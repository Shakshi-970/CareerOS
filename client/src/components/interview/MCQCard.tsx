import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import type { MCQQuestion, OptionKey } from '../../lib/interview-mcq'
import { useMCQStore } from '../../store/mcq.store'

const difficultyBadge: Record<string, string> = {
  easy: 'bg-emer-tint text-emer-d',
  medium: 'bg-amber-t text-amber-w',
  hard: 'bg-amber-t text-amber-w',
}

interface Props {
  question: MCQQuestion
  index: number
  total: number
}

export function MCQCard({ question, index, total }: Props) {
  const entry = useMCQStore(state => state.answers[question.id])
  const submitAnswer = useMCQStore(state => state.submitAnswer)

  const isAnswered = entry !== undefined
  const userSelected = entry?.selected
  const isCorrect = entry?.isCorrect

  function handleSelect(key: OptionKey) {
    if (isAnswered) return
    submitAnswer(question.id, key, key === question.correct)
  }

  function optionStyle(key: OptionKey): string {
    const base =
      'w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all'

    if (!isAnswered) {
      return `${base} border-hair bg-paper hover:border-emer/40 hover:bg-emer-tint cursor-pointer`
    }

    if (key === question.correct) {
      return `${base} border-emer/60 bg-emer-tint text-ink font-medium`
    }

    if (key === userSelected) {
      return `${base} border-amber-w/60 bg-amber-t text-ink font-medium`
    }

    return `${base} border-hair bg-panel text-faint cursor-default`
  }

  function optionIcon(key: OptionKey) {
    if (!isAnswered) {
      return (
        <span className="w-6 h-6 rounded-full border-2 border-hair flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-faint">
          {key}
        </span>
      )
    }

    if (key === question.correct) {
      return <CheckCircle2 className="w-5 h-5 text-emer shrink-0 mt-0.5" />
    }

    if (key === userSelected) {
      return <XCircle className="w-5 h-5 text-amber-w shrink-0 mt-0.5" />
    }

    return (
      <span className="w-6 h-6 rounded-full border-2 border-hair flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-faint">
        {key}
      </span>
    )
  }

  return (
    <div className="bg-paper rounded-2xl border border-hair shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-panel border-b border-hair">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-faint">
            Q{index} <span className="font-normal text-faint">of {total}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-panel2" />
          <span className="text-[11px] font-semibold text-muted bg-panel2 px-2 py-0.5 rounded-full">
            {question.concept}
          </span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyBadge[question.difficulty]}`}>
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Question */}
      <div className="px-5 pt-4 pb-4">
        <p className="text-sm font-semibold text-ink leading-relaxed">{question.question}</p>
      </div>

      {/* Options */}
      <div className="px-5 pb-4 space-y-2.5">
        {question.options.map(opt => (
          <button
            key={opt.key}
            onClick={() => handleSelect(opt.key)}
            className={optionStyle(opt.key)}
            disabled={isAnswered}
          >
            {optionIcon(opt.key)}
            <span className="leading-snug">{opt.text}</span>
          </button>
        ))}
      </div>

      {/* Result + explanation */}
      {isAnswered && (
        <div className={`mx-5 mb-5 rounded-xl p-4 border ${isCorrect ? 'bg-emer-tint border-emer/30' : 'bg-amber-t border-amber-w/30'}`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emer" />
                <span className="text-sm font-bold text-emer-d">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-amber-w" />
                <span className="text-sm font-bold text-amber-w">
                  Not quite — correct answer is {question.correct}
                </span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-w shrink-0 mt-0.5" />
            <p className="text-xs text-ink leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  )
}
