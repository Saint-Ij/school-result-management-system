"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import { getGrade, getRemark } from "@/lib/grades"
import { SchoolHeader } from "./school-header"
import { GradingSystem } from "./grading-system"

import { PerformanceChart } from "./performance-chart"
import type { ReportCardProps } from "./types"

export function ReportCard({
  report,
  subjects,
  totalScore,
  totalMax,
  position,
  totalStudents,
  classTeacherName,
  attendancePresent,
  attendanceTotal,
}: ReportCardProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const average = subjects.length > 0 ? totalScore / subjects.length : 0
  const averagePct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0
  const overallGrade = getGrade(totalScore, totalMax)
  const attendancePct = attendanceTotal > 0 ? Math.round((attendancePresent / attendanceTotal) * 100) : 0

  function handlePrint() {
    window.print()
  }

  function handleExport() {
    const content = printRef.current
    if (!content) return
    const clone = content.cloneNode(true) as HTMLElement
    clone.querySelectorAll(".no-print").forEach((el) => el.remove())
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Report Card - ${report.student?.firstName ?? "Student"}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: 'Times New Roman', Times, serif; font-size: 12px; line-height: 1.4; color: #000; background: #fff; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #000; padding: 4px 6px; text-align: left; }
    th { background: #f3f4f6; font-weight: 700; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .text-xs { font-size: 10px; }
    .text-sm { font-size: 11px; }
    .text-lg { font-size: 16px; }
    h1 { font-size: 18px; margin: 0; }
    .mb-2 { margin-bottom: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }
    .mt-6 { margin-top: 24px; }
    .w-full { width: 100%; }
    .border { border: 1px solid #222; }
    .border-b { border-bottom: 1px solid #222; }
    .border-t { border-top: 1px solid #222; }
    .border-r { border-right: 1px solid #222; }
    .border-l { border-left: 1px solid #222; }
    .p-1 { padding: 4px; }
    .p-2 { padding: 8px; }
    .p-4 { padding: 16px; }
    .px-2 { padding-left: 8px; padding-right: 8px; }
    .px-3 { padding-left: 12px; padding-right: 12px; }
    .py-1 { padding-top: 4px; padding-bottom: 4px; }
    .py-2 { padding-top: 8px; padding-bottom: 8px; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: 1fr 1fr; }
    .grid-cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .gap-2 { gap: 8px; }
    .gap-4 { gap: 16px; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .uppercase { text-transform: uppercase; }
    .tracking-wider { letter-spacing: 0.05em; }
  </style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`,
      ],
      { type: "text/html" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-card-${report.student?.firstName ?? "student"}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="flex items-center justify-between no-print mb-4">
        <h1 className="text-2xl font-semibold">Report Card</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="size-3 mr-1" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="size-3 mr-1" /> Export
          </Button>
        </div>
      </div>

      <div ref={printRef} className="report-card print-sheet">
        <SchoolHeader term={report.term?.name ?? ""} session={report.term?.session?.name ?? ""} />

        {/* Student Information */}
        <table className="w-full border border-black mb-4">
          <tbody>
            <tr>
              <td className="border border-black px-3 py-1.5 w-1/4 font-semibold text-xs text-black">Name:</td>
              <td className="border border-black px-3 py-1.5 w-1/4 text-xs text-black">
                {report.student?.lastName} {report.student?.firstName}
              </td>
              <td className="border border-black px-3 py-1.5 w-1/4 font-semibold text-xs text-black">Class:</td>
              <td className="border border-black px-3 py-1.5 w-1/4 text-xs text-black">{report.class?.name}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-semibold text-xs text-black">Admission No:</td>
              <td className="border border-black px-3 py-1.5 text-xs text-black">{report.student?.admissionNo}</td>
              <td className="border border-black px-3 py-1.5 font-semibold text-xs text-black">Term:</td>
              <td className="border border-black px-3 py-1.5 text-xs text-black">{report.term?.name}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-semibold text-xs text-black">Session:</td>
              <td className="border border-black px-3 py-1.5 text-xs text-black">{report.term?.session?.name}</td>
              <td className="border border-black px-3 py-1.5 font-semibold text-xs text-black">Next Term Begins:</td>
              <td className="border border-black px-3 py-1.5 text-xs text-black">{report.term?.nextTermBegins ?? "—"}</td>
            </tr>
            <tr>
              <td className="border border-black px-3 py-1.5 font-semibold text-xs text-black">Class Teacher:</td>
              <td className="border border-black px-3 py-1.5 text-xs text-black" colSpan={3}>{classTeacherName || "—"}</td>
            </tr>
          </tbody>
        </table>

        {/* Subject Scores Table */}
        <table className="w-full border border-black mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-2 py-1.5 text-left text-[10px] font-semibold text-black">Subject</th>
              {subjects[0]?.components.map((c, i) => (
                <th key={i} className="border border-black px-2 py-1.5 text-center text-[10px] font-semibold text-black">
                  {c.column}
                  <br />
                  <span className="text-[9px] font-normal">({c.maxScore})</span>
                </th>
              ))}
              <th className="border border-black px-2 py-1.5 text-center text-[10px] font-semibold text-black">
                Total
                <br />
                <span className="text-[9px] font-normal">(100)</span>
              </th>
              <th className="border border-black px-2 py-1.5 text-center text-[10px] font-semibold text-black">Grade</th>
              <th className="border border-black px-2 py-1.5 text-center text-[10px] font-semibold text-black">Remark</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj) => {
              const scaledTotal = subj.maxTotal > 0 ? Math.round((subj.total / subj.maxTotal) * 100) : 0
              return (
                <tr key={subj.subjectId} className="border-t border-black">
                  <td className="border border-black px-2 py-1 text-[10px] font-medium text-black">{subj.subject}</td>
                  {subj.components.map((c, i) => (
                    <td key={i} className="border border-black px-2 py-1 text-center text-[10px] text-black">
                      {c.score}
                    </td>
                  ))}
                  <td className="border border-black px-2 py-1 text-center text-[10px] font-medium text-black">{scaledTotal}</td>
                  <td className="border border-black px-2 py-1 text-center text-[10px] font-medium text-black">
                    {getGrade(subj.total, subj.maxTotal)}
                  </td>
                  <td className="border border-black px-2 py-1 text-center text-[10px] text-black">
                    {getRemark(subj.total, subj.maxTotal)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Key / Grading */}
        <div className="mb-4">
          <GradingSystem />
        </div>

        {/* Performance Chart */}
        <div className="mb-4">
          <PerformanceChart subjects={subjects} />
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="border border-black rounded-sm p-3">
            <p className="text-[10px] text-gray-500">Total Score</p>
            <p className="text-lg font-bold text-black">{totalScore}/{totalMax}</p>
            <p className="text-[10px] text-gray-500">Percentage: {averagePct}%</p>
          </div>
          <div className="border border-black rounded-sm p-3">
            <p className="text-[10px] text-gray-500">Average</p>
            <p className="text-lg font-bold text-black">{average.toFixed(1)}</p>
            <p className="text-[10px] text-gray-500">Overall Grade: {overallGrade}</p>
          </div>
          <div className="border border-black rounded-sm p-3">
            <p className="text-[10px] text-gray-500">Position</p>
            <p className="text-lg font-bold text-black">
              {position}
              <span className="text-sm text-gray-500"> / {totalStudents}</span>
            </p>
            <p className="text-[10px] text-gray-500">
              Attendance: {attendancePresent}/{attendanceTotal} ({attendancePct}%)
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border border-black rounded-sm p-3 mb-4">
          <p className="font-semibold text-xs mb-1 text-black">Class Teacher&apos;s Comment</p>
          <div className="border border-black rounded-sm p-2 min-h-[48px] text-xs text-gray-500">
            {report.classTeacherComment || (
              <span className="italic">No comment</span>
            )}
          </div>
        </div>

        <div className="border border-black rounded-sm p-3 mb-4">
          <p className="font-semibold text-xs mb-1 text-black">Head Teacher&apos;s Comment</p>
          <div className="border border-black rounded-sm p-2 min-h-[48px] text-xs text-gray-500">
            {report.adminComment || (
              <span className="italic">No comment</span>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; margin: 0; padding: 0; }
          @page { size: A4; margin: 15mm; }
        }
        .print-sheet {
          font-family: 'Times New Roman', Times, serif;
        }
      `}</style>
    </>
  )
}
