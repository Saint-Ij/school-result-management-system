import { ReactNode } from "react"

type StatsGridProps = {
  children: ReactNode
  columns?: 2 | 3 | 4 | 5 | 6
}

export function StatsGrid({ children, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
    6: "sm:grid-cols-3 lg:grid-cols-6",
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridCols[columns]}`}>
      {children}
    </div>
  )
}
