import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  teacher,
  student,
  classSubject,
  schoolClass,
  studentClass,
  studentScore,
} from "@/lib/db/schema";



export async function getAssignedSubjects(teacherId: number) {
  return db.query.classSubject.findMany({
    where: eq(classSubject.teacherId, teacherId),
    with: {
      class: true,
      subject: true,
    },
  });
}


export async function getAssignedClasses(teacherId: number) {
  return db.query.schoolClass.findMany({
    where: eq(schoolClass.classTeacherId, teacherId),
  });
}


export async function getClassSubject(classSubjectId: number) {
  return db.query.classSubject.findFirst({
    where: eq(classSubject.id, classSubjectId),
    with: {
      class: true,
      subject: true,
      teacher: true,
      scoreSetup: true,
    },
  });
}


export async function getClassStudents(classId: number, sessionId: number) {
  return db.query.studentClass.findMany({
    where: and(
      eq(studentClass.classId, classId),
      eq(studentClass.sessionId, sessionId)
    ),
    with: {
      student: true,
    },
  });
}


export async function getSubjectScores(classSubjectId: number, termId: number) {
  return db.query.studentScore.findMany({
    where: and(
      eq(studentScore.classSubjectId, classSubjectId),
      eq(studentScore.termId, termId)
    ),
    with: {
      student: true,
      scoreSetup: true,
    },
  });
}


export async function getStudentSubjectScores(
  studentId: number,
  classSubjectId: number,
  termId: number
) {
  return db.query.studentScore.findMany({
    where: and(
      eq(studentScore.studentId, studentId),
      eq(studentScore.classSubjectId, classSubjectId),
      eq(studentScore.termId, termId)
    ),
    with: {
      scoreSetup: true,
    },
  });
}



export async function getStudent(studentId: number) {
  return db.query.student.findFirst({
    where: eq(student.id, studentId),
  });
}

export async function getTeacher(teacherId: number) {
  return db.query.teacher.findFirst({
    where: eq(teacher.id, teacherId),
  });
}

export type ScoreSheetSubject = {
  id: number
  subjectName: string
}

export type ScoreSheetStudent = {
  studentId: number
  firstName: string
  lastName: string
  scores: Record<number, number>
}

export type ScoreSheetData = {
  subjects: ScoreSheetSubject[]
  students: ScoreSheetStudent[]
}

export async function getScoreSheetData(
  classId: number,
  sessionId: number,
  termId: number
): Promise<ScoreSheetData> {
  const subjectsData = await db.query.classSubject.findMany({
    where: eq(classSubject.classId, classId),
    with: {
      subject: true,
      scoreSetup: true,
    },
  })

  const enrollments = await db.query.studentClass.findMany({
    where: and(
      eq(studentClass.classId, classId),
      eq(studentClass.sessionId, sessionId)
    ),
    with: {
      student: true,
    },
  })

  const studentIds = enrollments.map((e) => e.studentId)
  const classSubjectIds = subjectsData.map((cs) => cs.id)

  const allScores =
    studentIds.length > 0 && classSubjectIds.length > 0
      ? await db.query.studentScore.findMany({
          where: and(
            inArray(studentScore.studentId, studentIds),
            inArray(studentScore.classSubjectId, classSubjectIds),
            eq(studentScore.termId, termId)
          ),
        })
      : []

  const subjects: ScoreSheetSubject[] = subjectsData.map((cs) => ({
    id: cs.id,
    subjectName: cs.subject?.name ?? "",
  }))

  const students: ScoreSheetStudent[] = enrollments.map((enrollment) => {
    const studentScores = allScores.filter(
      (s) => s.studentId === enrollment.studentId
    )

    const scores: Record<number, number> = {}

    for (const cs of subjectsData) {
      const csScores = studentScores.filter((s) => s.classSubjectId === cs.id)
      const total = csScores.reduce((sum, s) => sum + s.score, 0)
      scores[cs.id] = total
    }

    return {
      studentId: enrollment.studentId,
      firstName: enrollment.student.firstName,
      lastName: enrollment.student.lastName,
      scores,
    }
  })

  return { subjects, students }
}

export type SubjectScoreSummary = {
  subjectId: number
  subjectName: string
  total: number
  maxTotal: number
  components: { column: string; score: number; maxScore: number }[]
}

export type StudentScoreSummary = {
  subjects: SubjectScoreSummary[]
  totalScore: number
  totalMax: number
  average: number
  position: number
  totalStudents: number
}

export async function getStudentScoreSummary(
  studentId: number,
  classId: number,
  termId: number,
  sessionId: number
): Promise<StudentScoreSummary> {
  const classSubjectsData = await db.query.classSubject.findMany({
    where: eq(classSubject.classId, classId),
    with: {
      subject: true,
      scoreSetup: true,
    },
  })

  const scores = await db.query.studentScore.findMany({
    where: and(
      eq(studentScore.studentId, studentId),
      eq(studentScore.termId, termId)
    ),
    with: {
      scoreSetup: true,
    },
  })

  const subjects: SubjectScoreSummary[] = classSubjectsData.map((cs) => {
    const subjectScores = scores.filter((s) => s.classSubjectId === cs.id)
    const total = subjectScores.reduce((sum, s) => sum + s.score, 0)
    const maxTotal = cs.scoreSetup.reduce((sum, s) => sum + s.maxScore, 0)
    return {
      subjectId: cs.subject.id,
      subjectName: cs.subject.name,
      total,
      maxTotal,
      components: subjectScores.map((s) => ({
        column: s.scoreSetup.columnName,
        score: s.score,
        maxScore: s.scoreSetup.maxScore,
      })),
    }
  })

  const totalScore = subjects.reduce((sum, s) => sum + s.total, 0)
  const totalMax = subjects.reduce((sum, s) => sum + s.maxTotal, 0)

  const positions = await calculateClassPositions(classId, sessionId, termId)
  const totalStudents = Object.keys(positions).length

  return {
    subjects,
    totalScore,
    totalMax,
    average: totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0,
    position: positions[studentId] ?? 0,
    totalStudents,
  }
}

export async function calculateClassPositions(
  classId: number,
  sessionId: number,
  termId: number
): Promise<Record<number, number>> {
  const enrollments = await db.query.studentClass.findMany({
    where: and(
      eq(studentClass.classId, classId),
      eq(studentClass.sessionId, sessionId)
    ),
  })

  const studentIds = enrollments.map((e) => e.studentId)
  if (studentIds.length === 0) return {}

  const allScores = await db.query.studentScore.findMany({
    where: and(
      inArray(studentScore.studentId, studentIds),
      eq(studentScore.termId, termId)
    ),
  })

  const totals: Record<number, number> = {}
  for (const s of allScores) {
    totals[s.studentId] = (totals[s.studentId] ?? 0) + s.score
  }

  const ranked = Object.entries(totals)
    .map(([sid, total]) => ({ studentId: Number(sid), total }))
    .sort((a, b) => b.total - a.total)

  const positions: Record<number, number> = {}
  let currentRank = 1
  for (let i = 0; i < ranked.length; i++) {
    if (i > 0 && ranked[i].total < ranked[i - 1].total) {
      currentRank = i + 1
    }
    positions[ranked[i].studentId] = currentRank
  }

  for (const sid of studentIds) {
    if (!(sid in positions)) {
      positions[sid] = ranked.length + 1
    }
  }

  return positions
}
