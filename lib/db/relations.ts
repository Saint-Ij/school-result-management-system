import { relations } from "drizzle-orm";
import {
  admin,
  teacher,
  student,
  session,
  term,
  schoolClass,
  subject,
  classSubject,
  scoreSetup,
  studentScore,
  attendanceSession,
  attendanceRecord,
  studentClass,
  reportCard,
} from "./schema";


export const teacherRelations = relations(teacher, ({ many }) => ({
  classes: many(schoolClass),
  classSubjects: many(classSubject),
}));

export const adminRelations = relations(admin, ({ many }) => ({
  approvedCards: many(reportCard),
}));

export const studentRelations = relations(student, ({ many }) => ({
  scores: many(studentScore),
  attendance: many(attendanceRecord),
  enrollments: many(studentClass),
  reportCards: many(reportCard),
}));

export const sessionRelations = relations(session, ({ many }) => ({
  terms: many(term),
  enrollments: many(studentClass),
}));

export const termRelations = relations(term, ({ one, many }) => ({
  session: one(session, {
    fields: [term.sessionId],
    references: [session.id],
  }),
  attendanceSessions: many(attendanceSession),
  scores: many(studentScore),
  reportCards: many(reportCard),
}));

export const classRelations = relations(schoolClass, ({ one, many }) => ({
  classTeacher: one(teacher, {
    fields: [schoolClass.classTeacherId],
    references: [teacher.id],
  }),
  classSubjects: many(classSubject),
  enrollments: many(studentClass),
  attendanceSessions: many(attendanceSession),
  reportCards: many(reportCard),
}));

export const subjectRelations = relations(subject, ({ many }) => ({
  classSubjects: many(classSubject),
}));

export const classSubjectRelations = relations(
  classSubject,
  ({ one, many }) => ({
    class: one(schoolClass, {
      fields: [classSubject.classId],
      references: [schoolClass.id],
    }),
    subject: one(subject, {
      fields: [classSubject.subjectId],
      references: [subject.id],
    }),
    teacher: one(teacher, {
      fields: [classSubject.teacherId],
      references: [teacher.id],
    }),
    scoreSetup: many(scoreSetup),
    scores: many(studentScore),
  })
);

export const scoreSetupRelations = relations(scoreSetup, ({ one, many }) => ({
  classSubject: one(classSubject, {
    fields: [scoreSetup.classSubjectId],
    references: [classSubject.id],
  }),
  studentScores: many(studentScore),
}));

export const studentScoreRelations = relations(studentScore, ({ one }) => ({
  student: one(student, {
    fields: [studentScore.studentId],
    references: [student.id],
  }),
  classSubject: one(classSubject, {
    fields: [studentScore.classSubjectId],
    references: [classSubject.id],
  }),
  term: one(term, {
    fields: [studentScore.termId],
    references: [term.id],
  }),
  scoreSetup: one(scoreSetup, {
    fields: [studentScore.scoreSetupId],
    references: [scoreSetup.id],
  }),
}));

export const attendanceSessionRelations = relations(
  attendanceSession,
  ({ one, many }) => ({
    term: one(term, {
      fields: [attendanceSession.termId],
      references: [term.id],
    }),
    class: one(schoolClass, {
      fields: [attendanceSession.classId],
      references: [schoolClass.id],
    }),
    records: many(attendanceRecord),
  })
);

export const attendanceRecordRelations = relations(
  attendanceRecord,
  ({ one }) => ({
    session: one(attendanceSession, {
      fields: [attendanceRecord.attendanceSessionId],
      references: [attendanceSession.id],
    }),
    student: one(student, {
      fields: [attendanceRecord.studentId],
      references: [student.id],
    }),
  })
);

export const reportCardRelations = relations(reportCard, ({ one }) => ({
  student: one(student, {
    fields: [reportCard.studentId],
    references: [student.id],
  }),
  class: one(schoolClass, {
    fields: [reportCard.classId],
    references: [schoolClass.id],
  }),
  term: one(term, {
    fields: [reportCard.termId],
    references: [term.id],
  }),
  approvedByAdmin: one(admin, {
    fields: [reportCard.approvedBy],
    references: [admin.id],
  }),
}));

export const studentClassRelations = relations(studentClass, ({ one }) => ({
  student: one(student, {
    fields: [studentClass.studentId],
    references: [student.id],
  }),
  class: one(schoolClass, {
    fields: [studentClass.classId],
    references: [schoolClass.id],
  }),
  session: one(session, {
    fields: [studentClass.sessionId],
    references: [session.id],
  }),
}));


