"use client"

import { useRouter } from "next/navigation"
import { DataTable } from "@/components/shared/data-table"
import { getTeachersColumns, type TeacherRow } from "@/features/admin/columns/teachers-columns"
import { toast } from "sonner"

type TeachersTableProps = {
  data: TeacherRow[]
  onDelete: (id: number) => Promise<void>
}

export function TeachersTable({ data, onDelete }: TeachersTableProps) {
  const router = useRouter()

  const handleDelete = async (id: number) => {
    try {
      await onDelete(id)
      toast.success("Teacher deleted successfully")
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to delete teacher") }
  }

  return <DataTable columns={getTeachersColumns({ onDelete: handleDelete })} data={data} searchKey="name" searchPlaceholder="Search teachers..." />
}
