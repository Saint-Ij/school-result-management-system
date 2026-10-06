"use client"

import { useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/data-table"
import { getStudentsColumns, type StudentRow } from "@/features/admin/columns/students-columns"
import { toast } from "sonner"

type StudentsTableProps = {
  data: StudentRow[]
  onDelete: (id: number) => Promise<void>
}

export function StudentsTable({ data, onDelete }: StudentsTableProps) {
  const router = useRouter()
  const handleDelete = async (id: number) => {
    try { await onDelete(id); toast.success("Student deleted"); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to delete student") }
  }
  return <DataTable columns={getStudentsColumns({ onDelete: handleDelete })} data={data} searchKey="lastName" searchPlaceholder="Search students..." />
}
