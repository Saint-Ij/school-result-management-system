import { PageHeader } from "@/components/shared/page-header"
import { ScoreSetupManager } from "@/features/admin/components/score-setup-manager"
import { getClassSubjects, getScoreSetup } from "@/server/admin/queries"
import { createScoreSheet, deleteScoreColumn, updateScoreColumn } from "@/server/admin/relations"

export default async function ScoreSetupPage() {
  const classSubjects = await getClassSubjects()

  async function handleAddColumn(csId: number, columns: { columnName: string; maxScore: number }[]) {
    "use server"
    await createScoreSheet(csId, columns)
  }

  async function handleDeleteColumn(id: number) {
    "use server"
    await deleteScoreColumn(id)
  }

  async function handleUpdateColumn(id: number, data: { columnName: string; maxScore: number }) {
    "use server"
    await updateScoreColumn(id, data)
  }

  async function handleGetScoreSetup(csId: number) {
    "use server"
    return getScoreSetup(csId)
  }

  return (
    <div>
      <PageHeader title="Score Setup" description="Configure score columns for each subject per class" />
      <ScoreSetupManager classSubjects={classSubjects} onAddColumn={handleAddColumn} onDeleteColumn={handleDeleteColumn} onUpdateColumn={handleUpdateColumn} getScoreSetup={handleGetScoreSetup} />
    </div>
  )
}
