import axios from 'axios'
import OpenAI from 'openai'

// ─── Groq client (same pattern as ai.service.ts) ─────────────────────────────
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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RawJob {
  id: string
  title: string
  company: string
  location: string
  description: string
  applyUrl: string
  salary: string
  isRemote: boolean
  postedDaysAgo: number
  isDirectApply: boolean
}

export interface ScoredJob {
  id: string
  jobTitle: string
  company: string
  location: string
  salaryRange: string
  applyUrl: string
  isDirectApply: boolean
  matchScore: number
  isRemote: boolean
  postedDaysAgo: number
  companySize: 'startup' | 'mid' | 'large'
  matchedSkills: string[]
  gapSkills: string[]
  whyFit: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractSalaryFromText(text: string): string | null {
  // Matches: "₹12–18 LPA", "12-18 LPA", "CTC: 20-30 lakhs", "salary 15 LPA", "10,00,000 – 18,00,000"
  const patterns = [
    /(?:₹\s*)?(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*(?:lpa|l\.p\.a\.?|lakhs?\s*(?:per\s*)?(?:annum|year|p\.?a\.?)?)/i,
    /(?:salary|ctc|package|compensation)[:\s]+(?:₹\s*)?(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)/i,
    /(?:₹\s*)?(\d{1,2}),\s*(\d{2}),\s*\d{3}\s*[-–]\s*(\d{1,2}),\s*(\d{2}),\s*\d{3}/i,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      // lakhs pattern: direct numbers like "12–18 LPA"
      const min = parseFloat(m[1])
      const max = parseFloat(m[2])
      if (min > 0 && max > 0 && max <= 200) {
        return `₹${min}–${max} LPA`
      }
    }
  }
  return null
}

function parsePostedDaysAgo(str: string): number {
  if (!str) return 0
  if (/hour|minute|just now/i.test(str)) return 0
  const days = str.match(/(\d+)\s*day/i)
  if (days) return parseInt(days[1])
  const weeks = str.match(/(\d+)\s*week/i)
  if (weeks) return parseInt(weeks[1]) * 7
  const months = str.match(/(\d+)\s*month/i)
  if (months) return parseInt(months[1]) * 30
  return 0
}

const JOB_AGGREGATOR_HOSTS = [
  'linkedin.com', 'indeed.com', 'naukri.com', 'glassdoor.com',
  'ziprecruiter.com', 'monster.com', 'talent.com', 'jooble.org',
  'simplyhired.com', 'careerbuilder.com', 'foundit.in', 'wellfound.com',
]

function isDirectApplyUrl(value: string): boolean {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, '')
    return !JOB_AGGREGATOR_HOSTS.some(host => hostname === host || hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

function chooseApplyUrl(options: unknown, fallback: string): string {
  if (Array.isArray(options)) {
    const direct = options.find(option => {
      if (!option || typeof option !== 'object') return false
      const link = (option as { link?: unknown }).link
      return typeof link === 'string' && isDirectApplyUrl(link)
    }) as { link?: string } | undefined
    if (direct?.link) return direct.link
    const first = options.find(option => option && typeof option === 'object' && typeof (option as { link?: unknown }).link === 'string') as { link?: string } | undefined
    if (first?.link) return first.link
  }
  return fallback
}

// Substring tokens — a company name containing any of these tokens is classified as that tier.
// Using substrings (not exact match) handles "Google India Pvt Ltd", "Amazon.com Services LLC", etc.
const LARGE_TOKENS = [
  'google', 'microsoft', 'amazon', 'meta', 'apple', 'uber', 'oracle',
  'sap', 'ibm', 'accenture', 'tcs', 'infosys', 'wipro', 'hcl',
  'cognizant', 'tech mahindra', 'ltimindtree', 'lti', 'mphasis', 'hexaware', 'capgemini',
  'flipkart', 'zomato', 'swiggy', 'phonepe', 'paytm', 'ola', 'rapido',
  'myntra', 'nykaa', 'bigbasket', 'reliance', 'jio', 'airtel', 'vodafone',
  'byju', 'unacademy', 'vedantu', 'upgrad',
  'adobe', 'salesforce', 'cisco', 'dell', 'hp ', 'linkedin', 'twitter', 'netflix',
  'deloitte', 'pwc', 'kpmg', 'ey', 'ernst', 'mckinsey', 'bcg', 'bain', 'roland berger',
  'goldman sachs', 'jpmorgan', 'morgan stanley', 'citibank', 'barclays', 'hsbc',
  'hdfc', 'icici', 'axis bank', 'kotak', 'sbi', 'bajaj', 'lic',
  'samsung', 'lg ', 'sony', 'bosch', 'siemens', 'honeywell', 'ge ', 'intel', 'qualcomm',
  'thoughtworks', 'publicis', 'wpp', 'dentsu',
]

const MID_TOKENS = [
  'razorpay', 'meesho', 'cred', 'groww', 'zepto', 'blinkit',
  'freshworks', 'browserstack', 'juspay', 'jupiter', 'slice',
  'bharatpe', 'khatabook', 'mswipe', 'mobikwik', 'lendingkart', 'kreditbee',
  'dunzo', 'udaan', 'moglix', 'infra.market', 'delhivery', 'shiprocket',
  'cleartax', 'zoho', 'postman', 'hasura', 'setu', 'cashfree', 'instamojo',
  'sharechat', 'moj', 'dailyhunt', 'inmobi', 'lenskart', 'urban company', 'housejoy',
]

export function inferCompanySize(company: string): 'startup' | 'mid' | 'large' {
  const c = company.toLowerCase()
  if (LARGE_TOKENS.some(t => c.includes(t))) return 'large'
  if (MID_TOKENS.some(t => c.includes(t))) return 'mid'
  return 'startup'
}

// ─── JSearch fetch ────────────────────────────────────────────────────────────
export async function fetchJobsJSearch(
  role: string,
  location: string
): Promise<RawJob[]> {
  const res = await axios.get('https://jsearch.p.rapidapi.com/search', {
    params: {
      query: `${role} ${location} India`,
      page: '1',
      num_pages: '2',
      date_posted: 'month',
      employment_types: 'FULLTIME',
      country: 'in',
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY ?? '',
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
    timeout: 10_000,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobs: any[] = res.data?.data?.jobs ?? res.data?.data ?? []

  return jobs.map((j) => {
    const applyUrl = chooseApplyUrl(j.apply_options, j.job_apply_link ?? '')
    return {
    id: j.job_id ?? j.job_uid ?? String(Math.random()),
    title: j.job_title ?? '',
    company: j.employer_name ?? '',
    location: j.job_city ? `${j.job_city}, India` : location,
    description: j.job_description ?? '',
    applyUrl,
    salary:
      j.job_min_salary && j.job_max_salary
        ? `₹${Math.round(j.job_min_salary / 100000)}–${Math.round(j.job_max_salary / 100000)} LPA`
        : (extractSalaryFromText(j.job_description ?? '') ?? 'Not disclosed'),
    isRemote: Boolean(j.job_is_remote),
    postedDaysAgo: parsePostedDaysAgo(j.job_posted_at ?? ''),
    isDirectApply: isDirectApplyUrl(applyUrl),
    }
  })
}

// ─── SerpApi fetch (fallback) ─────────────────────────────────────────────────
export async function fetchJobsSerpApi(
  role: string,
  location: string
): Promise<RawJob[]> {
  const res = await axios.get('https://serpapi.com/search', {
    params: {
      engine: 'google_jobs',
      q: `${role} ${location} India`,
      hl: 'en',
      gl: 'in',
      api_key: process.env.SERPAPI_KEY ?? '',
    },
    timeout: 12_000,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jobs: any[] = res.data?.jobs_results ?? []

  return jobs.map((j, idx) => {
    const applyUrl = chooseApplyUrl(j.apply_options, '')
    return {
    id: j.job_id ?? `serp-${idx}-${Date.now()}`,
    title: j.title ?? '',
    company: j.company_name ?? '',
    location: j.location ?? location,
    description: j.description ?? '',
    applyUrl,
    salary:
      j.detected_extensions?.salary
        ?? extractSalaryFromText(j.description ?? '')
        ?? 'Not disclosed',
    isRemote: /remote/i.test(j.location ?? ''),
    postedDaysAgo: parsePostedDaysAgo(j.detected_extensions?.posted_at ?? ''),
    isDirectApply: isDirectApplyUrl(applyUrl),
    }
  })
}

// ─── AI scoring ───────────────────────────────────────────────────────────────
export async function scoreJob(
  raw: RawJob,
  userSkills: string[],
  skillGaps: string[],
  targetRole: string
): Promise<ScoredJob> {
  const prompt = `You are CareerOS. Score how well this candidate fits this job.

CANDIDATE SKILLS: ${userSkills.join(', ')}
CANDIDATE SKILL GAPS: ${skillGaps.join(', ')}
TARGET ROLE: ${targetRole}

JOB TITLE: ${raw.title}
COMPANY: ${raw.company}
JOB DESCRIPTION: ${raw.description.slice(0, 700)}

Return ONLY valid JSON, no markdown fences:
{
  "matchScore": integer 0-100 (honest fit based on skills overlap and seniority match),
  "matchedSkills": ["up to 4 skills from candidate skills that this job needs"],
  "gapSkills": ["up to 3 skill gaps that hurt fit for this specific job"],
  "whyFit": ["one specific sentence reason 1", "one specific sentence reason 2"]
}`

  const completion = await getClient().chat.completions.create({
    model: process.env.GROQ_MODEL ?? 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
    temperature: 0.1,
  })

  let parsed: Record<string, unknown> = {}
  try {
    const raw = completion.choices[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    // fall through to defaults
  }

  return {
    id: raw.id,
    jobTitle: raw.title,
    company: raw.company,
    location: raw.location,
    salaryRange: raw.salary,
    applyUrl: raw.applyUrl,
    isDirectApply: raw.isDirectApply,
    matchScore: typeof parsed.matchScore === 'number' ? parsed.matchScore : 50,
    isRemote: raw.isRemote,
    postedDaysAgo: raw.postedDaysAgo,
    companySize: inferCompanySize(raw.company),
    matchedSkills: Array.isArray(parsed.matchedSkills) ? (parsed.matchedSkills as string[]) : [],
    gapSkills: Array.isArray(parsed.gapSkills) ? (parsed.gapSkills as string[]) : [],
    whyFit: Array.isArray(parsed.whyFit) ? (parsed.whyFit as string[]) : ['See job description for details'],
  }
}
