"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Trash2, Calendar } from "lucide-react"

type TermItem = { id: number; name: string; nextTermBegins: string | null }
type SessionWithTerms = { id: number; name: string; isActive: boolean | null; terms: TermItem[] }

type TermsManagerProps = {
  sessions: SessionWithTerms[]
  onCreateTerm: (data: { name: string; sessionId: number; nextTermBegins?: string | null }) => Promise<void>
  onDeleteTerm: (id: number) => Promise<void>
  onUpdateTerm: (id: number, data: { name?: string; nextTermBegins?: string | null }) => Promise<void>
}

export function TermsManager({ sessions, onCreateTerm, onDeleteTerm, onUpdateTerm }: TermsManagerProps) {
  const router = useRouter()
  const [selectedSessionId, setSelectedSessionId] = useState("")
  const [termName, setTermName] = useState("")
  const [nextTermDate, setNextTermDate] = useState("")
  const [editingTermId, setEditingTermId] = useState<number | null>(null)
  const [editDate, setEditDate] = useState("")

  const session = sessions.find(s => s.id.toString() === selectedSessionId)
  const terms = session?.terms ?? []

  async function handleCreate() {
    if (!selectedSessionId || !termName) return
    try {
      await onCreateTerm({
        name: termName,
        sessionId: Number(selectedSessionId),
        nextTermBegins: nextTermDate || null,
      })
      toast.success("Term created")
      setTermName("")
      setNextTermDate("")
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to create term") }
  }

  async function handleDelete(termId: number) {
    try {
      await onDeleteTerm(termId)
      toast.success("Term deleted")
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to delete term") }
  }

  function startEdit(term: TermItem) {
    setEditingTermId(term.id)
    setEditDate(term.nextTermBegins ?? "")
  }

  async function saveEdit(termId: number) {
    try {
      await onUpdateTerm(termId, { nextTermBegins: editDate || null })
      toast.success("Date updated")
      setEditingTermId(null)
      router.refresh()
    } catch (err) { console.error(err); toast.error("Failed to update date") }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Not set"
    const d = new Date(dateStr + "T00:00:00")
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Select Session</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedSessionId} onValueChange={(v) => setSelectedSessionId(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a session...">
                  {(value) => sessions.find(s => s.id.toString() === value)?.name ?? value}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {sessions.map((s) => (<SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>))}
              </SelectPopup>
            </Select>
            {selectedSessionId && (
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <Input placeholder="Term name (e.g. 1st Term)" value={termName} onChange={(e) => setTermName(e.target.value)} />
                  <div className="flex gap-2 items-center">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <input
                      type="date"
                      value={nextTermDate}
                      onChange={(e) => setNextTermDate(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <Button onClick={handleCreate} size="sm">Add</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {terms.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{t.name}</span>
                        {editingTermId === t.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="flex h-7 w-40 rounded-md border border-input bg-transparent px-2 py-0.5 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <Button size="sm" variant="ghost" onClick={() => saveEdit(t.id)} className="h-7 px-2 text-xs">
                              Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingTermId(null)} className="h-7 px-2 text-xs">
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Next term: {formatDate(t.nextTermBegins)}
                            <button
                              className="ml-1 text-xs underline underline-offset-2 hover:text-foreground"
                              onClick={() => startEdit(t)}
                            >
                              Edit
                            </button>
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(t.id)}><Trash2 className="size-3 text-destructive" /></Button>
                    </div>
                  ))}
                  {terms.length === 0 && <p className="text-xs text-muted-foreground">No terms in this session.</p>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All Sessions & Terms</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-md border border-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  {s.isActive && <Badge variant="success">Active</Badge>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.terms.map((t) => (
                    <Badge key={t.id} variant="secondary" className="flex items-center gap-1">
                      {t.name}
                      {t.nextTermBegins && <span className="text-[10px] opacity-70">({formatDate(t.nextTermBegins)})</span>}
                    </Badge>
                  ))}
                  {s.terms.length === 0 && <span className="text-xs text-muted-foreground">No terms</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
