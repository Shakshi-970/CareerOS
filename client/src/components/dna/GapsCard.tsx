import { Flame, Clock, TrendingUp } from 'lucide-react'
import type { DnaReport } from '../../../../shared/types'

const urgencyConfig = {
  high: { label: 'High Priority', icon: Flame, bar: 'bg-amber-w', badge: 'bg-amber-t text-amber-w border border-amber-w/20' },
  medium: { label: 'Medium Priority', icon: Clock, bar: 'bg-amber-w', badge: 'bg-amber-t text-amber-w border border-amber-w/20' },
  low: { label: 'Lower Priority', icon: Clock, bar: 'bg-emer', badge: 'bg-emer-tint text-emer-d border border-emer/20' },
}

interface GapsCardProps {
  gaps: DnaReport['gaps']
  targetTitle?: string
}

export function GapsCard({ gaps, targetTitle = 'target role' }: GapsCardProps) {
  return (
    <div className="bg-paper rounded-xl border border-hair shadow-sm p-6">
      <h2 className="font-semibold text-ink mb-1">Skill Gaps to Close</h2>
      <p className="text-xs text-faint mt-1 mb-5">Ordered by urgency — close these to unlock your target role</p>

      <div className="space-y-5">
        {gaps.map((gap) => {
          const cfg = urgencyConfig[gap.urgency]
          const Icon = cfg.icon
          return (
            <div key={gap.name} className="border border-hair rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="font-medium text-ink text-sm">{gap.name}</span>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3 h-3 text-faint flex-shrink-0" />
                <span className="text-xs text-muted">
                  Market demand: <span className="font-semibold text-ink">{gap.marketDemandPercent}%</span> of {targetTitle} job postings
                </span>
              </div>

              <div className="h-1.5 bg-panel2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${cfg.bar}`}
                  style={{ width: `${gap.marketDemandPercent}%` }}
                />
              </div>

              <p className="text-xs text-muted leading-relaxed">
                <span className="font-medium text-ink">Next step: </span>
                {gap.recommendedAction}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
