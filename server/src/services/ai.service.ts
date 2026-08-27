import OpenAI from 'openai'
import type { DnaReport, ProfileAnalysis } from '../../../shared/types'

// Lazy-initialize so dotenv.config() in index.ts runs first
let _client: OpenAI | null = null
function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY ?? '',
      baseURL: process.env.GROQ_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
  }
  return _client
}

function getModel(): string {
  return process.env.GROQ_MODEL ?? 'gemini-2.0-flash'
}

// Rate limiting — 1 call per user per feature per 30s (in-memory, Phase 1)
const rateLimitMap = new Map<string, number>()

function checkRateLimit(key: string): boolean {
  const last = rateLimitMap.get(key) ?? 0
  if (Date.now() - last < 30_000) return false
  rateLimitMap.set(key, Date.now())
  return true
}

const SYSTEM_PROMPT = `You are CareerOS — an expert career intelligence analyst.
You analyze professional profiles and generate detailed, data-driven career diagnostic reports.
You must always respond with valid JSON only. No markdown fences, no explanation outside the JSON object.`

function buildDnaPrompt(userProfile: Record<string, unknown>, targetRole: string): string {
  return `Analyze this professional profile and generate a CareerOS DNA Report.

PROFILE:
${JSON.stringify(userProfile, null, 2)}

TARGET ROLE: ${targetRole}

Return ONLY this exact JSON structure:
{
  "archetype": {
    "title": "3-4 word creative label for their current career state (e.g. The Rising Analyst)",
    "targetTitle": "their target role verbatim",
    "description": "2 sentences — honest insight about their trajectory and key challenge"
  },
  "strengths": [
    { "name": "skill name", "relevanceTag": "one of: Core PM Skill / Technical Depth / Industry Edge / Credibility Signal / Transferable", "description": "1 sentence on how this strength applies to target role" }
  ],
  "gaps": [
    { "name": "skill name", "urgency": "high|medium|low", "recommendedAction": "specific 1-sentence action they can take this week", "marketDemandPercent": integer 0-100 }
  ],
  "riskFlags": [
    { "title": "short title", "description": "1 sentence on the risk and its impact", "severity": "high|medium|low" }
  ],
  "nextActions": [
    { "action": "specific actionable task", "impact": "+N pts" }
  ],
  "marketPerceptionScore": integer 0-100
}

Requirements:
- Exactly 5 strengths
- Exactly 5 gaps ordered by urgency (high first)
- 2 to 4 riskFlags
- Exactly 3 nextActions (highest-impact first)
- marketPerceptionScore reflects how recruiters would currently perceive this profile (0-100)
- Base every insight on the actual profile data — no generic advice`
}

function validateDnaReport(raw: unknown): DnaReport {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('AI returned non-object response')
  }
  const d = raw as Record<string, unknown>
  const required = ['archetype', 'strengths', 'gaps', 'riskFlags', 'nextActions', 'marketPerceptionScore']
  for (const key of required) {
    if (!(key in d)) throw new Error(`Missing field: ${key}`)
  }
  if (!Array.isArray(d.strengths) || d.strengths.length !== 5) {
    throw new Error('strengths must be an array of exactly 5 items')
  }
  if (!Array.isArray(d.gaps) || d.gaps.length !== 5) {
    throw new Error('gaps must be an array of exactly 5 items')
  }
  return d as unknown as DnaReport
}

