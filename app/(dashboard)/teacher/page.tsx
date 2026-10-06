import { auth } from "@/auth"
import { db } from "@/lib/db"
import { teacher, attendanceSession, reportCard, studentClass } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { DashboardCard } from "@/components/shared/dashboard-card"
import { StatsGrid } from "@/components/shared/stats-grid"
import { getAssignedSubjects, getAssignedClasses } from "@/server/teacher/queries"
import Link from "next/link"
import { BookOpen, Users, Calendar, Trophy, FileSpreadsheet, ClipboardCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default async function TeacherDashboardPage() {
  const session = await auth()
  const userId = Number(session?.user?.id)
  const user = await db.query.teacher.findFirst({ where: eq(teacher.id, userId) })

  const [subjects, classes] = await Promise.all([
    getAssignedSubjects(userId),
    getAssignedClasses(userId),
  ])

  const classIds = classes.map((c) => c.id)

  const [attendanceSessions, submittedResults, studentCounts] = await Promise.all([
    classIds.length > 0
      ? db.query.attendanceSession.findMany({
          where: inArray(attendanceSession.classId, classIds),
        })
      : Promise.resolve([]),
    classIds.length > 0
      ? db.query.reportCard.findMany({
          where: inArray(reportCard.classId, classIds),
        })
      : Promise.resolve([]),
    classIds.length > 0
      ? db.query.studentClass.findMany({
          where: inArray(studentClass.classId, classIds),
        })
      : Promise.resolve([]),
  ])

  const studentsCount = studentCounts.length
  const attendanceCount = attendanceSessions.length
  const submittedResultsCount = submittedResults.filter(
    (r) => r.status === "teacher_submitted"
  ).length

  const quickLinks = [
    {
      label: "Take Attendance",
      href: "/teacher/attendance",
      icon: <Calendar className="size-5" />,
    },
    {
      label: "Enter Scores",
      href: "/teacher/scores",
      icon: <FileSpreadsheet className="size-5" />,
    },
    {
      label: "View Score Sheet",
      href: "/teacher/score-sheet",
      icon: <ClipboardCheck className="size-5" />,
    },
    {
      label: "Submit Results",
      href: "/teacher/results",
      icon: <Trophy className="size-5" />,
    },
  ]

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}`} description="Your teaching dashboard" />
      <StatsGrid>
        <DashboardCard label="Assigned Subjects" value={subjects.length} icon={<BookOpen className="size-4" />} />
        <DashboardCard label="Assigned Classes" value={classes.length} icon={<Users className="size-4" />} />
        <DashboardCard label="Attendance Sessions" value={attendanceCount} icon={<Calendar className="size-4" />} />
        <DashboardCard label="Submitted Results" value={submittedResultsCount} icon={<Trophy className="size-4" />} />
        <DashboardCard label="Students Under Care" value={studentsCount} icon={<Users className="size-4" />} />
      </StatsGrid>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center gap-4 px-6 py-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
