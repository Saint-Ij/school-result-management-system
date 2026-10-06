import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { admin } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { DashboardLayout } from "@/components/shared/dashboard-layout"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user?.type !== "admin") redirect("/")

  const userId = Number(session.user.id)
  const user = await db.query.admin.findFirst({
    where: eq(admin.id, userId),
  })

  return (
    <DashboardLayout role="admin" name={user?.name ?? "Admin"}>
      {children}
    </DashboardLayout>
  )
}
