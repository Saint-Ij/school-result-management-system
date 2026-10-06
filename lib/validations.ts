import { z } from "zod"

export const teacherSchema = z.object({
  staffId: z.string().min(1, "Staff ID required"),
  passwordHash: z.string().min(1, "Password required"),
  name: z.string().min(1, "Name required"),
})

export const teacherUpdateSchema = z.object({
  staffId: z.string().min(1).optional(),
  passwordHash: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
})

export const studentSchema = z.object({
  admissionNo: z.string().min(1, "Admission number required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  middleName: z.string().optional(),
  passwordHash: z.string().min(1, "Password required"),
})

export const studentUpdateSchema = z.object({
  admissionNo: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  middleName: z.string().nullable().optional(),
  passwordHash: z.string().min(6).optional(),
})

export const sessionSchema = z.object({
  name: z.string().min(1, "Session name required"),
  isActive: z.boolean().optional(),
})

export const sessionUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
})

export const termSchema = z.object({
  name: z.string().min(1, "Term name required"),
  sessionId: z.number().int().positive("Session ID must be a positive integer"),
  nextTermBegins: z.string().nullable().optional(),
})

export const termUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  nextTermBegins: z.string().nullable().optional(),
})

export const classSchema = z.object({
  name: z.string().min(1, "Class name required"),
  classTeacherId: z.number().int().positive().optional(),
})

export const classUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  classTeacherId: z.number().int().positive().nullable().optional(),
})

export const subjectSchema = z.object({
  name: z.string().min(1, "Subject name required"),
})

export const subjectUpdateSchema = z.object({
  name: z.string().min(1).optional(),
})

export const scoreSchema = z.object({
  studentId: z.number().int().positive(),
  classSubjectId: z.number().int().positive(),
  termId: z.number().int().positive(),
  scoreSetupId: z.number().int().positive(),
  score: z.number().int().min(0),
})

export const scoreSetupSchema = z.object({
  classSubjectId: z.number().int().positive(),
  columnName: z.string().min(1, "Column name required"),
  maxScore: z.number().int().min(1, "Max score must be at least 1"),
})

export const scoreSetupUpdateSchema = z.object({
  columnName: z.string().min(1).optional(),
  maxScore: z.number().int().min(1).optional(),
})

export const attendanceSchema = z.object({
  studentId: z.number().int().positive(),
  status: z.enum(["present", "absent", "excused", "late"]),
})

export const attendanceSessionSchema = z.object({
  termId: z.number().int().positive(),
  classId: z.number().int().positive(),
  date: z.string().optional(),
})

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  type: z.enum(["admin", "teacher", "student"]),
})

export const assignStudentToClassSchema = z.object({
  studentId: z.number().int().positive(),
  classId: z.number().int().positive(),
  sessionId: z.number().int().positive(),
})

export const assignSubjectToClassSchema = z.object({
  classId: z.number().int().positive(),
  subjectId: z.number().int().positive(),
  teacherId: z.number().int().positive().optional(),
})
