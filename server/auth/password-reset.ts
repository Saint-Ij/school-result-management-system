import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { admin, teacher, student } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function adminResetPassword(
  userType: "admin" | "teacher" | "student",
  userId: number,
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (session?.user?.type !== "admin") {
    return { error: "Unauthorized" };
  }

  if (newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  if (userType === "admin") {
    await db.update(admin).set({ passwordHash }).where(eq(admin.id, userId));
  } else if (userType === "teacher") {
    await db.update(teacher).set({ passwordHash }).where(eq(teacher.id, userId));
  } else if (userType === "student") {
    await db.update(student).set({ passwordHash }).where(eq(student.id, userId));
  }

  return { success: true };
}
