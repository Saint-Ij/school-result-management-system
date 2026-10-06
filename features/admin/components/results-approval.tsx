"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { StudentScoreSummary } from "@/server/teacher/queries"

type ResultRow = {
  id: number
  studentId: number
  classId: number
  termId: number
  student: { firstName: string; lastName: string }
  class: { name: string }
  term: { name: string }
  classTeacherComment: string | null
  status: string
}

type ResultsApprovalProps = {
  pendingResults: ResultRow[]
  approvedResults: ResultRow[]
  onApprove: (reportCardId: number, comment: string) => Promise<void>
  onReject: (reportCardId: number) => Promise<void>
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

export function ResultsApproval({ pendingResults, approvedResults, onApprove, onReject }: ResultsApprovalProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<ResultRow | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [scoreSummary, setScoreSummary] = useState<StudentScoreSummary | null>(null)
  const [loadingScores, setLoadingScores] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const fetchIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  function handleSelectResult(row: ResultRow) {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const id = ++fetchIdRef.current
    setSelectedResult(row)
    setAdminComment("")
    setDialogOpen(true)
    setLoadingScores(true)
    setScoreSummary(null)
    setLoadError(null)

    fetchStudentScores(row.studentId, row.classId, row.termId, controller.signal)
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

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      if (abortRef.current) abortRef.current.abort()
      setDialogOpen(false)
      setSelectedResult(null)
      setScoreSummary(null)
      setLoadError(null)
    }
  }

  async function handleApprove() {
    if (!selectedResult) return
    try {
      await onApprove(selectedResult.id, adminComment)
      toast.success("Result approved")
      handleDialogOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to approve result")
    }
  }

  async function handleReject() {
    if (!selectedResult) return
    try {
      await onReject(selectedResult.id)
      toast.success("Result rejected - returned to draft")
      handleDialogOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error("Failed to reject result")
    }
  }

  const pendingColumns: ColumnDef<ResultRow>[] = [
    { header: "Student", cell: ({ row }) => `${row.original.student.firstName} ${row.original.student.lastName}` },
    { accessorKey: "class.name", header: "Class" },
    { header: "Teacher Comment", cell: ({ row }) => row.original.classTeacherComment ?? "—" },
    { header: "Status", cell: () => <Badge variant="warning">Submitted</Badge> },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" size="xs" onClick={() => handleSelectResult(row.original)}>
          <Eye className="size-3 mr-1" /> View
        </Button>
      ),
    },
  ]

  const approvedColumns: ColumnDef<ResultRow>[] = [
    { header: "Student", cell: ({ row }) => `${row.original.student.firstName} ${row.original.student.lastName}` },
    { accessorKey: "class.name", header: "Class" },
    { header: "Status", cell: () => <Badge variant="success">Approved</Badge> },
  ]

  return (
    <>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingResults.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedResults.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DataTable columns={pendingColumns} data={pendingResults} searchKey="student.firstName" searchPlaceholder="Search student..." />
        </TabsContent>
        <TabsContent value="approved">
          <DataTable columns={approvedColumns} data={approvedResults} searchKey="student.firstName" searchPlaceholder="Search student..." />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogPopup>
          {selectedResult && (
            <>
              <DialogHeader>
                <DialogTitle>Review Result</DialogTitle>
                <DialogDescription>
                  {selectedResult.student.firstName} {selectedResult.student.lastName} - {selectedResult.class.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {loadingScores ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : loadError ? (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                    {loadError}
                  </div>
                ) : scoreSummary ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Student Performance</h4>
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
                  </div>
                ) : null}
                <div>
                  <Label>Teacher Comment</Label>
                  <p className="text-sm text-muted-foreground">{selectedResult.classTeacherComment ?? "No comment"}</p>
                </div>
                <div>
                  <Label>Admin Comment</Label>
                  <Input value={adminComment} onChange={(e) => setAdminComment(e.target.value)} placeholder="Add approval comment..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleReject}>Reject</Button>
                <Button onClick={handleApprove}>Approve</Button>
              </DialogFooter>
            </>
          )}
        </DialogPopup>
      </Dialog>
    </>
  )
}