function buildAnalyzePrompt(resumeText: string, targetRole: string, linkedinUrl: string): string {
  return `You are CareerOS — an expert career intelligence analyst.
Analyze this resume and generate a complete CareerOS profile analysis.

TARGET ROLE: ${targetRole}${linkedinUrl ? `\nLINKEDIN: ${linkedinUrl}` : ''}

RESUME:
${resumeText.slice(0, 1800)}

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "userInfo": {
    "name": "full name extracted from resume",
    "currentRole": "most recent job title or Student if fresher",
    "yearsExperience": integer total years of work experience,
    "education": "highest degree and institution from resume",
    "location": "city/country from resume or India if not specified"
  },
  "careerScore": {
    "overallScore": integer 0-100 honest readiness for target role,
    "dimensions": [
      { "label": "Resume Quality", "key": "resumeQuality", "value": integer 0-100 },
      { "label": "Skill Match", "key": "skillMatch", "value": integer 0-100 },
      { "label": "Experience Relevance", "key": "experienceRelevance", "value": integer 0-100 },
      { "label": "Digital Presence", "key": "digitalPresence", "value": integer 0-100 },
      { "label": "Certifications", "key": "certifications", "value": integer 0-100 }
    ]
  },
  "dnaReport": {
    "archetype": {
      "title": "3-4 word creative career label",
      "targetTitle": "${targetRole}",
      "description": "2 honest sentences about trajectory and main challenge"
    },
    "strengths": [
      { "name": "skill name", "relevanceTag": "Core PM Skill|Technical Depth|Industry Edge|Credibility Signal|Transferable", "description": "1 sentence on how this applies to target role" }
    ],
    "gaps": [
      { "name": "skill name", "urgency": "high|medium|low", "recommendedAction": "specific 1-sentence action for this week", "marketDemandPercent": integer 0-100 }
    ],
    "riskFlags": [
      { "title": "short title", "description": "1 sentence on risk and impact", "severity": "high|medium|low" }
    ],
    "nextActions": [
      { "action": "specific task", "impact": "+N pts" }
    ],
    "marketPerceptionScore": integer 0-100
  },
  "skillGaps": [
    {
      "skill": "skill name",
      "urgency": "high|medium|low",
      "closability": "high|medium|low",
      "status": "open",
      "marketDemandPercent": integer 0-100,
      "estimatedHours": integer hours to close this gap,
      "recommendedResource": { "platform": "Coursera|Udemy|YouTube|Microsoft Learn", "name": "specific course or resource" },
      "scoreImpact": integer 1-15
    }
  ],
  "priorityActions": [
    { "rank": 1, "action": "specific action", "impact": "+N pts", "urgency": "high|medium|low", "href": "/skills|/learning|/dna|/jobs" },
    { "rank": 2, "action": "specific action", "impact": "+N pts", "urgency": "high|medium|low", "href": "/skills|/learning|/dna|/jobs" },
    { "rank": 3, "action": "specific action", "impact": "+N pts", "urgency": "medium|low", "href": "/skills|/learning|/dna|/jobs" }
  ]
}

Rules:
- Extract the ACTUAL person name and details from the resume — never invent data
- Score honestly relative to readiness for ${targetRole}
- Exactly 5 strengths, exactly 5 gaps ordered high→low urgency, 2-4 riskFlags, exactly 3 nextActions
- 5-7 skillGaps specific to ${targetRole}, ordered by urgency
- skillGaps MUST be distributed across all urgency/closability quadrants — NEVER put all skills in the same combination. Required distribution for 6-7 skills:
    * 2 skills: urgency="high", closability="high"  → Close First (learnable prerequisites)
    * 1-2 skills: urgency="high", closability="low"  → Plan For (need real experience, hard to shortcut e.g. leadership, domain depth, industry tenure)
    * 1-2 skills: urgency="low", closability="high"  → Quick Wins (nice-to-have, easy 1-week online course)
    * 1 skill: urgency="low", closability="low"      → Long Game (multi-year aspiration)
  Violating this by grouping all skills into one quadrant makes the skill matrix useless.
- Exactly 3 priorityActions`
}

const FALLBACK_DNA = {
  archetype: { title: 'Career Explorer', targetTitle: '', description: 'Detailed analysis unavailable — try re-analysing.' },
  strengths: [],
  gaps: [],
  riskFlags: [],
  nextActions: [],
  marketPerceptionScore: 50,
}

