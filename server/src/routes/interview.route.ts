import { Router } from 'express'
import type { Request, Response } from 'express'
import OpenAI from 'openai'

const router = Router()

// ---------------------------------------------------------------------------
// Groq client — getClient / getModel are not exported from ai.service, so
// we inline them here following the same lazy-init pattern.
// ---------------------------------------------------------------------------
let _client: OpenAI | null = null
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY ?? '',
      baseURL: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
    })
  }
  return _client
}

function getModel(): string {
  return process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant'
}

// ---------------------------------------------------------------------------
// Module-level rate limit map — 1 call per user per 60 s
// checkRateLimit in ai.service is not exported, so we maintain our own map.
// ---------------------------------------------------------------------------
const interviewRateLimitMap = new Map<string, number>()

function checkInterviewRateLimit(userId: string): boolean {
  const key = `interview:${userId}`
  const last = interviewRateLimitMap.get(key) ?? 0
  if (Date.now() - last < 60_000) return false
  interviewRateLimitMap.set(key, Date.now())
  return true
}

// ---------------------------------------------------------------------------
// Types — mirrored from client/src/lib/interview-mcq.ts (not imported
// server-side to keep the boundary clean).
// ---------------------------------------------------------------------------

/** Dynamic category spec supplied by the client (or defaulted server-side). */
interface CategorySpec {
  key: string         // e.g. "machine_learning"
  label: string       // e.g. "ML & Statistics"
  description: string // e.g. "ML algorithms, model selection, bias/variance, regularization"
  count: number       // target question count for this category
}

/** Default PM-focused categories — used when the client sends no `categories`. */
const DEFAULT_CATEGORIES: CategorySpec[] = [
  { key: 'behavioral',     label: 'Behavioral',     description: 'Leadership, teamwork, conflict resolution, STAR method',                              count: 3 },
  { key: 'product_design', label: 'Product Design', description: 'Feature design, user journeys, north star metrics, PRD thinking',                    count: 3 },
  { key: 'estimation',     label: 'Estimation',     description: 'Market sizing, back-of-envelope calculations, Fermi problems',                        count: 2 },
  { key: 'strategy',       label: 'Strategy',       description: 'GTM, competitive analysis, OKRs, business model thinking',                            count: 3 },
]

// MCQCategory is now dynamic — any string key is valid.
type MCQCategory = string
type Difficulty = 'easy' | 'medium' | 'hard'
type OptionKey = 'A' | 'B' | 'C' | 'D'

interface MCQOption {
  key: OptionKey
  text: string
}

interface MCQQuestion {
  id: string
  category: MCQCategory
  difficulty: Difficulty
  concept: string
  question: string
  options: MCQOption[]
  correct: OptionKey
  explanation: string
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------
const VALID_DIFFICULTIES = new Set<string>(['easy', 'medium', 'hard'])
const VALID_OPTION_KEYS = new Set<string>(['A', 'B', 'C', 'D'])

/**
 * Validate a raw question object.
 * @param raw           - unknown value from the AI response
 * @param validCategoryKeys - Set of accepted category key strings (dynamic per request)
 */
function isValidMCQQuestion(raw: unknown, validCategoryKeys: Set<string>): raw is MCQQuestion {
  if (typeof raw !== 'object' || raw === null) return false
  const q = raw as Record<string, unknown>

  if (typeof q.id !== 'string' || !q.id) return false
  if (!validCategoryKeys.has(q.category as string)) return false
  if (!VALID_DIFFICULTIES.has(q.difficulty as string)) return false
  if (typeof q.concept !== 'string' || !q.concept) return false
  if (typeof q.question !== 'string' || !q.question) return false
  if (!VALID_OPTION_KEYS.has(q.correct as string)) return false
  if (typeof q.explanation !== 'string' || !q.explanation) return false

  if (!Array.isArray(q.options) || q.options.length !== 4) return false
  for (const opt of q.options) {
    if (typeof opt !== 'object' || opt === null) return false
    const o = opt as Record<string, unknown>
    if (!VALID_OPTION_KEYS.has(o.key as string)) return false
    if (typeof o.text !== 'string' || !o.text) return false
  }

  return true
}

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildInterviewPrompt(
  targetRole: string,
  skillGaps: string[],
  categories: CategorySpec[],
): string {
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0)
  const categoryEnum = categories.map((c) => `"${c.key}"`).join(' | ')
  const keyList = categories.map((c) => `"${c.key}"`).join(', ')

  const gapList = skillGaps.length > 0
    ? skillGaps.map((g, i) => `${i + 1}. ${g}`).join('\n')
    : `Infer the key skill gaps a ${targetRole} interviewer would test.`

