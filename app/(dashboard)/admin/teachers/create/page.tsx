import { PageHeader } from "@/components/shared/page-header"
import { TeacherForm } from "@/features/admin/forms/teacher-form"
import { registerTeacher } from "@/server/admin/creation"

export default function CreateTeacherPage() {
  async function handleCreate(data: { name: string; staffId: string; passwordHash: string }) {
    "use server"
    return registerTeacher(data)
  }

  return (
    <div>
      <PageHeader title="Add Teacher" description="Create a new teacher account" />
      <TeacherForm onSubmit={handleCreate} />
    </div>
  )
}
