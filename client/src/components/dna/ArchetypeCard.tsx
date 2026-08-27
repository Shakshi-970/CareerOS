import { ArrowRight, Zap } from 'lucide-react'
import type { DnaReport } from '../../../../shared/types'

interface ArchetypeCardProps {
  archetype: DnaReport['archetype']
}

export function ArchetypeCard({ archetype }: ArchetypeCardProps) {
  return (
    <div className="bg-gradient-to-r from-ink to-emer-d rounded-xl p-6 text-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-4 h-4" style={{ color: '#9FE3CB' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9FE3CB' }}>Career Archetype</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{archetype.title}</h2>
        </div>
        <ArrowRight className="w-5 h-5 hidden sm:block flex-shrink-0" style={{ color: '#9FE3CB' }} />
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: '#CFE8DE' }}>Target</p>
          <h3 className="text-xl font-semibold" style={{ color: '#CFE8DE' }}>{archetype.targetTitle}</h3>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: '#CFE8DE' }}>{archetype.description}</p>
    </div>
  )
}