  const distributionLines = categories
    .map((c) => `  "${c.key}": ${c.count} questions — ${c.description}`)
    .join('\n')

  return `Generate exactly ${totalCount} MCQ questions for a "${targetRole}" interview.

CATEGORY KEYS (use exactly as shown — no variations):
Valid: ${keyList}

COUNTS PER CATEGORY:
${distributionLines}

SKILL GAPS TO COVER (at least one question each):
${gapList}

RULES:
- Questions must be role-specific and scenario-based (not generic)
- Set scenarios in Indian companies: Zomato, PhonePe, Swiggy, CRED, Razorpay, Meesho, Flipkart, Paytm, etc.
- Wrong options must be plausible misconceptions, not obviously silly
- Mix difficulty: roughly equal easy / medium / hard
- Explanation: 1-2 sentences — why the correct answer is right and why the top distractor is wrong

OUTPUT: a JSON object with key "questions" containing an array of exactly ${totalCount} items.
Each item must follow this structure exactly:
{"id":"snake_case_id","category":${categoryEnum},"difficulty":"easy"|"medium"|"hard","concept":"2-3 word label","question":"question text","options":[{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],"correct":"A"|"B"|"C"|"D","explanation":"1-2 sentences"}`
}

// ---------------------------------------------------------------------------
// CategorySpec runtime guard
// ---------------------------------------------------------------------------
function isValidCategorySpec(raw: unknown): raw is CategorySpec {
  if (typeof raw !== 'object' || raw === null) return false
  const c = raw as Record<string, unknown>
  return (
    typeof c.key === 'string' && c.key.trim().length > 0 &&
    typeof c.label === 'string' && c.label.trim().length > 0 &&
    typeof c.description === 'string' && c.description.trim().length > 0 &&
    typeof c.count === 'number' && Number.isInteger(c.count) && c.count > 0
  )
}

