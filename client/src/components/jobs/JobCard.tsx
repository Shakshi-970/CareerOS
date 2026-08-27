import { useState } from 'react'
import {
  ChevronDown, ChevronUp, MapPin, Clock, Wifi,
  CheckCircle2, AlertCircle, ExternalLink, TrendingUp,
} from 'lucide-react'
import type { JobMatch } from '../../lib/mock-data'

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? { ring: 'stroke-[#0E7A5A]', text: 'text-emer', bg: 'bg-emer-tint' }
      : score >= 50
      ? { ring: 'stroke-[#C05A12]', text: 'text-amber-w', bg: 'bg-amber-t' }
      : { ring: 'stroke-[#DCE0E4]', text: 'text-muted', bg: 'bg-panel' }

  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className={`relative w-14 h-14 shrink-0 rounded-full flex items-center justify-center ${color.bg}`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#DCE0E4" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" className={color.ring} strokeWidth="4" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className={`relative text-xs font-bold ${color.text}`}>{score}%</span>
    </div>
  )
}

const companySizeLabel: Record<string, string> = {
  startup: 'Startup', mid: 'Mid-stage', large: 'Large company',
}

const LEVER_SLUGS: Record<string, string> = {
  Razorpay: 'razorpay', Meesho: 'meesho', BrowserStack: 'browserstack',
  Freshworks: 'freshworks', InMobi: 'inmobi', Juspay: 'juspay',
  Dunzo: 'dunzo', Lenskart: 'lenskart', Slice: 'sliceit', upGrad: 'upgrad',
}

const GREENHOUSE_SLUGS: Record<string, string> = {
  CRED: 'credclub', Swiggy: 'swiggy', Unacademy: 'unacademy',
}

const CUSTOM_CAREER_PAGES: Record<string, string> = {
  Groww: 'https://groww.in/careers', PhonePe: 'https://www.phonepe.com/careers/',
  Zepto: 'https://www.zeptonow.com/careers', Paytm: 'https://paytm.com/careers',
  Flipkart: 'https://www.flipkartcareers.com/', Zomato: 'https://careers.zomato.com/',
  Amazon: 'https://www.amazon.jobs/en/search?base_query=&loc_query=India',
  Blinkit: 'https://jobs.blinkit.com/', BharatPe: 'https://bharatpe.com/careers',
  'Jupiter Money': 'https://jupiter.money/careers/', TCS: 'https://careers.tcs.com/',
  Infosys: 'https://career.infosys.com/', Wipro: 'https://careers.wipro.com/',
  HCL: 'https://www.hcltech.com/careers', Accenture: 'https://www.accenture.com/in-en/careers',
  Cognizant: 'https://careers.cognizant.com/global/en', 'Tech Mahindra': 'https://careers.techmahindra.com/',
  Deloitte: 'https://apply.deloitte.com/careers/SearchJobs/?CodeSearch=true',
  KPMG: 'https://home.kpmg/in/en/home/careers.html', McKinsey: 'https://www.mckinsey.com/careers/search-jobs',
  BCG: 'https://careers.bcg.com/search-jobs', Bain: 'https://www.bain.com/careers/',
  EY: 'https://careers.ey.com/ey/search/?q=&location=India', PwC: 'https://careers.pwc.com/global/en/india',
  Google: 'https://careers.google.com/jobs/results/?location=India',
  Microsoft: 'https://careers.microsoft.com/v2/global/en/india.html',
  Adobe: 'https://careers.adobe.com/us/en/search-results?keywords=&location=India',
  Uber: 'https://www.uber.com/us/en/careers/list/?country=India', Ola: 'https://ola.careers/',
  Zoho: 'https://careers.zohocorp.com/', "Byju's": 'https://byjus.com/careers/',
  'Urban Company': 'https://www.urbancompany.com/careers', Rapido: 'https://rapido.bike/careers/',
  PolicyBazaar: 'https://www.policybazaar.com/careers/', Nykaa: 'https://www.nykaa.com/careers',
  Myntra: 'https://careers.myntra.com/',
}

function toSlug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function getNaukriUrl(jobTitle: string, location: string): string {
  const titleSlug = toSlug(jobTitle)
  const citySlug = toSlug(location.split(',')[0])
  return `https://www.naukri.com/${titleSlug}-jobs-in-${citySlug}`
}

function getLinkedInUrl(jobTitle: string, location: string): string {
  const kw = encodeURIComponent(jobTitle)
  const loc = encodeURIComponent(`${location.split(',')[0]}, India`)
  return `https://www.linkedin.com/jobs/search/?keywords=${kw}&location=${loc}&f_JT=F&sortBy=R`
}

function getHiristUrl(jobTitle: string): string {
  return `https://www.hirist.tech/j/${encodeURIComponent(toSlug(jobTitle))}/1`
}

function getWellfoundUrl(jobTitle: string, location: string): string {
  const q = encodeURIComponent(jobTitle)
  const l = encodeURIComponent(location.split(',')[0])
  return `https://wellfound.com/jobs?q=${q}&l=${l}`
}

function getInstahyreUrl(jobTitle: string, location: string): string {
  const q = encodeURIComponent(jobTitle)
  const l = encodeURIComponent(location.split(',')[0])
  return `https://www.instahyre.com/search-jobs/?q=${q}&location=${l}`
}

