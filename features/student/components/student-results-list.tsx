"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Eye } from "lucide-react"

type ResultRow = {
  id: number
  class: { name: string }
  term: { id: number; name: string; session: { name: string } }
  status: string
}

export function StudentResultsList({ results }: { results: ResultRow[] }) {
  if (results.length === 0) {
    return <EmptyState title="No results available" description="Approved results will appear here." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-6">
            <div className="mb-2">
              <Badge variant="success">Approved</Badge>
            </div>
            <h3 className="text-lg font-semibold">{r.term.name}</h3>
            <p className="text-sm text-muted-foreground">{r.term.session?.name}</p>
            <p className="text-sm text-muted-foreground">{r.class.name}</p>
            <Link href={`/student/results/${r.term.id}`} className="mt-4 block">
              <Button size="sm" className="w-full">
                <Eye className="size-3 mr-1" /> View Report Card
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
