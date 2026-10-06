import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { student } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { DashboardLayout } from "@/components/shared/dashboard-layout"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.type !== "student") redirect("/")

  const userId = Number(session.user.id)
  const user = await db.query.student.findFirst({
    where: eq(student.id, userId),
  })

  const name = user
    ? `${user.firstName} ${user.lastName}`
    : "Student"

  return (
    <DashboardLayout role="student" name={name}>
      {children}
    </DashboardLayout>
  )
}
