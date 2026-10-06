import { NextResponse } from "next/server"
import { getFullBackup } from "@/server/admin/backup"

export async function GET() {
  try {
    const backup = await getFullBackup()
    return NextResponse.json(backup)
  } catch (error) {
    return NextResponse.json({ error: "Backup failed" }, { status: 500 })
  }
}
