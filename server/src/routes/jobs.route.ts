import { Router } from 'express'
import type { Request, Response } from 'express'
import { fetchJobsJSearch, fetchJobsSerpApi, scoreJob, inferCompanySize } from '../services/jobs.service.js'
import type { ScoredJob } from '../services/jobs.service.js'

const router = Router()

// In-memory cache — key: "role::location", expires after 30 min
const cache = new Map<string, { data: ScoredJob[]; cachedAt: number }>()
const CACHE_TTL = 1000 * 60 * 30

router.post('/search', async (req: Request, res: Response) => {
  try {
    const {
      targetRole,
      location = 'Bengaluru',
      userSkills = [],
      skillGaps = [],
    } = req.body as {
      targetRole?: string
      location?: string
      userSkills?: string[]
      skillGaps?: string[]
    }

    if (!targetRole?.trim()) {
      res.status(400).json({ success: false, data: null, error: 'targetRole is required' })
      return
    }

    const cacheKey = [
      targetRole.trim().toLowerCase(),
      location.trim().toLowerCase(),
      [...userSkills].sort().join('|').toLowerCase(),
      [...skillGaps].sort().join('|').toLowerCase(),
    ].join('::')
    const hit = cache.get(cacheKey)
    if (hit && Date.now() - hit.cachedAt < CACHE_TTL) {
      res.json({ success: true, data: hit.data, error: null, cached: true })
      return
    }

    // Use both indexes: either provider can miss good employers or return stale listings.
    const [jsearchResult, serpResult] = await Promise.allSettled([
      fetchJobsJSearch(targetRole, location),
      fetchJobsSerpApi(targetRole, location),
    ])
    const rawJobs = [
      ...(jsearchResult.status === 'fulfilled' ? jsearchResult.value : []),
      ...(serpResult.status === 'fulfilled' ? serpResult.value : []),
    ]

    if (jsearchResult.status === 'rejected') {
      console.warn('[jobs/search] JSearch failed:', (jsearchResult.reason as Error).message)
    }
    if (serpResult.status === 'rejected') {
      console.warn('[jobs/search] SerpApi failed:', (serpResult.reason as Error).message)
    }

    const uniqueJobs = Array.from(
      rawJobs.reduce((jobs, job) => {
        if (!job.title.trim() || !job.company.trim() || !job.applyUrl.trim()) return jobs
        const key = `${job.title.toLowerCase()}::${job.company.toLowerCase()}::${job.location.toLowerCase()}`
        const existing = jobs.get(key)
        if (!existing || Number(job.isDirectApply) > Number(existing.isDirectApply)) jobs.set(key, job)
        return jobs
      }, new Map<string, (typeof rawJobs)[number]>()).values()
    )

    // Prefer employer/ATS links, disclosed salary, freshness, then company size.
    const sizeRank = { large: 0, mid: 1, startup: 2 }
    uniqueJobs.sort((a, b) => {
      const aDirect = a.isDirectApply ? 0 : 1
      const bDirect = b.isDirectApply ? 0 : 1
      if (aDirect !== bDirect) return aDirect - bDirect
      const aSalary = a.salary !== 'Not disclosed' ? 0 : 1
      const bSalary = b.salary !== 'Not disclosed' ? 0 : 1
      if (aSalary !== bSalary) return aSalary - bSalary
      if (a.postedDaysAgo !== b.postedDaysAgo) return a.postedDaysAgo - b.postedDaysAgo
      return sizeRank[inferCompanySize(a.company)] - sizeRank[inferCompanySize(b.company)]
    })

    const toScore = uniqueJobs.slice(0, 8)

    if (toScore.length === 0) {
      res.json({ success: true, data: [], error: null })
      return
    }

    // Score all jobs in parallel with AI — individual failures fall back to defaults
    const scored = (
      await Promise.all(
        toScore.map(job =>
          scoreJob(job, userSkills, skillGaps, targetRole).catch((): ScoredJob => ({
            id: job.id,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            salaryRange: job.salary,
            applyUrl: job.applyUrl,
            isDirectApply: job.isDirectApply,
            matchScore: 50,
            isRemote: job.isRemote,
            postedDaysAgo: job.postedDaysAgo,
            companySize: 'mid',
            matchedSkills: [],
            gapSkills: [],
            whyFit: ['See job description for details'],
          }))
        )
      )
    )

    // Sort by match score descending
    const ranked = scored.sort((a, b) => b.matchScore - a.matchScore)

    cache.set(cacheKey, { data: ranked, cachedAt: Date.now() })

    res.json({ success: true, data: ranked, error: null })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Job search failed'
    console.error('[jobs/search]', msg)
    res.status(500).json({ success: false, data: null, error: msg })
  }
})

export default router
