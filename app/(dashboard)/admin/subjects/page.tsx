import { PageHeader } from "@/components/shared/page-header"
import { SubjectsManager } from "@/features/admin/components/subjects-manager"
import { getSubjects } from "@/server/admin/queries"
import { createSubject } from "@/server/admin/creation"
import { updateSubject, deleteSubject } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function SubjectsPage() {
  const subjects = await getSubjects()

  const csvData = subjects.map((s) => ({ name: s.name }))

  async function handleCreate(name: string) {
    "use server"
    await createSubject({ name })
  }

  async function handleEdit(id: number, name: string) {
    "use server"
    await updateSubject(id, { name })
  }

  async function handleDelete(id: number) {
    "use server"
    await deleteSubject(id)
  }

  return (
    <div>
      <PageHeader title="Subjects" description="Manage school subjects">
        <ExportCsv data={csvData} columns={[{ key: "name", label: "Subject Name" }]} filename="subjects" />
      </PageHeader>
      <SubjectsManager subjects={subjects} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
