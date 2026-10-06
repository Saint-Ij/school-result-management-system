"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { DataTable } from "@/components/shared/data-table"
import { type ColumnDef } from "@tanstack/react-table"
import { Trash2, Plus, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type ClassSubjectRow = { id: number; classId: number; subjectId: number; class: { name: string } | null; subject: { name: string } | null }
type ScoreColumn = { id: number; columnName: string; maxScore: number }

type ScoreSetupManagerProps = {
  classSubjects: ClassSubjectRow[]
  onAddColumn: (csId: number, columns: { columnName: string; maxScore: number }[]) => Promise<void>
  onDeleteColumn: (id: number) => Promise<void>
  onUpdateColumn: (id: number, data: { columnName: string; maxScore: number }) => Promise<void>
  getScoreSetup: (csId: number) => Promise<ScoreColumn[]>
}

export function ScoreSetupManager({ classSubjects, onAddColumn, onDeleteColumn, onUpdateColumn, getScoreSetup }: ScoreSetupManagerProps) {
  const router = useRouter()
  const [selectedCsId, setSelectedCsId] = useState("")
  const [csSearch, setCsSearch] = useState("")
  const filteredClassSubjects = classSubjects.filter((cs) =>
    `${cs.class?.name ?? ""} ${cs.subject?.name ?? ""}`.toLowerCase().includes(csSearch.toLowerCase())
  )
  const [columns, setColumns] = useState<ScoreColumn[]>([])
  const [newColName, setNewColName] = useState("")
  const [newColMax, setNewColMax] = useState("")

  const csId = Number(selectedCsId)

  useEffect(() => {
    if (csId) {
      getScoreSetup(csId).then(setColumns).catch((err) => { console.error(err); toast.error("Failed to load score columns") })
    }
  }, [csId])

  async function handleAddColumn() {
    if (!csId || !newColName || !newColMax) return
    try { await onAddColumn(csId, [{ columnName: newColName, maxScore: Number(newColMax) }]); toast.success("Column added"); setNewColName(""); setNewColMax(""); setColumns(await getScoreSetup(csId)); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to add column") }
  }

  async function handleDeleteColumn(colId: number) {
    try { await onDeleteColumn(colId); toast.success("Column deleted"); setColumns(await getScoreSetup(csId)); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to delete column") }
  }

  const [editingCol, setEditingCol] = useState<ScoreColumn | null>(null)
  const [editName, setEditName] = useState("")
  const [editMax, setEditMax] = useState("")

  async function handleUpdateColumn() {
    if (!editingCol || !editName || !editMax) return
    try { await onUpdateColumn(editingCol.id, { columnName: editName, maxScore: Number(editMax) }); toast.success("Column updated"); setEditingCol(null); setColumns(await getScoreSetup(csId)); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to update column") }
  }

  const tableColumns: ColumnDef<ScoreColumn>[] = [
    { accessorKey: "columnName", header: "Column Name" },
    { accessorKey: "maxScore", header: "Max Score" },
    { id: "actions", header: "Actions", cell: ({ row }) => (<div className="flex gap-1"><Button variant="ghost" size="icon-xs" onClick={() => { setEditingCol(row.original); setEditName(row.original.columnName); setEditMax(row.original.maxScore.toString()) }}><Pencil className="size-3" /></Button><Button variant="ghost" size="icon-xs" onClick={() => handleDeleteColumn(row.original.id)}><Trash2 className="size-3 text-destructive" /></Button></div>) },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Select Subject</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search class subjects..."
              value={csSearch}
              onChange={(e) => setCsSearch(e.target.value)}
              className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring"
            />
            <Select value={selectedCsId} onValueChange={(v) => setSelectedCsId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select class subject...">
                  {(value) => {
                    const cs = classSubjects.find(c => c.id.toString() === value)
                    return cs ? `${cs.class?.name} - ${cs.subject?.name}` : value
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{filteredClassSubjects.map((cs) => (<SelectItem key={cs.id} value={cs.id.toString()}>{cs.class?.name} - {cs.subject?.name}</SelectItem>))}</SelectPopup>
            </Select>
          </div>
          {csId > 0 && <div className="flex gap-2"><Input placeholder="Column name (e.g. CA1)" value={newColName} onChange={(e) => setNewColName(e.target.value)} className="flex-1" /><Input placeholder="Max" type="number" value={newColMax} onChange={(e) => setNewColMax(e.target.value)} className="w-20" /><Button onClick={handleAddColumn} size="icon-xs"><Plus className="size-3" /></Button></div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Score Columns</CardTitle></CardHeader>
        <CardContent><DataTable columns={tableColumns} data={columns} /></CardContent>
      </Card>
      <Dialog open={!!editingCol} onOpenChange={(open) => { if (!open) setEditingCol(null) }}>
        <DialogPopup>
          <DialogHeader><DialogTitle>Edit Score Column</DialogTitle><DialogDescription>Update the column name or max score.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Column name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input placeholder="Max score" type="number" value={editMax} onChange={(e) => setEditMax(e.target.value)} />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditingCol(null)}>Cancel</Button><Button onClick={handleUpdateColumn}>Save</Button></DialogFooter>
        </DialogPopup>
      </Dialog>
    </div>
  )
}
