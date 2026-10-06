const RATINGS = ["A", "B", "C", "D", "E"] as const

type DomainTrait = {
  label: string
  value: string
}

type DomainTableProps = {
  title: string
  traits: DomainTrait[]
}

export function DomainTable({ title, traits }: DomainTableProps) {
  return (
    <div className="text-xs">
      <p className="font-semibold mb-1">{title}</p>
      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-2 py-1 text-left font-medium">Trait</th>
              {RATINGS.map((r) => (
                <th key={r} className="px-2 py-1 text-center font-medium w-7">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {traits.map((trait) => (
              <tr key={trait.label} className="border-t border-border">
                <td className="px-2 py-0.5">{trait.label}</td>
                {RATINGS.map((r) => (
                  <td key={r} className="px-2 py-0.5 text-center">
                    {trait.value === r ? "✓" : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