function getCompanyCareerUrl(company: string, jobTitle: string): string {
  const leverSlug = LEVER_SLUGS[company]
  if (leverSlug) return `https://jobs.lever.co/${leverSlug}?search=${encodeURIComponent(jobTitle)}`
  const ghSlug = GREENHOUSE_SLUGS[company]
  if (ghSlug) return `https://boards.greenhouse.io/${ghSlug}/jobs?q=${encodeURIComponent(jobTitle)}`
  const custom = CUSTOM_CAREER_PAGES[company]
  if (custom) return custom
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${company} ${jobTitle}`)}&sortBy=R`
}

interface Props {
  job: JobMatch
}

export function JobCard({ job }: Props) {
  const [expanded, setExpanded] = useState(false)

  const fitLabel = job.matchScore >= 70 ? 'Strong fit' : job.matchScore >= 50 ? 'Decent fit' : 'Stretch role'
  const fitClass = job.matchScore >= 70 ? 'bg-emer-tint text-emer-d' : job.matchScore >= 50 ? 'bg-amber-t text-amber-w' : 'bg-panel text-muted'

  return (
    <div className={`bg-paper rounded-xl border shadow-sm transition-all ${expanded ? 'border-emer/30' : 'border-hair'}`}>
      {/* Header row */}
      <button className="w-full text-left p-4 flex items-start gap-4" onClick={() => setExpanded(!expanded)}>
        <ScoreBadge score={job.matchScore} />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-ink">{job.jobTitle}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${fitClass}`}>{fitLabel}</span>
              </div>
              <div className="text-sm text-muted font-medium mt-0.5">{job.company}</div>
            </div>
            <span className="text-sm font-semibold text-emer-d shrink-0">{job.salaryRange}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted">
              <MapPin className="w-3 h-3" />{job.location}
            </span>
            {job.isRemote && (
              <span className="flex items-center gap-1 text-xs text-emer font-medium">
                <Wifi className="w-3 h-3" />Remote ok
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-faint">
              <Clock className="w-3 h-3" />{job.postedDaysAgo}d ago
            </span>
            <span className="text-xs text-faint">{companySizeLabel[job.companySize]}</span>
          </div>

          <div className="mt-2">
            <span className="text-[10px] text-muted">
              <span className="font-semibold text-emer">{job.matchedSkills.length} matched</span>
              {' · '}
              <span className="font-semibold text-amber-w">{job.gapSkills.length} gaps</span>
            </span>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4 text-faint" /> : <ChevronDown className="w-4 h-4 text-faint" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-hair pt-4 space-y-4">
          {/* Why you fit */}
          <div>
            <h4 className="text-xs font-bold text-faint uppercase tracking-wide mb-2">Why You Fit</h4>
            <ul className="space-y-1.5">
              {job.whyFit.map((reason, i) => (
                <li key={i} className="flex gap-2 text-sm text-ink">
                  <TrendingUp className="w-3.5 h-3.5 text-emer shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emer-tint rounded-lg p-3 border border-emer/20">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emer" />
                <span className="text-xs font-bold text-emer-d">Skills you have</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.matchedSkills.map(s => (
                  <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-paper border border-emer/30 text-emer-d rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="bg-amber-t rounded-lg p-3 border border-amber-w/20">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-w" />
                <span className="text-xs font-bold text-amber-w">Gaps to close</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.gapSkills.map(s => (
                  <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-paper border border-amber-w/30 text-amber-w rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Job board links */}
          <div className="space-y-2 pt-1">
            {job.applyUrl && !job.applyUrl.includes('undefined') && (
              <a
                href={job.applyUrl}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#0E7A5A' }}
              >
                <ExternalLink className="w-4 h-4" />
                Apply Now — Direct Link
              </a>
            )}

            <p className="text-[10px] font-semibold text-faint uppercase tracking-wide pt-1">Find similar on:</p>
            <div className="flex gap-2">
              <a
                href={getNaukriUrl(job.jobTitle, job.location)}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emer text-white text-xs font-semibold hover:bg-emer-d transition-colors"
              >
                Naukri <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={getLinkedInUrl(job.jobTitle, job.location)}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-emer/30 text-emer text-xs font-semibold hover:bg-emer-tint transition-colors"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2 flex-wrap">
              <a
                href={getHiristUrl(job.jobTitle)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-hair text-xs font-semibold text-muted hover:bg-panel transition-colors"
              >
                Hirist <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={getWellfoundUrl(job.jobTitle, job.location)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-hair text-xs font-semibold text-muted hover:bg-panel transition-colors"
              >
                Wellfound <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={getInstahyreUrl(job.jobTitle, job.location)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-hair text-xs font-semibold text-muted hover:bg-panel transition-colors"
              >
                Instahyre <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href={getCompanyCareerUrl(job.company, job.jobTitle)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-ink text-white text-xs font-semibold hover:opacity-80 transition-opacity ml-auto"
              >
                {job.company} Careers <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <a
            href="/learning"
            className="w-full flex items-center justify-center py-2 rounded-lg border border-hair text-xs font-semibold text-muted hover:bg-panel transition-colors"
          >
            Close skill gaps to improve fit →
          </a>
        </div>
      )}
    </div>
  )
}
