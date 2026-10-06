import { auth } from "@/auth"
import { db } from "@/lib/db"
import { session } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { ScoreSheet } from "@/features/teacher/components/score-sheet"
import {
  getAssignedClasses,
  getScoreSheetData,
  calculateClassPositions,
} from "@/server/teacher/queries"
import { getTermsBySession } from "@/server/admin/queries"

export default async function ScoreSheetPage() {
  const sessionData = await auth()
  const userId = Number(sessionData?.user?.id)
  const classes = await getAssignedClasses(userId)
  const activeSession = await db.query.session.findFirst({
    where: eq(session.isActive, true),
  })
  const terms = activeSession ? await getTermsBySession(activeSession.id) : []

  async function handleLoad(classId: number, termId: number) {
    "use server"
    if (!activeSession) return null
    return getScoreSheetData(classId, activeSession.id, termId)
  }

  async function handlePositions(classId: number, termId: number) {
    "use server"
    if (!activeSession) return {}
    return calculateClassPositions(classId, activeSession.id, termId)
  }

  return (
    <div>
      <PageHeader
        title="Score Sheet"
        description="View consolidated scores for your class"
      />
      <ScoreSheet
        classes={classes}
        terms={terms}
        onLoad={handleLoad}
        onPositions={handlePositions}
      />
    </div>
  )
}
