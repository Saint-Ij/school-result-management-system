"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { SubjectGroup } from "./types"

const CHART_BLUE = "#3B82F6"

type Props = {
  subjects: SubjectGroup[]
}

export function PerformanceChart({ subjects }: Props) {
  const data = subjects.map((s) => ({
    subject: s.subject.length > 10 ? s.subject.slice(0, 10) + "…" : s.subject,
    score: s.total,
    max: s.maxTotal,
    pct: s.maxTotal > 0 ? Math.round((s.total / s.maxTotal) * 100) : 0,
  }))

  if (data.length === 0) {
    return (
      <div className="border border-black rounded-md p-8 text-center text-sm text-black">
        No subject data available for chart
      </div>
    )
  }

  return (
    <div className="w-full">
      <p className="font-semibold text-xs mb-2 text-black">SUBJECT PERFORMANCE CHART</p>
      <div className="border border-black rounded-sm p-3">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000" />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 10, fill: "#000" }}
              axisLine={{ stroke: "#000" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#000" }}
              axisLine={{ stroke: "#000" }}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 0,
                border: "1px solid #000",
                background: "#fff",
              }}
              formatter={(_value, _name, entry) => {
                const payload = entry?.payload as { pct: number; score: number; max: number } | undefined
                if (!payload) return ["", ""]
                return [`${payload.score}/${payload.max} (${payload.pct}%)`, "Score"]
              }}
            />
            <Bar dataKey="pct" radius={[2, 2, 0, 0]} maxBarSize={40} fill={CHART_BLUE} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
