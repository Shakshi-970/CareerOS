import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import type { DnaReport } from '../../../../shared/types'

const severityConfig = {
  high: {
    icon: AlertTriangle,
    wrapper: 'border-amber-w/30 bg-amber-t',
    icon_class: 'text-amber-w',
    badge: 'bg-amber-t text-amber-w border border-amber-w/20',
    label: 'High Risk',
  },
  medium: {
    icon: AlertCircle,
    wrapper: 'border-amber-w/20 bg-amber-t',
    icon_class: 'text-amber-w',
    badge: 'bg-amber-t text-amber-w border border-amber-w/20',
    label: 'Medium Risk',
  },
  low: {
    icon: Info,
    wrapper: 'border-emer/20 bg-emer-tint',
    icon_class: 'text-emer',
    badge: 'bg-emer-tint text-emer-d border border-emer/20',
    label: 'Low Risk',
  },
}

interface RiskFlagsCardProps {
  riskFlags: DnaReport['riskFlags']
}

export function RiskFlagsCard({ riskFlags }: RiskFlagsCardProps) {
  return (
    <div className="bg-paper rounded-xl border border-hair shadow-sm p-6">
      <h2 className="font-semibold text-ink mb-1">Risk Flags</h2>
      <p className="text-xs text-faint mt-1 mb-5">Issues that may be quietly holding back your applications</p>

      <div className="space-y-3">
        {riskFlags.map((flag) => {
          const cfg = severityConfig[flag.severity]
          const Icon = cfg.icon
          return (
            <div key={flag.title} className={`flex gap-3 p-4 rounded-lg border ${cfg.wrapper}`}>
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.icon_class}`} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-ink">{flag.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{flag.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
