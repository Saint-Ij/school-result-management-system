import { PageHeader } from "@/components/shared/page-header"
import { AdminPasswordReset } from "@/features/admin/components/admin-password-reset"
import { getTeachers } from "@/server/admin/queries"
import { db } from "@/lib/db"
import { adminResetPassword } from "@/server/auth/password-reset"

export default async function PasswordResetPage() {
  const teachers = await getTeachers()
  const students = await db.query.student.findMany()
  const admins = await db.query.admin.findMany()

  async function handleReset(userType: "admin" | "teacher" | "student", userId: number, newPassword: string) {
    "use server"
    return adminResetPassword(userType, userId, newPassword)
  }

  return (
    <div>
      <PageHeader
        title="Password Reset"
        description="Reset passwords for any user in the system"
      />
      <AdminPasswordReset
        admins={admins}
        teachers={teachers}
        students={students}
        onReset={handleReset}
      />
    </div>
  )
}
