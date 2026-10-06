import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { attendanceSession, attendanceRecord } from "@/lib/db/schema";
import { attendanceSessionSchema, attendanceSchema } from "@/lib/validations";
import { z } from "zod";

export async function createAttendanceSession(
  data: z.infer<typeof attendanceSessionSchema>
) {
  const parsed = attendanceSessionSchema.parse(data);
  return db.insert(attendanceSession).values(parsed).returning();
}

export async function takeAttendance(
  attendanceSessionId: number,
  records: z.infer<typeof attendanceSchema>[]
) {
  z.number().int().positive().parse(attendanceSessionId);
  const parsedRecords = z.array(attendanceSchema).min(1).parse(records);
  await db
    .delete(attendanceRecord)
    .where(eq(attendanceRecord.attendanceSessionId, attendanceSessionId));
  if (parsedRecords.length > 0) {
    return db
      .insert(attendanceRecord)
      .values(
        parsedRecords.map((record) => ({
          attendanceSessionId,
          studentId: record.studentId,
          status: record.status,
        }))
      )
      .returning();
  }
  return [];
}

export async function updateAttendance(
  attendanceSessionId: number,
  studentId: number,
  status: "present" | "absent" | "excused" | "late"
) {
  z.number().int().positive().parse(attendanceSessionId);
  z.number().int().positive().parse(studentId);
  z.enum(["present", "absent", "excused", "late"]).parse(status);
  return db
    .update(attendanceRecord)
    .set({ status })
    .where(
      and(
        eq(attendanceRecord.attendanceSessionId, attendanceSessionId),
        eq(attendanceRecord.studentId, studentId)
      )
    )
    .returning();
}

export async function getAttendanceSession(attendanceSessionId: number) {
  z.number().int().positive().parse(attendanceSessionId);
  return db.query.attendanceSession.findFirst({
    where: eq(attendanceSession.id, attendanceSessionId),
    with: {
      class: true,
      term: true,
      records: {
        with: {
          student: true,
        },
      },
    },
  });
}

export async function getAttendanceByDate(classId: number, date: string) {
  z.number().int().positive().parse(classId);
  z.string().min(1).parse(date);
  return db.query.attendanceSession.findFirst({
    where: and(
      eq(attendanceSession.classId, classId),
      eq(attendanceSession.date, date)
    ),
    with: {
      records: {
        with: {
          student: true,
        },
      },
    },
  });
}

export async function getClassAttendance(classId: number) {
  z.number().int().positive().parse(classId);
  return db.query.attendanceSession.findMany({
    where: eq(attendanceSession.classId, classId),
    with: {
      records: true,
    },
  });
}

export async function getStudentAttendance(studentId: number) {
  z.number().int().positive().parse(studentId);
  return db.query.attendanceRecord.findMany({
    where: eq(attendanceRecord.studentId, studentId),
    with: {
      session: {
        with: {
          class: true,
          term: true,
        },
      },
    },
  });
}
