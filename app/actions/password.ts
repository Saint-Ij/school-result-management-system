"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { admin, teacher, student } from "@/lib/db/schema";

export type PasswordResult = {
  success: boolean;
  error?: string;
};

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<PasswordResult> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.type) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = Number(session.user.id);
  const type = session.user.type as "admin" | "teacher" | "student";

  let user: { passwordHash: string } | undefined;
  if (type === "admin") {
    user = await db.query.admin.findFirst({
      where: eq(admin.id, userId),
    });
  } else if (type === "teacher") {
    user = await db.query.teacher.findFirst({
      where: eq(teacher.id, userId),
    });
  } else if (type === "student") {
    user = await db.query.student.findFirst({
      where: eq(student.id, userId),
    });
  } else {
    return { success: false, error: "Invalid user type" };
  }

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (type === "admin") {
    await db.update(admin).set({ passwordHash: hashedPassword }).where(eq(admin.id, userId));
  } else if (type === "teacher") {
    await db.update(teacher).set({ passwordHash: hashedPassword }).where(eq(teacher.id, userId));
  } else if (type === "student") {
    await db.update(student).set({ passwordHash: hashedPassword }).where(eq(student.id, userId));
  }

  return { success: true };
}
