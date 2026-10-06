import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

type DashboardCardProps = {
  label: string
  value: string | number
  icon?: ReactNode
  description?: string
}

export function DashboardCard({ label, value, icon, description }: DashboardCardProps) {
  return (
    <Card className="p-0">
      <CardContent className="flex items-start gap-4 px-6 py-5">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {description && (
            <span className="mt-1 text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
