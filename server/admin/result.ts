import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportCard } from "@/lib/db/schema";

export async function getPendingResults() {
  return db.query.reportCard.findMany({
    where: eq(reportCard.status, "teacher_submitted"),
    with: {
      student: true,
      class: true,
      term: true,
    },
  });
}

export async function approveResult(
  reportCardId: number,
  adminId: number,
  comment: string
) {
  return db
    .update(reportCard)
    .set({
      adminComment: comment,
      status: "approved",
      approvedBy: adminId,
      approvedAt: new Date(),
    })
    .where(eq(reportCard.id, reportCardId))
    .returning();
}

export async function rejectResult(reportCardId: number) {
  return db
    .update(reportCard)
    .set({
      status: "draft",
      adminComment: null,
      approvedBy: null,
      approvedAt: null,
    })
    .where(eq(reportCard.id, reportCardId))
    .returning();
}

export async function getApprovedResult(studentId: number, termId: number) {
  return db.query.reportCard.findFirst({
    where: and(
      eq(reportCard.studentId, studentId),
      eq(reportCard.termId, termId),
      eq(reportCard.status, "approved")
    ),
  });
}
