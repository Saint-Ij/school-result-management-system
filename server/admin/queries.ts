import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  teacher,
  student,
  session,
  term,
  schoolClass,
  subject,
  classSubject,
  scoreSetup,
  studentClass,
} from "@/lib/db/schema";


export async function getTeachers() {
  return db.query.teacher.findMany();
}

export async function getTeacherById(id: number) {
  return db.query.teacher.findFirst({
    where: eq(teacher.id, id),
  });
}


export async function getStudents() {
  return db.query.student.findMany();
}

export async function getStudentById(id: number) {
  return db.query.student.findFirst({
    where: eq(student.id, id),
  });
}


export async function getSessions() {
  return db.query.session.findMany({
    with: {
      terms: true,
    },
  });
}

export async function getSessionById(id: number) {
  return db.query.session.findFirst({
    where: eq(session.id, id),
    with: {
      terms: true,
    },
  });
}


export async function getTerms() {
  return db.query.term.findMany({
    with: {
      session: true,
    },
  });
}

export async function getTermsBySession(sessionId: number) {
  return db.query.term.findMany({
    where: eq(term.sessionId, sessionId),
  });
}


export async function getClasses() {
  return db.query.schoolClass.findMany({
    with: {
      classTeacher: true,
    },
  });
}

export async function getClassById(id: number) {
  return db.query.schoolClass.findFirst({
    where: eq(schoolClass.id, id),
    with: {
      classTeacher: true,
    },
  });
}


export async function getSubjects() {
  return db.query.subject.findMany();
}

export async function getSubjectById(id: number) {
  return db.query.subject.findFirst({
    where: eq(subject.id, id),
  });
}



export async function getClassSubjects() {
  return db.query.classSubject.findMany({
    with: {
      class: true,
      subject: true,
      teacher: true,
    },
  });
}

export async function getSubjectsForClass(classId: number) {
  return db.query.classSubject.findMany({
    where: eq(classSubject.classId, classId),
    with: {
      subject: true,
      teacher: true,
    },
  });
}


export async function getScoreSetup(classSubjectId: number) {
  return db.query.scoreSetup.findMany({
    where: eq(scoreSetup.classSubjectId, classSubjectId),
  });
}

export async function getSessionEnrollments(sessionId: number) {
  return db.query.studentClass.findMany({
    where: eq(studentClass.sessionId, sessionId),
    with: {
      class: true,
      student: true,
    },
  });
}
