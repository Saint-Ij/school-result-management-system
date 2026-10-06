import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportCard } from "@/lib/db/schema";

export async function upsertResultRecord(data: {
  studentId: number;
  classId: number;
  termId: number;
  comment: string;
}) {
  const [record] = await db
    .insert(reportCard)
    .values({
      studentId: data.studentId,
      classId: data.classId,
      termId: data.termId,
      classTeacherComment: data.comment,
      status: "teacher_submitted",
    })
    .onConflictDoUpdate({
      target: [reportCard.studentId, reportCard.classId, reportCard.termId],
      set: {
        classTeacherComment: data.comment,
        status: "teacher_submitted",
      },
    })
    .returning();
  return record;
}

export async function getClassReportCards(classId: number, termId: number) {
  return db.query.reportCard.findMany({
    where: and(
      eq(reportCard.classId, classId),
      eq(reportCard.termId, termId)
    ),
  });
}
