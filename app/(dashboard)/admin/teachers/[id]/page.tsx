import { notFound } from "next/navigation"
import { getTeacherById } from "@/server/admin/queries"
import { getAssignedClasses, getAssignedSubjects } from "@/server/teacher/queries"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Pencil } from "lucide-react"

export default async function TeacherViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const teacher = await getTeacherById(Number(id))
  if (!teacher) notFound()

  const assignedClasses = await getAssignedClasses(Number(id))
  const assignedSubjects = await getAssignedSubjects(Number(id))

  return (
    <div>
      <PageHeader title={teacher.name} description={`Staff ID: ${teacher.staffId}`}>
        <Link href={`/admin/teachers/${id}/edit`}>
          <Button size="sm">
            <Pencil className="size-4" />
            Edit
          </Button>
        </Link>
      </PageHeader>

      <div className="space-y-6">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Teacher Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Name</span>
              <p className="text-sm">{teacher.name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Staff ID</span>
              <p className="text-sm">{teacher.staffId}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Teacher Of</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedClasses.length > 0 ? (
              <ul className="list-inside list-disc space-y-1 text-sm">
                {assignedClasses.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not assigned as class teacher</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects Taught</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedSubjects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedSubjects.map((cs) => (
                    <TableRow key={cs.id}>
                      <TableCell>{cs.class?.name}</TableCell>
                      <TableCell>{cs.subject?.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No subjects assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
