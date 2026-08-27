import { CheckCircle2 } from 'lucide-react'
import type { DnaReport } from '../../../../shared/types'

const tagColors: Record<string, string> = {
  'Core PM Skill': 'bg-emer-tint text-emer-d border border-emer/20',
  'Technical Depth': 'bg-emer-tint text-emer-d border border-emer/20',
  'Industry Edge': 'bg-emer-tint text-emer-d border border-emer/20',
  'Credibility Signal': 'bg-amber-t text-amber-w border border-amber-w/20',
  Transferable: 'bg-panel2 text-muted border border-hair',
}

interface StrengthsCardProps {
  strengths: DnaReport['strengths']
  targetTitle?: string
}

export function StrengthsCard({ strengths, targetTitle = 'target' }: StrengthsCardProps) {
  return (
    <div className="bg-paper rounded-xl border border-hair shadow-sm p-6 h-full">
      <h2 className="font-semibold text-ink mb-1">Top Strengths</h2>
      <p className="text-xs text-faint mt-1 mb-5">What you already bring to the {targetTitle} role</p>

      <div className="space-y-4">
        {strengths.map((s) => (
          <div key={s.name} className="flex gap-3">
            <CheckCircle2 className="w-4 h-4 text-emer mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-ink">{s.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[s.relevanceTag] ?? 'bg-panel2 text-muted'}`}>
                  {s.relevanceTag}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
