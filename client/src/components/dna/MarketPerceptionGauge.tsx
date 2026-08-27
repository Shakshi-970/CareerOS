import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

const RADIUS = 48
const CX = 60
const CY = 60
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function scoreColor(score: number): string {
  if (score >= 70) return '#0E7A5A'
  if (score >= 50) return '#0E7A5A'
  return '#C05A12'
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Highly Visible'
  if (score >= 65) return 'Visible'
  if (score >= 45) return 'Moderate'
  return 'Low Visibility'
}

interface MarketPerceptionGaugeProps {
  score: number
}

export function MarketPerceptionGauge({ score }: MarketPerceptionGaugeProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [score])

  const color = scoreColor(score)
  const offset = animated ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE

  return (
    <div className="bg-paper rounded-xl border border-hair shadow-sm p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <Eye className="w-4 h-4 text-faint" />
        <h2 className="font-semibold text-ink">Market Perception</h2>
      </div>
      <p className="text-xs text-faint mb-5 self-start">How recruiters currently see your profile</p>

      <div className="relative mb-4">
        <svg viewBox="0 0 120 120" className="w-36 h-36" aria-label={`Market perception score: ${score}`}>
          <circle cx={CX} cy={CY} r={RADIUS} fill="none" stroke="#DCE0E4" strokeWidth="10" />
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-faint">/ 100</span>
        </div>
      </div>

      <span className="text-sm font-semibold mb-3" style={{ color }}>{scoreLabel(score)}</span>

      <div className="w-full space-y-2 text-xs text-muted">
        <div className="flex justify-between">
          <span>LinkedIn activity</span>
          <span className="font-medium text-amber-w">Low</span>
        </div>
        <div className="flex justify-between">
          <span>Profile completeness</span>
          <span className="font-medium text-emer">Good</span>
        </div>
        <div className="flex justify-between">
          <span>Keyword visibility</span>
          <span className="font-medium text-amber-w">Medium</span>
        </div>
      </div>
    </div>
  )
}
