import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Link2, Target, CheckCircle2, Upload, ArrowRight,
  ArrowLeft, Zap, AlertCircle, X, ChevronDown, Search, MapPin,
} from 'lucide-react'
import { analyzeProfile } from '@/lib/api'
import { useProfileStore } from '@/store/profile.store'
import { JOB_ROLE_CATEGORIES, INDIAN_CITIES } from '@/lib/career-data'

type Step = 1 | 2 | 3

const steps = [
  { num: 1 as Step, label: 'Resume', icon: FileText },
  { num: 2 as Step, label: 'LinkedIn', icon: Link2 },
  { num: 3 as Step, label: 'Target Role', icon: Target },
]

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const analyzeSteps = [
  'Parsing resume',
  'Extracting skills',
  'Scoring readiness',
  'Mapping skill gaps',
  'Building roadmap',
]

// ─── Role multi-select dropdown ─────────────────────────────────────────────
function RoleSelector({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (roles: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = JOB_ROLE_CATEGORIES
    .map(cat => ({
      ...cat,
      roles: cat.roles.filter(r =>
        !query || r.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter(cat => cat.roles.length > 0)

  // Flat list for keyboard nav
  const flatFiltered = filtered.flatMap(c => c.roles)

  function toggle(role: string) {
    if (selected.includes(role)) {
      onChange(selected.filter(r => r !== role))
    } else if (selected.length < 3) {
      onChange([...selected, role])
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && flatFiltered.length > 0) {
      toggle(flatFiltered[0])
      setQuery('')
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((role, i) => (
            <span
              key={role}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                i === 0
                  ? 'bg-emer-tint text-emer-d border-emer/30'
                  : 'bg-panel2 text-slate-w border-hair'
              }`}
            >
              {i === 0 && <span className="text-[9px] uppercase tracking-wide opacity-60 mr-0.5">Primary</span>}
              {role}
              <button onClick={() => toggle(role)} className="hover:opacity-70 transition-opacity">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <button
        type="button"
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50) }}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
          open ? 'border-emer ring-1 ring-emer/10' : 'border-hair hover:border-emer/40'
        } ${selected.length >= 3 ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        disabled={selected.length >= 3}
      >
        <Search className="w-4 h-4 text-faint shrink-0" />
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search roles…"
            className="flex-1 outline-none text-ink bg-transparent placeholder-faint"
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-left text-faint">
            {selected.length >= 3 ? '3 roles selected (max)' : 'Select role(s) — up to 3'}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-faint shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && selected.length < 3 && (
        <div className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-hair rounded-xl shadow-lg">
          {filtered.length === 0 ? (
            <p className="text-xs text-faint text-center py-6">No roles found</p>
          ) : (
            filtered.map(cat => (
              <div key={cat.category}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-faint uppercase tracking-widest bg-panel border-b border-gray-100 sticky top-0">
                  {cat.category}
                </div>
                {cat.roles.map(role => {
                  const isSelected = selected.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { toggle(role); setQuery(''); if (selected.length + 1 >= 3) setOpen(false) }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-emer-tint text-emer-d font-medium'
                          : 'text-muted hover:bg-panel hover:text-ink'
                      }`}
                    >
                      {role}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emer shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── City dropdown ───────────────────────────────────────────────────────────
function CitySelector({
  value,
  onChange,
}: {
  value: string
  onChange: (city: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = INDIAN_CITIES.filter(c =>
    !query || c.city.toLowerCase().includes(query.toLowerCase()) ||
    c.state.toLowerCase().includes(query.toLowerCase())
  )

  function select(city: string) {
    onChange(city)
    setOpen(false)
    setQuery('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && filtered.length > 0) select(filtered[0].city)
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50) }}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm text-left transition-colors ${
          open ? 'border-emer ring-1 ring-emer/10' : 'border-hair hover:border-emer/40'
        }`}
      >
        <MapPin className="w-4 h-4 text-faint shrink-0" />
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search city…"
            className="flex-1 outline-none text-ink bg-transparent placeholder-faint"
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={`flex-1 ${value ? 'text-ink' : 'text-faint'}`}>
            {value || 'Select your city'}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-faint shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-hair rounded-xl shadow-lg">
          {filtered.length === 0 ? (
            <p className="text-xs text-faint text-center py-4">No cities found</p>
          ) : (
            filtered.map(c => (
              <button
                key={c.city}
                type="button"
                onClick={() => select(c.city)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                  value === c.city ? 'bg-emer-tint text-emer-d font-medium' : 'text-muted hover:bg-panel hover:text-ink'
                }`}
              >
                <span>{c.city}</span>
                {c.state && <span className="text-xs text-faint">{c.state}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ConnectPage ────────────────────────────────────────────────────────
export function ConnectPage() {
  const navigate = useNavigate()
  const profileStore = useProfileStore()

  const [step, setStep] = useState<Step>(1)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [linkedinConnected, setLinkedinConnected] = useState(false)
  const [targetRoles, setTargetRoles] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [timeline, setTimeline] = useState<'3m' | '6m' | '1y'>('6m')
  const [isDragging, setIsDragging] = useState(false)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) { setResumeFile(file); setResumeUploaded(true) }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) { setResumeFile(file); setResumeUploaded(true) }
  }

  function clearResume() { setResumeFile(null); setResumeUploaded(false) }

  function handleLinkedinEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && linkedinUrl.trim()) setLinkedinConnected(true)
  }

  async function handleFinishSetup() {
    if (!resumeFile || targetRoles.length === 0) return
    setIsAnalyzing(true)
    setAnalyzeError(null)

    try {
      const base64 = await readFileAsBase64(resumeFile)
      // Store in sessionStorage for re-analysis of additional roles from AccountPanel
      sessionStorage.setItem('careeros_resume_b64', base64)

      // Analyze primary role first
      const primaryRole = targetRoles[0]
      const mimeType = resumeFile.name.toLowerCase().endsWith('.pdf')
        ? 'application/pdf'
        : (resumeFile.type || 'application/pdf')
      const analysis = await analyzeProfile({
        resumeBase64: base64,
        mimeType,
        targetRole: primaryRole,
        linkedinUrl: linkedinConnected ? linkedinUrl : undefined,
        userId: `user_${Date.now()}`,
      })

      // Store LinkedIn URL
      if (linkedinConnected && linkedinUrl) {
        profileStore.setLinkedinUrl(linkedinUrl)
      }

      // Set primary analysis with selected timeline
      profileStore.setAnalysis(analysis, primaryRole, timeline)

      // Add additional role slots (not analyzed yet)
      targetRoles.slice(1).forEach(role => {
        profileStore.addRoleSlot(role)
      })

      navigate('/dashboard')
    } catch (err) {
      const axiosMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      const fallback = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setAnalyzeError(axiosMsg ?? fallback)
      setIsAnalyzing(false)
    }
  }

  const timelineLabels: Record<string, string> = { '3m': '3 months', '6m': '6 months', '1y': '1 year' }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-panel flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-full border-4 border-emer/20 border-t-emer animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-7 h-7 text-emer" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ink mb-1">Analysing your profile with AI…</h2>
            <p className="text-muted text-sm">
              Building your <span className="font-medium">{targetRoles[0]}</span> roadmap
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {analyzeSteps.map((s, i) => (
              <span
                key={s}
                className="text-xs bg-panel2 text-muted px-3 py-1.5 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              >
                {s}
              </span>
            ))}
          </div>
          {targetRoles.length > 1 && (
            <p className="text-xs text-faint">
              {targetRoles.slice(1).join(', ')} can be analyzed from your Account panel after setup
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-panel flex flex-col">
      {/* Top bar */}
      <div className="bg-paper border-b border-hair px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emer" />
          <span className="font-bold text-ink">CareerOS</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-xs text-faint hover:text-muted">
          Skip setup →
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step === s.num
                        ? 'bg-emer text-white'
                        : step > s.num
                        ? 'bg-emer text-white'
                        : 'bg-panel2 text-faint'
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === s.num ? 'text-ink' : 'text-faint'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > s.num ? 'bg-emer/30' : 'bg-panel2'}`} />
                )}
              </div>
            ))}
          </div>

          {/* ─ Step 1: Resume ─ */}
          {step === 1 && (
            <div className="bg-paper rounded-2xl border border-hair shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-emer-tint flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emer" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">Upload your resume</h2>
                  <p className="text-xs text-muted">PDF · CareerOS AI will parse and analyse it</p>
                </div>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`mt-6 border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging ? 'border-emer bg-emer-tint'
                    : resumeUploaded ? 'border-emer/40 bg-emer-tint'
                    : 'border-hair bg-panel hover:border-emer/40'
                }`}
              >
                {resumeUploaded && resumeFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-emer" />
                    <p className="text-sm font-semibold text-ink">{resumeFile.name}</p>
                    <p className="text-xs text-emer">
                      {(resumeFile.size / 1024).toFixed(0)} KB · Ready to analyse
                    </p>
                    <button onClick={clearResume} className="text-xs text-faint hover:text-muted mt-1">
                      Remove and re-upload
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-faint" />
                    <p className="text-sm text-muted">Drag & drop your resume here</p>
                    <p className="text-xs text-faint">or</p>
                    <label className="cursor-pointer px-4 py-2 bg-emer text-white text-xs font-semibold rounded-lg hover:bg-emer-d transition-colors">
                      Browse files
                      <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
                    </label>
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!resumeUploaded}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emer text-white text-sm font-semibold hover:bg-emer-d transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ─ Step 2: LinkedIn ─ */}
          {step === 2 && (
            <div className="bg-paper rounded-2xl border border-hair shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-emer-tint flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-emer" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">Connect LinkedIn</h2>
                  <p className="text-xs text-muted">Boosts your Digital Presence score (optional)</p>
                </div>
              </div>

              {linkedinConnected ? (
                <div className="mt-6 flex items-center gap-3 p-4 bg-emer-tint rounded-xl border border-emer/30">
                  <CheckCircle2 className="w-6 h-6 text-emer shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-ink break-all">{linkedinUrl}</p>
                    <p className="text-xs text-emer">LinkedIn profile connected ✓</p>
                  </div>
                  <button
                    onClick={() => setLinkedinConnected(false)}
                    className="ml-auto text-xs text-faint hover:text-muted shrink-0"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <label className="text-xs font-semibold text-muted block mb-1.5">
                    Your LinkedIn profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    onKeyDown={handleLinkedinEnter}
                    className="w-full px-3 py-2.5 rounded-lg border border-hair text-sm text-ink placeholder-faint focus:outline-none focus:border-emer focus:ring-1 focus:ring-emer/10"
                  />
                  <p className="text-xs text-faint">
                    Press Enter or click Connect · We store only the URL for scoring
                  </p>
                  <button
                    onClick={() => { if (linkedinUrl.trim()) setLinkedinConnected(true) }}
                    disabled={!linkedinUrl.trim()}
                    className="w-full py-2.5 rounded-lg bg-emer text-white text-sm font-semibold hover:bg-emer-d transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Connect LinkedIn
                  </button>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-hair text-sm text-muted hover:bg-panel hover:text-ink transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emer text-white text-sm font-semibold hover:bg-emer-d transition-colors"
                >
                  {linkedinConnected ? 'Continue' : 'Skip for now'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─ Step 3: Target roles + location ─ */}
          {step === 3 && (
            <div className="bg-paper rounded-2xl border border-hair shadow-sm p-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-emer-tint flex items-center justify-center">
                  <Target className="w-5 h-5 text-emer" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-ink">Set your target role(s)</h2>
                  <p className="text-xs text-muted">
                    Select 1–3 roles · CareerOS will analyse your fit for each
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-muted">
                      Target Role(s)
                    </label>
                    <span className="text-[10px] text-faint">{targetRoles.length}/3 selected</span>
                  </div>
                  <RoleSelector selected={targetRoles} onChange={setTargetRoles} />
                  {targetRoles.length > 1 && (
                    <p className="text-[10px] text-faint mt-1">
                      Your primary role (first selected) will be analysed immediately. Others can be analysed from the Account panel.
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-2">
                    Target timeline
                  </label>
                  <div className="flex gap-2">
                    {(['3m', '6m', '1y'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setTimeline(t)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                          timeline === t
                            ? 'bg-emer text-white border-emer'
                            : 'bg-white text-muted border-gray-200 hover:bg-panel'
                        }`}
                      >
                        {timelineLabels[t]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted block mb-1.5">
                    Your city
                  </label>
                  <CitySelector value={location} onChange={setLocation} />
                </div>
              </div>

              {analyzeError && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-amber-t rounded-lg border border-amber-w/30">
                  <AlertCircle className="w-4 h-4 text-amber-w shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-w">{analyzeError}</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-hair text-sm text-muted hover:bg-panel hover:text-ink transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleFinishSetup}
                  disabled={targetRoles.length === 0 || !resumeFile}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emer text-white text-sm font-semibold hover:bg-emer-d transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Analyse My Profile <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-faint mt-4">
            You can add more roles or update settings from the Account panel later
          </p>
        </div>
      </div>
    </div>
  )
}
