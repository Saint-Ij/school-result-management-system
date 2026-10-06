import { db } from "@/lib/db";
import {
  teacher,
  student,
  session,
  term,
  schoolClass,
  subject,
} from "@/lib/db/schema";
import {
  teacherSchema,
  studentSchema,
  sessionSchema,
  termSchema,
  classSchema,
  subjectSchema,
} from "@/lib/validations";
import { z } from "zod";

export async function registerTeacher(
  data: z.infer<typeof teacherSchema>
) {
  const parsed = teacherSchema.parse(data);
  return db.insert(teacher).values(parsed).returning();
}

export async function registerStudent(
  data: z.infer<typeof studentSchema>
) {
  const parsed = studentSchema.parse(data);
  return db.insert(student).values(parsed).returning();
}

export async function createSession(
  data: z.infer<typeof sessionSchema>
) {
  const parsed = sessionSchema.parse(data);
  return db.insert(session).values(parsed).returning();
}

export async function createTerm(
  data: z.infer<typeof termSchema>
) {
  const parsed = termSchema.parse(data);
  return db.insert(term).values(parsed).returning();
}

export async function createTerms(sessionId: number, terms: string[]) {
  z.number().int().positive().parse(sessionId);
  z.array(z.string().min(1)).min(1).parse(terms);
  return db
    .insert(term)
    .values(
      terms.map((name) => ({
        name,
        sessionId,
      }))
    )
    .returning();
}

export async function createClass(
  data: z.infer<typeof classSchema>
) {
  const parsed = classSchema.parse(data);
  return db.insert(schoolClass).values(parsed).returning();
}

export async function createSubject(
  data: z.infer<typeof subjectSchema>
) {
  const parsed = subjectSchema.parse(data);
  return db.insert(subject).values(parsed).returning();
}

export async function createSubjects(names: string[]) {
  z.array(z.string().min(1)).parse(names);
  return db
    .insert(subject)
    .values(
      names.map((name) => ({
        name,
      }))
    )
    .returning();
}
