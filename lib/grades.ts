export type GradeEntry = {
  range: string
  grade: string
  remark: string
  min: number
  max: number
}

export const GRADE_TABLE: GradeEntry[] = [
  { range: "90 - 100", grade: "A+", remark: "Outstanding", min: 90, max: 100 },
  { range: "80 - 89", grade: "A", remark: "Excellent", min: 80, max: 89 },
  { range: "70 - 79", grade: "B+", remark: "Very Good", min: 70, max: 79 },
  { range: "60 - 69", grade: "B", remark: "Good", min: 60, max: 69 },
  { range: "55 - 59", grade: "C+", remark: "Credit", min: 55, max: 59 },
  { range: "50 - 54", grade: "C", remark: "Pass", min: 50, max: 54 },
  { range: "35 - 49", grade: "P", remark: "Fair", min: 35, max: 49 },
  { range: "0 - 34", grade: "NI", remark: "Needs Improv.", min: 0, max: 34 },
]

export function getGrade(total: number, maxTotal: number): string {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0
  for (const entry of GRADE_TABLE) {
    if (pct >= entry.min && pct <= entry.max) return entry.grade
  }
  return "NI"
}

export function getRemark(total: number, maxTotal: number): string {
  const pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0
  for (const entry of GRADE_TABLE) {
    if (pct >= entry.min && pct <= entry.max) return entry.remark
  }
  return "Needs Improv."
}
