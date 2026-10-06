import { Inbox } from "lucide-react"

type EmptyStateProps = {
  title?: string
  description?: string
}

export function EmptyState({
  title = "No data found",
  description = "There are no items to display yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Inbox className="mb-4 size-12 text-muted-foreground/50" />
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground/70">{description}</p>
    </div>
  )
}
