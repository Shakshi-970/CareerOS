import axios from 'axios'
import type { ApiResponse, DnaReport, ProfileAnalysis } from '../../../shared/types'
import type { MCQQuestion } from './interview-mcq'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
})

export async function analyzeProfile(payload: {
  resumeBase64: string
  mimeType: string
  targetRole: string
  linkedinUrl?: string
  userId?: string
}): Promise<ProfileAnalysis> {
  const { data } = await http.post<ApiResponse<ProfileAnalysis>>(
    '/api/v1/profile/analyze',
    payload
  )
  if (!data.success || !data.data) {
    throw new Error(data.error ?? 'Profile analysis failed')
  }
  return data.data
}

interface CategorySpec {
  key: string
  label: string
  description: string
  count: number
}

export async function generateInterviewQuestions(payload: {
  targetRole: string
  skillGaps?: string[]
  userId?: string
  categories?: CategorySpec[]
}): Promise<MCQQuestion[]> {
  try {
    const { data } = await http.post<ApiResponse<MCQQuestion[]>>(
      '/api/v1/interview/questions',
      payload
    )
    if (!data.success || !data.data) {
      throw new Error(data.error ?? 'Question generation failed')
    }
    return data.data
  } catch (err: unknown) {
    const serverMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
    if (serverMsg) throw new Error(serverMsg)
    throw err
  }
}

export async function generateDnaReport(payload: {
  userProfile: Record<string, unknown>
  targetRole: string
  userId?: string
}): Promise<DnaReport> {
  const { data } = await http.post<ApiResponse<DnaReport>>('/api/v1/report/generate', payload)
  if (!data.success || !data.data) {
    throw new Error(data.error ?? 'Report generation failed')
  }
  return data.data
}
