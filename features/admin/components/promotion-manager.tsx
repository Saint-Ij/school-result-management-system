"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { toast } from "sonner"
import { ArrowRight, Check, X, GraduationCap } from "lucide-react"

type SessionInfo = { id: number; name: string; isActive: boolean | null }
type ClassProgression = {
  currentId: number
  currentName: string
  nextName: string | null
  studentCount: number
}
type ClassInfo = { id: number; name: string }
type StudentInfo = { id: number; student: { id: number; firstName: string; lastName: string; admissionNo: string } }

type PromotionManagerProps = {
  sessions: SessionInfo[]
  progressions: ClassProgression[]
  targetClasses: ClassInfo[]
  onGetStudents: (classId: number, sessionId: number) => Promise<StudentInfo[]>
  onPromote: (studentIds: number[], toClassId: number, toSessionId: number) => Promise<{ promoted: number; skipped: number; errors: number }>
}

export function PromotionManager({
  sessions,
  progressions,
  targetClasses,
  onGetStudents,
  onPromote,
}: PromotionManagerProps) {
  const router = useRouter()
  const [fromSessionId, setFromSessionId] = useState("")
  const [toSessionId, setToSessionId] = useState("")
  const [loading, setLoading] = useState(false)
  const [promoting, setPromoting] = useState(false)
  const [expandedClass, setExpandedClass] = useState<number | null>(null)
  const [students, setStudents] = useState<StudentInfo[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [targetClassId, setTargetClassId] = useState<string>("")

  const fromSession = sessions.find(s => s.id.toString() === fromSessionId)
  const toSession = sessions.find(s => s.id.toString() === toSessionId)
  const sameSession = fromSessionId && toSessionId && fromSessionId === toSessionId

  const filteredProgressions = progressions.filter(
    (p) => p.studentCount > 0
  )

  const handleLoadStudents = useCallback(async (classId: number) => {
    if (!fromSessionId) return
    setLoading(true)
    setExpandedClass(classId)
    setSelected(new Set())
    setTargetClassId("")
    try {
      const list = await onGetStudents(classId, Number(fromSessionId))
      setStudents(list)
    } catch {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }, [fromSessionId, onGetStudents])

  function toggleAll() {
    if (selected.size === students.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(students.map(s => s.student.id)))
    }
  }

  function toggleOne(id: number) {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  async function handlePromote() {
    if (selected.size === 0 || !targetClassId || !toSessionId) return
    setPromoting(true)
    try {
      const result = await onPromote(
        Array.from(selected),
        Number(targetClassId),
        Number(toSessionId)
      )
      toast.success(
        `Promoted: ${result.promoted}, Already enrolled: ${result.skipped}`
      )
      setSelected(new Set())
      if (expandedClass) handleLoadStudents(expandedClass)
      router.refresh()
    } catch {
      toast.error("Promotion failed")
    } finally {
      setPromoting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Select Sessions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">From Session (current enrollments)</label>
              <Select value={fromSessionId} onValueChange={(v) => { setFromSessionId(v ?? ""); setExpandedClass(null); setStudents([]) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session...">
                    {(value) => sessions.find(s => s.id.toString() === value)?.name ?? value}
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} {s.isActive ? "(Active)" : ""}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">To Session (new enrollments)</label>
              <Select value={toSessionId} onValueChange={(v) => setToSessionId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select session...">
                    {(value) => sessions.find(s => s.id.toString() === value)?.name ?? value}
                  </SelectValue>
                </SelectTrigger>
                <SelectPopup>
                  {sessions.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} {s.isActive ? "(Active)" : ""}
                    </SelectItem>
                  ))}
                </SelectPopup>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {fromSession && toSession && sameSession && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          From and To sessions are the same. Select different sessions to promote.
        </div>
      )}

      {fromSession && toSession && !sameSession && (
        <Card>
          <CardHeader><CardTitle>Promotion Overview</CardTitle></CardHeader>
          <CardContent>
            {filteredProgressions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No classes with enrolled students in the selected session.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredProgressions.map((p) => (
                  <div key={p.currentId} className="border border-border rounded-md">
                    <div className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{p.currentName}</span>
                        <ArrowRight className="size-3 text-muted-foreground" />
                        {p.nextName ? (
                          <Badge variant="outline">{p.nextName}</Badge>
                        ) : (
                          <Badge variant="secondary">Manual pick</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          ({p.studentCount} student{p.studentCount !== 1 ? "s" : ""})
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadStudents(p.currentId)}
                        disabled={loading}
                      >
                        <GraduationCap className="size-3 mr-1" />
                        {expandedClass === p.currentId ? "Refresh" : "Select Students"}
                      </Button>
                    </div>

                    {expandedClass === p.currentId && (
                      <div className="border-t border-border px-3 py-2 space-y-2">
                        {loading ? (
                          <p className="text-xs text-muted-foreground py-2">Loading students...</p>
                        ) : students.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">No enrolled students found.</p>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" onClick={toggleAll} className="text-xs h-7">
                                {selected.size === students.length ? "Deselect All" : "Select All"}
                              </Button>
                              <span className="text-xs text-muted-foreground">
                                {selected.size} of {students.length} selected
                              </span>
                            </div>

                            <div className="max-h-48 overflow-y-auto border border-border rounded-sm">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-8" />
                                    <TableHead>Name</TableHead>
                                    <TableHead>Admission No</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {students.map((s) => (
                                    <TableRow key={s.id}>
                                      <TableCell>
                                        <button
                                          onClick={() => toggleOne(s.student.id)}
                                          className={`flex items-center justify-center w-5 h-5 rounded border ${
                                            selected.has(s.student.id)
                                              ? "bg-primary border-primary text-primary-foreground"
                                              : "border-muted-foreground/30"
                                          }`}
                                        >
                                          {selected.has(s.student.id) && <Check className="size-3" />}
                                        </button>
                                      </TableCell>
                                      <TableCell className="text-xs">
                                        {s.student.lastName}, {s.student.firstName}
                                      </TableCell>
                                      <TableCell className="text-xs">{s.student.admissionNo}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Promote to:</span>
                                <Select value={targetClassId} onValueChange={(v) => setTargetClassId(v ?? "")}>
                                  <SelectTrigger className="h-8 w-40">
                                    <SelectValue placeholder="Target class...">
                                      {(value) => targetClasses.find(t => t.id.toString() === value)?.name ?? value}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectPopup>
                                    {targetClasses.map((t) => (
                                      <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                                    ))}
                                  </SelectPopup>
                                </Select>
                              </div>
                              <Button
                                size="sm"
                                onClick={handlePromote}
                                disabled={selected.size === 0 || !targetClassId || promoting}
                              >
                                {promoting ? "Promoting..." : `Promote ${selected.size} Student${selected.size !== 1 ? "s" : ""}`}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {fromSession && !toSession && (
        <p className="text-sm text-muted-foreground text-center py-8">
          Select a target session to proceed.
        </p>
      )}
    </div>
  )
}
