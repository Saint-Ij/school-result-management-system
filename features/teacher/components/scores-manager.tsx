"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { toast } from "sonner"

type SubjectRow = { id: number; classId: number; subjectId: number; class: { name: string } | null; subject: { name: string } | null }
type TermRow = { id: number; name: string }

type ClassSubjectFull = {
  id: number
  classId: number
  subjectId: number
  teacherId: number | null
  class: { id: number; name: string } | null
  subject: { id: number; name: string } | null
  teacher: { id: number; name: string } | null
  scoreSetup: { id: number; classSubjectId: number; columnName: string; maxScore: number }[]
}

type StudentClassRow = {
  studentId: number
  classId: number
  sessionId: number
  student: { id: number; firstName: string; lastName: string } | null
}

type StudentScoreRow = {
  id: number
  studentId: number
  classSubjectId: number
  termId: number
  scoreSetupId: number
  score: number
  student: { id: number; firstName: string; lastName: string } | null
  scoreSetup: { id: number; columnName: string; maxScore: number } | null
}

type ScoresManagerProps = {
  subjects: SubjectRow[]
  terms: TermRow[]
  onGetClassSubject: (csId: number) => Promise<ClassSubjectFull | null>
  onGetClassStudents: (classId: number) => Promise<StudentClassRow[]>
  onGetSubjectScores: (csId: number, termId: number) => Promise<StudentScoreRow[]>
  onRecordScores: (entries: { studentId: number; classSubjectId: number; termId: number; scoreSetupId: number; score: number }[]) => Promise<{ id: number }[]>
}

export function ScoresManager({ subjects, terms, onGetClassSubject, onGetClassStudents, onGetSubjectScores, onRecordScores }: ScoresManagerProps) {
  const router = useRouter()
  const [selectedSubjId, setSelectedSubjId] = useState("")
  const [selectedTermId, setSelectedTermId] = useState("")
  const [subjSearch, setSubjSearch] = useState("")
  const filteredSubjects = subjects.filter((s) =>
    `${s.class?.name ?? ""} ${s.subject?.name ?? ""}`.toLowerCase().includes(subjSearch.toLowerCase())
  )
  const [scoreSetup, setScoreSetup] = useState<{ id: number; columnName: string; maxScore: number }[]>([])
  const [scores, setScores] = useState<Record<string, Record<number, string>>>({})
  const [students, setStudents] = useState<{ id: number; name: string }[]>([])

  const csId = Number(selectedSubjId)
  const termId = Number(selectedTermId)

  useEffect(() => { if (csId) { onGetClassSubject(csId).then((cs) => setScoreSetup(cs?.scoreSetup ?? [])).catch((err) => { console.error(err); toast.error("Failed to load score setup") }) } }, [csId])

  async function loadData() {
    if (!csId || !termId) return
    try {
      const cs = await onGetClassSubject(csId)
      if (!cs) return
      const classStudents = await onGetClassStudents(cs.classId)
      const studentList = classStudents.map((sc) => ({ id: sc.studentId, name: `${sc.student?.firstName ?? ""} ${sc.student?.lastName ?? ""}` }))
      setStudents(studentList)

      const existingScores = await onGetSubjectScores(csId, termId)
      const scoreMap: Record<string, Record<number, string>> = {}
      studentList.forEach((s) => {
        scoreMap[s.id] = {}
        cs.scoreSetup?.forEach((col) => {
          const existing = existingScores.find((es) => es.studentId === s.id && es.scoreSetupId === col.id)
          scoreMap[s.id][col.id] = existing ? String(existing.score) : ""
        })
      })
      setScores(scoreMap)
    } catch (err) { console.error(err); toast.error("Failed to load data") }
  }

  useEffect(() => { if (csId && termId) { loadData() } }, [csId, termId])

  function getStudentTotal(studentId: number): number {
    const studentScores = scores[studentId]
    if (!studentScores) return 0
    return scoreSetup.reduce((sum, col) => {
      const val = studentScores[col.id]
      return sum + (val !== "" ? Number(val) : 0)
    }, 0)
  }

  function updateCell(studentId: number, setupId: number, value: string) { setScores(prev => ({ ...prev, [studentId]: { ...prev[studentId], [setupId]: value } })) }

  async function handleSave() {
    if (!csId || !termId) return
    try {
      const entries: { studentId: number; classSubjectId: number; termId: number; scoreSetupId: number; score: number }[] = []
      for (const studentIdStr of Object.keys(scores)) {
        const studentId = Number(studentIdStr)
        for (const setupIdStr of Object.keys(scores[studentId])) {
          const setupId = Number(setupIdStr)
          const score = scores[studentId][setupId]
          if (score !== "") entries.push({ studentId, classSubjectId: csId, termId, scoreSetupId: setupId, score: Number(score) })
        }
      }
      if (entries.length > 0) await onRecordScores(entries)
      toast.success("Scores saved"); router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to save scores") }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Select Subject & Term</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search subjects..."
                value={subjSearch}
                onChange={(e) => setSubjSearch(e.target.value)}
                className="mb-1 w-full rounded-none border border-transparent border-b-input bg-transparent px-0 py-1 text-sm outline-none focus-visible:border-b-ring"
              />
              <Select value={selectedSubjId} onValueChange={(v) => { setSelectedSubjId(v ?? ""); setSelectedTermId("") }}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select subject...">
                    {(value) => filteredSubjects.find(s => s.id.toString() === value) ? `${filteredSubjects.find(s => s.id.toString() === value)?.class?.name} - ${filteredSubjects.find(s => s.id.toString() === value)?.subject?.name}` : value}
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>{filteredSubjects.map(sub => (<SelectItem key={sub.id} value={sub.id.toString()}>{sub.class?.name} - {sub.subject?.name}</SelectItem>))}</SelectPopup>
              </Select>
            </div>
            <Select value={selectedTermId} onValueChange={(v) => setSelectedTermId(v ?? "")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select term...">
                  {(value) => terms.find(t => t.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>{terms.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectPopup>
            </Select>
          </div>
        </CardContent>
      </Card>
      {students.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Score Entry</CardTitle><p className="text-xs text-muted-foreground">Total obtainable: {scoreSetup.reduce((s, c) => s + c.maxScore, 0)}</p></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead>{scoreSetup.map(col => (<TableHead key={col.id}>{col.columnName}<span className="ml-1 text-xs text-muted-foreground">({col.maxScore})</span></TableHead>))}<TableHead className="text-center font-medium">Total</TableHead></TableRow></TableHeader>
              <TableBody>{students.map(s => (<TableRow key={s.id}><TableCell className="font-medium">{s.name}</TableCell>{scoreSetup.map(col => (<TableCell key={col.id}><Input type="number" className="h-8 w-20" min={0} max={col.maxScore} value={scores[s.id]?.[col.id] ?? ""} onChange={e => updateCell(s.id, col.id, e.target.value)} /></TableCell>))}<TableCell className="text-center font-semibold">{getStudentTotal(s.id)}</TableCell></TableRow>))}</TableBody>
            </Table>
            <Button className="mt-4" onClick={handleSave}>Save Scores</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
