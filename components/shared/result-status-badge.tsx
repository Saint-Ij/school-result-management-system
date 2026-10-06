import { Badge } from "@/components/ui/badge"

type ResultStatusBadgeProps = {
  status: "draft" | "teacher_submitted" | "approved"
}

export function ResultStatusBadge({ status }: ResultStatusBadgeProps) {
  const config = {
    draft: { label: "Draft", variant: "secondary" as const },
    teacher_submitted: { label: "Submitted", variant: "warning" as const },
    approved: { label: "Approved", variant: "success" as const },
  }

  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}
