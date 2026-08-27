import { BookOpen, Clock, CheckCircle, TrendingUp, Star, RefreshCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { mockSkillGaps, mockLearningPhases } from '../lib/mock-data'
import { useSkillStore } from '../store/skill.store'
import { useProfileStore } from '../store/profile.store'
import { LearningPhaseCard } from '../components/learning/LearningPhaseCard'

export function LearningPage() {
  const navigate = useNavigate()
  const storeStatuses = useSkillStore(state => state.statuses)
  const profile = useProfileStore()

  const hasData = profile.isAnalyzed && profile.skillGapItems.length > 0
  const baseSkills = hasData ? profile.skillGapItems : !profile.isAnalyzed ? mockSkillGaps : []
  const basePhases = hasData ? profile.learningPhases : !profile.isAnalyzed ? mockLearningPhases : []

  const phases = basePhases.map(p => ({
    ...p,
    skills: p.skillNames
      .map(name => baseSkills.find(s => s.skill === name))
      .filter((s): s is NonNullable<typeof s> => s !== undefined),
  }))

  const completedSkills = baseSkills.filter(
    s => (storeStatuses[s.skill] ?? s.status) === 'done'
  )
  const inProgressCount = baseSkills.filter(
    s => (storeStatuses[s.skill] ?? s.status) === 'in_progress'
  ).length
  const totalHoursRemaining = baseSkills
    .filter(s => (storeStatuses[s.skill] ?? s.status) !== 'done')
    .reduce((sum, s) => sum + s.estimatedHours, 0)
  const overallProgress = baseSkills.length > 0
    ? Math.round((completedSkills.length / baseSkills.length) * 100)
    : 0

  const targetRoleLabel = hasData ? profile.targetRole! : !profile.isAnalyzed ? 'Product Manager' : (profile.targetRole ?? 'your target role')
  const timelineLabel = profile.targetTimeline === '3m' ? '3-month' : profile.targetTimeline === '1y' ? '1-year' : '6-month'

  if (profile.isAnalyzed && baseSkills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emer-tint flex items-center justify-center">
          <BookOpen className="w-7 h-7 text-emer" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink mb-1">No learning roadmap yet</h2>
          <p className="text-sm text-muted max-w-sm">
            {profile.targetRole
              ? `Your personalized roadmap for ${profile.targetRole} will appear here after a full profile analysis.`
              : 'Analyze your profile to get a personalized learning roadmap.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/connect')}
          className="flex items-center gap-2 px-4 py-2 bg-emer text-white text-sm font-semibold rounded-lg hover:bg-emer-d transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          {profile.targetRole ? 'Re-analyze Profile' : 'Analyze Profile'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Learning Roadmap</h1>
          <p className="text-muted mt-1 text-sm">
            Your personalized {timelineLabel} plan to become a{' '}
            <span className="font-medium text-ink">{targetRoleLabel}</span>
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emer-tint text-emer-d rounded-full border border-emer/20">
          <BookOpen className="w-3 h-3" />
          {profile.isAnalyzed ? 'Your Personalized Roadmap' : 'AI-Generated Roadmap'}
        </span>
      </div>

      {/* Overall progress */}
      <div className="bg-paper rounded-xl border border-hair shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-ink">Overall Progress</span>
          <span className="text-sm font-bold text-ink">{overallProgress}%</span>
        </div>
        <div className="h-2.5 bg-panel2 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-emer rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-ink">
              {baseSkills.length}
            </div>
            <div className="text-xs text-muted mt-0.5">Total skills</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-emer">
              <CheckCircle className="w-4 h-4" />
              {completedSkills.length}
            </div>
            <div className="text-xs text-muted mt-0.5">Completed</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-amber-w">
              <TrendingUp className="w-4 h-4" />
              {inProgressCount}
            </div>
            <div className="text-xs text-muted mt-0.5">In progress</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-emer">
              <Clock className="w-4 h-4" />
              {totalHoursRemaining}h
            </div>
            <div className="text-xs text-muted mt-0.5">Hours left</div>
          </div>
        </div>
      </div>

      {/* Phase columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {phases.map(phase => (
          <LearningPhaseCard
            key={phase.phase}
            phase={phase.phase}
            label={phase.label}
            dateRange={phase.dateRange}
            skills={phase.skills}
          />
        ))}
      </div>

      {/* Completed skills */}
      {completedSkills.length > 0 && (
        <div className="bg-paper rounded-xl border border-emer/20 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-emer" />
            <h2 className="text-sm font-bold text-ink">Already Completed</h2>
            <span className="text-xs text-muted">
              ({completedSkills.length} skill{completedSkills.length > 1 ? 's' : ''})
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedSkills.map(skill => (
              <div
                key={skill.skill}
                className="flex items-center gap-2.5 p-3 bg-emer-tint rounded-lg border border-emer/20"
              >
                <CheckCircle className="w-4 h-4 text-emer shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-muted line-through truncate">
                    {skill.skill}
                  </div>
                  <div className="text-xs text-faint truncate">
                    {skill.recommendedResource.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
