import { notFound } from "next/navigation"
import bcrypt from "bcryptjs"
import { getStudentById } from "@/server/admin/queries"
import { updateStudent } from "@/server/admin/mutations"
import { PageHeader } from "@/components/shared/page-header"
import { StudentEditForm } from "@/features/admin/forms/student-edit-form"

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await getStudentById(Number(id))
  if (!student) notFound()

  async function handleEdit(data: { firstName: string; lastName: string; middleName: string | null; admissionNo: string; password?: string }) {
    "use server"
    if (!student) return
    const updateData: Parameters<typeof updateStudent>[1] = {
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      admissionNo: data.admissionNo,
    }
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10)
    }
    await updateStudent(student.id, updateData)
  }

  return (
    <div>
      <PageHeader title="Edit Student" description={`Editing ${student.firstName} ${student.lastName}`} />
      <StudentEditForm student={student} onSubmit={handleEdit} />
    </div>
  )
}
