import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { studentClass } from "@/lib/db/schema"
import { getClassById, getSubjectsForClass } from "@/server/admin/queries"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExportCsv } from "@/components/shared/export-csv"

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const schoolClass = await getClassById(Number(id))
  if (!schoolClass) notFound()

  const enrollments = await db.query.studentClass.findMany({
    where: eq(studentClass.classId, Number(id)),
    with: {
      student: true,
    },
  })

  const students = enrollments.toSorted((a, b) =>
    a.student.lastName.localeCompare(b.student.lastName)
  )

  const subjects = await getSubjectsForClass(Number(id))

  const csvData = students.map((e, i) => ({
    sn: i + 1,
    lastName: e.student.lastName,
    firstName: e.student.firstName,
    admissionNo: e.student.admissionNo,
  }))

  return (
    <div>
      <PageHeader
        title={schoolClass.name}
        description={schoolClass.classTeacher ? `Class Teacher: ${schoolClass.classTeacher.name}` : "No class teacher assigned"}
      >
        <ExportCsv
          data={csvData}
          columns={[
            { key: "sn", label: "S/N" },
            { key: "lastName", label: "Last Name" },
            { key: "firstName", label: "First Name" },
            { key: "admissionNo", label: "Admission No" },
          ]}
          filename={`${schoolClass.name.replace(/\s/g, "-")}-students`}
        />
        <Link href="/admin/classes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4" />
            Back to Classes
          </Button>
        </Link>
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Class Name</span>
              <p className="text-sm">{schoolClass.name}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Class Teacher</span>
              <p className="text-sm">
                {schoolClass.classTeacher ? schoolClass.classTeacher.name : "No class teacher assigned"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students ({students.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S/N</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Admission No</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((enrollment, index) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {enrollment.student.lastName}, {enrollment.student.firstName}
                        {enrollment.student.middleName ? ` ${enrollment.student.middleName}` : ""}
                      </TableCell>
                      <TableCell>{enrollment.student.admissionNo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No students enrolled</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assigned Subjects ({subjects.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((cs) => (
                    <TableRow key={cs.id}>
                      <TableCell className="font-medium">{cs.subject.name}</TableCell>
                      <TableCell>{cs.teacher ? cs.teacher.name : "No teacher assigned"}</TableCell>
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
