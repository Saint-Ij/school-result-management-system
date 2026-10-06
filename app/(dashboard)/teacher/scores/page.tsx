import { auth } from "@/auth"
import { db } from "@/lib/db"
import { session, scoreSetup } from "@/lib/db/schema"
import { eq, inArray } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { ScoresManager } from "@/features/teacher/components/scores-manager"
import { getAssignedSubjects, getClassStudents, getSubjectScores, getClassSubject } from "@/server/teacher/queries"
import { recordScores } from "@/server/teacher/mutations"
import { getTermsBySession } from "@/server/admin/queries"

export default async function ScoresPage() {
  const sessionData = await auth()
  const userId = Number(sessionData?.user?.id)
  const subjects = await getAssignedSubjects(userId)
  const activeSession = await db.query.session.findFirst({ where: eq(session.isActive, true) })
  const terms = activeSession ? await getTermsBySession(activeSession.id) : []

  async function handleGetClassSubject(csId: number) {
    "use server"
    const result = await getClassSubject(csId)
    return result ?? null
  }

  async function handleGetClassStudents(classId: number) {
    "use server"
    if (!activeSession) return []
    return getClassStudents(classId, activeSession.id)
  }

  async function handleGetSubjectScores(csId: number, termId: number) {
    "use server"
    return getSubjectScores(csId, termId)
  }

  async function handleRecordScores(entries: { studentId: number; classSubjectId: number; termId: number; scoreSetupId: number; score: number }[]) {
    "use server"
    if (entries.length === 0) return []
    const setupIds = [...new Set(entries.map((e) => e.scoreSetupId))]
    const setups = await db.query.scoreSetup.findMany({
      where: inArray(scoreSetup.id, setupIds),
    })
    const maxMap = Object.fromEntries(setups.map((s) => [s.id, s.maxScore]))
    for (const entry of entries) {
      const max = maxMap[entry.scoreSetupId]
      if (!max) throw new Error(`Invalid score column`)
      if (entry.score < 0 || entry.score > max) throw new Error(`Score ${entry.score} exceeds maximum ${max}`)
    }
    return recordScores(entries)
  }

  return (
    <div>
      <PageHeader title="Scores" description="Enter and manage student scores" />
      <ScoresManager
        subjects={subjects}
        terms={terms}
        onGetClassSubject={handleGetClassSubject}
        onGetClassStudents={handleGetClassStudents}
        onGetSubjectScores={handleGetSubjectScores}
        onRecordScores={handleRecordScores}
      />
    </div>
  )
}
