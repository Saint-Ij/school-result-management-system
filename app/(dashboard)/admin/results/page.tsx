import { auth } from "@/auth"
import { db } from "@/lib/db"
import { reportCard } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { PageHeader } from "@/components/shared/page-header"
import { ResultsApproval } from "@/features/admin/components/results-approval"
import { getPendingResults } from "@/server/admin/result"
import { approveResult, rejectResult } from "@/server/admin/result"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function AdminResultsPage() {
  const session = await auth()
  const adminId = Number(session?.user?.id)

  const pending = await getPendingResults()
  const approved = await db.query.reportCard.findMany({
    where: eq(reportCard.status, "approved"),
    with: { student: true, class: true, term: true },
  })

  const csvData = approved.map((r) => ({
    student: `${r.student?.lastName ?? ""} ${r.student?.firstName ?? ""}`,
    admissionNo: r.student?.admissionNo ?? "",
    class: r.class?.name ?? "",
    term: r.term?.name ?? "",
    status: r.status,
    approvedAt: r.approvedAt ? new Date(r.approvedAt).toLocaleDateString() : "",
  }))

  async function handleApprove(reportCardId: number, comment: string) {
    "use server"
    await approveResult(reportCardId, adminId, comment)
  }

  async function handleReject(reportCardId: number) {
    "use server"
    await rejectResult(reportCardId)
  }

  return (
    <div>
      <PageHeader title="Results" description="Approve or reject submitted results">
        <ExportCsv
          data={csvData}
          columns={[
            { key: "student", label: "Student" },
            { key: "admissionNo", label: "Admission No" },
            { key: "class", label: "Class" },
            { key: "term", label: "Term" },
            { key: "status", label: "Status" },
            { key: "approvedAt", label: "Approved Date" },
          ]}
          filename="approved-results"
        />
      </PageHeader>
      <ResultsApproval
        pendingResults={pending}
        approvedResults={approved}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
