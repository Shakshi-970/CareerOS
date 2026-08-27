import { useState, useEffect, useRef } from 'react'
import {
  ChevronLeft, ChevronRight, RotateCcw, Target, CheckCircle2, XCircle,
  Loader2, Sparkles, AlertCircle, RefreshCw,
  Users, Brain, Calculator, TrendingUp, Database, Code2, BarChart3,
  Layers, Settings, Search, FileText, Zap, ChevronDown,
} from 'lucide-react'
import type { MCQQuestion } from '../lib/interview-mcq'
import { mcqQuestions } from '../lib/interview-mcq'
import { getCategoriesForRole, type InterviewCategory, type IconKey } from '../lib/interview-categories'
import { useMCQStore } from '../store/mcq.store'
import { MCQCard } from '../components/interview/MCQCard'
import { useProfileStore } from '../store/profile.store'
import { useAIInterviewStore } from '../store/ai-interview.store'
import { generateInterviewQuestions } from '../lib/api'
import { JOB_ROLE_CATEGORIES } from '../lib/career-data'

// Flat list of all roles for the role picker
const ALL_ROLES = JOB_ROLE_CATEGORIES.flatMap(cat => cat.roles)

function RolePicker({ value, onChange }: { value: string; onChange: (r: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const filtered = query
    ? ALL_ROLES.filter(r => r.toLowerCase().includes(query.toLowerCase()))
    : ALL_ROLES

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: '220px' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.4rem 0.75rem', borderRadius: '8px',
          border: '1px solid #DCE0E4', backgroundColor: '#FFFFFF',
          fontSize: '0.82rem', fontWeight: 600, color: '#1B1E26', cursor: 'pointer',
          width: '100%', justifyContent: 'space-between',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <ChevronDown style={{ width: '0.85rem', height: '0.85rem', flexShrink: 0, color: '#8A94A2' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          backgroundColor: '#FFFFFF', border: '1px solid #DCE0E4',
          borderRadius: '10px', boxShadow: '0 8px 24px rgba(27,30,38,0.12)',
          maxHeight: '260px', overflowY: 'auto',
        }}>
          <div style={{ padding: '0.5rem' }}>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search role…"
              style={{
                width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem',
                border: '1px solid #DCE0E4', borderRadius: '6px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          {filtered.slice(0, 60).map(role => (
            <button
              key={role}
              onClick={() => { onChange(role); setOpen(false); setQuery('') }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '0.45rem 0.75rem', fontSize: '0.8rem',
                color: role === value ? '#0E7A5A' : '#1B1E26',
                fontWeight: role === value ? 700 : 400,
                background: role === value ? 'rgba(14,122,90,0.06)' : 'none',
                border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={e => { if (role !== value) e.currentTarget.style.background = '#E7F3EE' }}
              onMouseLeave={e => { if (role !== value) e.currentTarget.style.background = 'none' }}
            >
              {role}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<IconKey, React.ElementType> = {
  users: Users,
  brain: Brain,
  calculator: Calculator,
  trending: TrendingUp,
  database: Database,
  code: Code2,
  chart: BarChart3,
  layers: Layers,
  settings: Settings,
  search: Search,
  file: FileText,
  zap: Zap,
}

function CategoryIcon({ iconKey, className }: { iconKey: IconKey; className?: string }) {
  const Icon = ICON_MAP[iconKey]
  return <Icon className={className} />
}

// ─── InterviewPage ────────────────────────────────────────────────────────────
export function InterviewPage() {
  const profile = useProfileStore()
  const aiInterview = useAIInterviewStore()
  const answers = useMCQStore(s => s.answers)
  const resetQuestions = useMCQStore(s => s.resetQuestions)

  // Local role — seeded from profile if analyzed, but user can override freely
  const profileRole = profile.isAnalyzed ? (profile.targetRole ?? 'Product Manager') : 'Product Manager'
  const [selectedRole, setSelectedRole] = useState(profileRole)

  // Keep in sync if the user's profile role changes (e.g. they re-analyze)
  useEffect(() => { setSelectedRole(profileRole) }, [profileRole])

  const targetRole = selectedRole
  const categories: InterviewCategory[] = getCategoriesForRole(targetRole)
  const categoryKeys = categories.map(c => c.key)

  const [activeKey, setActiveKey] = useState<string>(categoryKeys[0])
  const [indexByCategory, setIndexByCategory] = useState<Record<string, number>>(() =>
    Object.fromEntries(categoryKeys.map(k => [k, 0]))
  )
  const [showingResults, setShowingResults] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categoryKeys.map(k => [k, false]))
  )
  // Incrementing this forces the generation useEffect to re-run on manual retry
  const [retryCount, setRetryCount] = useState(0)

  // Reset active category and indexes when targetRole changes
  useEffect(() => {
    const keys = getCategoriesForRole(targetRole).map(c => c.key)
    setActiveKey(keys[0])
    setIndexByCategory(Object.fromEntries(keys.map(k => [k, 0])))
    setShowingResults(Object.fromEntries(keys.map(k => [k, false])))
  }, [targetRole])

  // Generate questions whenever targetRole changes or on manual retry.
  // Skip if questions are already cached for this role (persisted across navigation).
  useEffect(() => {
    if (aiInterview.generatedFor === targetRole && aiInterview.questions.length > 0) return

    let cancelled = false

    aiInterview.setLoading(true)
    aiInterview.setError(null)

    generateInterviewQuestions({
      targetRole,
      skillGaps: profile.isAnalyzed
        ? profile.skillGapItems.slice(0, 5).map(s => s.skill)
        : [],
      userId: `user_${Date.now()}`,
      categories: getCategoriesForRole(targetRole).map(c => ({
        key: c.key,
        label: c.label,
        description: c.promptDescription,
        count: c.questionCount,
      })),
    })
      .then(questions => {
        if (cancelled) return
        aiInterview.setQuestions(questions, targetRole)
        resetQuestions([])
      })
      .catch(err => {
        if (cancelled) return
        aiInterview.setError(err instanceof Error ? err.message : 'Failed to generate questions')
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRole, retryCount])

  // Source: AI if available for this role, else PM static questions (other roles show nothing until AI loads)
  const usingAI = aiInterview.generatedFor === targetRole && aiInterview.questions.length > 0
  const isPMRole = /product manager|associate product|senior product|group product|apm|gpm/i.test(targetRole)
  const activeQuestions: MCQQuestion[] = usingAI
    ? aiInterview.questions
    : isPMRole
    ? mcqQuestions
    : []

  const catQuestions = (key: string) => activeQuestions.filter(q => q.category === key)
  const currentCatQ = catQuestions(activeKey)
  const currentIndex = indexByCategory[activeKey] ?? 0
  const currentQuestion = currentCatQ[currentIndex] ?? currentCatQ[0]

  function catStats(key: string) {
    const qs = catQuestions(key)
    const answered = qs.filter(q => answers[q.id])
    const correct = answered.filter(q => answers[q.id]?.isCorrect)
    return { total: qs.length, answered: answered.length, correct: correct.length }
  }

  const totalAnswered = Object.keys(answers).length
  const totalCorrect = Object.values(answers).filter(a => a.isCorrect).length
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0

  function handleNext() {
    if (currentIndex < currentCatQ.length - 1)
      setIndexByCategory(p => ({ ...p, [activeKey]: currentIndex + 1 }))
  }

  function handlePrev() {
    if (currentIndex > 0)
      setIndexByCategory(p => ({ ...p, [activeKey]: currentIndex - 1 }))
  }

  function handleResetCategory() {
    const ids = currentCatQ.map(q => q.id)
    resetQuestions(ids)
    setIndexByCategory(p => ({ ...p, [activeKey]: 0 }))
    setShowingResults(p => ({ ...p, [activeKey]: false }))
  }

  function handleRegenerateAll() {
    aiInterview.resetAll()
    resetQuestions([])
    const keys = getCategoriesForRole(targetRole).map(c => c.key)
    setIndexByCategory(Object.fromEntries(keys.map(k => [k, 0])))
    setShowingResults(Object.fromEntries(keys.map(k => [k, false])))
    setRetryCount(n => n + 1)
  }

  const catQ = catStats(activeKey)
  const categoryAllAnswered = catQ.answered === catQ.total && catQ.total > 0
  const categoryComplete = categoryAllAnswered && showingResults[activeKey]

  const isLoading = aiInterview.isLoading
  const hasError = !!aiInterview.error

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Interview Prep</h1>
          <p className="text-muted mt-1 text-sm">
            MCQ quiz — answer to see instant feedback
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Role picker — works without needing to analyze a resume */}
          <RolePicker value={selectedRole} onChange={role => {
            aiInterview.resetAll()
            resetQuestions([])
            setSelectedRole(role)
            setRetryCount(n => n + 1)
          }} />

          {isLoading ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emer-tint border border-emer/30 text-xs text-emer font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating…
            </div>
          ) : usingAI ? (
            <button
              onClick={handleRegenerateAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emer-tint border border-emer/30 text-xs text-emer font-medium hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI · {activeQuestions.length}q · Refresh
            </button>
          ) : hasError ? (
            <button
              onClick={handleRegenerateAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-t border border-amber-w/30 text-xs text-amber-w hover:opacity-80 transition-opacity"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          ) : null}

          <div className="flex items-center gap-2 bg-paper border border-hair rounded-xl px-4 py-2 shadow-sm">
            <Target className="w-4 h-4 text-emer" />
            <div>
              <div className="text-[10px] text-faint font-semibold uppercase tracking-wide leading-none">Overall</div>
              <div className="text-sm font-bold text-ink leading-tight">
                {totalCorrect}/{totalAnswered}
                <span className="text-xs font-normal text-muted ml-1">
                  {totalAnswered > 0 ? `· ${overallAccuracy}% accuracy` : '· not started'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading banner ── */}
      {isLoading && (
        <div className="bg-emer-tint rounded-xl border border-emer/30 p-4 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-emer animate-spin shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emer-d">
              Generating {targetRole}-specific questions with AI…
            </p>
            <p className="text-xs text-emer mt-0.5">
              Tailored to your skill gaps and current {new Date().getFullYear()} market trends
              {isPMRole ? ' · Using static PM questions until ready' : ''}
            </p>
          </div>
        </div>
      )}

      {/* ── Category stat cards ── */}
      <div className={`grid gap-3 ${categories.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
        {categories.map(cat => {
          const stats = catStats(cat.key)
          const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
          const isActive = activeKey === cat.key

          return (
            <button
              key={cat.key}
              onClick={() => setActiveKey(cat.key)}
              className={`text-left p-3 rounded-xl border transition-all ${isActive ? cat.ring + ' shadow-sm' : 'border-hair bg-paper hover:bg-panel'}`}
            >
              <CategoryIcon iconKey={cat.iconKey} className={`w-4 h-4 ${cat.color} mb-1.5`} />
              <div className="text-xs font-bold text-ink leading-tight">{cat.label}</div>
              <div className="text-[10px] text-muted mt-0.5">
                <span className="font-semibold text-ink">{stats.correct}</span>
                /{stats.total || '…'} correct
              </div>
              <div className="mt-2 h-1.5 bg-panel2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.activeBg} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Quiz area ── */}
      <div>
        {/* Category header + dot nav */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {(() => {
              const cat = categories.find(c => c.key === activeKey)!
              return <CategoryIcon iconKey={cat.iconKey} className={`w-4 h-4 ${cat.color}`} />
            })()}
            <span className="text-sm font-bold text-ink">
              {categories.find(c => c.key === activeKey)?.label}
            </span>
            {catQ.total > 0 && (
              <span className="text-xs text-faint">
                {catQ.correct}/{catQ.total} correct
                {catQ.answered > 0 && (
                  <> · {Math.round((catQ.correct / catQ.answered) * 100)}% accuracy</>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {currentCatQ.map((q, i) => {
                const ans = answers[q.id]
                const isCur = i === currentIndex
                const dot = ans ? (ans.isCorrect ? 'bg-emer' : 'bg-amber-w') : isCur ? 'bg-emer' : 'bg-panel2'
                return (
                  <button
                    key={q.id}
                    onClick={() => setIndexByCategory(p => ({ ...p, [activeKey]: i }))}
                    className={`rounded-full transition-all ${isCur ? 'w-4 h-2.5' : 'w-2.5 h-2.5'} ${dot}`}
                    title={`Q${i + 1}`}
                  />
                )
              })}
            </div>
            {catQ.answered > 0 && (
              <button
                onClick={handleResetCategory}
                className="flex items-center gap-1 text-[10px] text-faint hover:text-muted transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        </div>

        {/* Complete state */}
        {categoryComplete ? (
          <div className="bg-paper rounded-2xl border border-hair shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-emer">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-1">
              {categories.find(c => c.key === activeKey)?.label} Complete
            </h3>
            <p className="text-muted text-sm mb-4">
              <span className="font-bold text-ink">{catQ.correct}/{catQ.total}</span> correct
              <span className="mx-2">·</span>
              <span className={`font-bold ${Math.round(catQ.correct / catQ.total * 100) >= 70 ? 'text-emer' : Math.round(catQ.correct / catQ.total * 100) >= 50 ? 'text-amber-w' : 'text-amber-w'}`}>
                {Math.round(catQ.correct / catQ.total * 100)}% accuracy
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {currentCatQ.map((q, i) => {
                const ans = answers[q.id]
                return (
                  <div key={q.id} className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-medium ${ans?.isCorrect ? 'bg-emer-tint border-emer/30 text-emer-d' : 'bg-amber-t border-amber-w/30 text-amber-w'}`}>
                    {ans?.isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Q{i + 1}
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={handleResetCategory} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-hair text-sm font-semibold text-muted hover:bg-panel transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Retry Category
              </button>
              {(() => {
                const idx = categories.findIndex(c => c.key === activeKey)
                const next = categories[idx + 1]
                return next ? (
                  <button onClick={() => setActiveKey(next.key)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emer text-white text-sm font-semibold hover:bg-emer-d transition-colors">
                    {next.label} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : null
              })()}
            </div>
          </div>

        ) : !isLoading && currentCatQ.length === 0 ? (
          /* No questions yet for this category */
          <div className="bg-paper rounded-2xl border border-hair shadow-sm p-10 text-center">
            {hasError ? (
              <>
                <AlertCircle className="w-10 h-10 text-amber-w mx-auto mb-3" />
                <p className="text-sm font-semibold text-ink mb-1">Could not generate questions</p>
                <p className="text-xs text-faint mb-4">{aiInterview.error}</p>
                <button onClick={handleRegenerateAll} className="px-4 py-2 rounded-lg bg-emer text-white text-xs font-semibold hover:bg-emer-d transition-colors">
                  Try again
                </button>
              </>
            ) : (
              <>
                <Sparkles className="w-10 h-10 text-emer/40 mx-auto mb-3" />
                <p className="text-sm text-muted">AI questions for this category will appear shortly…</p>
              </>
            )}
          </div>

        ) : currentQuestion ? (
          <>
            <MCQCard question={currentQuestion} index={currentIndex + 1} total={currentCatQ.length} />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-hair text-sm font-semibold text-muted hover:bg-panel disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>

              <span className="text-xs text-faint font-medium">
                {currentIndex + 1} / {currentCatQ.length}
              </span>

              {currentIndex < currentCatQ.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emer text-white text-sm font-semibold hover:bg-emer-d disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowingResults(p => ({ ...p, [activeKey]: true }))}
                  disabled={!categoryAllAnswered}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emer text-white text-sm font-semibold hover:bg-emer-d disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  See Results <Target className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
