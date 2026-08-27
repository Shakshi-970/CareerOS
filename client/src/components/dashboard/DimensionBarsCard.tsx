import { useEffect, useState } from 'react'
import type { DimensionScore } from '@/lib/mock-data'

function barStyle(value: number): { color: string; label: string } {
  if (value >= 70) return { color: '#0E7A5A', label: 'Strong'     }
  if (value >= 50) return { color: '#0E7A5A', label: 'Good'       }
  return                  { color: '#C05A12', label: 'Needs work' }
}

interface DimensionBarsCardProps {
  dimensions: DimensionScore[]
}

export function DimensionBarsCard({ dimensions }: DimensionBarsCardProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="card-warm p-6 h-full">
      <h2 style={{ fontWeight: 700, color: '#1B1E26', fontSize: '1rem' }}>
        Score Breakdown
      </h2>
      <p style={{ fontSize: '0.7rem', color: '#8A94A2', marginTop: '0.2rem', marginBottom: '1.25rem' }}>
        How each dimension contributes to your readiness
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {dimensions.map(({ label, key, value }) => {
          const { color, label: barLabel } = barStyle(value)
          return (
            <div key={key}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#1B1E26', fontWeight: 500 }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      backgroundColor: `${color}15`,
                      color,
                    }}
                  >
                    {barLabel}
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#1B1E26',
                      width: '2rem',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {value}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: '6px',
                  backgroundColor: '#DCE0E4',
                  borderRadius: '999px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    backgroundColor: color,
                    width: animated ? `${value}%` : '0%',
                    transition: 'width 900ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
