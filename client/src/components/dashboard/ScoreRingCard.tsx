import { useEffect, useState } from 'react'
import type { MockCareerScore } from '@/lib/mock-data'

const RADIUS = 52
const CX = 64
const CY = 64
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function scoreArc(score: number): { color: string; glow: string } {
  if (score >= 70) return { color: '#0E7A5A', glow: 'rgba(14,122,90,0.2)' }
  if (score >= 40) return { color: '#0E7A5A', glow: 'rgba(14,122,90,0.15)' }
  return { color: '#C05A12', glow: 'rgba(192,90,18,0.2)' }
}

function scoreTier(score: number): { label: string; line: string } {
  if (score >= 80) return { label: 'On Track',  line: "You're ahead of most applicants" }
  if (score >= 65) return { label: 'Growing',   line: 'Strong momentum — keep pushing' }
  if (score >= 40) return { label: 'Building',  line: 'Every gap you close matters' }
  return               { label: 'Starting',  line: 'Your best career day starts now' }
}

interface ScoreRingCardProps {
  score: MockCareerScore
  userName: string
  targetRole: string
}

export function ScoreRingCard({ score, userName, targetRole }: ScoreRingCardProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [score.overallScore])

  const value = score.overallScore
  const { color, glow } = scoreArc(value)
  const { label, line } = scoreTier(value)
  const offset = animated ? CIRCUMFERENCE * (1 - value / 100) : CIRCUMFERENCE

  return (
    <div className="card-warm p-7 flex flex-col items-center relative overflow-hidden">
      {/* Ambient glow behind the ring */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 220,
          height: 220,
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(circle, ${glow} 0%, transparent 68%)`,
          borderRadius: '50%',
        }}
      />

      {/* Ring + numeral */}
      <div className="relative z-10">
        <svg
          viewBox="0 0 128 128"
          className="w-48 h-48"
          aria-label={`Career readiness score: ${value} out of 100`}
        >
          {/* Track */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke="#DCE0E4"
            strokeWidth="7"
          />
          {/* Progress */}
          <circle
            cx={CX} cy={CY} r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{
              transition: 'stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 5px ${glow})`,
            }}
          />
        </svg>

        {/* Score numeral */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center select-none"
          style={{ gap: '0.1rem' }}
        >
          <span
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: '3.5rem',
              lineHeight: 1,
              color,
              letterSpacing: '-0.04em',
            }}
          >
            {value}
          </span>
          <span
            style={{
              fontSize: '0.6rem',
              color: '#8A94A2',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            out of 100
          </span>
        </div>
      </div>

      {/* Name + target */}
      <div className="mt-5 text-center z-10">
        <p
          style={{
            fontSize: '0.65rem',
            color: '#8A94A2',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          Career Readiness
        </p>
        <p style={{ fontWeight: 600, color: '#1B1E26', marginTop: '0.45rem', fontSize: '1rem' }}>
          {userName}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#5B6573', marginTop: '0.15rem' }}>
          {targetRole}
        </p>
      </div>

      {/* Tier badge + tagline */}
      <div className="mt-4 z-10 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {label}
        </span>
        <p style={{ fontSize: '0.7rem', color: '#8A94A2', marginTop: '0.4rem' }}>
          {line}
        </p>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.65rem', color: '#8A94A2', textAlign: 'center' }}>
        Updated today · Next check-in in 7 days
      </p>
    </div>
  )
}
