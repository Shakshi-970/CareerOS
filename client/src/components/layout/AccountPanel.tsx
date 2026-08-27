import { useState } from 'react'
import {
  X, Target, Plus, Trash2, RefreshCw, LogOut, CheckCircle2,
  Loader, ChevronRight, User, MapPin, Briefcase, AlertTriangle,
} from 'lucide-react'
import { useProfileStore } from '@/store/profile.store'
import { useMCQStore } from '@/store/mcq.store'
import { useAIInterviewStore } from '@/store/ai-interview.store'
import { useAuthStore } from '@/store/auth.store'
import { analyzeProfile } from '@/lib/api'

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function scoreColor(score: number) {
  if (score >= 70) return 'bg-emer-tint text-emer-d border-emer/30'
  if (score >= 50) return 'bg-amber-t text-amber-w border-amber-w/30'
  return 'bg-panel2 text-muted border-hair'
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function AccountPanel({ isOpen, onClose }: Props) {
  const profile = useProfileStore()
  const resetMCQ = useMCQStore(s => s.resetAll)
  const resetAIInterview = useAIInterviewStore(s => s.resetAll)
  const { user: authUser, signOut } = useAuthStore()

  const [addingRole, setAddingRole] = useState(false)
  const [newRole, setNewRole] = useState('')
  const [analyzingIndex, setAnalyzingIndex] = useState<number | null>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Identity always comes from the primary (first) analyzed role — the person
  // doesn't change based on which target role is selected.
  const primaryEntry = profile.roles.find(r => r.analysis) ?? null

  const displayName = primaryEntry
    ? primaryEntry.analysis!.userInfo.name
    : 'Your Account'

  const currentRole = primaryEntry
    ? primaryEntry.analysis!.userInfo.currentRole
    : 'Not analyzed yet'

  const location = primaryEntry
    ? primaryEntry.analysis!.userInfo.location
    : ''

  function handleAddRole() {
    if (!newRole.trim() || profile.roles.length >= 3) return
    profile.addRoleSlot(newRole.trim())
    setNewRole('')
    setAddingRole(false)
  }

  async function handleAnalyzeRole(index: number) {
    const storedBase64 = sessionStorage.getItem('careeros_resume_b64')
    if (!storedBase64) {
      setAnalyzeError('Resume not found in session. Please re-upload your resume from the Connect page.')
      return
    }

    const role = profile.roles[index]?.role
    if (!role) return

    setAnalyzingIndex(index)
    setAnalyzeError(null)

    try {
      const analysis = await analyzeProfile({
        resumeBase64: storedBase64,
        mimeType: 'application/pdf',
        targetRole: role,
        linkedinUrl: profile.linkedinUrl || undefined,
        userId: `user_${Date.now()}`,
      })
      profile.setRoleAnalysis(index, analysis)
    } catch (err: unknown) {
      // Extract actual server error message from axios response if available
      const axiosMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      const fallback = err instanceof Error ? err.message : 'Analysis failed.'
      const msg = axiosMsg ?? fallback
      // Surface rate-limit errors with a helpful hint
      setAnalyzeError(
        msg.toLowerCase().includes('rate') || msg.includes('429')
          ? 'Too many requests — please wait 30 seconds and try again.'
          : msg
      )
    } finally {
      setAnalyzingIndex(null)
    }
  }

  function handleSignOut() {
    signOut()
    onClose()
    window.location.href = '/login'
  }

  function handleReset() {
    profile.reset()
    resetMCQ()
    resetAIInterview()
    signOut()
    sessionStorage.removeItem('careeros_resume_b64')
    setShowResetConfirm(false)
    onClose()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-30 hidden lg:block"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-paper shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hair">
          <span className="text-sm font-bold text-ink">Account</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-faint hover:bg-slate-100 hover:text-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* User card */}
          <div className="px-5 py-5 border-b border-hair">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-emer flex items-center justify-center text-white text-xl font-bold shrink-0">
                {getInitials(displayName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-ink truncate">{displayName}</div>
                <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                  <Briefcase className="w-3 h-3 shrink-0" />
                  <span className="truncate">{currentRole}</span>
                </div>
                {location && (
                  <div className="flex items-center gap-1 text-xs text-faint mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>

            {profile.isAnalyzed && (
              <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${scoreColor(profile.analysis!.careerScore.overallScore)}`}>
                <Target className="w-3.5 h-3.5" />
                Career Score: {profile.analysis!.careerScore.overallScore} / 100
              </div>
            )}
          </div>

          {/* Target Roles */}
          <div className="px-5 py-4 border-b border-hair">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                Target Roles
              </span>
              <span className="text-[10px] text-faint">{profile.roles.length}/3 max</span>
            </div>

            {profile.roles.length === 0 ? (
              <p className="text-xs text-faint py-2">
                No roles set. Upload your resume to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {profile.roles.map((entry, idx) => {
                  const isActive = idx === profile.activeRoleIndex
                  const isAnalyzedActive = isActive && !!entry.analysis
                  const isPendingActive = isActive && !entry.analysis
                  const score = entry.analysis?.careerScore.overallScore

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border p-3 transition-all ${
                        isActive
                          ? isPendingActive
                            ? 'border-amber-w/30 bg-amber-t'
                            : 'border-emer/40 bg-emer-tint'
                          : 'border-hair bg-paper'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Radio — clicking unanalyzed role is safe: store preserves existing analysis */}
                        <button
                          onClick={() => profile.setActiveRole(idx)}
                          disabled={isActive}
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                          style={{ borderColor: isActive ? (isPendingActive ? '#C05A12' : '#0E7A5A') : '#DCE0E4' }}
                        >
                          {isActive && <div className={`w-2 h-2 rounded-full ${isPendingActive ? 'bg-amber-w' : 'bg-emer'}`} />}
                        </button>

                        <span className="flex-1 text-sm font-semibold text-ink truncate">
                          {entry.role}
                        </span>

                        {score !== undefined ? (
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor(score)}`}>
                            {score}
                          </span>
                        ) : analyzingIndex === idx ? (
                          <Loader className="w-4 h-4 text-emer animate-spin" />
                        ) : (
                          <span className="text-[10px] text-faint">Not analyzed</span>
                        )}

                        {profile.roles.length > 1 && (
                          <button
                            onClick={() => profile.removeRole(idx)}
                            className="w-6 h-6 rounded flex items-center justify-center text-faint hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Notice: active role not yet analyzed — dashboard is showing another role's data */}
                      {isPendingActive && analyzingIndex !== idx && (
                        <p className="text-[10px] text-amber-w mt-1.5 leading-tight">
                          Dashboard is showing your previous role's data. Analyze to load {entry.role} results.
                        </p>
                      )}

                      {analyzingIndex !== idx && (
                        <button
                          onClick={() => handleAnalyzeRole(idx)}
                          className={`mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            entry.analysis
                              ? 'border border-hair text-muted hover:bg-panel bg-paper'
                              : isPendingActive
                                ? 'bg-amber-w hover:bg-[#9E4A0E] text-white'
                                : 'bg-emer hover:bg-emer-d text-white'
                          }`}
                        >
                          <RefreshCw className="w-3 h-3" />
                          {entry.analysis ? 'Re-analyze' : 'Analyze for this role'}
                        </button>
                      )}

                      {/* Switch button: only for analyzed, non-active roles */}
                      {isAnalyzedActive === false && entry.analysis && !isActive && (
                        <button
                          onClick={() => { profile.setActiveRole(idx); onClose() }}
                          className="mt-2 w-full flex items-center justify-center gap-1 py-1 rounded-lg text-xs font-medium text-emer hover:bg-emer-tint transition-colors"
                        >
                          Switch to this role <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {analyzeError && (
              <div className="mt-2 flex items-start gap-1.5 p-2 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{analyzeError}</p>
              </div>
            )}

            {/* Add role */}
            {profile.roles.length < 3 && (
              <div className="mt-3">
                {addingRole ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAddRole(); if (e.key === 'Escape') setAddingRole(false) }}
                      placeholder="e.g. Data Analyst"
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-hair focus:outline-none focus:border-emer"
                    />
                    <button
                      onClick={handleAddRole}
                      disabled={!newRole.trim()}
                      className="px-3 py-2 rounded-lg bg-emer text-white text-xs font-semibold hover:bg-emer-d disabled:opacity-40 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setAddingRole(false); setNewRole('') }}
                      className="px-2 py-2 rounded-lg border border-hair text-xs text-muted hover:bg-panel transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingRole(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-hair text-xs font-medium text-muted hover:border-emer/50 hover:text-emer hover:bg-emer-tint transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Target Role
                  </button>
                )}
              </div>
            )}
          </div>

          {/* LinkedIn */}
          {profile.linkedinUrl && (
            <div className="px-5 py-4 border-b border-hair">
              <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2">LinkedIn</div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <CheckCircle2 className="w-4 h-4 text-emer shrink-0" />
                <span className="truncate">{profile.linkedinUrl}</span>
              </div>
            </div>
          )}

          {/* Profile actions */}
          <div className="px-5 py-4 border-b border-hair">
            <div className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Settings</div>
            <a
              href="/connect"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-panel transition-colors"
            >
              <User className="w-4 h-4 text-faint" />
              Re-upload resume / Re-analyze
            </a>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-panel transition-colors mt-1"
            >
              <LogOut className="w-4 h-4 text-faint" />
              Sign out{authUser ? ` (${authUser.provider === 'google' ? 'Google' : authUser.email})` : ''}
            </button>
          </div>

          {/* Danger zone */}
          <div className="px-5 py-4">
            <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Danger Zone</div>
            {showResetConfirm ? (
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <p className="text-xs text-red-700 mb-3 font-medium">
                  This will delete all your profile data, scores, and progress. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-2 rounded-lg border border-hair text-xs text-muted hover:bg-panel transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Reset Profile & Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
