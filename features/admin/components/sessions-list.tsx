"use client"

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type SessionWithTerms = { id: number; name: string; isActive: boolean | null; terms: { id: number; name: string }[] }

type SessionsListProps = {
  sessions: SessionWithTerms[]
  onSetActive: (id: number) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function SessionsList({ sessions, onSetActive, onDelete }: SessionsListProps) {
  const router = useRouter()

  const handleSetActive = async (id: number) => {
    try { await onSetActive(id); toast.success("Active session updated"); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to update active session") }
  }

  const handleDelete = async (id: number) => {
    try { await onDelete(id); toast.success("Session deleted"); router.refresh() }
    catch (err) { console.error(err); toast.error("Failed to delete session") }
  }

  return (
    <Card>
      <CardHeader><CardTitle>All Sessions</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.length === 0 && <p className="text-sm text-muted-foreground">No sessions created yet.</p>}
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  {s.isActive && <Badge variant="success">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{s.terms.length} term(s)</p>
              </div>
              <div className="flex gap-1">
                {!s.isActive && <Button variant="outline" size="xs" onClick={() => handleSetActive(s.id)}>Set Active</Button>}
                <Button variant="ghost" size="xs" onClick={() => handleDelete(s.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
