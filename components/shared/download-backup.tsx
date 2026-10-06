"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function DownloadBackup() {
  async function handleBackup() {
    try {
      const res = await fetch("/api/backup")
      if (!res.ok) throw new Error("Backup failed")
      const backup = await res.json()
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `gsai-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Backup failed:", err)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleBackup}>
      <Download className="size-3 mr-1" /> Download Backup
    </Button>
  )
}
