"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

type ApplicationRow = {
  id: string
  firstName: string
  lastName: string
  middleName: string | null
  gender: string
  dateOfBirth: string
  nationality: string
  stateOfOrigin: string
  localGovernmentArea: string
  parentFullName: string
  relationship: string
  occupation: string
  email: string
  phoneNumber: string
  alternativePhoneNumber: string | null
  residentialAddress: string
  classApplyingFor: string
  programType: string
  previousSchoolAttended: string | null
  lastClassCompleted: string | null
  reasonForTransfer: string | null
  bloodGroup: string | null
  genotype: string | null
  medicalConditions: string | null
  disabilities: string | null
  passportPhotographUrl: string
  birthCertificateUrl: string
  reportCardUrl: string | null
  medicalCertificateUrl: string | null
  status: string
  reviewNotes: string | null
  createdAt: Date
  updatedAt: Date
}

type ApplicationsManagementProps = {
  pending: ApplicationRow[]
  accepted: ApplicationRow[]
  rejected: ApplicationRow[]
  onAccept: (applicationId: string, reviewNotes: string) => Promise<void>
  onReject: (applicationId: string, reviewNotes: string) => Promise<void>
}

export function ApplicationsManagement({
  pending,
  accepted,
  rejected,
  onAccept,
  onReject,
}: ApplicationsManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<ApplicationRow | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSelect(row: ApplicationRow) {
    setSelectedApp(row)
    setReviewNotes("")
    setDialogOpen(true)
  }

  function handleDialogOpenChange(open: boolean) {
    if (!open) {
      setDialogOpen(false)
      setSelectedApp(null)
      setReviewNotes("")
    }
  }

  async function handleAccept() {
    if (!selectedApp) return
    setLoading(true)
    try {
      await onAccept(selectedApp.id, reviewNotes)
      toast.success("Application accepted")
      handleDialogOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Failed to accept application")
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!selectedApp) return
    setLoading(true)
    try {
      await onReject(selectedApp.id, reviewNotes)
      toast.success("Application rejected")
      handleDialogOpenChange(false)
      router.refresh()
    } catch {
      toast.error("Failed to reject application")
    } finally {
      setLoading(false)
    }
  }

  const pendingColumns: ColumnDef<ApplicationRow>[] = [
    {
      header: "Name",
      cell: ({ row }) =>
        `${row.original.lastName} ${row.original.firstName}${
          row.original.middleName ? " " + row.original.middleName : ""
        }`,
    },
    { accessorKey: "classApplyingFor", header: "Class" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phoneNumber", header: "Phone" },
    {
      header: "Submitted",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" size="xs" onClick={() => handleSelect(row.original)}>
          <Eye className="size-3 mr-1" /> Review
        </Button>
      ),
    },
  ]

  const statusColumns: ColumnDef<ApplicationRow>[] = [
    {
      header: "Name",
      cell: ({ row }) =>
        `${row.original.lastName} ${row.original.firstName}${
          row.original.middleName ? " " + row.original.middleName : ""
        }`,
    },
    { accessorKey: "classApplyingFor", header: "Class" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "reviewNotes", header: "Notes" },
    {
      header: "Date",
      cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
    },
  ]

  return (
    <>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <DataTable
            columns={pendingColumns}
            data={pending}
            searchKey="firstName"
            searchPlaceholder="Search applicant..."
          />
        </TabsContent>
        <TabsContent value="accepted">
          <DataTable
            columns={statusColumns}
            data={accepted}
            searchKey="firstName"
            searchPlaceholder="Search applicant..."
          />
        </TabsContent>
        <TabsContent value="rejected">
          <DataTable
            columns={statusColumns}
            data={rejected}
            searchKey="firstName"
            searchPlaceholder="Search applicant..."
          />
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogPopup>
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Review Application</DialogTitle>
                <DialogDescription>
                  {selectedApp.lastName} {selectedApp.firstName}
                  {selectedApp.middleName ? " " + selectedApp.middleName : ""} —{" "}
                  {selectedApp.classApplyingFor}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs">Gender</span>
                    <span className="capitalize">{selectedApp.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Date of Birth</span>
                    <span>{new Date(selectedApp.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Nationality</span>
                    <span>{selectedApp.nationality}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">State of Origin</span>
                    <span>{selectedApp.stateOfOrigin}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">LGA</span>
                    <span>{selectedApp.localGovernmentArea}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-xs">Program Type</span>
                    <span>{selectedApp.programType}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs">Residential Address</span>
                  <span className="text-sm">{selectedApp.residentialAddress}</span>
                </div>

                <div>
                  <span className="text-xs font-semibold">Parent/Guardian</span>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-1">
                    <div>
                      <span className="text-muted-foreground block text-xs">Full Name</span>
                      <span>{selectedApp.parentFullName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Relationship</span>
                      <span className="capitalize">{selectedApp.relationship}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Occupation</span>
                      <span>{selectedApp.occupation}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Email</span>
                      <span>{selectedApp.email}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs">Phone</span>
                      <span>{selectedApp.phoneNumber}</span>
                    </div>
                    {selectedApp.alternativePhoneNumber && (
                      <div>
                        <span className="text-muted-foreground block text-xs">Alt. Phone</span>
                        <span>{selectedApp.alternativePhoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApp.previousSchoolAttended && (
                  <div>
                    <span className="text-xs font-semibold">Previous School</span>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-1">
                      <div>
                        <span className="text-muted-foreground block text-xs">School</span>
                        <span>{selectedApp.previousSchoolAttended}</span>
                      </div>
                      {selectedApp.lastClassCompleted && (
                        <div>
                          <span className="text-muted-foreground block text-xs">Last Class</span>
                          <span>{selectedApp.lastClassCompleted}</span>
                        </div>
                      )}
                      {selectedApp.reasonForTransfer && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground block text-xs">Reason for Transfer</span>
                          <span>{selectedApp.reasonForTransfer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(selectedApp.bloodGroup || selectedApp.genotype || selectedApp.medicalConditions || selectedApp.disabilities) && (
                  <div>
                    <span className="text-xs font-semibold">Medical Info</span>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-1">
                      {selectedApp.bloodGroup && (
                        <div>
                          <span className="text-muted-foreground block text-xs">Blood Group</span>
                          <span>{selectedApp.bloodGroup}</span>
                        </div>
                      )}
                      {selectedApp.genotype && (
                        <div>
                          <span className="text-muted-foreground block text-xs">Genotype</span>
                          <span>{selectedApp.genotype}</span>
                        </div>
                      )}
                      {selectedApp.medicalConditions && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground block text-xs">Medical Conditions</span>
                          <span>{selectedApp.medicalConditions}</span>
                        </div>
                      )}
                      {selectedApp.disabilities && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground block text-xs">Disabilities</span>
                          <span>{selectedApp.disabilities}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold">Uploaded Documents</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <a
                      href={selectedApp.passportPhotographUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Passport Photo
                    </a>
                    <a
                      href={selectedApp.birthCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Birth Certificate
                    </a>
                    {selectedApp.reportCardUrl && (
                      <a
                        href={selectedApp.reportCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        Report Card
                      </a>
                    )}
                    {selectedApp.medicalCertificateUrl && (
                      <a
                        href={selectedApp.medicalCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        Medical Certificate
                      </a>
                    )}
                  </div>
                </div>

                {selectedApp.reviewNotes && (
                  <div>
                    <span className="text-muted-foreground block text-xs">Previous Review Notes</span>
                    <span className="text-sm">{selectedApp.reviewNotes}</span>
                  </div>
                )}

                <div>
                  <Label>Review Notes</Label>
                  <Input
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes for this decision..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={loading}
                >
                  {loading && <Loader2 className="size-3 mr-1 animate-spin" />}
                  Reject
                </Button>
                <Button
                  variant="default"
                  onClick={handleAccept}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading && <Loader2 className="size-3 mr-1 animate-spin" />}
                  Accept
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogPopup>
      </Dialog>
    </>
  )
}
