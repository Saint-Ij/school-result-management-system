"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/shared/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { toast } from "sonner"

type SubjectRow = { id: number; name: string }

type SubjectsManagerProps = {
  subjects: SubjectRow[]
  onCreate: (name: string) => Promise<void>
  onEdit: (id: number, name: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function SubjectsManager({ subjects, onCreate, onEdit, onDelete }: SubjectsManagerProps) {
  const router = useRouter()
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  async function handleCreate() { if (!newName) return; try { await onCreate(newName); toast.success("Subject created"); setNewName(""); router.refresh() } catch (err) { console.error(err); toast.error("Failed to create subject") } }

  async function handleEdit() { if (!editingId) return; try { await onEdit(editingId, editName); toast.success("Subject updated"); setEditingId(null); router.refresh() } catch (err) { console.error(err); toast.error("Failed to update subject") } }

  async function handleDelete(id: number) { try { await onDelete(id); toast.success("Subject deleted"); router.refresh() } catch (err) { console.error(err); toast.error("Failed to delete subject") } }

  const columns: ColumnDef<SubjectRow>[] = [
    { accessorKey: "name", header: "Subject Name" },
    { id: "actions", header: "Actions", cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-xs" onClick={() => { setEditingId(row.original.id); setEditName(row.original.name) }}><Pencil className="size-3" /></Button>
        <ConfirmDeleteDialog title="Delete Subject" description={`Delete ${row.original.name}?`} onConfirm={() => handleDelete(row.original.id)}><Button variant="ghost" size="icon-xs"><Trash2 className="size-3 text-destructive" /></Button></ConfirmDeleteDialog>
      </div>
    )},
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader><CardTitle>Create Subject</CardTitle></CardHeader>
        <CardContent><div className="flex gap-2"><Input placeholder="Subject name" value={newName} onChange={(e) => setNewName(e.target.value)} /><Button onClick={handleCreate} size="sm">Add</Button></div></CardContent>
      </Card>
      <div className="lg:col-span-2"><DataTable columns={columns} data={subjects} searchKey="name" searchPlaceholder="Search subjects..." /></div>
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingId(null)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader><CardTitle>Edit Subject</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><label className="text-sm font-medium">Subject Name</label><Input value={editName} onChange={(e) => setEditName(e.target.value)} /></div>
                <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button><Button onClick={handleEdit}>Save</Button></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
