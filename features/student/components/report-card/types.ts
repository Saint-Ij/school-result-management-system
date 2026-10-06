export type SubjectComponent = {
  column: string
  score: number
  maxScore: number
}

export type SubjectGroup = {
  subjectId: number
  subject: string
  total: number
  maxTotal: number
  components: SubjectComponent[]
}

export type ReportData = {
  id: number
  studentId: number
  classId: number
  termId: number
  classTeacherComment: string | null
  adminComment: string | null
  status: string
  approvedBy: number | null
  approvedAt: Date | null
  student: { firstName: string; lastName: string; admissionNo: string } | null
  class: { name: string } | null
  term: { name: string; session: { name: string }; nextTermBegins: string | null } | null
}

export type ReportCardProps = {
  report: ReportData
  subjects: SubjectGroup[]
  totalScore: number
  totalMax: number
  position: number
  totalStudents: number
  classTeacherName: string | null
  attendancePresent: number
  attendanceTotal: number
}
