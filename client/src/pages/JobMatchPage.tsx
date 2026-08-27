import { useState, useMemo, useEffect } from 'react'
import { Briefcase, TrendingUp, Target, Star, Loader2, RefreshCw } from 'lucide-react'
import { JobCard } from '../components/jobs/JobCard'
import { useProfileStore } from '../store/profile.store'
import { getJobMatchesForRole } from '../lib/job-matches'
import type { JobMatch } from '../lib/mock-data'

type SortKey = 'match' | 'salary' | 'recent'

const sortLabels: { key: SortKey; label: string }[] = [
  { key: 'match', label: 'Best Match' },
  { key: 'salary', label: 'Salary' },
  { key: 'recent', label: 'Most Recent' },
]

function parseSalary(range: string): number {
  const match = range.match(/₹(\d+)/)
  return match ? parseInt(match[1]) : 0
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

export function JobMatchPage() {
  const [sortBy, setSortBy] = useState<SortKey>('match')
  const [withinReachOnly, setWithinReachOnly] = useState(false)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isRealData, setIsRealData] = useState(false)
  const profile = useProfileStore()

  const targetRole = profile.isAnalyzed ? (profile.targetRole ?? 'Product Manager') : 'Product Manager'
  const userLocation = profile.isAnalyzed ? profile.analysis!.userInfo.location : null

  // Seed with mock data immediately so the page isn't empty
  useEffect(() => {
    const mock = getJobMatchesForRole(targetRole).map(j =>
      userLocation ? { ...j, location: userLocation } : j
    )
    setJobs(mock)
    setIsRealData(false)
  }, [targetRole, userLocation])

  // Fetch real jobs from the API when profile is analyzed
  useEffect(() => {
    if (!profile.isAnalyzed) return

    const cacheKey = `careeros_jobs::${targetRole}`
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      try {
        setJobs(JSON.parse(cached))
        setIsRealData(true)
        return
      } catch { /* ignore bad cache */ }
    }

    setIsLoading(true)
    setFetchError(null)

    const userSkills = profile.analysis!.dnaReport.strengths.map(s => s.name)
    const skillGaps  = profile.skillGapItems.map(s => s.skill)

    fetch(`${API_BASE}/api/v1/jobs/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole,
        location: userLocation ?? 'Bengaluru',
        userSkills,
        skillGaps,
      }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setJobs(res.data)
          setIsRealData(true)
          sessionStorage.setItem(cacheKey, JSON.stringify(res.data))
        } else {
          setFetchError('Could not load live jobs — showing curated matches')
        }
      })
      .catch(() => setFetchError('Could not load live jobs — showing curated matches'))
      .finally(() => setIsLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.isAnalyzed, targetRole])

  function handleRefresh() {
    const cacheKey = `careeros_jobs::${targetRole}`
    sessionStorage.removeItem(cacheKey)
    setIsRealData(false)
    // Re-trigger effect by toggling — simplest approach is a dedicated retry state
    profile.isAnalyzed && (() => {
      setIsLoading(true)
      setFetchError(null)
      const userSkills = profile.analysis!.dnaReport.strengths.map(s => s.name)
      const skillGaps  = profile.skillGapItems.map(s => s.skill)
      fetch(`${API_BASE}/api/v1/jobs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          location: userLocation ?? 'Bengaluru',
          userSkills,
          skillGaps,
        }),
      })
        .then(r => r.json())
        .then(res => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setJobs(res.data)
            setIsRealData(true)
            sessionStorage.setItem(cacheKey, JSON.stringify(res.data))
          } else {
            setFetchError('Could not load live jobs — showing curated matches')
          }
        })
        .catch(() => setFetchError('Could not load live jobs — showing curated matches'))
        .finally(() => setIsLoading(false))
    })()
  }

  const filtered = useMemo(() => {
    let list = withinReachOnly ? jobs.filter(j => j.matchScore >= 60) : [...jobs]
    if (sortBy === 'match') list.sort((a, b) => b.matchScore - a.matchScore)
    else if (sortBy === 'salary') list.sort((a, b) => parseSalary(b.salaryRange) - parseSalary(a.salaryRange))
    else list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    return list
  }, [jobs, sortBy, withinReachOnly])

  const bestFit = jobs.length > 0 ? Math.max(...jobs.map(j => j.matchScore)) : 0
  const avgFit = jobs.length > 0 ? Math.round(jobs.reduce((s, j) => s + j.matchScore, 0) / jobs.length) : 0
  const withinReachCount = jobs.filter(j => j.matchScore >= 60).length

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Job Match Dashboard</h1>
          <p className="text-muted mt-1 text-sm">
            Ranked by real fit % — skills, experience relevance, and seniority alignment
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emer-tint text-emer rounded-full border border-emer/30">
              <Loader2 className="w-3 h-3 animate-spin" />
              Fetching live jobs…
            </span>
          )}
          {!isLoading && isRealData && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-emer-tint text-emer-d rounded-full border border-emer/30 hover:opacity-80 transition-opacity"
            >
              <RefreshCw className="w-3 h-3" />
              Live jobs · Refresh
            </button>
          )}
          {!isLoading && !isRealData && (
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-panel text-muted rounded-full border border-hair">
              <Briefcase className="w-3 h-3" />
              Curated matches
            </span>
          )}
        </div>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="bg-amber-t border border-amber-w/30 rounded-xl px-4 py-3 text-xs text-amber-w font-medium">
          {fetchError}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-emer mb-0.5">
            <Star className="w-5 h-5" />
            {bestFit}%
          </div>
          <div className="text-xs text-muted">Best fit</div>
        </div>
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-emer mb-0.5">{avgFit}%</div>
          <div className="text-xs text-muted">Avg fit score</div>
        </div>
        <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-ink mb-0.5">
            <Target className="w-5 h-5 text-emer" />
            {withinReachCount}
          </div>
          <div className="text-xs text-muted">Within reach</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-paper rounded-xl border border-hair shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-faint uppercase tracking-wider">Sort</span>
          {sortLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                sortBy === key
                  ? 'bg-emer text-white'
                  : 'bg-panel text-muted hover:bg-panel2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setWithinReachOnly(!withinReachOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              withinReachOnly
                ? 'bg-emer text-white border-emer'
                : 'bg-paper text-muted border-hair hover:bg-panel'
            }`}
          >
            <TrendingUp className="w-3 h-3" />
            Within reach only
          </button>
        </div>

        {withinReachOnly && (
          <div className="w-full pt-2 border-t border-hair flex items-center justify-between">
            <span className="text-xs text-muted">
              Showing <span className="font-semibold text-ink">{filtered.length}</span> of{' '}
              {jobs.length} roles (≥ 60% fit)
            </span>
            <button
              onClick={() => setWithinReachOnly(false)}
              className="text-xs text-emer hover:underline"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* Job list */}
      <div className="space-y-3">
        {filtered.map((job, i) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Footer nudge */}
      <div className="bg-emer-tint rounded-xl border border-emer/20 p-5 text-center">
        <p className="text-sm font-semibold text-ink mb-1">
          Close skill gaps to unlock higher fit scores at your top matches
        </p>
        <p className="text-xs text-muted mb-3">
          {profile.isAnalyzed
            ? `Your personalised learning roadmap targets the gaps most relevant to ${profile.targetRole} roles in ${userLocation ?? 'your city'}`
            : 'Product Roadmapping + A/B Testing are the highest-leverage skills across your top matches'}
        </p>
        <a
          href="/learning"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emer text-white text-xs font-semibold rounded-lg hover:bg-emer-d transition-colors"
        >
          Go to Learning Roadmap →
        </a>
      </div>
    </div>
  )
}
