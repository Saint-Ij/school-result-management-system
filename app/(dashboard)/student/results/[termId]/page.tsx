import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { getStudentReportCard } from "@/server/student/results"
import { getPublishedResult } from "@/server/student/queries"
import { ReportCard } from "@/features/student/components/report-card"

export default async function ReportCardPage({
  params,
}: {
  params: Promise<{ termId: string }>
}) {
  const session = await auth()
  const userId = Number(session?.user?.id)
  const { termId } = await params

  const [reportData, resultInfo] = await Promise.all([
    getStudentReportCard(userId, Number(termId)).catch((err) => {
      console.error("Failed to fetch report card:", err)
      return null
    }),
    getPublishedResult(userId, Number(termId)),
  ])

  if (!reportData || !reportData.report || !resultInfo) {
    notFound()
  }

  return (
    <ReportCard
      report={reportData.report}
      subjects={reportData.subjects}
      totalScore={reportData.totalScore}
      totalMax={reportData.totalMax}
      position={reportData.position}
      totalStudents={reportData.totalStudents}
      classTeacherName={reportData.classTeacherName}
      attendancePresent={reportData.attendancePresent}
      attendanceTotal={reportData.attendanceTotal}
    />
  )
}
