import { Router } from 'express'
import type { Request, Response } from 'express'
import { PDFParse } from 'pdf-parse'
import { analyzeProfile } from '../services/ai.service.js'
import type { ProfileAnalysis, VelocityPoint } from '../../../shared/types'

const router = Router()

async function extractPdfText(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer, verbosity: 0 })
  const result = await parser.getText()
  return result.text
}

function generateVelocityData(currentScore: number): VelocityPoint[] {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now)
    d.setMonth(d.getMonth() - (5 - i))
    const monthsAgo = 5 - i
    const jitter = Math.round(Math.random() * 4) - 2
    const score = monthsAgo === 0
      ? currentScore
      : Math.max(10, Math.round(currentScore - monthsAgo * 4 + jitter))
    return { month: monthNames[d.getMonth()], score }
  })
}

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      resumeBase64,
      mimeType = 'application/pdf',
      targetRole,
      linkedinUrl = '',
      userId = 'anonymous',
    } = req.body as {
      resumeBase64?: string
      mimeType?: string
      targetRole?: string
      linkedinUrl?: string
      userId?: string
    }

    if (!resumeBase64 || !targetRole) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'resumeBase64 and targetRole are required',
      })
      return
    }

    const buffer = Buffer.from(resumeBase64, 'base64')
    let resumeText: string

    if (mimeType.includes('pdf')) {
      resumeText = await extractPdfText(buffer)
    } else {
      resumeText = buffer.toString('utf-8')
    }

    if (!resumeText?.trim()) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'Could not extract text from the resume. Please upload a text-based PDF.',
      })
      return
    }

    const partial = await analyzeProfile(resumeText, targetRole, linkedinUrl, userId)
    const velocityData = generateVelocityData(partial.careerScore.overallScore)
    const analysis: ProfileAnalysis = { ...partial, velocityData }

    res.json({ success: true, data: analysis, error: null })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Profile analysis failed'
    console.error('[profile/analyze] ERROR:', msg)
    if (err instanceof Error && err.cause) console.error('[profile/analyze] cause:', err.cause)
    res.status(500).json({ success: false, data: null, error: msg })
  }
})

export default router
