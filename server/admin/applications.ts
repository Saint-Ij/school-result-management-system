import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";

export async function getApplicationsByStatus(status: "pending" | "accepted" | "rejected") {
  return db.query.applications.findMany({
    where: eq(applications.status, status),
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}

export async function getApplication(id: string) {
  return db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
}

export async function acceptApplication(
  applicationId: string,
  reviewNotes: string
) {
  return db
    .update(applications)
    .set({
      status: "accepted",
      reviewNotes,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();
}

export async function rejectApplication(
  applicationId: string,
  reviewNotes: string
) {
  return db
    .update(applications)
    .set({
      status: "rejected",
      reviewNotes,
      updatedAt: new Date(),
    })
    .where(eq(applications.id, applicationId))
    .returning();
}
