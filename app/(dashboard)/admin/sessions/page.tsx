import { PageHeader } from "@/components/shared/page-header"
import { SessionsList } from "@/features/admin/components/sessions-list"
import { CreateSessionForm } from "@/features/admin/forms/create-session-form"
import { getSessions } from "@/server/admin/queries"
import { createSession } from "@/server/admin/creation"
import { setActiveSession, deleteSession } from "@/server/admin/mutations"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function SessionsPage() {
  const sessions = await getSessions()

  const csvData = sessions.map((s) => ({
    name: s.name,
    isActive: s.isActive ? "Yes" : "No",
    terms: (s.terms ?? []).map((t: { name: string }) => t.name).join("; "),
  }))

  async function handleCreate(name: string) {
    "use server"
    await createSession({ name })
  }

  async function handleSetActive(id: number) {
    "use server"
    await setActiveSession(id)
  }

  async function handleDelete(id: number) {
    "use server"
    await deleteSession(id)
  }

  return (
    <div>
      <PageHeader title="Sessions" description="Manage academic sessions">
        <ExportCsv
          data={csvData}
          columns={[
            { key: "name", label: "Session" },
            { key: "isActive", label: "Active" },
            { key: "terms", label: "Terms" },
          ]}
          filename="sessions"
        />
      </PageHeader>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CreateSessionForm onCreate={handleCreate} />
        <SessionsList sessions={sessions} onSetActive={handleSetActive} onDelete={handleDelete} />
      </div>
    </div>
  )
}
