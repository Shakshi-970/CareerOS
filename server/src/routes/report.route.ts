import { Router } from 'express'
import type { Request, Response } from 'express'
import { generateDnaReport } from '../services/ai.service.js'

const router = Router()

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { userProfile, targetRole, userId = 'anonymous' } = req.body as {
      userProfile: Record<string, unknown>
      targetRole: string
      userId?: string
    }

    if (!userProfile || !targetRole) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'userProfile and targetRole are required',
      })
      return
    }

    const report = await generateDnaReport(userProfile, targetRole, userId)
    res.json({ success: true, data: report, error: null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate report'
    const status = message.startsWith('Rate limit') ? 429 : 500
    res.status(status).json({ success: false, data: null, error: message })
  }
})

export default router
