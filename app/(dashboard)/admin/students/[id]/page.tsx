import { notFound } from "next/navigation"
import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { studentClass, term } from "@/lib/db/schema"
import { getStudentById, getSubjectsForClass } from "@/server/admin/queries"
import { getTermScores, getAttendance, getPublishedResults } from "@/server/student/queries"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function StudentViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const student = await getStudentById(Number(id))
  if (!student) notFound()

  const enrollment = await db.query.studentClass.findFirst({
    where: eq(studentClass.studentId, Number(id)),
    orderBy: [desc(studentClass.id)],
    with: {
      class: true,
      session: true,
    },
  })

  const latestTerm = await db.query.term.findFirst({
    orderBy: [desc(term.id)],
  })

  const scores = latestTerm ? await getTermScores(Number(id), latestTerm.id) : []

  const classSubjects = enrollment ? await getSubjectsForClass(enrollment.classId) : []

  const attendanceRecords = await getAttendance(Number(id))

  const approvedResults = await getPublishedResults(Number(id))

  const scoreMap = new Map<number, { subjectName: string; totalScore: number; hasScore: boolean }>()
  for (const cs of classSubjects) {
    scoreMap.set(cs.subject.id, { subjectName: cs.subject.name, totalScore: 0, hasScore: false })
  }
  for (const s of scores) {
    const subjId = s.classSubject.subject.id
    const entry = scoreMap.get(subjId)
    if (entry) {
      entry.totalScore += s.score
      entry.hasScore = true
    } else {
      scoreMap.set(subjId, { subjectName: s.classSubject.subject.name, totalScore: s.score, hasScore: true })
    }
  }

  const totalSessions = attendanceRecords.length
  const daysPresent = attendanceRecords.filter((r) => r.status === "present").length
  const attendancePct = totalSessions > 0 ? Math.round((daysPresent / totalSessions) * 100) : 0

  const scoreCsvData = Array.from(scoreMap.values()).map(({ subjectName, totalScore, hasScore }) => ({
    subject: subjectName,
    score: hasScore ? String(totalScore) : "-",
  }))

  return (
    <div>
      <PageHeader title={`${student.firstName} ${student.lastName}`} description={`Admission No: ${student.admissionNo}`}>
        <ExportCsv
          data={scoreCsvData}
          columns={[
            { key: "subject", label: "Subject" },
            { key: "score", label: `Score (${latestTerm?.name ?? ""})` },
          ]}
          filename={`${student.admissionNo}-scores`}
        />
        <Link href={`/admin/students/${id}/edit`}><Button size="sm"><Pencil className="size-4" /> Edit</Button></Link>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Full Name</span>
              <p className="text-sm">{student.firstName} {student.middleName ? `${student.middleName} ` : ""}{student.lastName}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Admission No</span>
              <p className="text-sm">{student.admissionNo}</p>
            </div>
            {student.middleName && (
              <div>
                <span className="text-xs text-muted-foreground">Middle Name</span>
                <p className="text-sm">{student.middleName}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Current Enrollment</CardTitle></CardHeader>
          <CardContent>
            {enrollment ? (
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-muted-foreground">Class</span>
                  <p className="text-sm font-medium">{enrollment.class.name}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Session</span>
                  <p className="text-sm font-medium">{enrollment.session.name}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not enrolled</p>
            )}
          </CardContent>
        </Card>

        {latestTerm && (
          <Card>
            <CardHeader><CardTitle>Scores - {latestTerm.name}</CardTitle></CardHeader>
            <CardContent>
              {scores.length > 0 || classSubjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Term</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(scoreMap.values()).map(({ subjectName, totalScore, hasScore }) => (
                      <TableRow key={subjectName}>
                        <TableCell className="font-medium">{subjectName}</TableCell>
                        <TableCell>{hasScore ? totalScore : "-"}</TableCell>
                        <TableCell>{latestTerm.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No scores available for the current term.</p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Attendance Summary</CardTitle></CardHeader>
          <CardContent>
            {totalSessions > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">Total Sessions</span>
                  <p className="text-lg font-semibold">{totalSessions}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Days Present</span>
                  <p className="text-lg font-semibold">{daysPresent}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Attendance %</span>
                  <p className="text-lg font-semibold">{attendancePct}%</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No attendance records found.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Published Results</CardTitle></CardHeader>
          <CardContent>
            {approvedResults.length > 0 ? (
              <div className="flex items-center justify-between">
                <p className="text-sm">{approvedResults.length} approved result{approvedResults.length !== 1 ? "s" : ""}</p>
                <Link href={`/admin/students/${id}/results`}>
                  <Button variant="outline" size="sm">View Results</Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No approved results yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