function validateProfileAnalysis(raw: unknown): Omit<ProfileAnalysis, 'velocityData'> {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('AI returned non-object response')
  }
  let d = raw as Record<string, unknown>

  // Unwrap if model nested the result under a single outer key e.g. { "analysis": {...} }
  if (!('userInfo' in d)) {
    const inner = Object.values(d).find(
      v => typeof v === 'object' && v !== null && 'userInfo' in (v as Record<string, unknown>)
    )
    if (inner) d = inner as Record<string, unknown>
  }

  // Only userInfo and careerScore are non-negotiable for the dashboard to render
  if (!('userInfo' in d)) throw new Error('Missing field from AI response: userInfo')
  if (!('careerScore' in d)) throw new Error('Missing field from AI response: careerScore')

  // Safe defaults for everything else
  if (!('dnaReport' in d)) d.dnaReport = FALLBACK_DNA
  // Synthesize priorityActions from skillGaps when omitted
  if (!('priorityActions' in d) || (d.priorityActions as unknown[]).length === 0) {
    const gaps = Array.isArray(d.skillGaps) ? (d.skillGaps as Array<Record<string, unknown>>) : []
    if (gaps.length > 0) {
      d.priorityActions = gaps
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
          (b.scoreImpact as number ?? 0) - (a.scoreImpact as number ?? 0))
        .slice(0, 3)
        .map((g, i) => ({
          rank: i + 1,
          action: `Learn ${String(g.skill)} to strengthen your profile`,
          impact: `+${String(g.scoreImpact ?? 6)} pts`,
          urgency: g.urgency ?? 'medium',
          href: '/learning',
        }))
    } else {
      d.priorityActions = []
    }
  }

  // Synthesize skillGaps from dnaReport.gaps when the AI omitted them (truncation fallback)
  const hasSkillGaps = 'skillGaps' in d && Array.isArray(d.skillGaps) && (d.skillGaps as unknown[]).length > 0
  if (!hasSkillGaps) {
    const dna = d.dnaReport as Record<string, unknown>
    const dnaGaps = Array.isArray(dna?.gaps) ? (dna.gaps as Array<Record<string, unknown>>) : []
    d.skillGaps = dnaGaps.length > 0
      ? dnaGaps.map((g, i) => ({
          skill: g.name,
          urgency: g.urgency ?? 'medium',
          closability: i < 2 ? 'high' : i < 4 ? 'medium' : 'low',
          status: 'open',
          marketDemandPercent: g.marketDemandPercent ?? 70,
          estimatedHours: 20,
          recommendedResource: { platform: 'Coursera', name: `${String(g.name)} — top-rated course` },
          scoreImpact: 6,
        }))
      : []
  }

  return d as unknown as Omit<ProfileAnalysis, 'velocityData'>
}

export async function analyzeProfile(
  resumeText: string,
  targetRole: string,
  linkedinUrl: string,
  _userId: string
): Promise<Omit<ProfileAnalysis, 'velocityData'>> {
  // App-level rate limit removed — Groq enforces its own RPM limits per API key.
  // Keeping userId param for API compatibility but not using it for gating.

  const completion = await getClient().chat.completions.create({
    model: getModel(),
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildAnalyzePrompt(resumeText, targetRole, linkedinUrl) },
    ],
    max_tokens: 4096,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  // Strip markdown code fences that some models add despite response_format: json_object
  const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    console.error('[analyzeProfile] JSON parse failed. Raw response (first 500 chars):', raw.slice(0, 500))
    throw new Error('AI returned invalid JSON — could not parse response')
  }

  try {
    return validateProfileAnalysis(parsed)
  } catch (validationErr) {
    const topKeys = typeof parsed === 'object' && parsed !== null
      ? Object.keys(parsed as object).join(', ')
      : String(parsed)
    console.error('[analyzeProfile] Validation failed. Top-level keys:', topKeys, '| Error:', (validationErr as Error).message)
    throw validationErr
  }
}

export async function generateDnaReport(
  userProfile: Record<string, unknown>,
  targetRole: string,
  userId: string
): Promise<DnaReport> {
  if (!checkRateLimit(`dna:${userId}`)) {
    throw new Error('Rate limit: please wait 30 seconds between report generations')
  }

  const completion = await getClient().chat.completions.create({
    model: getModel(),
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildDnaPrompt(userProfile, targetRole) },
    ],
    max_tokens: 2000,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('AI returned invalid JSON — could not parse response')
  }

  return validateDnaReport(parsed)
}
