import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { term } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getStudentScoreSummary } from "@/server/teacher/queries"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = Number(searchParams.get("studentId"))
    const classId = Number(searchParams.get("classId"))
    const termId = Number(searchParams.get("termId"))

    if (!studentId || !classId || !termId) {
      return NextResponse.json({ error: "Missing required params" }, { status: 400 })
    }

    const termRecord = await db.query.term.findFirst({
      where: eq(term.id, termId),
    })

    if (!termRecord) {
      return NextResponse.json({ error: "Term not found" }, { status: 404 })
    }

    const summary = await getStudentScoreSummary(studentId, classId, termId, termRecord.sessionId)
    return NextResponse.json(summary)
  } catch (error) {
    console.error("Failed to fetch student scores:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
