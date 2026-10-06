"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type ErrorStateProps = {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertCircle className="mb-4 size-12 text-destructive/50" />
      <h3 className="text-sm font-medium text-destructive">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
