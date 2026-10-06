"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

type Column = { key: string; label: string }

type ExportCsvProps = {
  data: Record<string, unknown>[]
  columns: Column[]
  filename: string
}

export function ExportCsv({ data, columns, filename }: ExportCsvProps) {
  function handleExport() {
    const header = columns.map((c) => `"${c.label}"`).join(",")
    const rows = data.map((row) =>
      columns.map((c) => {
        const val = row[c.key]
        if (val === null || val === undefined) return ""
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="size-3 mr-1" /> Export CSV
    </Button>
  )
}
