"use client"

import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"

export type TeacherRow = {
  id: number
  staffId: string
  name: string
}

type TeachersColumnsProps = {
  onDelete: (id: number) => void
}

export function getTeachersColumns({ onDelete }: TeachersColumnsProps): ColumnDef<TeacherRow>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="size-3" />
        </button>
      ),
    },
    {
      accessorKey: "staffId",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Staff ID
          <ArrowUpDown className="size-3" />
        </button>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div className="flex items-center gap-1">
            <Link href={`/admin/teachers/${teacher.id}`}>
              <Button variant="ghost" size="icon-xs">
                <Eye className="size-3" />
              </Button>
            </Link>
            <Link href={`/admin/teachers/${teacher.id}/edit`}>
              <Button variant="ghost" size="icon-xs">
                <Pencil className="size-3" />
              </Button>
            </Link>
            <ConfirmDeleteDialog
              title="Delete Teacher"
              description={`Are you sure you want to delete ${teacher.name}?`}
              onConfirm={() => onDelete(teacher.id)}
            >
              <Button variant="ghost" size="icon-xs">
                <Trash2 className="size-3 text-destructive" />
              </Button>
            </ConfirmDeleteDialog>
          </div>
        )
      },
    },
  ]
}
