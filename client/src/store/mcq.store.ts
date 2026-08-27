import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OptionKey } from '../lib/interview-mcq'

interface MCQEntry {
  selected: OptionKey
  isCorrect: boolean
}

interface MCQStore {
  answers: Record<string, MCQEntry>
  submitAnswer: (questionId: string, selected: OptionKey, isCorrect: boolean) => void
  resetQuestions: (questionIds: string[]) => void
  resetAll: () => void
}

export const useMCQStore = create<MCQStore>()(
  persist(
    (set) => ({
      answers: {},
      submitAnswer: (questionId, selected, isCorrect) =>
        set(state => ({
          answers: { ...state.answers, [questionId]: { selected, isCorrect } },
        })),
      resetQuestions: (questionIds) =>
        set(state => {
          const next = { ...state.answers }
          questionIds.forEach(id => delete next[id])
          return { answers: next }
        }),
      resetAll: () => set({ answers: {} }),
    }),
    { name: 'careeros-mcq-v1' }
  )
)
