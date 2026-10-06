"use client"

import { useState, useCallback } from "react"
import { Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { toast } from "sonner"
import type { ScoreSheetData } from "@/server/teacher/queries"

type ScoreSheetProps = {
  classes: { id: number; name: string }[]
  terms: { id: number; name: string }[]
  onLoad: (
    classId: number,
    termId: number
  ) => Promise<ScoreSheetData | null>
  onPositions: (
    classId: number,
    termId: number
  ) => Promise<Record<number, number>>
}

export function ScoreSheet({
  classes,
  terms,
  onLoad,
  onPositions,
}: ScoreSheetProps) {
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedTermId, setSelectedTermId] = useState("")
  const [data, setData] = useState<ScoreSheetData | null>(null)
  const [positions, setPositions] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)

  const classId = Number(selectedClassId)
  const termId = Number(selectedTermId)

  async function loadScoreSheet() {
    if (!classId || !termId) return
    setLoading(true)
    try {
      const [sheet, pos] = await Promise.all([
        onLoad(classId, termId),
        onPositions(classId, termId),
      ])
      if (sheet) setData(sheet)
      setPositions(pos)
    } catch (err) {
      console.error(err); toast.error("Failed to load score sheet")
    } finally {
      setLoading(false)
    }
  }

  const subjectCount = data?.subjects.length ?? 0

  function getStudentTotal(studentId: number): number {
    if (!data) return 0
    return data.subjects.reduce((sum, sub) => {
      return sum + (data.students.find((s) => s.studentId === studentId)?.scores?.[sub.id] ?? 0)
    }, 0)
  }

  function getStudentAverage(studentId: number): number {
    if (!data || subjectCount === 0) return 0
    const total = getStudentTotal(studentId)
    return Math.round((total / subjectCount) * 100) / 100
  }

  const handleExportCSV = useCallback(() => {
    if (!data) return

    const headers = [
      "Student",
      ...data.subjects.map((s) => s.subjectName),
      "Grand Total",
      "Average",
      "Position",
    ]

    const rows = data.students.map((student) => {
      const grandTotal = getStudentTotal(student.studentId)
      const average = getStudentAverage(student.studentId)
      const position = positions[student.studentId] ?? "-"
      const name = `${student.lastName}, ${student.firstName}`
      const scores = data.subjects.map((sub) => student.scores[sub.id]?.toString() ?? "")
      return [
        name,
        ...scores,
        grandTotal.toString(),
        average.toFixed(1),
        position.toString(),
      ]
    })

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `score-sheet-${classId}-${termId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [data, positions, classId, termId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Class & Term</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <Select
              value={selectedClassId}
              onValueChange={(v) => setSelectedClassId(v ?? "")}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select class...">
                  {(value) => classes.find((c) => c.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <Select
              value={selectedTermId}
              onValueChange={(v) => setSelectedTermId(v ?? "")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select term...">
                  {(value) => terms.find((t) => t.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {terms.map((t) => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
            <Button onClick={loadScoreSheet} disabled={loading}>
              {loading ? "Loading..." : "Load Score Sheet"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && data.students.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Score Sheet</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="size-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card z-10 whitespace-nowrap">
                    Student
                  </TableHead>
                  {data.subjects.map((sub) => (
                    <TableHead
                      key={sub.id}
                      className="text-center border-l whitespace-nowrap"
                    >
                      {sub.subjectName}
                    </TableHead>
                  ))}
                  <TableHead className="text-center border-l whitespace-nowrap">
                    Grand Total
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Average
                  </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Position
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.students.map((student) => {
                  const grandTotal = getStudentTotal(student.studentId)
                  const average = getStudentAverage(student.studentId)
                  const position = positions[student.studentId] ?? "-"
                  return (
                    <TableRow key={student.studentId}>
                      <TableCell className="sticky left-0 bg-card z-10 font-medium whitespace-nowrap">
                        {student.lastName}, {student.firstName}
                      </TableCell>
                      {data.subjects.map((sub) => (
                        <TableCell
                          key={sub.id}
                          className="text-center whitespace-nowrap border-l"
                        >
                          {student.scores[sub.id]?.toString() ?? "-"}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold whitespace-nowrap border-l">
                        {grandTotal}
                      </TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        {average.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center font-semibold whitespace-nowrap">
                        {position}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {data && data.students.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No students found in this class or no scores recorded yet.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
