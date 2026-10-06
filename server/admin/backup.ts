import { db } from "@/lib/db";

export async function getFullBackup() {
  const [
    admins,
    teachers,
    students,
    sessions,
    terms,
    classes,
    subjects,
    classSubjects,
    scoreSetups,
    studentScores,
    attendanceSessions,
    attendanceRecords,
    studentClasses,
    reportCards,
  ] = await Promise.all([
    db.query.admin.findMany(),
    db.query.teacher.findMany(),
    db.query.student.findMany(),
    db.query.session.findMany(),
    db.query.term.findMany(),
    db.query.schoolClass.findMany(),
    db.query.subject.findMany(),
    db.query.classSubject.findMany(),
    db.query.scoreSetup.findMany(),
    db.query.studentScore.findMany(),
    db.query.attendanceSession.findMany(),
    db.query.attendanceRecord.findMany(),
    db.query.studentClass.findMany(),
    db.query.reportCard.findMany(),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    data: {
      admin: admins,
      teacher: teachers,
      student: students,
      session: sessions,
      term: terms,
      class: classes,
      subject: subjects,
      classSubject: classSubjects,
      scoreSetup: scoreSetups,
      studentScore: studentScores,
      attendanceSession: attendanceSessions,
      attendanceRecord: attendanceRecords,
      studentClass: studentClasses,
      reportCard: reportCards,
    },
  };
}
