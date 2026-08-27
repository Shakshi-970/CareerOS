import { Link } from 'react-router-dom'
import { ChevronRight, Flame, Clock } from 'lucide-react'
import type { PriorityAction } from '@/lib/mock-data'

const urgencyConfig = {
  high:   { label: 'Urgent', icon: Flame, color: '#C05A12', bg: 'rgba(192,90,18,0.1)'   },
  medium: { label: 'Medium', icon: Clock, color: '#C05A12', bg: 'rgba(192,90,18,0.08)'  },
  low:    { label: 'Low',    icon: Clock, color: '#8A94A2', bg: 'rgba(138,148,162,0.1)' },
}

function parsePts(impact: string): number {
  const m = impact.match(/\+(\d+)/)
  return m ? parseInt(m[1]) : 0
}

interface PriorityActionsCardProps {
  actions: PriorityAction[]
  currentScore: number
}

export function PriorityActionsCard({ actions, currentScore }: PriorityActionsCardProps) {
  const totalGain = actions.reduce((s, a) => s + parsePts(a.impact), 0)
  const projectedScore = Math.min(100, currentScore + totalGain)

  return (
    <div className="card-warm p-6 h-full">
      <h2 style={{ fontWeight: 700, color: '#1B1E26', fontSize: '1rem' }}>
        Your 3 Priority Actions
      </h2>
      <p style={{ fontSize: '0.7rem', color: '#8A94A2', marginTop: '0.2rem', marginBottom: '1.25rem' }}>
        Complete these to see the biggest score jump
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {actions.map((item) => {
          const urgency = urgencyConfig[item.urgency]
          const UrgencyIcon = urgency.icon
          return (
            <Link
              key={item.rank}
              to={item.href}
              className="group"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                borderRadius: '12px',
                border: '1px solid transparent',
                transition: 'background 150ms, border-color 150ms',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = '#E7F3EE'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(14,122,90,0.25)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'transparent'
              }}
            >
              {/* Rank circle */}
              <span
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: '50%',
                  backgroundColor: '#0E7A5A',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.rank}
              </span>

              <span style={{ flex: 1, fontSize: '0.82rem', color: '#1B1E26', lineHeight: 1.35 }}>
                {item.action}
              </span>

              {/* Impact badge */}
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#C05A12',
                  backgroundColor: '#F6EBDE',
                  border: '1px solid rgba(192,90,18,0.2)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                {item.impact}
              </span>

              {/* Urgency chip */}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: urgency.color,
                  backgroundColor: urgency.bg,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  flexShrink: 0,
                }}
              >
                <UrgencyIcon style={{ width: '0.65rem', height: '0.65rem' }} />
                {urgency.label}
              </span>

              <ChevronRight style={{ width: '1rem', height: '1rem', color: '#8A94A2', flexShrink: 0 }} />
            </Link>
          )
        })}
      </div>

      <p
        style={{
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #DCE0E4',
          fontSize: '0.7rem',
          color: '#8A94A2',
        }}
      >
        Completing all 3 could raise your score to{' '}
        <span style={{ fontWeight: 700, color: '#0E7A5A' }}>{projectedScore} / 100</span>
      </p>
    </div>
  )
}
