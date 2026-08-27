import { create } from 'zustand'

interface InterviewStore {
  practiced: Record<string, boolean>
  toggle: (questionId: string) => void
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  practiced: {},
  toggle: (id) =>
    set(state => ({ practiced: { ...state.practiced, [id]: !state.practiced[id] } })),
}))
