import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProfileAnalysis } from '../../../shared/types'
import type { SkillGapItem, LearningPhaseData } from '../lib/mock-data'

const VALID_PLATFORMS = ['Coursera', 'Udemy', 'YouTube', 'Microsoft Learn'] as const
type ValidPlatform = typeof VALID_PLATFORMS[number]

export type TargetTimeline = '3m' | '6m' | '1y'

export interface RoleEntry {
  role: string
  targetTimeline: TargetTimeline
  analysis: ProfileAnalysis | null
  skillGapItems: SkillGapItem[]
  learningPhases: LearningPhaseData[]
  analyzedAt: number | null
}

function toSkillGapItems(gaps: ProfileAnalysis['skillGaps']): SkillGapItem[] {
  return gaps.map(g => ({
    skill: g.skill,
    urgency: g.urgency,
    closability: g.closability,
    status: 'open' as const,
    marketDemandPercent: g.marketDemandPercent,
    estimatedHours: g.estimatedHours,
    recommendedResource: {
      platform: (VALID_PLATFORMS.includes(g.recommendedResource.platform as ValidPlatform)
        ? g.recommendedResource.platform
        : 'Coursera') as ValidPlatform,
      name: g.recommendedResource.name,
    },
    scoreImpact: g.scoreImpact,
  }))
}

function buildLearningPhases(items: SkillGapItem[], timeline: TargetTimeline = '6m'): LearningPhaseData[] {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const now = new Date()
  const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }

  // Phase boundaries per timeline
  let p1End: Date, p2Start: Date, p2End: Date, p3Start: Date, p3End: Date
  let p1Label: string, p2Label: string, p3Label: string

  if (timeline === '3m') {
    p1End = addDays(now, 30);  p2Start = addDays(p1End, 1)
    p2End = addDays(now, 60);  p3Start = addDays(p2End, 1)
    p3End = addDays(now, 90)
    p1Label = 'Month 1'; p2Label = 'Month 2'; p3Label = 'Month 3'
  } else if (timeline === '1y') {
    p1End = addDays(now, 90);  p2Start = addDays(p1End, 1)
    p2End = addDays(now, 180); p3Start = addDays(p2End, 1)
    p3End = addDays(now, 365)
    p1Label = 'Months 1–3'; p2Label = 'Months 4–6'; p3Label = 'Months 7–12'
  } else {
    // 6 months (default)
    p1End = addDays(now, 30);  p2Start = addDays(p1End, 1)
    p2End = addDays(now, 90);  p3Start = addDays(p2End, 1)
    p3End = addDays(now, 180)
    p1Label = 'Month 1'; p2Label = 'Months 2–3'; p3Label = 'Months 4–6'
  }

  // Sort by priority score (high urgency + high closability = highest priority)
  const priorityScore = (s: SkillGapItem) =>
    (s.urgency === 'high' ? 4 : s.urgency === 'medium' ? 2 : 0) +
    (s.closability === 'high' ? 2 : s.closability === 'medium' ? 1 : 0)

  const sorted = [...items].sort((a, b) => priorityScore(b) - priorityScore(a))
  const n = sorted.length

  // Distribute across 3 phases proportionally — never leave a phase empty
  const p1size = n > 0 ? Math.max(1, Math.ceil(n / 3)) : 0
  const p2size = n > p1size ? Math.max(1, Math.ceil((n - p1size) / 2)) : 0

  const p1 = sorted.slice(0, p1size).map(s => s.skill)
  const p2 = sorted.slice(p1size, p1size + p2size).map(s => s.skill)
  const p3 = sorted.slice(p1size + p2size).map(s => s.skill)

  return [
    { phase: 30,  label: p1Label, dateRange: `${fmt(now)} – ${fmt(p1End)}`,    skillNames: p1 },
    { phase: 90,  label: p2Label, dateRange: `${fmt(p2Start)} – ${fmt(p2End)}`, skillNames: p2 },
    { phase: 180, label: p3Label, dateRange: `${fmt(p3Start)} – ${fmt(p3End)}`, skillNames: p3 },
  ]
}

function buildRoleEntry(analysis: ProfileAnalysis, role: string, timeline: TargetTimeline = '6m'): RoleEntry {
  const skillGapItems = toSkillGapItems(analysis.skillGaps)
  const learningPhases = buildLearningPhases(skillGapItems, timeline)
  return { role, targetTimeline: timeline, analysis, skillGapItems, learningPhases, analyzedAt: Date.now() }
}

