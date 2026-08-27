import type { SkillGapItem } from '../../lib/mock-data'
import { useSkillStore } from '../../store/skill.store'
import { LearningTaskItem } from './LearningTaskItem'

const phaseThemes: Record<
  number,
  { gradient: string; border: string; bg: string; footerBorder: string }
> = {
  30: {
    gradient: 'from-emer to-emer-d',
    border: 'border-emer/20',
    bg: 'bg-emer-tint',
    footerBorder: 'border-emer/20',
  },
  90: {
    gradient: 'from-emer to-emer-d',
    border: 'border-emer/20',
    bg: 'bg-emer-tint',
    footerBorder: 'border-emer/20',
  },
  180: {
    gradient: 'from-ink to-[#2d3240]',
    border: 'border-hair',
    bg: 'bg-panel',
    footerBorder: 'border-hair',
  },
}

interface Props {
  phase: 30 | 90 | 180
  label: string
  dateRange: string
  skills: SkillGapItem[]
}

export function LearningPhaseCard({ phase, label, dateRange, skills }: Props) {
  const storeStatuses = useSkillStore(state => state.statuses)
  const theme = phaseThemes[phase]

  const completedCount = skills.filter(
    s => (storeStatuses[s.skill] ?? s.status) === 'done'
  ).length
  const totalHours = skills.reduce((sum, s) => sum + s.estimatedHours, 0)
  const remainingHours = skills
    .filter(s => (storeStatuses[s.skill] ?? s.status) !== 'done')
    .reduce((sum, s) => sum + s.estimatedHours, 0)
  const progressPct = skills.length > 0 ? (completedCount / skills.length) * 100 : 0
  const weeksRemaining = Math.ceil(remainingHours / 5)

  return (
    <div className={`rounded-xl border ${theme.border} overflow-hidden flex flex-col shadow-sm`}>
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${theme.gradient} px-5 py-4`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">
              {phase}-day plan
            </span>
            <div className="text-white text-xl font-bold mt-0.5">{label}</div>
            <div className="text-white/60 text-xs mt-0.5">{dateRange}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-white text-3xl font-bold leading-none">{skills.length}</div>
            <div className="text-white/60 text-[10px] mt-0.5">
              {skills.length === 1 ? 'skill' : 'skills'}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-white/70 mb-1.5">
            <span>
              {completedCount}/{skills.length} completed
            </span>
            <span>{totalHours}h total</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className={`flex-1 p-4 space-y-2 ${theme.bg}`}>
        {skills.length === 0 ? (
          <p className="text-xs text-faint text-center py-8">No tasks in this phase</p>
        ) : (
          skills.map(skill => <LearningTaskItem key={skill.skill} skill={skill} />)
        )}
      </div>

      {/* Footer */}
      {remainingHours > 0 && (
        <div className={`px-4 py-2.5 border-t ${theme.footerBorder} ${theme.bg}`}>
          <p className="text-xs text-muted">
            <span className="font-semibold text-ink">{remainingHours}h remaining</span>
            {' · '}~{weeksRemaining} week{weeksRemaining !== 1 ? 's' : ''} at 5h/week
          </p>
        </div>
      )}
      {remainingHours === 0 && skills.length > 0 && (
        <div className={`px-4 py-2.5 border-t ${theme.footerBorder} bg-emer-tint`}>
          <p className="text-xs text-emer font-semibold">Phase complete</p>
        </div>
      )}
    </div>
  )
}
