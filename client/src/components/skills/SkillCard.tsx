import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, TrendingUp, ExternalLink, CheckCircle, PlayCircle } from 'lucide-react'
import type { SkillGapItem } from '../../lib/mock-data'
import { useSkillStore } from '../../store/skill.store'

function getCourseUrl(platform: string, courseName: string): string {
  const q = encodeURIComponent(courseName)
  switch (platform) {
    case 'Coursera': return `https://www.coursera.org/search?query=${q}`
    case 'Udemy': return `https://www.udemy.com/courses/search/?q=${q}`
    case 'YouTube': return `https://www.youtube.com/results?search_query=${q}`
    case 'Microsoft Learn': return `https://learn.microsoft.com/en-us/search/?terms=${q}`
    default: return `https://www.google.com/search?q=${q}+course`
  }
}

const urgencyColors: Record<string, string> = {
  high: 'bg-amber-t text-amber-w',
  medium: 'bg-amber-t text-amber-w',
  low: 'bg-panel text-muted',
}

const platformColors: Record<string, string> = {
  Coursera: 'bg-emer-tint text-emer-d',
  Udemy: 'bg-emer-tint text-emer-d',
  YouTube: 'bg-amber-t text-amber-w',
  'Microsoft Learn': 'bg-emer-tint text-emer-d',
}

interface Props {
  skill: SkillGapItem
}

export function SkillCard({ skill }: Props) {
  const [expanded, setExpanded] = useState(false)
  const storeStatus = useSkillStore(state => state.statuses[skill.skill])
  const setStatus = useSkillStore(state => state.setStatus)
  const effectiveStatus = storeStatus ?? skill.status
  const isDone = effectiveStatus === 'done'
  const isInProgress = effectiveStatus === 'in_progress'

  return (
    <div
      className={`bg-paper rounded-lg border transition-all ${
        expanded ? 'border-emer/40 shadow-md' : 'border-hair shadow-sm'
      } ${isDone ? 'opacity-60' : ''}`}
    >
      <button
        className="w-full text-left p-3 flex items-start gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-ink">{skill.skill}</span>
            {isDone && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emer-tint text-emer-d">
                <CheckCircle className="w-2.5 h-2.5" />
                Done
              </span>
            )}
            {isInProgress && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-t text-amber-w">
                In Progress
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${urgencyColors[skill.urgency]}`}
            >
              {skill.urgency} urgency
            </span>
            <span className="text-xs text-emer font-semibold">+{skill.scoreImpact} pts</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-faint shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-faint shrink-0 mt-0.5" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-hair pt-2.5 space-y-2.5">
          <div>
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Market demand</span>
              <span className="font-semibold text-ink">{skill.marketDemandPercent}%</span>
            </div>
            <div className="h-1.5 bg-panel2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emer rounded-full transition-all"
                style={{ width: `${skill.marketDemandPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock className="w-3 h-3" />
              <span>{skill.estimatedHours}h to close</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emer font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>+{skill.scoreImpact} pts score impact</span>
            </div>
          </div>

          <a
            href={getCourseUrl(skill.recommendedResource.platform, skill.recommendedResource.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-panel hover:bg-emer-tint rounded-md px-2.5 py-2 transition-colors group"
            title={`Open ${skill.recommendedResource.name} on ${skill.recommendedResource.platform}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                  platformColors[skill.recommendedResource.platform] ?? 'bg-panel2 text-muted'
                }`}
              >
                {skill.recommendedResource.platform}
              </span>
              <span className="text-xs text-muted group-hover:text-emer truncate transition-colors">
                {skill.recommendedResource.name}
              </span>
            </div>
            <ExternalLink className="w-3 h-3 text-faint group-hover:text-emer shrink-0 ml-1 transition-colors" />
          </a>

          {/* Status action */}
          <div className="pt-1 border-t border-hair flex items-center justify-between">
            {effectiveStatus === 'open' && (
              <a
                href={getCourseUrl(skill.recommendedResource.platform, skill.recommendedResource.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setStatus(skill.skill, 'in_progress')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emer-tint text-emer-d text-xs font-semibold hover:opacity-80 transition-opacity"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Start Learning
              </a>
            )}
            {effectiveStatus === 'in_progress' && (
              <>
                <button
                  onClick={() => setStatus(skill.skill, 'done')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emer text-white text-xs font-semibold hover:bg-emer-d transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mark as Done
                </button>
                <button
                  onClick={() => setStatus(skill.skill, 'open')}
                  className="text-xs text-faint hover:text-muted transition-colors"
                >
                  Reset
                </button>
              </>
            )}
            {effectiveStatus === 'done' && (
              <>
                <div className="flex items-center gap-1.5 text-xs text-emer font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </div>
                <button
                  onClick={() => setStatus(skill.skill, 'open')}
                  className="text-xs text-faint hover:text-muted transition-colors"
                >
                  Reopen
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
