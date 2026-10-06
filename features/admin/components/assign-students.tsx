"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { X } from "lucide-react"

type ClassRow = { id: number; name: string }
type StudentRow = { id: number; firstName: string; lastName: string; admissionNo: string }
type SessionRow = { id: number; name: string }

type EnrolledStudent = {
  studentId: number
  student: { id: number; firstName: string; lastName: string } | null
}

type SessionEnrollment = {
  studentId: number
  classId: number
  class: { id: number; name: string } | null
  student: { id: number; firstName: string; lastName: string } | null
}

type AssignStudentsToClassesProps = {
  classes: ClassRow[]; students: StudentRow[]; sessions: SessionRow[]
  onAssignStudents: (studentIds: number[], classId: number, sessionId: number) => Promise<void>
  onRemoveStudent: (studentId: number, classId: number, sessionId: number) => Promise<void>
  onGetEnrolledStudents: (classId: number, sessionId: number) => Promise<EnrolledStudent[]>
  onGetSessionEnrollments: (sessionId: number) => Promise<SessionEnrollment[]>
}

export function AssignStudentsToClasses({ classes, students, sessions, onAssignStudents, onRemoveStudent, onGetEnrolledStudents, onGetSessionEnrollments }: AssignStudentsToClassesProps) {
  const router = useRouter()
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [classSearch, setClassSearch] = useState("")
  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(classSearch.toLowerCase()))
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([])
  const [enrolled, setEnrolled] = useState<EnrolledStudent[]>([])
  const [allSessionEnrollments, setAllSessionEnrollments] = useState<SessionEnrollment[]>([])

  const classId = Number(selectedClassId)
  const sessionId = Number(selectedSessionId)

  async function loadEnrolled() {
    if (!classId || !sessionId) return
    try {
      const [list, sessionEnrollments] = await Promise.all([
        onGetEnrolledStudents(classId, sessionId),
        onGetSessionEnrollments(sessionId),
      ])
      setEnrolled(list)
      setAllSessionEnrollments(sessionEnrollments)
    } catch (err) { console.error(err); toast.error("Failed to load enrolled students") }
  }

  useEffect(() => { loadEnrolled(); setEnPage(0) }, [classId, sessionId])

  async function handleAssign() {
    if (!classId || !sessionId || selectedStudentIds.length === 0) return
    try { await onAssignStudents(selectedStudentIds, classId, sessionId); toast.success("Students assigned"); setSelectedStudentIds([]); await loadEnrolled(); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to assign students") }
  }

  async function handleRemove(studentId: number) {
    if (!classId || !sessionId) return
    try { await onRemoveStudent(studentId, classId, sessionId); toast.success("Student removed"); await loadEnrolled(); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to remove student") }
  }

  const enrolledIds = new Set(enrolled.map((e) => e.studentId))
  const availableStudents = students.filter((s) => !enrolledIds.has(s.id))
  const otherClassEnrollments = new Map(
    allSessionEnrollments
      .filter((e) => !enrolledIds.has(e.studentId))
      .map((e) => [e.studentId, e.class?.name ?? `Class #${e.classId}`])
  )
  const [avPage, setAvPage] = useState(0)
  const avPageSize = 20
  const avTotalPages = Math.max(1, Math.ceil(availableStudents.length / avPageSize))
  const paginatedAvailable = availableStudents.slice(avPage * avPageSize, (avPage + 1) * avPageSize)
  const [enPage, setEnPage] = useState(0)
  const enPageSize = 20
  const enTotalPages = Math.max(1, Math.ceil(enrolled.length / enPageSize))
  const paginatedEnrolled = enrolled.slice(enPage * enPageSize, (enPage + 1) * enPageSize)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Assign Students to Class</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select value={selectedSessionId} onValueChange={(v) => { setSelectedSessionId(v ?? ""); setEnrolled([]) }}>
              <SelectTrigger>
                <SelectValue placeholder="Select session...">
                  {(value) => sessions.find((s) => s.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{sessions.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}</SelectPopup>
            </Select>
            <div>
              <input
                type="text"
                placeholder="Search classes..."
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
                className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring"
              />
              <Select value={selectedClassId} onValueChange={(v) => { setSelectedClassId(v ?? ""); setEnrolled([]) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class...">
                    {(value) => filteredClasses.find((c) => c.id.toString() === value)?.name ?? value}
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>{filteredClasses.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectPopup>
              </Select>
            </div>
          </div>
          {classId && sessionId && (
            <>
              <div className="space-y-2">
                {paginatedAvailable.map((s) => {
                  const otherClass = otherClassEnrollments.get(s.id)
                  return (
                    <label key={s.id} className="flex items-center gap-2">
                      <Checkbox checked={selectedStudentIds.includes(s.id)} onCheckedChange={(checked) => { if (checked) setSelectedStudentIds(p => [...p, s.id]); else setSelectedStudentIds(p => p.filter(id => id !== s.id)) }} />
                      <span className="text-sm">{s.firstName} {s.lastName} ({s.admissionNo})</span>
                      {otherClass && <Badge variant="outline" className="ml-auto text-xs">In {otherClass}</Badge>}
                    </label>
                  )
                })}
                {availableStudents.length === 0 && <p className="text-sm text-muted-foreground">All students already enrolled</p>}
                {availableStudents.length > avPageSize && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {availableStudents.length} students
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="xs" disabled={avPage === 0} onClick={() => setAvPage(p => p - 1)}>Prev</Button>
                      <span className="flex items-center px-2 text-xs text-muted-foreground">{avPage + 1} / {avTotalPages}</span>
                      <Button variant="outline" size="xs" disabled={avPage >= avTotalPages - 1} onClick={() => setAvPage(p => p + 1)}>Next</Button>
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={handleAssign} disabled={selectedStudentIds.length === 0}>Assign Selected Students</Button>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Enrolled Students</CardTitle></CardHeader>
        <CardContent>
          {enrolled.length === 0 && <p className="text-sm text-muted-foreground">No students enrolled yet</p>}
          <div className="space-y-2">
            {paginatedEnrolled.map((e) => (
              <div key={e.studentId} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-sm">{e.student?.firstName} {e.student?.lastName}</span>
                <Button variant="ghost" size="icon-xs" onClick={() => handleRemove(e.studentId)}><X className="size-3 text-destructive" /></Button>
              </div>
            ))}
          </div>
          {enrolled.length > enPageSize && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">{enrolled.length} students</span>
              <div className="flex gap-1">
                <Button variant="outline" size="xs" disabled={enPage === 0} onClick={() => setEnPage(p => p - 1)}>Prev</Button>
                <span className="flex items-center px-2 text-xs text-muted-foreground">{enPage + 1} / {enTotalPages}</span>
                <Button variant="outline" size="xs" disabled={enPage >= enTotalPages - 1} onClick={() => setEnPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
