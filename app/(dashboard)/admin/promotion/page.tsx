import { PageHeader } from "@/components/shared/page-header"
import { PromotionManager } from "@/features/admin/components/promotion-manager"
import { getSessions } from "@/server/admin/queries"
import { getPromotionData, getClassStudents, promoteStudents } from "@/server/admin/promotion"

export default async function PromotionPage() {
  const sessions = await getSessions()

  const latestSession = sessions.filter(s => !s.isActive).pop()
  const activeSession = sessions.find(s => s.isActive)

  const promoData = activeSession && latestSession
    ? await getPromotionData(activeSession.id, latestSession.id)
    : null
  const progressions = promoData?.progressions ?? []
  const targetClasses = promoData?.targetClasses ?? []

  async function handleGetStudents(classId: number, sessionId: number) {
    "use server"
    return getClassStudents(classId, sessionId)
  }

  async function handlePromote(studentIds: number[], toClassId: number, toSessionId: number) {
    "use server"
    return promoteStudents(studentIds, toClassId, toSessionId)
  }

  return (
    <div>
      <PageHeader title="Promotion" description="Promote students to the next class for a new session" />
      <PromotionManager
        sessions={sessions}
        progressions={progressions}
        targetClasses={targetClasses}
        onGetStudents={handleGetStudents}
        onPromote={handlePromote}
      />
    </div>
  )
}
