import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Lightbulb } from 'lucide-react'
import type { InterviewQuestion } from '../../lib/mock-data'
import { useInterviewStore } from '../../store/interview.store'

const difficultyConfig = {
  easy: { label: 'Easy', className: 'bg-emer-tint text-emer-d' },
  medium: { label: 'Medium', className: 'bg-amber-t text-amber-w' },
  hard: { label: 'Hard', className: 'bg-amber-t text-amber-w' },
}

interface Props {
  question: InterviewQuestion
  index: number
}

export function QuestionCard({ question, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const practiced = useInterviewStore(state => state.practiced[question.id] ?? false)
  const toggle = useInterviewStore(state => state.toggle)
  const diff = difficultyConfig[question.difficulty]

  return (
    <div
      className={`bg-paper rounded-xl border transition-all shadow-sm ${
        practiced ? 'border-emer/30' : expanded ? 'border-emer/40' : 'border-hair'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 p-4">
        <span className="text-xs font-bold text-faint mt-0.5 w-5 shrink-0">Q{index}</span>
        <button
          className="flex-1 text-left"
          onClick={() => setExpanded(!expanded)}
        >
          <p className={`text-sm font-semibold leading-snug ${practiced ? 'text-faint line-through' : 'text-ink'}`}>
            {question.question}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${diff.className}`}>
              {diff.label}
            </span>
          </div>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggle(question.id)}
            title={practiced ? 'Mark as not practiced' : 'Mark as practiced'}
            className="transition-transform hover:scale-110"
          >
            {practiced ? (
              <CheckCircle2 className="w-5 h-5 text-emer" />
            ) : (
              <Circle className="w-5 h-5 text-faint hover:text-emer transition-colors" />
            )}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="text-faint hover:text-muted">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded: framework + tips */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-hair pt-4">
          {/* Answer framework */}
          <div>
            <h4 className="text-xs font-bold text-faint uppercase tracking-wide mb-2.5">
              Answer Framework
            </h4>
            <ol className="space-y-2">
              {question.framework.map((step, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emer-tint text-emer-d text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-ink leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          <div className="bg-amber-t rounded-lg p-3 border border-amber-w/20">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-w" />
              <h4 className="text-xs font-bold text-amber-w uppercase tracking-wide">Tips</h4>
            </div>
            <ul className="space-y-1.5">
              {question.tips.map((tip, i) => (
                <li key={i} className="text-xs text-amber-w leading-snug flex gap-1.5">
                  <span className="text-amber-w/60 shrink-0">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Practiced toggle at bottom */}
          <button
            onClick={() => toggle(question.id)}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors ${
              practiced
                ? 'bg-emer-tint text-emer-d border border-emer/30 hover:opacity-80'
                : 'bg-panel text-muted border border-hair hover:bg-panel2'
            }`}
          >
            {practiced ? '✓ Practiced — click to unmark' : 'Mark as Practiced'}
          </button>
        </div>
      )}
    </div>
  )
}
