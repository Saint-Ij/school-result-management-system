import { PageHeader } from "@/components/shared/page-header"
import { ClassesManager } from "@/features/admin/components/classes-manager"
import { getClasses, getTeachers } from "@/server/admin/queries"
import { createClass } from "@/server/admin/creation"
import { updateClass, deleteClass } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function ClassesPage() {
  const [classes, teachers] = await Promise.all([getClasses(), getTeachers()])

  const csvData = classes.map((c) => ({
    name: c.name,
    classTeacher: c.classTeacher?.name ?? "",
  }))

  async function handleCreate(name: string) {
    "use server"
    await createClass({ name })
  }

  async function handleEdit(id: number, data: { name: string; classTeacherId: number | null }) {
    "use server"
    await updateClass(id, data)
  }

  async function handleDelete(id: number) {
    "use server"
    await deleteClass(id)
  }

  return (
    <div>
      <PageHeader title="Classes" description="Manage school classes">
        <ExportCsv data={csvData} columns={[
          { key: "name", label: "Class Name" },
          { key: "classTeacher", label: "Class Teacher" },
        ]} filename="classes" />
      </PageHeader>
      <ClassesManager classes={classes} teachers={teachers} onCreate={handleCreate} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
