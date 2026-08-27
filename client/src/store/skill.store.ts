import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SkillStatus = 'open' | 'in_progress' | 'done'

interface SkillStore {
  statuses: Record<string, SkillStatus>
  setStatus: (skill: string, status: SkillStatus) => void
}

export const useSkillStore = create<SkillStore>()(
  persist(
    (set) => ({
      statuses: {},
      setStatus: (skill, status) =>
        set(state => ({ statuses: { ...state.statuses, [skill]: status } })),
    }),
    { name: 'careeros-skills-v1' }
  )
)
