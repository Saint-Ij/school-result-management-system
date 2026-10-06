import { auth } from "@/auth"
import { db } from "@/lib/db"
import { session } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { AttendanceManager } from "@/features/teacher/components/attendance-manager"
import { getAssignedClasses, getClassStudents } from "@/server/teacher/queries"
import { getTermsBySession } from "@/server/admin/queries"
import { createAttendanceSession, takeAttendance, getAttendanceByDate } from "@/server/teacher/attendance"

export default async function AttendancePage() {
  const sessionData = await auth()
  const userId = Number(sessionData?.user?.id)
  const classes = await getAssignedClasses(userId)

  const activeSession = await db.query.session.findFirst({ where: eq(session.isActive, true) })
  const terms = activeSession ? await getTermsBySession(activeSession.id) : []

  async function handleGetStudents(classId: number) {
    "use server"
    if (!activeSession) return []
    return getClassStudents(classId, activeSession.id)
  }

  async function handleGetAttendanceByDate(classId: number, date: string) {
    "use server"
    const result = await getAttendanceByDate(classId, date)
    return result ?? null
  }

  async function handleCreateSession(data: { termId: number; classId: number; date: string }) {
    "use server"
    return createAttendanceSession(data)
  }

  async function handleTakeAttendance(sessionId: number, records: { studentId: number; status: "present" | "absent" | "excused" | "late" }[]) {
    "use server"
    return takeAttendance(sessionId, records)
  }

  return (
    <div>
      <PageHeader title="Attendance" description="Take and manage student attendance" />
      <AttendanceManager
        classes={classes}
        terms={terms}
        teacherId={userId}
        activeSessionId={activeSession?.id ?? null}
        onGetStudents={handleGetStudents}
        onGetAttendanceByDate={handleGetAttendanceByDate}
        onCreateSession={handleCreateSession}
        onTakeAttendance={handleTakeAttendance}
      />
    </div>
  )
}
