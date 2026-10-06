"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

type ClassRow = { id: number; name: string; classTeacherId: number | null; classTeacher: { name: string } | null }
type SubjectRow = { id: number; name: string }

type ClassSubjectRow = {
  id: number
  classId: number
  subjectId: number
  teacherId: number | null
  class: { id: number; name: string } | null
  subject: { id: number; name: string } | null
  teacher: { id: number; name: string } | null
}

type AssignSubjectsToClassesProps = {
  classes: ClassRow[]; subjects: SubjectRow[]; classSubjects: ClassSubjectRow[]
  onAssignSubjects: (classId: number, subjectIds: number[]) => Promise<void>
  onRemoveSubject: (csId: number) => Promise<void>
}

export function AssignSubjectsToClasses({ classes, subjects, classSubjects, onAssignSubjects, onRemoveSubject }: AssignSubjectsToClassesProps) {
  const router = useRouter()
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([])
  const [classSearch, setClassSearch] = useState("")
  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(classSearch.toLowerCase()))

  const classId = Number(selectedClassId)
  const assigned = classSubjects.filter((cs) => cs.classId === classId)

  async function handleAssign() { if (!classId || selectedSubjectIds.length === 0) return; try { await onAssignSubjects(classId, selectedSubjectIds); toast.success("Subjects assigned"); setSelectedSubjectIds([]); router.refresh() } catch (err) { console.error(err); toast.error("Failed to assign subjects") } }

  async function handleRemove(csId: number) { try { await onRemoveSubject(csId); toast.success("Subject removed"); router.refresh() } catch (err) { console.error(err); toast.error("Failed to remove subject") } }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Assign Subjects</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search classes..."
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring"
            />
            <Select value={selectedClassId} onValueChange={(v) => setSelectedClassId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select class...">
                  {(value) => filteredClasses.find((c) => c.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{filteredClasses.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectPopup>
            </Select>
          </div>
          {classId > 0 && <>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {subjects.map((sub) => {
                const isAssigned = assigned.some((a) => a.subjectId === sub.id)
                return (<label key={sub.id} className="flex items-center gap-2"><Checkbox checked={selectedSubjectIds.includes(sub.id)} disabled={isAssigned} onCheckedChange={(checked) => { if (checked) setSelectedSubjectIds(p => [...p, sub.id]); else setSelectedSubjectIds(p => p.filter(id => id !== sub.id)) }} /><span className="text-sm">{sub.name}</span>{isAssigned && <Badge variant="secondary" className="ml-auto">Assigned</Badge>}</label>)
              })}
            </div>
            <Button onClick={handleAssign} disabled={selectedSubjectIds.length === 0}>Assign Selected Subjects</Button>
          </>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Assigned Subjects</CardTitle></CardHeader>
        <CardContent>
          {classId > 0 ? <div className="space-y-2">{assigned.length === 0 && <p className="text-sm text-muted-foreground">No subjects assigned.</p>}{assigned.map((cs) => (<div key={cs.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2"><span className="text-sm">{cs.subject?.name ?? `Subject #${cs.subjectId}`}</span><Button variant="ghost" size="icon-xs" onClick={() => handleRemove(cs.id)}><Trash2 className="size-3 text-destructive" /></Button></div>))}</div> : <p className="text-sm text-muted-foreground">Select a class above.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
