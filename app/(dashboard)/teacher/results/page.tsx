import { auth } from "@/auth"
import { db } from "@/lib/db"
import { session } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { TeacherResultsManager } from "@/features/teacher/components/teacher-results"
import { getAssignedClasses, getClassStudents } from "@/server/teacher/queries"
import { upsertResultRecord, getClassReportCards } from "@/server/teacher/result"
import { getTermsBySession } from "@/server/admin/queries"

export default async function TeacherResultsPage() {
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

  async function handleGetResults(classId: number, termId: number) {
    "use server"
    return getClassReportCards(classId, termId)
  }

  async function handleSubmitResult(data: { studentId: number; classId: number; termId: number; comment: string }) {
    "use server"
    await upsertResultRecord(data)
  }

  return (
    <div>
      <PageHeader title="Results" description="Submit student results for approval" />
      <TeacherResultsManager
        classes={classes}
        terms={terms}
        onGetStudents={handleGetStudents}
        onGetResults={handleGetResults}
        onSubmitResult={handleSubmitResult}
      />
    </div>
  )
}
