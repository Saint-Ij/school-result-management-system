import { notFound } from "next/navigation"
import bcrypt from "bcryptjs"
import { getTeacherById } from "@/server/admin/queries"
import { updateTeacher } from "@/server/admin/mutations"
import { PageHeader } from "@/components/shared/page-header"
import { TeacherEditForm } from "@/features/admin/forms/teacher-edit-form"

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const teacher = await getTeacherById(Number(id))
  if (!teacher) notFound()

  async function handleEdit(data: { name: string; staffId: string; password?: string }) {
    "use server"
    if (!teacher) return
    const updateData: Parameters<typeof updateTeacher>[1] = {
      name: data.name,
      staffId: data.staffId,
    }
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10)
    }
    await updateTeacher(teacher.id, updateData)
  }

  return (
    <div>
      <PageHeader title="Edit Teacher" description={`Editing ${teacher.name}`} />
      <TeacherEditForm teacher={teacher} onSubmit={handleEdit} />
    </div>
  )
}