// ---------------------------------------------------------------------------
// POST /questions
// ---------------------------------------------------------------------------
router.post('/questions', async (req: Request, res: Response) => {
  try {
    const { targetRole, skillGaps, userId = 'anonymous', categories } = req.body as {
      targetRole?: unknown
      skillGaps?: unknown
      userId?: string
      categories?: unknown
    }

    if (typeof targetRole !== 'string' || !targetRole.trim()) {
      res.status(400).json({
        success: false,
        data: null,
        error: 'targetRole is required and must be a non-empty string',
      })
      return
    }

    const normalizedSkillGaps: string[] = Array.isArray(skillGaps)
      ? (skillGaps as unknown[]).filter(
          (g): g is string => typeof g === 'string' && g.trim().length > 0
        )
      : []

    // Resolve categories: validate client-supplied array or fall back to defaults.
    let resolvedCategories: CategorySpec[]
    if (categories !== undefined) {
      if (!Array.isArray(categories)) {
        res.status(400).json({
          success: false,
          data: null,
          error: '`categories` must be an array of CategorySpec objects',
        })
        return
      }
      const invalid = (categories as unknown[]).findIndex((c) => !isValidCategorySpec(c))
      if (invalid !== -1) {
        res.status(400).json({
          success: false,
          data: null,
          error: `categories[${invalid}] is invalid — each entry must have key (string), label (string), description (string), and count (positive integer)`,
        })
        return
      }
      resolvedCategories = categories as CategorySpec[]
    } else {
      resolvedCategories = DEFAULT_CATEGORIES
    }

    // Build the set of valid category keys for this request.
    const validCategoryKeys = new Set<string>(resolvedCategories.map((c) => c.key))

    if (!checkInterviewRateLimit(userId)) {
      res.status(429).json({
        success: false,
        data: null,
        error: 'Rate limit: please wait 60 seconds between interview question requests',
      })
      return
    }

    const completion = await getClient().chat.completions.create({
      model: getModel(),
      messages: [
        {
          role: 'system',
          content:
            'You are CareerOS — an expert career intelligence analyst and interview coach. ' +
            'You must always respond with valid JSON only. No markdown fences, no explanation outside the JSON object.',
        },
        {
          role: 'user',
          content: buildInterviewPrompt(targetRole.trim(), normalizedSkillGaps, resolvedCategories),
        },
      ],
      max_tokens: 4000,
      temperature: 0.35,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content ?? ''

    // Strip markdown fences defensively in case the model wraps in ```json ... ```
    const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      throw new Error('AI returned invalid JSON — could not parse response')
    }

    // Extract the questions array — model may return { "questions": [...] } or a bare array
    let rawQuestions: unknown[]
    if (Array.isArray(parsed)) {
      rawQuestions = parsed
    } else if (typeof parsed === 'object' && parsed !== null) {
      const obj = parsed as Record<string, unknown>
      const arrayValue = Object.values(obj).find((v) => Array.isArray(v))
      if (arrayValue === undefined) {
        throw new Error('AI response did not contain a questions array')
      }
      rawQuestions = arrayValue as unknown[]
    } else {
      throw new Error('AI response was not a JSON object or array')
    }

    // Category key alias map — catches common model synonym drift (e.g. "ml_algorithms" → "machine_learning")
    // This is a safety net; the improved prompt should prevent drift in the first place.
    const categoryAliases: Record<string, string> = {
      // ML / Data Science
      ml_algorithms: 'machine_learning', ml: 'machine_learning', machine_learning_algorithms: 'machine_learning',
      statistics_probability: 'statistics', probability: 'statistics', stats: 'statistics',
      sql: 'sql_data', sql_analytics: 'sql_data', sql_queries: 'sql_data', analytics: 'sql_data',
      // Data Engineering
      etl: 'data_pipelines', pipelines: 'data_pipelines', data_pipeline: 'data_pipelines',
      cloud: 'cloud_infra', infrastructure: 'cloud_infra', cloud_infrastructure: 'cloud_infra',
      database: 'database_design', db_design: 'database_design',
      // MLOps
      ml_theory: 'ml_theory', deep_learning: 'ml_theory',
      mlops_deployment: 'mlops', deployment: 'mlops',
      ml_system: 'system_design_ml', system_design_for_ml: 'system_design_ml',
      // Software Engineering
      data_structures: 'dsa', algorithms: 'dsa', dsa_algorithms: 'dsa',
      system: 'system_design', architecture: 'system_design',
      coding_debugging: 'coding', debugging: 'coding',
      // Frontend / Backend
      javascript: 'js_ts', typescript: 'js_ts', js: 'js_ts',
      react: 'react_frameworks', frameworks: 'react_frameworks',
      performance: 'web_performance', web: 'web_performance',
      api: 'api_arch', apis: 'api_arch', microservices: 'api_arch',
      db: 'databases', storage: 'databases',
      // DevOps
      ci_cd: 'cicd', pipeline: 'cicd', devops_pipeline: 'cicd',
      cloud_platforms: 'cloud', aws_gcp_azure: 'cloud',
      sre: 'reliability', monitoring: 'reliability', observability: 'reliability',
      // Business
      requirements_analysis: 'requirements', brd: 'requirements',
      process_improvement: 'process', lean: 'process',
      // AI Engineer
      llm: 'llm_genai', genai: 'llm_genai', generative_ai: 'llm_genai', rag: 'llm_genai',
      applied_ml: 'ml_application', production_ml: 'ml_application',
      ai_design: 'ai_system_design', genai_architecture: 'ai_system_design',
      // Finance
      modeling: 'financial_modeling', dcf: 'financial_modeling',
      company_valuation: 'valuation', multiples: 'valuation',
      // UX
      design_process: 'design_thinking', heuristic: 'design_thinking',
      research: 'user_research', usability: 'user_research',
      interaction: 'interaction_design', ui: 'interaction_design',
      // Growth
      growth: 'growth_analytics', metrics: 'growth_analytics', funnel: 'growth_analytics',
      ab_testing: 'experimentation', experiments: 'experimentation',
      go_to_market: 'gtm', gtm_strategy: 'gtm',
      // Consulting
      case: 'case_study', business_case: 'case_study',
      market: 'market_analysis', competitive: 'market_analysis',
      // Generic
      technical_skills: 'technical', core_technical: 'technical',
      strategic_thinking: 'strategy',
    }

    // Normalise category keys: trim + lowercase + alias resolution
    const normalisedQuestions = rawQuestions.map((q) => {
      if (typeof q === 'object' && q !== null) {
        const qObj = q as Record<string, unknown>
        if (typeof qObj.category === 'string') {
          const normalised = qObj.category.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')
          qObj.category = validCategoryKeys.has(normalised)
            ? normalised
            : (categoryAliases[normalised] ?? normalised)
        }
      }
      return q
    })

    const validQuestions = normalisedQuestions.filter((q) => isValidMCQQuestion(q, validCategoryKeys))

    if (validQuestions.length < 3) {
      throw new Error(
        `Too few valid questions returned: expected at least 3, got ${validQuestions.length}. ` +
          'The AI may have returned malformed data — please try again.'
      )
    }

    res.json({ success: true, data: validQuestions, error: null })
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : 'Failed to generate interview questions'
    const status = msg.startsWith('Rate limit') ? 429 : 500
    res.status(status).json({ success: false, data: null, error: msg })
  }
})

export default router
