import { db } from "@/lib/db";
import { studentScore } from "@/lib/db/schema";
import { scoreSchema } from "@/lib/validations";
import { z } from "zod";

export async function recordScores(
  scores: z.infer<typeof scoreSchema>[]
) {
  const parsed = z.array(scoreSchema).min(1).parse(scores);
  const results = [];
  for (const s of parsed) {
    const [record] = await db
      .insert(studentScore)
      .values(s)
      .onConflictDoUpdate({
        target: [
          studentScore.studentId,
          studentScore.scoreSetupId,
          studentScore.termId,
        ],
        set: { score: s.score, updatedAt: new Date() },
      })
      .returning();
    results.push(record);
  }
  return results;
}
