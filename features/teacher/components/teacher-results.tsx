"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { ResultStatusBadge } from "@/components/shared/result-status-badge"
import { toast } from "sonner"
import { Dialog, DialogTrigger, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import type { StudentScoreSummary } from "@/server/teacher/queries"

type ClassRow = { id: number; name: string }
type TermRow = { id: number; name: string }

type StudentClassRow = {
  studentId: number
  classId: number
  sessionId: number
  student: { id: number; firstName: string; lastName: string } | null
}

type ReportCardRow = {
  id: number
  studentId: number
  status: string
  classTeacherComment: string | null
}

type TeacherResultsManagerProps = {
  classes: ClassRow[]
  terms: TermRow[]
  onGetStudents: (classId: number) => Promise<StudentClassRow[]>
  onGetResults: (classId: number, termId: number) => Promise<ReportCardRow[]>
  onSubmitResult: (data: { studentId: number; classId: number; termId: number; comment: string }) => Promise<void>
}

async function fetchStudentScores(studentId: number, classId: number, termId: number, signal?: AbortSignal): Promise<StudentScoreSummary | null> {
  const params = new URLSearchParams({ studentId: String(studentId), classId: String(classId), termId: String(termId) })
  const res = await fetch(`/api/student-scores?${params}`, { signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function TeacherResultsManager({ classes, terms, onGetStudents, onGetResults, onSubmitResult }: TeacherResultsManagerProps) {
  const router = useRouter()
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedTermId, setSelectedTermId] = useState("")
  const [classStudents, setClassStudents] = useState<{ id: number; name: string; status: string }[]>([])
  const [comment, setComment] = useState("")
  const [studentComment, setStudentComment] = useState("")
  const [scoreSummary, setScoreSummary] = useState<StudentScoreSummary | null>(null)
  const [loadingScores, setLoadingScores] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const classId = Number(selectedClassId)
  const termId = Number(selectedTermId)

  async function loadStudents() {
    if (!classId || !termId) return
    try {
      const [students, results] = await Promise.all([
        onGetStudents(classId),
        onGetResults(classId, termId),
      ])
      const resultMap = new Map(results.map((r) => [r.studentId, r.status]))
      setClassStudents(
        students.map((sc) => ({
          id: sc.studentId,
          name: `${sc.student?.firstName ?? ""} ${sc.student?.lastName ?? ""}`,
          status: resultMap.get(sc.studentId) ?? "none",
        }))
      )
    } catch (err) { console.error(err); toast.error("Failed to load students") }
  }

  function handleOpenDialog(studentId: number) {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const id = ++fetchIdRef.current
    setStudentComment(comment)
    setLoadingScores(true)
    setScoreSummary(null)
    setLoadError(null)

    if (!classId || !termId) return
    fetchStudentScores(studentId, classId, termId, controller.signal)
      .then(summary => {
        if (id === fetchIdRef.current && !controller.signal.aborted) {
          setScoreSummary(summary)
          setLoadingScores(false)
        }
      })
      .catch(err => {
        if (id === fetchIdRef.current && !controller.signal.aborted) {
          console.error(err)
          setLoadError(err instanceof Error ? err.message : "Failed to load scores")
          setLoadingScores(false)
        }
      })
  }

  async function handleSubmit(studentId: number) {
    if (!classId || !termId) return
    try {
      await onSubmitResult({ studentId, classId, termId, comment: studentComment || comment })
      toast.success("Result submitted for approval")
      setStudentComment("")
      setScoreSummary(null)
      await loadStudents()
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to submit result") }
  }

  function canSubmit(status: string) {
    return status === "none" || status === "draft"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Select Class & Term</CardTitle></CardHeader>
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
            <Button onClick={loadStudents}>Load Students</Button>
          </div>
        </CardContent>
      </Card>
      {classStudents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">Default comment:</span><Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Enter class comment..." className="max-w-md" /></div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>{classStudents.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell><ResultStatusBadge status={(s.status === "none" ? "draft" : s.status) as "draft" | "teacher_submitted" | "approved"} /></TableCell>
                  <TableCell>
                    {canSubmit(s.status) ? (
                      <Dialog onOpenChange={(open) => { if (!open) { setScoreSummary(null); setLoadError(null) } }}>
                        <DialogTrigger render={<span />} nativeButton={false}>
                          <Button variant="outline" size="xs" onClick={() => handleOpenDialog(s.id)}>
                            {s.status === "draft" ? "Resubmit" : "Submit Result"}
                          </Button>
                        </DialogTrigger>
                        <DialogPopup>
                          <DialogHeader><DialogTitle>Submit Result</DialogTitle><DialogDescription>{s.name}</DialogDescription></DialogHeader>
                          <div className="space-y-4">
                            {loadingScores ? (
                              <div className="flex items-center justify-center py-8"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
                            ) : loadError ? (
                              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{loadError}</div>
                            ) : scoreSummary ? (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold mb-2">Subject Scores</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Subject</TableHead>
                                        {scoreSummary.subjects[0]?.components.map((c, i) => (
                                          <TableHead key={i} className="text-right">{c.column}</TableHead>
                                        ))}
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Max</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {scoreSummary.subjects.map((subj) => (
                                        <TableRow key={subj.subjectId}>
                                          <TableCell>{subj.subjectName}</TableCell>
                                          {subj.components.map((c, i) => (
                                            <TableCell key={i} className="text-right">{c.score}/{c.maxScore}</TableCell>
                                          ))}
                                          {subj.components.length === 0 && (
                                            <TableCell className="text-right text-muted-foreground" colSpan={scoreSummary.subjects[0]?.components.length || 1}>—</TableCell>
                                          )}
                                          <TableCell className="text-right font-medium">{subj.total}</TableCell>
                                          <TableCell className="text-right text-muted-foreground">{subj.maxTotal}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="bg-muted rounded-lg p-3 flex-1 min-w-[120px]">
                                    <span className="text-muted-foreground block">Total Score</span>
                                    <span className="text-lg font-bold">{scoreSummary.totalScore}/{scoreSummary.totalMax}</span>
                                  </div>
                                  <div className="bg-muted rounded-lg p-3 flex-1 min-w-[120px]">
                                    <span className="text-muted-foreground block">Average</span>
                                    <span className="text-lg font-bold">{scoreSummary.average}%</span>
                                  </div>
                                  <div className="bg-muted rounded-lg p-3 flex-1 min-w-[120px]">
                                    <span className="text-muted-foreground block">Position</span>
                                    <span className="text-lg font-bold">{scoreSummary.position}<span className="text-sm font-normal text-muted-foreground">/{scoreSummary.totalStudents}</span></span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Teacher Comment</label>
                                  <Input value={studentComment} onChange={e => setStudentComment(e.target.value)} placeholder="Enter comment..." />
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <DialogFooter><Button onClick={() => handleSubmit(s.id)} disabled={!scoreSummary}>Submit for Approval</Button></DialogFooter>
                        </DialogPopup>
                      </Dialog>
                    ) : (
                      <Button variant="outline" size="xs" disabled>
                        {s.status === "teacher_submitted" ? "Awaiting Approval" : "Approved"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
