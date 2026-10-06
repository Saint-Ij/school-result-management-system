import { auth } from "@/auth"
import { db } from "@/lib/db"
import { student, studentClass } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { DashboardCard } from "@/components/shared/dashboard-card"
import { StatsGrid } from "@/components/shared/stats-grid"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPublishedResults, getAttendance, getTermScores } from "@/server/student/queries"
import { GraduationCap, Trophy, CalendarCheck, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

export default async function StudentDashboardPage() {
  const session = await auth()
  const userId = Number(session?.user?.id)
  const user = await db.query.student.findFirst({ where: eq(student.id, userId) })
  if (!user) return null

  const results = await getPublishedResults(userId)
  const attendance = await getAttendance(userId)
  const enrollment = await db.query.studentClass.findFirst({
    where: eq(studentClass.studentId, userId),
    with: { class: true, session: true },
    orderBy: (sc, { desc }) => [desc(sc.id)],
  })

  const attendancePercent = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === "present").length / attendance.length) * 100)
    : 0

  const latestResult = results.length > 0
    ? results.reduce((latest, r) => {
        const la = latest.approvedAt ? new Date(latest.approvedAt).getTime() : 0
        const ra = r.approvedAt ? new Date(r.approvedAt).getTime() : 0
        return ra > la ? r : latest
      })
    : null

  let recentScores: Awaited<ReturnType<typeof getTermScores>> = []
  if (latestResult) {
    recentScores = await getTermScores(userId, latestResult.termId)
  }

  const subjectScores = Object.values(
    recentScores.reduce<Record<number, { subject: string; total: number }>>((acc, score) => {
      const key = score.classSubjectId
      if (!acc[key]) {
        acc[key] = { subject: score.classSubject.subject.name, total: 0 }
      }
      acc[key].total += score.score
      return acc
    }, {})
  )

  const totalScore = subjectScores.reduce((sum, s) => sum + s.total, 0)
  const averageScore = subjectScores.length > 0 ? Math.round(totalScore / subjectScores.length) : 0

  const recentAttendance = attendance.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.firstName} ${user.lastName}`}
        description={`Admission No: ${user.admissionNo}`}
      />
      <StatsGrid>
        <DashboardCard label="Current Class" value={enrollment?.class?.name ?? "—"} icon={<GraduationCap className="size-4" />} />
        <DashboardCard label="Attendance" value={`${attendancePercent}%`} icon={<CalendarCheck className="size-4" />} />
        <DashboardCard label="Approved Results" value={results.length} icon={<Trophy className="size-4" />} />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectScores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectScores.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.subject}</TableCell>
                    <TableCell className="text-right font-medium">{s.total}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">{totalScore}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Average</TableCell>
                  <TableCell className="text-right font-semibold">{averageScore}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No scores recorded yet</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/student/results" className="block">
          <DashboardCard
            label="View Results"
            value="All Results"
            icon={<Trophy className="size-4" />}
          />
        </Link>
        <Link href="/student/results" className="block">
          <DashboardCard
            label="View Report Card"
            value="Latest Result"
            icon={<FileSpreadsheet className="size-4" />}
          />
        </Link>
        <Link href="/student/results" className="block">
          <DashboardCard
            label="Results Summary"
            value="Quick Overview"
            icon={<FileSpreadsheet className="size-4" />}
          />
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttendance.length > 0 ? (
            <div className="space-y-3">
              {recentAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <span className="text-sm">{record.session.date}</span>
                  <Badge
                    variant={
                      record.status === "present" ? "success" :
                      record.status === "absent" ? "destructive" :
                      record.status === "late" ? "warning" :
                      "secondary"
                    }
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No attendance records yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
