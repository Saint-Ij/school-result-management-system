import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  student,
  studentScore,
  attendanceRecord,
  reportCard,
} from "@/lib/db/schema";


export async function getProfile(studentId: number) {
  return db.query.student.findFirst({
    where: eq(student.id, studentId),
  });
}


export async function getTermScores(studentId: number, termId: number) {
  return db.query.studentScore.findMany({
    where: and(
      eq(studentScore.studentId, studentId),
      eq(studentScore.termId, termId)
    ),
    with: {
      scoreSetup: true,
      classSubject: {
        with: {
          subject: true,
        },
      },
    },
  });
}


export async function getAttendance(studentId: number) {
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


export async function getPublishedResults(studentId: number) {
  return db.query.reportCard.findMany({
    where: and(
      eq(reportCard.studentId, studentId),
      eq(reportCard.status, "approved")
    ),
    with: {
      class: true,
      term: {
        with: {
          session: true,
        },
      },
    },
  });
}


export async function getPublishedResult(studentId: number, termId: number) {
  return db.query.reportCard.findFirst({
    where: and(
      eq(reportCard.studentId, studentId),
      eq(reportCard.termId, termId),
      eq(reportCard.status, "approved")
    ),
    with: {
      class: true,
      term: {
        with: {
          session: true,
        },
      },
    },
  });
}