interface ProfileStore {
  // Legacy flat fields — always reflect the active role
  isAnalyzed: boolean
  analysis: ProfileAnalysis | null
  targetRole: string | null
  targetTimeline: TargetTimeline
  skillGapItems: SkillGapItem[]
  learningPhases: LearningPhaseData[]
  // Multi-role
  roles: RoleEntry[]
  activeRoleIndex: number
  linkedinUrl: string
  // Actions
  setAnalysis: (analysis: ProfileAnalysis, targetRole: string, timeline?: TargetTimeline) => void
  addRoleSlot: (role: string) => void
  setRoleAnalysis: (index: number, analysis: ProfileAnalysis, timeline?: TargetTimeline) => void
  setActiveRole: (index: number) => void
  removeRole: (index: number) => void
  setLinkedinUrl: (url: string) => void
  reset: () => void
}

function syncFromRole(entry: RoleEntry | undefined) {
  if (!entry || !entry.analysis) {
    return {
      isAnalyzed: false,
      analysis: null,
      targetRole: entry?.role ?? null,
      targetTimeline: (entry?.targetTimeline ?? '6m') as TargetTimeline,
      skillGapItems: [],
      learningPhases: [],
    }
  }
  return {
    isAnalyzed: true,
    analysis: entry.analysis,
    targetRole: entry.role,
    targetTimeline: entry.targetTimeline,
    skillGapItems: entry.skillGapItems,
    learningPhases: entry.learningPhases,
  }
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      isAnalyzed: false,
      analysis: null,
      targetRole: null,
      targetTimeline: '6m' as TargetTimeline,
      skillGapItems: [],
      learningPhases: [],
      roles: [],
      activeRoleIndex: 0,
      linkedinUrl: '',

      setAnalysis: (analysis, targetRole, timeline = '6m') => {
        const entry = buildRoleEntry(analysis, targetRole, timeline)
        const existingRoles = get().roles
        // Purge slots from a different person — keep only slots whose analysis
        // belongs to the same user (matching name) or has no analysis yet.
        const newName = analysis.userInfo.name.trim().toLowerCase()
        const samePersonSlots = existingRoles.slice(1).filter(r =>
          !r.analysis ||
          r.analysis.userInfo.name.trim().toLowerCase() === newName
        )
        const updatedRoles = [entry, ...samePersonSlots]
        set({
          ...syncFromRole(entry),
          roles: updatedRoles,
          activeRoleIndex: 0,
        })
      },

      addRoleSlot: (role) => {
        const roles = get().roles
        if (roles.length >= 3) return
        const slot: RoleEntry = { role, targetTimeline: get().targetTimeline, analysis: null, skillGapItems: [], learningPhases: [], analyzedAt: null }
        set({ roles: [...roles, slot] })
      },

      setRoleAnalysis: (index, analysis, timeline) => {
        const roles = [...get().roles]
        if (!roles[index]) return
        const tl = timeline ?? roles[index].targetTimeline ?? get().targetTimeline
        const entry = buildRoleEntry(analysis, roles[index].role, tl)
        roles[index] = entry
        const activeIdx = get().activeRoleIndex
        set({ roles, ...(index === activeIdx ? syncFromRole(entry) : {}) })
      },

      setActiveRole: (index) => {
        const roles = get().roles
        const entry = roles[index]
        if (!entry) return
        if (entry.analysis) {
          // Role is analyzed — full sync, dashboard updates to this role's data
          set({ activeRoleIndex: index, ...syncFromRole(entry) })
        } else {
          // Role not yet analyzed — only advance the pointer and update targetRole.
          // Preserve the existing analysis/score so the dashboard keeps showing real
          // data instead of reverting to sample data (Rahul Sharma).
          set({ activeRoleIndex: index, targetRole: entry.role })
        }
      },

      removeRole: (index) => {
        const roles = get().roles
        if (roles.length <= 1) return
        const newRoles = roles.filter((_, i) => i !== index)
        const activeIdx = get().activeRoleIndex
        const newActive = activeIdx >= newRoles.length ? newRoles.length - 1 : activeIdx === index ? 0 : activeIdx > index ? activeIdx - 1 : activeIdx
        // Find an analyzed role to display; prefer the new active, else any analyzed
        const displayEntry = newRoles[newActive]?.analysis ? newRoles[newActive] : newRoles.find(r => r.analysis)
        set({ roles: newRoles, activeRoleIndex: newActive, ...(displayEntry ? syncFromRole(displayEntry) : {}) })
      },

      setLinkedinUrl: (url) => set({ linkedinUrl: url }),

      reset: () => set({
        isAnalyzed: false, analysis: null, targetRole: null, targetTimeline: '6m',
        skillGapItems: [], learningPhases: [],
        roles: [], activeRoleIndex: 0, linkedinUrl: '',
      }),
    }),
    {
      name: 'careeros-profile-v2',
      partialize: (state) => ({
        isAnalyzed: state.isAnalyzed,
        analysis: state.analysis,
        targetRole: state.targetRole,
        targetTimeline: state.targetTimeline,
        skillGapItems: state.skillGapItems,
        learningPhases: state.learningPhases,
        roles: state.roles,
        activeRoleIndex: state.activeRoleIndex,
        linkedinUrl: state.linkedinUrl,
      }),
    }
  )
)
