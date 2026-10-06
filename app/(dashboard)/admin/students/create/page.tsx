import { PageHeader } from "@/components/shared/page-header"
import { StudentForm } from "@/features/admin/forms/student-form"
import { registerStudent } from "@/server/admin/creation"

export default function CreateStudentPage() {
  async function handleCreate(data: { admissionNo: string; passwordHash: string; firstName: string; lastName: string; middleName?: string }) {
    "use server"
    return registerStudent(data)
  }

  return (
    <div>
      <PageHeader title="Add Student" description="Create a new student account" />
      <StudentForm onSubmit={handleCreate} />
    </div>
  )
}
