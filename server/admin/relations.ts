import { db } from "@/lib/db";
import {
  classSubject,
  studentClass,
  scoreSetup,
  studentScore,
  attendanceRecord,
  attendanceSession,
  reportCard,
} from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import {
  assignStudentToClassSchema,
  assignSubjectToClassSchema,
  scoreSetupSchema,
  scoreSetupUpdateSchema,
} from "@/lib/validations";
import { z } from "zod";

export async function assignStudentToClass(
  data: z.infer<typeof assignStudentToClassSchema>
) {
  const parsed = assignStudentToClassSchema.parse(data);
  return db.transaction(async (tx) => {
    await tx
      .delete(studentClass)
      .where(
        and(
          eq(studentClass.studentId, parsed.studentId),
          eq(studentClass.sessionId, parsed.sessionId)
        )
      );
    return tx.insert(studentClass).values(parsed).returning();
  });
}

export async function assignStudentsToClass(
  studentIds: number[],
  classId: number,
  sessionId: number
) {
  z.array(z.number().int().positive()).min(1).parse(studentIds);
  z.number().int().positive().parse(classId);
  z.number().int().positive().parse(sessionId);
  return db.transaction(async (tx) => {
    await tx
      .delete(studentClass)
      .where(
        and(
          inArray(studentClass.studentId, studentIds),
          eq(studentClass.sessionId, sessionId)
        )
      );
    return tx
      .insert(studentClass)
      .values(
        studentIds.map((studentId) => ({
          studentId,
          classId,
          sessionId,
        }))
      )
      .returning();
  });
}

export async function assignSubjectToClass(
  data: z.infer<typeof assignSubjectToClassSchema>
) {
  const parsed = assignSubjectToClassSchema.parse(data);
  return db.insert(classSubject).values(parsed).returning();
}

export async function assignSubjectsToClass(
  classId: number,
  subjectIds: number[]
) {
  z.number().int().positive().parse(classId);
  z.array(z.number().int().positive()).min(1).parse(subjectIds);
  return db
    .insert(classSubject)
    .values(
      subjectIds.map((subjectId) => ({
        classId,
        subjectId,
      }))
    )
    .returning();
}

export async function assignTeacherToClassSubject(
  classSubjectId: number,
  teacherId: number
) {
  z.number().int().positive().parse(classSubjectId);
  z.number().int().positive().parse(teacherId);
  return db
    .update(classSubject)
    .set({ teacherId })
    .where(eq(classSubject.id, classSubjectId))
    .returning();
}

export async function createScoreColumn(
  data: z.infer<typeof scoreSetupSchema>
) {
  const parsed = scoreSetupSchema.parse(data);
  return db.insert(scoreSetup).values(parsed).returning();
}

export async function createScoreSheet(
  classSubjectId: number,
  columns: {
    columnName: string;
    maxScore: number;
  }[]
) {
  z.number().int().positive().parse(classSubjectId);
  z.array(scoreSetupSchema.omit({ classSubjectId: true })).min(1).parse(columns);
  return db
    .insert(scoreSetup)
    .values(
      columns.map((column) => ({
        classSubjectId,
        columnName: column.columnName,
        maxScore: column.maxScore,
      }))
    )
    .returning();
}

export async function removeStudentFromClass(
  studentId: number,
  classId: number,
  sessionId: number
) {
  z.number().int().positive().parse(studentId);
  z.number().int().positive().parse(classId);
  z.number().int().positive().parse(sessionId);
  return db.transaction(async (tx) => {
    const subjects = await tx
      .select({ id: classSubject.id })
      .from(classSubject)
      .where(eq(classSubject.classId, classId));
    const csIds = subjects.map((s) => s.id);
    if (csIds.length > 0) {
      await tx
        .delete(studentScore)
        .where(
          and(
            eq(studentScore.studentId, studentId),
            inArray(studentScore.classSubjectId, csIds)
          )
        );
    }
    const sessions = await tx
      .select({ id: attendanceSession.id })
      .from(attendanceSession)
      .where(eq(attendanceSession.classId, classId));
    const attSessionIds = sessions.map((s) => s.id);
    if (attSessionIds.length > 0) {
      await tx
        .delete(attendanceRecord)
        .where(
          and(
            eq(attendanceRecord.studentId, studentId),
            inArray(attendanceRecord.attendanceSessionId, attSessionIds)
          )
        );
    }
    await tx
      .delete(reportCard)
      .where(
        and(eq(reportCard.studentId, studentId), eq(reportCard.classId, classId))
      );
    return tx
      .delete(studentClass)
      .where(
        and(
          eq(studentClass.studentId, studentId),
          eq(studentClass.classId, classId),
          eq(studentClass.sessionId, sessionId)
        )
      )
      .returning();
  });
}

export async function removeSubjectFromClass(classSubjectId: number) {
  z.number().int().positive().parse(classSubjectId);
  return db.transaction(async (tx) => {
    await tx
      .delete(studentScore)
      .where(eq(studentScore.classSubjectId, classSubjectId));
    await tx
      .delete(scoreSetup)
      .where(eq(scoreSetup.classSubjectId, classSubjectId));
    return tx
      .delete(classSubject)
      .where(eq(classSubject.id, classSubjectId))
      .returning();
  });
}

export async function removeTeacherFromClassSubject(classSubjectId: number) {
  z.number().int().positive().parse(classSubjectId);
  return db
    .update(classSubject)
    .set({
      teacherId: null,
    })
    .where(eq(classSubject.id, classSubjectId))
    .returning();
}

export async function updateScoreColumn(
  id: number,
  data: z.infer<typeof scoreSetupUpdateSchema>
) {
  const parsed = scoreSetupUpdateSchema.parse(data);
  return db.update(scoreSetup).set(parsed).where(eq(scoreSetup.id, id)).returning();
}

export async function deleteScoreColumn(scoreSetupId: number) {
  z.number().int().positive().parse(scoreSetupId);
  return db.transaction(async (tx) => {
    await tx
      .delete(studentScore)
      .where(eq(studentScore.scoreSetupId, scoreSetupId));
    return tx
      .delete(scoreSetup)
      .where(eq(scoreSetup.id, scoreSetupId))
      .returning();
  });
}
