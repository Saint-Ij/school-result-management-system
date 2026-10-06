import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { teacher } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { DashboardLayout } from "@/components/shared/dashboard-layout"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.type !== "teacher") redirect("/")

  const userId = Number(session.user.id)
  const user = await db.query.teacher.findFirst({
    where: eq(teacher.id, userId),
  })

  return (
    <DashboardLayout role="teacher" name={user?.name ?? "Teacher"}>
      {children}
    </DashboardLayout>
  )
}
