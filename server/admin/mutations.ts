import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import {
  teacher,
  student,
  session,
  term,
  schoolClass,
  subject,
  studentScore,
  attendanceRecord,
  attendanceSession,
  studentClass,
  reportCard,
  classSubject,
  scoreSetup,
} from "@/lib/db/schema";
import {
  studentUpdateSchema,
  teacherUpdateSchema,
  sessionUpdateSchema,
  termUpdateSchema,
  classUpdateSchema,
  subjectUpdateSchema,
} from "@/lib/validations";
import { z } from "zod";

export async function updateStudent(
  id: number,
  data: z.infer<typeof studentUpdateSchema>
) {
  const parsed = studentUpdateSchema.parse(data);
  return db.update(student).set(parsed).where(eq(student.id, id)).returning();
}

export async function deleteStudent(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    await tx.delete(studentScore).where(eq(studentScore.studentId, id));
    await tx
      .delete(attendanceRecord)
      .where(eq(attendanceRecord.studentId, id));
    await tx.delete(studentClass).where(eq(studentClass.studentId, id));
    await tx.delete(reportCard).where(eq(reportCard.studentId, id));
    return tx.delete(student).where(eq(student.id, id)).returning();
  });
}

export async function updateTeacher(
  id: number,
  data: z.infer<typeof teacherUpdateSchema>
) {
  const parsed = teacherUpdateSchema.parse(data);
  return db.update(teacher).set(parsed).where(eq(teacher.id, id)).returning();
}

export async function deleteTeacher(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    await tx
      .update(schoolClass)
      .set({ classTeacherId: null })
      .where(eq(schoolClass.classTeacherId, id));
    await tx
      .update(classSubject)
      .set({ teacherId: null })
      .where(eq(classSubject.teacherId, id));
    return tx.delete(teacher).where(eq(teacher.id, id)).returning();
  });
}

export async function updateSession(
  id: number,
  data: z.infer<typeof sessionUpdateSchema>
) {
  const parsed = sessionUpdateSchema.parse(data);
  return db.update(session).set(parsed).where(eq(session.id, id)).returning();
}

export async function deleteSession(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    const terms = await tx
      .select({ id: term.id })
      .from(term)
      .where(eq(term.sessionId, id));
    const termIds = terms.map((t) => t.id);
    if (termIds.length > 0) {
      const sessions = await tx
        .select({ id: attendanceSession.id })
        .from(attendanceSession)
        .where(inArray(attendanceSession.termId, termIds));
      const sessionIds = sessions.map((s) => s.id);
      if (sessionIds.length > 0) {
        await tx
          .delete(attendanceRecord)
          .where(inArray(attendanceRecord.attendanceSessionId, sessionIds));
        await tx
          .delete(attendanceSession)
          .where(inArray(attendanceSession.id, sessionIds));
      }
      await tx.delete(studentScore).where(inArray(studentScore.termId, termIds));
      await tx.delete(reportCard).where(inArray(reportCard.termId, termIds));
      await tx.delete(term).where(inArray(term.id, termIds));
    }
    await tx.delete(studentClass).where(eq(studentClass.sessionId, id));
    return tx.delete(session).where(eq(session.id, id)).returning();
  });
}

export async function setActiveSession(id: number) {
  z.number().int().positive().parse(id);
  await db.update(session).set({ isActive: false });

  return db
    .update(session)
    .set({ isActive: true })
    .where(eq(session.id, id))
    .returning();
}

export async function updateTerm(
  id: number,
  data: z.infer<typeof termUpdateSchema>
) {
  const parsed = termUpdateSchema.parse(data);
  return db.update(term).set(parsed).where(eq(term.id, id)).returning();
}

export async function deleteTerm(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    const sessions = await tx
      .select({ id: attendanceSession.id })
      .from(attendanceSession)
      .where(eq(attendanceSession.termId, id));
    const sessionIds = sessions.map((s) => s.id);
    if (sessionIds.length > 0) {
      await tx
        .delete(attendanceRecord)
        .where(inArray(attendanceRecord.attendanceSessionId, sessionIds));
      await tx
        .delete(attendanceSession)
        .where(inArray(attendanceSession.id, sessionIds));
    }
    await tx.delete(studentScore).where(eq(studentScore.termId, id));
    await tx.delete(reportCard).where(eq(reportCard.termId, id));
    return tx.delete(term).where(eq(term.id, id)).returning();
  });
}

export async function updateClass(
  id: number,
  data: z.infer<typeof classUpdateSchema>
) {
  const parsed = classUpdateSchema.parse(data);
  return db
    .update(schoolClass)
    .set(parsed)
    .where(eq(schoolClass.id, id))
    .returning();
}

export async function deleteClass(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    const subjects = await tx
      .select({ id: classSubject.id })
      .from(classSubject)
      .where(eq(classSubject.classId, id));
    const csIds = subjects.map((s) => s.id);
    if (csIds.length > 0) {
      await tx
        .delete(studentScore)
        .where(inArray(studentScore.classSubjectId, csIds));
      await tx
        .delete(scoreSetup)
        .where(inArray(scoreSetup.classSubjectId, csIds));
      await tx.delete(classSubject).where(inArray(classSubject.id, csIds));
    }
    const sessions = await tx
      .select({ id: attendanceSession.id })
      .from(attendanceSession)
      .where(eq(attendanceSession.classId, id));
    const sessionIds = sessions.map((s) => s.id);
    if (sessionIds.length > 0) {
      await tx
        .delete(attendanceRecord)
        .where(inArray(attendanceRecord.attendanceSessionId, sessionIds));
      await tx
        .delete(attendanceSession)
        .where(inArray(attendanceSession.id, sessionIds));
    }
    await tx.delete(studentClass).where(eq(studentClass.classId, id));
    await tx.delete(reportCard).where(eq(reportCard.classId, id));
    return tx.delete(schoolClass).where(eq(schoolClass.id, id)).returning();
  });
}

export async function updateSubject(
  id: number,
  data: z.infer<typeof subjectUpdateSchema>
) {
  const parsed = subjectUpdateSchema.parse(data);
  return db.update(subject).set(parsed).where(eq(subject.id, id)).returning();
}

export async function deleteSubject(id: number) {
  z.number().int().positive().parse(id);
  return db.transaction(async (tx) => {
    const subjects = await tx
      .select({ id: classSubject.id })
      .from(classSubject)
      .where(eq(classSubject.subjectId, id));
    const csIds = subjects.map((s) => s.id);
    if (csIds.length > 0) {
      await tx
        .delete(studentScore)
        .where(inArray(studentScore.classSubjectId, csIds));
      await tx
        .delete(scoreSetup)
        .where(inArray(scoreSetup.classSubjectId, csIds));
      await tx.delete(classSubject).where(inArray(classSubject.id, csIds));
    }
    return tx.delete(subject).where(eq(subject.id, id)).returning();
  });
}
