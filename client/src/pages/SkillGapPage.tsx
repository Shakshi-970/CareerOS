import { useState } from 'react'
import { AlertTriangle, Clock, CheckCircle, TrendingUp, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockSkillGaps } from '../lib/mock-data'
import { SkillMatrix, getQuadrant, type Quadrant } from '../components/skills/SkillMatrix'
import { useSkillStore } from '../store/skill.store'
import { useProfileStore } from '../store/profile.store'

type QuadrantFilter = Quadrant | 'all'
type StatusFilter = 'all' | 'open' | 'in_progress' | 'done'

const quadrantButtons: { key: QuadrantFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'close_first', label: 'Close First' },
  { key: 'plan_for', label: 'Plan For' },
  { key: 'quick_wins', label: 'Quick Wins' },
  { key: 'long_game', label: 'Long Game' },
]

const statusButtons: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

function EmptySkillState({ targetRole }: { targetRole: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-emer-tint flex items-center justify-center">
        <TrendingUp className="w-8 h-8 text-emer" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-ink mb-2">Skill gap analysis not ready yet</h2>
        <p className="text-sm text-muted max-w-md">
          {targetRole
            ? <>Your previous analysis for <span className="font-semibold text-ink">{targetRole}</span> returned incomplete data. Re-upload your resume to generate a full skill gap breakdown.</>
            : 'Upload your resume and select a target role to generate your personalized skill gap analysis.'}
        </p>
      </div>
      <div className="bg-amber-t border border-amber-w/30 rounded-xl p-4 max-w-sm text-left">
        <p className="text-xs font-semibold text-amber-w mb-1">Why is this empty?</p>
        <p className="text-xs text-amber-w">The AI analysis may have been cut short. Re-analyzing with the updated engine will return complete skill gap data.</p>
      </div>
      <button
        onClick={() => navigate('/connect')}
        className="flex items-center gap-2 px-5 py-2.5 bg-emer text-white text-sm font-semibold rounded-lg hover:bg-emer-d transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Re-analyze Profile
      </button>
    </div>
  )
}

export function SkillGapPage() {
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const storeStatuses = useSkillStore(state => state.statuses)
  const profile = useProfileStore()

  const baseSkills = profile.isAnalyzed && profile.skillGapItems.length > 0
    ? profile.skillGapItems
    : !profile.isAnalyzed
    ? mockSkillGaps
    : []

  // Merge store overrides so filters and stats stay live
  const effectiveSkills = baseSkills.map(skill => ({
    ...skill,
    status: storeStatuses[skill.skill] ?? skill.status,
  }))

  const filteredSkills = effectiveSkills.filter(skill => {
    const quadrantMatch = quadrantFilter === 'all' || getQuadrant(skill) === quadrantFilter
    const statusMatch = statusFilter === 'all' || skill.status === statusFilter
    return quadrantMatch && statusMatch
  })

  const openCount = effectiveSkills.filter(s => s.status === 'open').length
  const inProgressCount = effectiveSkills.filter(s => s.status === 'in_progress').length
  const doneCount = effectiveSkills.filter(s => s.status === 'done').length
  const highUrgencyCount = effectiveSkills.filter(
    s => s.urgency === 'high' && s.status !== 'done'
  ).length
  const potentialGain = effectiveSkills
    .filter(s => s.status !== 'done')
    .reduce((sum, s) => sum + s.scoreImpact, 0)

  const isFiltered = quadrantFilter !== 'all' || statusFilter !== 'all'

  if (profile.isAnalyzed && baseSkills.length === 0) {
    return <EmptySkillState targetRole={profile.targetRole} />
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Skill Gap Analysis</h1>
          <p className="text-muted mt-1 text-sm">
            {profile.isAnalyzed
              ? `Skills mapped to your target role: ${profile.targetRole}`
              : 'Skills mapped by urgency to your target role and how quickly you can close each gap.'}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-paper rounded-xl border border-hair shadow-sm px-5 py-3">
          <div className="text-center">
            <div className="text-xl font-bold text-amber-w">{highUrgencyCount}</div>
            <div className="text-xs text-muted mt-0.5 whitespace-nowrap">High Priority</div>
          </div>
          <div className="w-px h-8 bg-hair" />
          <div className="text-center">
            <div className="text-xl font-bold text-amber-w">{inProgressCount}</div>
            <div className="text-xs text-muted mt-0.5 whitespace-nowrap">In Progress</div>
          </div>
          <div className="w-px h-8 bg-hair" />
          <div className="text-center">
            <div className="text-xl font-bold text-emer">{doneCount}</div>
            <div className="text-xs text-muted mt-0.5 whitespace-nowrap">Done</div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-paper rounded-xl border border-hair shadow-sm p-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-faint uppercase tracking-wider">
              Quadrant
            </span>
            {quadrantButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setQuadrantFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  quadrantFilter === key
                    ? 'bg-emer text-white'
                    : 'bg-panel text-muted hover:bg-panel2'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="w-px bg-hair hidden sm:block" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold text-faint uppercase tracking-wider">
              Status
            </span>
            {statusButtons.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-emer text-white'
                    : 'bg-panel text-muted hover:bg-panel2'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {isFiltered && (
          <div className="mt-3 pt-3 border-t border-hair flex items-center justify-between">
            <span className="text-xs text-muted">
              Showing{' '}
              <span className="font-semibold text-ink">{filteredSkills.length}</span> of{' '}
              {effectiveSkills.length} skills
            </span>
            <button
              onClick={() => {
                setQuadrantFilter('all')
                setStatusFilter('all')
              }}
              className="text-xs text-emer hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Matrix */}
      <div className="bg-paper rounded-xl border border-hair shadow-sm p-6">
        <SkillMatrix skills={filteredSkills} activeQuadrant={quadrantFilter} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-t flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-w" />
          </div>
          <div>
            <div className="text-xs text-muted">Open gaps</div>
            <div className="text-xl font-bold text-ink">{openCount}</div>
          </div>
        </div>
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-t flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-w" />
          </div>
          <div>
            <div className="text-xs text-muted">In progress</div>
            <div className="text-xl font-bold text-ink">{inProgressCount}</div>
          </div>
        </div>
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emer-tint flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4 text-emer" />
          </div>
          <div>
            <div className="text-xs text-muted">Closed</div>
            <div className="text-xl font-bold text-ink">{doneCount}</div>
          </div>
        </div>
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emer-tint flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-emer" />
          </div>
          <div>
            <div className="text-xs text-muted">Score potential</div>
            <div className="text-xl font-bold text-emer-d">+{potentialGain} pts</div>
          </div>
        </div>
      </div>
    </div>
  )
}
