import { PageHeader } from "@/components/shared/page-header"
import { TermsManager } from "@/features/admin/components/terms-manager"
import { getSessions } from "@/server/admin/queries"
import { createTerm } from "@/server/admin/creation"
import { deleteTerm, updateTerm } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function TermsPage() {
  const sessions = await getSessions()

  const csvData = sessions.flatMap((s) =>
    (s.terms ?? []).map((t: { id: number; name: string; nextTermBegins: string | null }) => ({
      session: s.name,
      term: t.name,
      nextTermBegins: t.nextTermBegins ?? "",
    }))
  )

  async function handleCreateTerm(data: { name: string; sessionId: number; nextTermBegins?: string | null }) {
    "use server"
    await createTerm(data)
  }

  async function handleDeleteTerm(id: number) {
    "use server"
    await deleteTerm(id)
  }

  async function handleUpdateTerm(id: number, data: { name?: string; nextTermBegins?: string | null }) {
    "use server"
    await updateTerm(id, data)
  }

  return (
    <div>
      <PageHeader title="Terms" description="Manage terms within academic sessions">
        <ExportCsv
          data={csvData}
          columns={[
            { key: "session", label: "Session" },
            { key: "term", label: "Term" },
            { key: "nextTermBegins", label: "Next Term Begins" },
          ]}
          filename="terms"
        />
      </PageHeader>
      <TermsManager sessions={sessions} onCreateTerm={handleCreateTerm} onDeleteTerm={handleDeleteTerm} onUpdateTerm={handleUpdateTerm} />
    </div>
  )
}
