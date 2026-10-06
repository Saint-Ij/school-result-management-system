"use client"

import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"

export type StudentRow = {
  id: number
  admissionNo: string
  firstName: string
  lastName: string
  middleName: string | null
}

type StudentsColumnsProps = {
  onDelete: (id: number) => void
}

export function getStudentsColumns({ onDelete }: StudentsColumnsProps): ColumnDef<StudentRow>[] {
  return [
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Name <ArrowUpDown className="size-3" />
        </button>
      ),
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "admissionNo",
      header: "Admission No",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/admin/students/${s.id}`}>
              <Button variant="ghost" size="icon-xs"><Eye className="size-3" /></Button>
            </Link>
            <Link href={`/admin/students/${s.id}/edit`}>
              <Button variant="ghost" size="icon-xs"><Pencil className="size-3" /></Button>
            </Link>
            <ConfirmDeleteDialog title="Delete Student" description={`Delete ${s.firstName} ${s.lastName}?`} onConfirm={() => onDelete(s.id)}>
              <Button variant="ghost" size="icon-xs"><Trash2 className="size-3 text-destructive" /></Button>
            </ConfirmDeleteDialog>
          </div>
        )
      },
    },
  ]
}
