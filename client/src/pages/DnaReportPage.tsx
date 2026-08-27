import { useEffect, useState } from 'react'
import { Zap, RefreshCw, AlertCircle } from 'lucide-react'
import type { DnaReport } from '../../../shared/types'
import { generateDnaReport } from '@/lib/api'
import { mockUser, mockDnaReport } from '@/lib/mock-data'
import { ArchetypeCard } from '@/components/dna/ArchetypeCard'
import { StrengthsCard } from '@/components/dna/StrengthsCard'
import { GapsCard } from '@/components/dna/GapsCard'
import { MarketPerceptionGauge } from '@/components/dna/MarketPerceptionGauge'
import { RiskFlagsCard } from '@/components/dna/RiskFlagsCard'
import { useProfileStore } from '@/store/profile.store'

const DEMO_PROFILE = {
  name: mockUser.name,
  targetRole: mockUser.targetRole,
  location: mockUser.location,
  connections: mockUser.connections,
  experience: [
    { role: 'Business Analyst', duration: '2 years', company: 'Mid-size tech firm' },
    { role: 'MBA Student', duration: 'Final year', institution: 'Business School' },
  ],
  skills: ['SQL', 'Excel', 'Jira', 'Python (basic)', 'Stakeholder management', 'Process documentation'],
  certifications: ['Google Analytics (2023)', 'Coursera SQL for Data Science'],
  linkedIn: { connections: 320, headlineQuality: 'generic', activityScore: 'low' },
}

function GeneratingAnimation() {
  const steps = ['Parsing resume', 'Analyzing skills', 'Scoring readiness', 'Mapping gaps']
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-emer/20 border-t-emer animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className="w-7 h-7 text-emer" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-ink mb-1">
          Generating your CareerOS DNA...
        </h2>
        <p className="text-muted text-sm">
          Analyzing your profile against live market intelligence
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {steps.map((step, i) => (
          <span
            key={step}
            className="text-xs bg-panel2 text-muted px-3 py-1.5 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.25}s` }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <AlertCircle className="w-10 h-10 text-amber-w" />
      <div>
        <h2 className="text-lg font-semibold text-ink mb-1">
          Could not generate report
        </h2>
        <p className="text-muted text-sm max-w-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-emer text-white text-sm font-medium rounded-lg hover:bg-emer-d transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try again
      </button>
    </div>
  )
}

export function DnaReportPage() {
  const profile = useProfileStore()
  const [report, setReport] = useState<DnaReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usedMock, setUsedMock] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // If the user completed onboarding and the dnaReport has real content, use it directly
    if (profile.isAnalyzed && profile.analysis!.dnaReport.strengths.length > 0) {
      setReport(profile.analysis!.dnaReport)
      setUsedMock(false)
      setLoading(false)
      return
    }

    // Build the profile to send: use real user info when available, else demo
    const userProfilePayload = profile.isAnalyzed
      ? {
          name: profile.analysis!.userInfo.name,
          currentRole: profile.analysis!.userInfo.currentRole,
          yearsExperience: profile.analysis!.userInfo.yearsExperience,
          education: profile.analysis!.userInfo.education,
          location: profile.analysis!.userInfo.location,
        }
      : DEMO_PROFILE

    const targetRolePayload = profile.isAnalyzed
      ? (profile.targetRole ?? mockUser.targetRole)
      : mockUser.targetRole

    let cancelled = false
    setLoading(true)
    setError(null)

    generateDnaReport({
      userProfile: userProfilePayload,
      targetRole: targetRolePayload,
      userId: `dna_${Date.now()}`,
    })
      .then(data => {
        if (!cancelled) {
          setReport(data)
          setUsedMock(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message)
          // Only fall back to mock demo data when in demo (unauthenticated) mode
          if (!profile.isAnalyzed) {
            setReport(mockDnaReport)
            setUsedMock(true)
          }
          // For analyzed users: keep report=null so ErrorState renders with retry button
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [attempt, profile.isAnalyzed])

  if (loading) return <GeneratingAnimation />

  if (error && !report) return (
    <ErrorState message={error} onRetry={() => setAttempt(n => n + 1)} />
  )

  if (!report) return null

  const displayName = profile.isAnalyzed
    ? profile.analysis!.userInfo.name
    : mockUser.name

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">CareerOS DNA Report</h1>
          <p className="text-muted text-sm mt-1">
            Full career diagnostic for{' '}
            <span className="font-medium text-muted">{displayName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {usedMock && (
            <span className="text-xs bg-amber-t text-amber-w border border-amber-w/30 px-2 py-1 rounded-full">
              Demo data
            </span>
          )}
          {!usedMock && (
            <span className="text-xs bg-emer-tint text-emer border border-emer/30 px-2 py-1 rounded-full">
              {profile.isAnalyzed ? 'Your profile' : 'AI generated'}
            </span>
          )}
          {!profile.isAnalyzed && (
            <button
              onClick={() => setAttempt(n => n + 1)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-ink px-3 py-1.5 rounded-lg border border-hair hover:border-emer/40 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      <ArchetypeCard archetype={report.archetype} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsCard strengths={report.strengths} targetTitle={report.archetype.targetTitle} />
        <MarketPerceptionGauge score={report.marketPerceptionScore} />
      </div>

      <GapsCard gaps={report.gaps} targetTitle={report.archetype.targetTitle} />

      <RiskFlagsCard riskFlags={report.riskFlags} />
    </div>
  )
}
