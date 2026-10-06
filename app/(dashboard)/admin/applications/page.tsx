import { PageHeader } from "@/components/shared/page-header"
import { ApplicationsManagement } from "@/features/admin/components/applications-management"
import {
  getApplicationsByStatus,
  acceptApplication,
  rejectApplication,
} from "@/server/admin/applications"

export default async function AdminApplicationsPage() {
  const pending = await getApplicationsByStatus("pending")
  const accepted = await getApplicationsByStatus("accepted")
  const rejected = await getApplicationsByStatus("rejected")

  async function handleAccept(applicationId: string, reviewNotes: string) {
    "use server"
    await acceptApplication(applicationId, reviewNotes)
  }

  async function handleReject(applicationId: string, reviewNotes: string) {
    "use server"
    await rejectApplication(applicationId, reviewNotes)
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Review and manage admission applications"
      />
      <ApplicationsManagement
        pending={pending}
        accepted={accepted}
        rejected={rejected}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  )
}
