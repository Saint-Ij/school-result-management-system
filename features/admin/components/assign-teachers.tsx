"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

type TeacherRow = { id: number; name: string }
type ClassSubjectRow = { id: number; classId: number; subjectId: number; teacherId: number | null; class: { name: string } | null; subject: { name: string } | null; teacher: { name: string } | null }

type AssignTeachersToSubjectsProps = {
  classSubjects: ClassSubjectRow[]; teachers: TeacherRow[]
  onAssignTeacher: (csId: number, teacherId: number) => Promise<void>
  onRemoveTeacher: (csId: number) => Promise<void>
}

export function AssignTeachersToSubjects({ classSubjects, teachers, onAssignTeacher, onRemoveTeacher }: AssignTeachersToSubjectsProps) {
  const router = useRouter()
  const [selectedCsId, setSelectedCsId] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const [csSearch, setCsSearch] = useState("")
  const filteredClassSubjects = classSubjects.filter((cs) =>
    `${cs.class?.name ?? ""} ${cs.subject?.name ?? ""}`.toLowerCase().includes(csSearch.toLowerCase())
  )
  const [teacherSearch, setTeacherSearch] = useState("")
  const filteredTeachers = teachers.filter((t) => t.name.toLowerCase().includes(teacherSearch.toLowerCase()))

  const cs = classSubjects.find(cs => cs.id === Number(selectedCsId))
  const [assignPage, setAssignPage] = useState(0)
  const assignPageSize = 15
  const assignTotalPages = Math.ceil(classSubjects.length / assignPageSize)
  const paginatedAssignments = classSubjects.slice(assignPage * assignPageSize, (assignPage + 1) * assignPageSize)

  async function handleAssign() {
    const csId = Number(selectedCsId)
    const tId = Number(selectedTeacherId)
    if (!csId || !tId) return
    try { await onAssignTeacher(csId, tId); toast.success("Teacher assigned"); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to assign teacher") }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Assign Teacher to Class Subject</CardTitle></CardHeader>
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
                  return cs ? `${cs.class?.name ?? `Class #${cs.classId}`} - ${cs.subject?.name ?? `Subject #${cs.subjectId}`}` : value
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectPopup>{filteredClassSubjects.map((cs) => (<SelectItem key={cs.id} value={cs.id.toString()}>{cs.class?.name ?? `Class #${cs.classId}`} - {cs.subject?.name ?? `Subject #${cs.subjectId}`}</SelectItem>))}</SelectPopup>
          </Select>
        </div>
        {cs && <><p className="text-sm text-muted-foreground">Current teacher: <strong>{cs.teacher?.name ?? "None"}</strong></p><div><input type="text" placeholder="Search teachers..." value={teacherSearch} onChange={(e) => setTeacherSearch(e.target.value)} className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring" /><Select value={selectedTeacherId} onValueChange={(v) => setSelectedTeacherId(v ?? "")}><SelectTrigger><SelectValue placeholder="Select teacher...">{(value) => filteredTeachers.find((t) => t.id.toString() === value)?.name ?? value}</SelectValue></SelectTrigger><SelectPopup>{filteredTeachers.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectPopup></Select></div><Button onClick={handleAssign} disabled={!selectedTeacherId}>Assign Teacher</Button></>}
        <div className="mt-6"><h4 className="text-sm font-medium mb-2">Current Assignments</h4><div className="space-y-2">{paginatedAssignments.map((cs) => (<div key={cs.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2"><span className="text-sm">{cs.class?.name} - {cs.subject?.name}</span><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{cs.teacher?.name ?? "Unassigned"}</span>{cs.teacher && <Button variant="ghost" size="icon-xs" onClick={async () => { try { await onRemoveTeacher(cs.id); toast.success("Teacher removed"); router.refresh() } catch (err) { console.error(err); toast.error("Failed to remove teacher") } }}><X className="size-3 text-destructive" /></Button>}</div></div>))}</div>{classSubjects.length > assignPageSize && (<div className="flex items-center justify-between pt-2"><span className="text-xs text-muted-foreground">{classSubjects.length} total</span><div className="flex gap-1"><Button variant="outline" size="xs" disabled={assignPage === 0} onClick={() => setAssignPage(p => p - 1)}>Prev</Button><span className="flex items-center px-2 text-xs text-muted-foreground">{assignPage + 1} / {assignTotalPages}</span><Button variant="outline" size="xs" disabled={assignPage >= assignTotalPages - 1} onClick={() => setAssignPage(p => p + 1)}>Next</Button></div></div>)}</div>
      </CardContent>
    </Card>
  )
}
