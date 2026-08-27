import { mockCareerScore, mockPriorityActions, mockUser, mockVelocityData } from '@/lib/mock-data'
import { ScoreRingCard }      from '@/components/dashboard/ScoreRingCard'
import { DimensionBarsCard }  from '@/components/dashboard/DimensionBarsCard'
import { PriorityActionsCard } from '@/components/dashboard/PriorityActionsCard'
import { CareerVelocityCard } from '@/components/dashboard/CareerVelocityCard'
import { QuickLinksGrid }     from '@/components/dashboard/QuickLinksGrid'
import { useProfileStore }    from '@/store/profile.store'

function timeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function DashboardPage() {
  const profile = useProfileStore()

  const firstName = profile.isAnalyzed
    ? profile.analysis!.userInfo.name.split(' ')[0]
    : mockUser.name.split(' ')[0]

  const targetRole = profile.isAnalyzed
    ? profile.targetRole!
    : mockUser.targetRole

  const careerScore = profile.isAnalyzed
    ? profile.analysis!.careerScore
    : mockCareerScore

  const rawActions = profile.isAnalyzed ? profile.analysis!.priorityActions : []
  const priorityActions = rawActions.length > 0
    ? rawActions
    : profile.isAnalyzed && profile.skillGapItems.length > 0
      ? profile.skillGapItems
          .filter(s => s.status !== 'done')
          .sort((a, b) => b.scoreImpact - a.scoreImpact)
          .slice(0, 3)
          .map((s, i) => ({
            rank: i + 1,
            action: `Learn ${s.skill} — ${s.recommendedResource.name}`,
            impact: `+${s.scoreImpact} pts`,
            urgency: s.urgency,
            href: '/learning',
          }))
      : mockPriorityActions

  const velocityData = profile.isAnalyzed
    ? profile.analysis!.velocityData
    : mockVelocityData

  const fullName = profile.isAnalyzed
    ? profile.analysis!.userInfo.name
    : mockUser.name

  const targetCompany = profile.isAnalyzed
    ? profile.analysis!.userInfo.currentRole
    : mockUser.targetCompany

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1B1E26', lineHeight: 1.15 }}>
          {timeGreeting()},{' '}
          <span
            className="font-display"
            style={{
              fontWeight: 800,
              color: '#0E7A5A',
            }}
          >
            {firstName}.
          </span>
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#5B6573', marginTop: '0.35rem' }}>
          {profile.isAnalyzed ? (
            <>
              Target:{' '}
              <span style={{ fontWeight: 600, color: '#1B1E26' }}>{targetRole}</span>
              {' · '}
              <span style={{ color: '#8A94A2' }}>{targetCompany}</span>
            </>
          ) : (
            <>
              Target:{' '}
              <span style={{ fontWeight: 600, color: '#1B1E26' }}>{targetRole}</span>
              {' at a '}
              {targetCompany}
            </>
          )}
        </p>
      </div>

      {/* Row 1: Score ring + dimension bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreRingCard
          score={careerScore}
          userName={fullName}
          targetRole={targetRole}
        />
        <DimensionBarsCard dimensions={careerScore.dimensions} />
      </div>

      {/* Row 2: Priority actions + velocity sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityActionsCard actions={priorityActions} currentScore={careerScore.overallScore} />
        <CareerVelocityCard data={velocityData} />
      </div>

      {/* Row 3: Quick links */}
      <QuickLinksGrid />
    </div>
  )
}
