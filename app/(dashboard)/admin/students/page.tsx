import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { StudentsTable } from "@/features/admin/tables/students-table"
import { getStudents } from "@/server/admin/queries"
import { deleteStudent } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function StudentsPage() {
  const students = await getStudents()

  const csvData = students.map((s) => ({
    lastName: s.lastName,
    firstName: s.firstName,
    middleName: s.middleName ?? "",
    admissionNo: s.admissionNo,
  }))

  async function handleDelete(id: number) {
    "use server"
    await deleteStudent(id)
  }

  return (
    <div>
      <PageHeader title="Students" description="Manage all students">
        <ExportCsv data={csvData} columns={[
          { key: "lastName", label: "Last Name" },
          { key: "firstName", label: "First Name" },
          { key: "middleName", label: "Middle Name" },
          { key: "admissionNo", label: "Admission No" },
        ]} filename="students" />
        <Link href="/admin/students/create">
          <Button size="sm"><Plus className="size-4" /> Add Student</Button>
        </Link>
      </PageHeader>
      <StudentsTable data={students} onDelete={handleDelete} />
    </div>
  )
}
