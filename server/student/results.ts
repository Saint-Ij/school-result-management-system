import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reportCard, studentScore, studentClass, attendanceRecord } from "@/lib/db/schema";

export type SubjectGroup = {
  subjectId: number;
  subject: string;
  total: number;
  maxTotal: number;
  components: { column: string; score: number; maxScore: number }[];
};

export async function getStudentReportCard(studentId: number, termId: number) {
  const result = await db.query.reportCard.findFirst({
    where: and(
      eq(reportCard.studentId, studentId),
      eq(reportCard.termId, termId),
      eq(reportCard.status, "approved")
    ),
    with: {
      student: true,
      class: {
        with: {
          classTeacher: true,
        },
      },
      term: {
        with: {
          session: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Result not available");
  }

  const scores = await db.query.studentScore.findMany({
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

  const grouped = Object.values(
    scores.reduce<Record<number, SubjectGroup>>((acc, score) => {
      const key = score.classSubjectId;

      if (!acc[key]) {
        acc[key] = {
          subjectId: score.classSubject.subject.id,
          subject: score.classSubject.subject.name,
          total: 0,
          maxTotal: 0,
          components: [],
        };
      }

      acc[key].components.push({
        column: score.scoreSetup.columnName,
        score: score.score,
        maxScore: score.scoreSetup.maxScore,
      });

      acc[key].total += score.score;
      acc[key].maxTotal += score.scoreSetup.maxScore;

      return acc;
    }, {})
  );

  const totalScore = grouped.reduce((sum, subject) => sum + subject.total, 0);
  const totalMax = grouped.reduce((sum, subject) => sum + subject.maxTotal, 0);

  const sessionId = result.term?.session?.id;
  const position = await calculateStudentPosition(studentId, result.classId, sessionId, termId);

  const attendanceRecords = await db.query.attendanceRecord.findMany({
    where: eq(attendanceRecord.studentId, studentId),
    with: {
      session: {
        with: {
          term: true,
        },
      },
    },
  });

  const presentCount = attendanceRecords.filter((a) => a.status === "present").length;
  const totalAttendance = attendanceRecords.length;

  return {
    report: result,
    subjects: grouped,
    totalScore,
    totalMax,
    position: position.position,
    totalStudents: position.totalStudents,
    classTeacherName: result.class?.classTeacher?.name ?? null,
    attendancePresent: presentCount,
    attendanceTotal: totalAttendance,
  };
}

async function calculateStudentPosition(
  studentId: number,
  classId: number,
  sessionId: number | undefined,
  termId: number
): Promise<{ position: number; totalStudents: number }> {
  const conditions = [eq(studentClass.classId, classId)];
  if (sessionId) {
    conditions.push(eq(studentClass.sessionId, sessionId));
  }
  const enrolledStudents = await db.query.studentClass.findMany({
    where: and(...conditions),
  });

  const allStudentIds = enrolledStudents.map((es) => es.studentId);
  const totalStudents = allStudentIds.length;

  if (totalStudents === 0) {
    return { position: 0, totalStudents: 0 };
  }

  const allScores = await Promise.all(
    allStudentIds.map(async (sid) => {
      const s = await db.query.studentScore.findMany({
        where: and(
          eq(studentScore.studentId, sid),
          eq(studentScore.termId, termId)
        ),
      });
      const total = s.reduce((sum, sc) => sum + sc.score, 0);
      return { studentId: sid, total };
    })
  );

  const scoredStudents = allScores.filter((s) => s.total > 0);
  const ranked = scoredStudents.sort((a, b) => b.total - a.total);
  const currentStudentScore = allScores.find((s) => s.studentId === studentId)?.total ?? 0;
  const position = ranked.findIndex((s) => s.studentId === studentId) + 1;

  if (position === 0 && currentStudentScore === 0) {
    return { position: scoredStudents.length + 1, totalStudents: scoredStudents.length || totalStudents };
  }

  return { position: position > 0 ? position : totalStudents, totalStudents };
}
