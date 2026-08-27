import { CheckCircle2, Circle, Clock, TrendingUp, Loader, ExternalLink } from 'lucide-react'
import type { SkillGapItem } from '../../lib/mock-data'
import { useSkillStore } from '../../store/skill.store'

const platformColors: Record<string, string> = {
  Coursera: 'bg-emer-tint text-emer-d',
  Udemy: 'bg-emer-tint text-emer-d',
  YouTube: 'bg-amber-t text-amber-w',
  'Microsoft Learn': 'bg-emer-tint text-emer-d',
}

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

interface Props {
  skill: SkillGapItem
}

export function LearningTaskItem({ skill }: Props) {
  const storeStatus = useSkillStore(state => state.statuses[skill.skill])
  const setStatus = useSkillStore(state => state.setStatus)
  const status = storeStatus ?? skill.status

  function handleToggle() {
    if (status === 'open') setStatus(skill.skill, 'in_progress')
    else if (status === 'in_progress') setStatus(skill.skill, 'done')
    else setStatus(skill.skill, 'open')
  }

  const courseUrl = getCourseUrl(skill.recommendedResource.platform, skill.recommendedResource.name)

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        status === 'done'
          ? 'bg-emer-tint border-emer/20'
          : status === 'in_progress'
          ? 'bg-amber-t border-amber-w/20'
          : 'bg-paper border-hair'
      }`}
    >
      <button
        onClick={handleToggle}
        title={
          status === 'open'
            ? 'Mark as started'
            : status === 'in_progress'
            ? 'Mark as done'
            : 'Reopen'
        }
        className="mt-0.5 shrink-0 transition-transform hover:scale-110"
      >
        {status === 'done' ? (
          <CheckCircle2 className="w-5 h-5 text-emer" />
        ) : status === 'in_progress' ? (
          <Loader className="w-5 h-5 text-amber-w" />
        ) : (
          <Circle className="w-5 h-5 text-faint hover:text-emer transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-semibold leading-snug ${
            status === 'done' ? 'line-through text-faint' : 'text-ink'
          }`}
        >
          {skill.skill}
        </div>
        <a
          href={courseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emer hover:underline mt-0.5 flex items-center gap-0.5 w-fit"
          title={`Open ${skill.recommendedResource.name} on ${skill.recommendedResource.platform}`}
        >
          <span className="truncate max-w-[160px]">{skill.recommendedResource.name}</span>
          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
        </a>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <a
            href={courseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 hover:opacity-80 transition-opacity ${
              platformColors[skill.recommendedResource.platform] ?? 'bg-panel text-muted'
            }`}
          >
            {skill.recommendedResource.platform}
          </a>
          <span className="flex items-center gap-0.5 text-[10px] text-muted shrink-0">
            <Clock className="w-3 h-3" />
            {skill.estimatedHours}h
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-emer font-semibold shrink-0">
            <TrendingUp className="w-3 h-3" />
            +{skill.scoreImpact} pts
          </span>
        </div>
      </div>
    </div>
  )
}
