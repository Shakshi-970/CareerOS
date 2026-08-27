import type { SkillGapItem } from '../../lib/mock-data'
import { SkillCard } from './SkillCard'

export type Quadrant = 'close_first' | 'plan_for' | 'quick_wins' | 'long_game'

export function getQuadrant(skill: SkillGapItem): Quadrant {
  const isHighUrgency = skill.urgency === 'high'
  const isHighClosability = skill.closability === 'high'
  if (isHighUrgency && isHighClosability) return 'close_first'
  if (isHighUrgency && !isHighClosability) return 'plan_for'
  if (!isHighUrgency && isHighClosability) return 'quick_wins'
  return 'long_game'
}

const quadrantConfig: Record<
  Quadrant,
  { label: string; sublabel: string; headerClass: string; labelClass: string; dotClass: string; borderClass: string }
> = {
  plan_for: {
    label: 'Plan For',
    sublabel: 'High urgency · Hard to close',
    headerClass: 'bg-amber-t',
    labelClass: 'text-amber-w',
    dotClass: 'bg-amber-w',
    borderClass: 'border-amber-w/30',
  },
  close_first: {
    label: 'Close First',
    sublabel: 'High urgency · Easy to close',
    headerClass: 'bg-amber-t',
    labelClass: 'text-amber-w',
    dotClass: 'bg-amber-w',
    borderClass: 'border-amber-w/30',
  },
  long_game: {
    label: 'Long Game',
    sublabel: 'Lower urgency · Hard to close',
    headerClass: 'bg-panel',
    labelClass: 'text-muted',
    dotClass: 'bg-faint',
    borderClass: 'border-hair',
  },
  quick_wins: {
    label: 'Quick Wins',
    sublabel: 'Lower urgency · Easy to close',
    headerClass: 'bg-emer-tint',
    labelClass: 'text-emer-d',
    dotClass: 'bg-emer',
    borderClass: 'border-emer/20',
  },
}

interface Props {
  skills: SkillGapItem[]
  activeQuadrant: Quadrant | 'all'
}

export function SkillMatrix({ skills, activeQuadrant }: Props) {
  const grouped: Record<Quadrant, SkillGapItem[]> = {
    close_first: [],
    plan_for: [],
    quick_wins: [],
    long_game: [],
  }
  for (const skill of skills) {
    grouped[getQuadrant(skill)].push(skill)
  }

  function renderQuadrant(q: Quadrant) {
    const config = quadrantConfig[q]
    const items = grouped[q]
    const dimmed = activeQuadrant !== 'all' && activeQuadrant !== q

    return (
      <div
        className={`rounded-xl border ${config.borderClass} transition-opacity duration-200 ${
          dimmed ? 'opacity-30 pointer-events-none' : ''
        }`}
      >
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl border-b ${config.headerClass} ${config.borderClass}`}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${config.dotClass}`} />
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-bold ${config.labelClass}`}>{config.label}</span>
            <span className="text-xs text-faint ml-2 hidden sm:inline">{config.sublabel}</span>
          </div>
          <span className="text-xs font-semibold text-muted bg-paper px-2 py-0.5 rounded-full border border-hair shrink-0">
            {items.length}
          </span>
        </div>
        <div className={`p-3 space-y-2 min-h-[110px] ${config.headerClass} rounded-b-xl`}>
          {items.length === 0 ? (
            <p className="text-xs text-faint text-center pt-8">No skills here</p>
          ) : (
            items.map(skill => <SkillCard key={skill.skill} skill={skill} />)
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center ml-8">
        <div className="flex-1 flex justify-between text-xs text-faint px-1">
          <span>← Low Closability</span>
          <span className="font-medium text-muted uppercase tracking-widest text-[10px]">Closability Axis</span>
          <span>High Closability →</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col justify-around items-center w-7 py-2">
          <span className="text-[10px] font-medium text-faint uppercase tracking-wide [writing-mode:vertical-rl] rotate-180">
            ↑ High
          </span>
          <div className="text-[10px] font-semibold text-faint uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Urgency
          </div>
          <span className="text-[10px] font-medium text-faint uppercase tracking-wide [writing-mode:vertical-rl] rotate-180">
            Low ↓
          </span>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          {renderQuadrant('plan_for')}
          {renderQuadrant('close_first')}
          {renderQuadrant('long_game')}
          {renderQuadrant('quick_wins')}
        </div>
      </div>
    </div>
  )
}
