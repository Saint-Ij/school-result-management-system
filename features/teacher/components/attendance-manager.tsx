"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { toast } from "sonner"

type ClassRow = { id: number; name: string }
type TermRow = { id: number; name: string }
const STATUS_OPTIONS = ["present", "absent", "excused", "late"] as const
type AttendanceStatus = typeof STATUS_OPTIONS[number]

type StudentClassRow = {
  studentId: number
  classId: number
  sessionId: number
  student: { id: number; firstName: string; lastName: string } | null
}

type AttendanceSessionRecord = {
  id: number
  termId: number
  classId: number
  date: string
  records: {
    id: number
    attendanceSessionId: number
    studentId: number
    status: string
    student: { id: number; firstName: string; lastName: string } | null
  }[]
}

type AttendanceSessionResult = {
  id: number
  termId: number
  classId: number
  date: string
}

type AttendanceManagerProps = {
  classes: ClassRow[]
  terms: TermRow[]
  teacherId: number
  activeSessionId: number | null
  onGetStudents: (classId: number) => Promise<StudentClassRow[]>
  onGetAttendanceByDate: (classId: number, date: string) => Promise<AttendanceSessionRecord | null>
  onCreateSession: (data: { termId: number; classId: number; date: string }) => Promise<AttendanceSessionResult[]>
  onTakeAttendance: (sessionId: number, records: { studentId: number; status: AttendanceStatus }[]) => Promise<{ id: number }[]>
}

export function AttendanceManager({ classes, terms, activeSessionId, onGetStudents, onGetAttendanceByDate, onCreateSession, onTakeAttendance }: AttendanceManagerProps) {
  const router = useRouter()
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedTermId, setSelectedTermId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<{ id: number; name: string; status: AttendanceStatus }[]>([])
  const [sessionId, setSessionId] = useState<number | null>(null)

  async function loadStudents() {
    const classId = Number(selectedClassId)
    if (!classId || !date) return
    try {
      const existing = await onGetAttendanceByDate(classId, date)
      if (existing) {
        setSessionId(existing.id)
        setStudents(existing.records?.map((r) => ({ id: r.studentId, name: r.student?.firstName ? `${r.student.firstName} ${r.student.lastName}` : `Student #${r.studentId}`, status: r.status as AttendanceStatus })) ?? [])
      } else {
        const classStudents = await onGetStudents(classId)
        setSessionId(null)
        setStudents(classStudents.map((sc) => ({ id: sc.studentId, name: `${sc.student?.firstName ?? ""} ${sc.student?.lastName ?? ""}`, status: "present" as AttendanceStatus })))
      }
    } catch (err) { console.error(err); toast.error("Failed to load students") }
  }

  function updateStatus(studentId: number, status: AttendanceStatus) { setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s)) }

  async function handleSave() {
    const classId = Number(selectedClassId)
    const termId = Number(selectedTermId)
    if (!classId || !termId || students.length === 0) return
    try {
      if (!activeSessionId) { toast.error("No active session"); return }

      let attSessionId = sessionId
      if (!attSessionId) {
        const [attSession] = await onCreateSession({ termId, classId, date })
        attSessionId = attSession.id
        setSessionId(attSessionId)
      }

      await onTakeAttendance(attSessionId, students.map(s => ({ studentId: s.id, status: s.status })))
      toast.success("Attendance saved")
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to save attendance") }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Select Class & Date</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedClassId} onValueChange={(v) => setSelectedClassId(v ?? "")}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select class...">
                  {(value) => classes.find(c => c.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{classes.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectPopup>
            </Select>
            <Select value={selectedTermId} onValueChange={(v) => setSelectedTermId(v ?? "")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select term...">
                  {(value) => terms.find(t => t.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{terms.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectPopup>
            </Select>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-48" />
            <Button onClick={loadStudents}>Load Students</Button>
          </div>
        </CardContent>
      </Card>
      {students.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Student Attendance</CardTitle><p className="text-xs text-muted-foreground">{date}</p></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>{students.map(s => (<TableRow key={s.id}><TableCell>{s.name}</TableCell><TableCell><div className="flex gap-1">{STATUS_OPTIONS.map(status => (<Button key={status} variant={s.status === status ? "default" : "outline"} size="xs" onClick={() => updateStatus(s.id, status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Button>))}</div></TableCell></TableRow>))}</TableBody>
            </Table>
            <Button className="mt-4" onClick={handleSave}>Save Attendance</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
