import { db } from "@/lib/db";
import { studentClass, schoolClass, student } from "@/lib/db/schema";
import { eq, and, inArray, sql } from "drizzle-orm";

type ClassProgression = {
  currentId: number;
  currentName: string;
  nextName: string | null;
  studentCount: number;
};

const PROGRESSION: Record<string, string> = {
  "JSS 1": "JSS 2",
  "JSS 2": "JSS 3",
  "JSS 3": "SSS 1",
  "SSS 1": "SSS 2",
  "SSS 2": "SSS 3",
  "SSS 3": "", // graduated
  "JSS1": "JSS 2",
  "JSS2": "JSS 3",
  "JSS3": "SSS 1",
  "SSS1": "SSS 2",
  "SSS2": "SSS 3",
  "SSS3": "",
};

function detectNextClass(name: string): string | null {
  const normalized = name.trim().replace(/\s+/g, " ");
  const next = PROGRESSION[normalized];
  if (next === "") return null; // graduated
  return next ?? null; // unknown progression
}

export async function getPromotionData(
  fromSessionId: number,
  toSessionId: number
) {
  const classes = await db.query.schoolClass.findMany();

  const result: ClassProgression[] = [];
  for (const c of classes) {
    const nextName = detectNextClass(c.name);
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(studentClass)
      .where(
        and(eq(studentClass.classId, c.id), eq(studentClass.sessionId, fromSessionId))
      );
    result.push({
      currentId: c.id,
      currentName: c.name,
      nextName,
      studentCount: Number(countResult[0]?.count ?? 0),
    });
  }

  const targetClasses = await db.query.schoolClass.findMany();

  return { progressions: result, targetClasses };
}

export async function getClassStudents(classId: number, sessionId: number) {
  return db.query.studentClass.findMany({
    where: and(eq(studentClass.classId, classId), eq(studentClass.sessionId, sessionId)),
    with: { student: true },
  });
}

export async function promoteStudents(
  studentIds: number[],
  toClassId: number,
  toSessionId: number
) {
  if (studentIds.length === 0) return { promoted: 0, skipped: 0, errors: 0 };

  let promoted = 0;
  let skipped = 0;

  for (const studentId of studentIds) {
    const existing = await db.query.studentClass.findFirst({
      where: and(
        eq(studentClass.studentId, studentId),
        eq(studentClass.sessionId, toSessionId)
      ),
    });
    if (existing) {
      skipped++;
      continue;
    }
    await db.insert(studentClass).values({
      studentId,
      classId: toClassId,
      sessionId: toSessionId,
    });
    promoted++;
  }

  return { promoted, skipped, errors: 0 };
}
