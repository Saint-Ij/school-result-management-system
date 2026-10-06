import { GRADE_TABLE } from "@/lib/grades"

export function GradingSystem() {
  return (
    <div>
      <p className="font-semibold text-xs mb-2 text-black">KEY / GRADING</p>
      <div className="border border-black rounded-sm overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1 text-left font-medium text-black">Score Range</th>
              <th className="px-2 py-1 text-center font-medium text-black">Grade</th>
              <th className="px-2 py-1 text-left font-medium text-black">Remark</th>
            </tr>
          </thead>
          <tbody>
            {GRADE_TABLE.map((g) => (
              <tr key={g.grade} className="border-t border-black">
                <td className="px-2 py-0.5 text-black">{g.range}</td>
                <td className="px-2 py-0.5 text-center font-medium text-black">{g.grade}</td>
                <td className="px-2 py-0.5 text-black">{g.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
