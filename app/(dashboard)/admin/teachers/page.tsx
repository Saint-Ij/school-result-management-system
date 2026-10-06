import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { TeachersTable } from "@/features/admin/tables/teachers-table"
import { getTeachers } from "@/server/admin/queries"
import { deleteTeacher } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function TeachersPage() {
  const teachers = await getTeachers()

  const csvData = teachers.map((t) => ({
    name: t.name,
    staffId: t.staffId,
  }))

  async function handleDelete(id: number) {
    "use server"
    await deleteTeacher(id)
  }

  return (
    <div>
      <PageHeader title="Teachers" description="Manage all teachers">
        <ExportCsv data={csvData} columns={[
          { key: "name", label: "Name" },
          { key: "staffId", label: "Staff ID" },
        ]} filename="teachers" />
        <Link href="/admin/teachers/create">
          <Button size="sm"><Plus className="size-4" /> Add Teacher</Button>
        </Link>
      </PageHeader>
      <TeachersTable data={teachers} onDelete={handleDelete} />
    </div>
  )
}
