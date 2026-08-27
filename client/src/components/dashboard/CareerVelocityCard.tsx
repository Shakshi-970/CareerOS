import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import type { VelocityPoint } from '@/lib/mock-data'

interface CareerVelocityCardProps {
  data: VelocityPoint[]
}

export function CareerVelocityCard({ data }: CareerVelocityCardProps) {
  const first = data[0].score
  const last = data[data.length - 1].score
  const gain = last - first

  return (
    <div className="card-warm p-6 h-full flex flex-col">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontWeight: 700, color: '#1B1E26', fontSize: '1rem' }}>Career Velocity</h2>
          <p style={{ fontSize: '0.7rem', color: '#8A94A2', marginTop: '0.15rem' }}>Score trend over 6 months</p>
        </div>
        <TrendingUp style={{ width: '1rem', height: '1rem', color: '#0E7A5A', marginTop: '0.1rem' }} />
      </div>

      {/* Gain number */}
      <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
        <span
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: '2rem',
            lineHeight: 1,
            color: '#0E7A5A',
            letterSpacing: '-0.03em',
          }}
        >
          +{gain}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#5B6573' }}>pts gained</span>
      </div>

      <div style={{ flex: 1, minHeight: '100px', marginTop: '0.75rem' }}>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 10, left: -20 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 10,
                border: '1px solid #DCE0E4',
                boxShadow: '0 4px 12px rgba(27,30,38,0.08)',
                backgroundColor: '#FFFFFF',
                color: '#1B1E26',
              }}
              labelStyle={{ color: '#5B6573', fontWeight: 500 }}
              formatter={(value) => [value, 'Score']}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#0E7A5A"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#0E7A5A', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#0E7A5A', stroke: 'rgba(14,122,90,0.3)', strokeWidth: 2 }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
