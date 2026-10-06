import { auth } from "@/auth"
import { db } from "@/lib/db"
import { admin, teacher, student, schoolClass, subject, session as sessionTable, reportCard, studentClass } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { DashboardCard } from "@/components/shared/dashboard-card"
import { StatsGrid } from "@/components/shared/stats-grid"
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderKanban,
  Calendar,
  Trophy,
} from "lucide-react"
import { AdminCharts } from "@/features/admin/components/admin-charts"
import { DownloadBackup } from "@/components/shared/download-backup"

export default async function AdminDashboardPage() {
  const sessionData = await auth()
  const userId = Number(sessionData?.user?.id)
  const user = await db.query.admin.findFirst({ where: eq(admin.id, userId) })

  const [teachersCount, studentsCount, classesCount, subjectsCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(teacher).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(student).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(schoolClass).then(r => Number(r[0]?.count ?? 0)),
    db.select({ count: sql<number>`count(*)` }).from(subject).then(r => Number(r[0]?.count ?? 0)),
  ])

  const activeSession = await db.query.session.findFirst({ where: eq(sessionTable.isActive, true) })

  const pendingResults = await db.query.reportCard.findMany({
    where: eq(reportCard.status, "teacher_submitted"),
  })

  const classes = await db.query.schoolClass.findMany()
  const classDataPromises = classes.map(async (c) => {
    const count = await db.select({ count: sql<number>`count(*)` })
      .from(studentClass)
      .where(eq(studentClass.classId, c.id))
      .then(r => Number(r[0]?.count ?? 0))
    return { name: c.name, students: count }
  })
  const classData = await Promise.all(classDataPromises)

  const allResults = await db.query.reportCard.findMany()
  const approved = allResults.filter(r => r.status === "approved").length
  const pending = allResults.filter(r => r.status === "teacher_submitted").length
  const draft = allResults.filter(r => r.status === "draft").length

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.name}`}
        description="Overview of your school management system"
      >
        <DownloadBackup />
      </PageHeader>
      <StatsGrid>
        <DashboardCard label="Total Students" value={studentsCount} icon={<GraduationCap className="size-4" />} />
        <DashboardCard label="Total Teachers" value={teachersCount} icon={<Users className="size-4" />} />
        <DashboardCard label="Total Classes" value={classesCount} icon={<BookOpen className="size-4" />} />
        <DashboardCard label="Total Subjects" value={subjectsCount} icon={<FolderKanban className="size-4" />} />
        <DashboardCard
          label="Active Session"
          value={activeSession?.name ?? "None"}
          icon={<Calendar className="size-4" />}
        />
        <DashboardCard
          label="Pending Results"
          value={pendingResults.length}
          icon={<Trophy className="size-4" />}
          description="Awaiting approval"
        />
      </StatsGrid>
      <div className="mt-8">
        <AdminCharts
          classData={classData}
          resultData={[
            { name: "Approved", value: approved },
            { name: "Pending", value: pending },
            { name: "Draft", value: draft },
          ]}
        />
      </div>
    </div>
  )
}
