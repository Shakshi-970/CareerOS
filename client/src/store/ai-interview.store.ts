import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MCQQuestion } from '../lib/interview-mcq'

interface AIInterviewStore {
  questions: MCQQuestion[]
  generatedFor: string | null  // targetRole these were generated for
  isLoading: boolean
  error: string | null
  setQuestions: (questions: MCQQuestion[], role: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearForRole: (role: string) => void
  resetAll: () => void
}

export const useAIInterviewStore = create<AIInterviewStore>()(
  persist(
    (set, get) => ({
      questions: [],
      generatedFor: null,
      isLoading: false,
      error: null,
      setQuestions: (questions, role) =>
        set({ questions, generatedFor: role, isLoading: false, error: null }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false }),
      clearForRole: (role) => {
        if (get().generatedFor === role) set({ questions: [], generatedFor: null })
      },
      resetAll: () => set({ questions: [], generatedFor: null, isLoading: false, error: null }),
    }),
    {
      name: 'careeros-ai-interview-v1',
      // Only persist questions + role. isLoading/error are transient.
      partialize: (state) => ({
        questions: state.questions,
        generatedFor: state.generatedFor,
      }),
    }
  )
)
