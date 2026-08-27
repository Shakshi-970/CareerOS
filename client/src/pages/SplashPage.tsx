import { useNavigate } from 'react-router-dom'
import {
  Zap,
  BarChart2,
  Target,
  BookOpen,
  Briefcase,
  MessageSquare,
  FileSearch,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

const features = [
  {
    icon: BarChart2,
    title: 'Career Readiness Score',
    desc: 'Composite score across 5 dimensions, updated as you grow',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.1)',
  },
  {
    icon: FileSearch,
    title: 'CareerOS DNA Report',
    desc: 'Full career diagnostic — archetype, strengths, risks, AI-generated',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
  {
    icon: Target,
    title: 'Skill Gap Analyzer',
    desc: 'Urgency × Closability matrix, prioritised for your target role',
    iconColor: '#C05A12',
    iconBg: 'rgba(192,90,18,0.08)',
  },
  {
    icon: BookOpen,
    title: 'Learning Roadmap',
    desc: '30/90/180-day plan with curated courses and hour estimates',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
  {
    icon: Briefcase,
    title: 'Job Match Dashboard',
    desc: 'Ranked by real fit %, not keyword overlap',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'Role-specific MCQs with answer frameworks and tips',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
]

const audiences = ['Final-year students', 'Working professionals', 'Career switchers', 'MBA graduates']

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F2F4F5', color: '#1B1E26', display: 'flex', flexDirection: 'column' }}>

      {/* ── Nav ── */}
      <nav
        style={{
          backgroundColor: '#1B1E26',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          height: '3.75rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#9FE3CB' }} />
          <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            CareerOS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ fontSize: '0.85rem', color: '#9FE3CB', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9FE3CB')}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/connect')}
            style={{
              fontSize: '0.82rem',
              backgroundColor: '#0E7A5A',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.45rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '5rem 1.5rem 4rem',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(14,122,90,0.08)',
            border: '1px solid rgba(14,122,90,0.2)',
            borderRadius: '999px',
            padding: '0.35rem 1rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#0E7A5A',
            marginBottom: '2rem',
            letterSpacing: '0.02em',
          }}
        >
          <Zap style={{ width: '0.7rem', height: '0.7rem' }} />
          AI-powered career intelligence · Built for India
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: '720px',
            marginBottom: '1.25rem',
            color: '#1B1E26',
            letterSpacing: '-0.025em',
          }}
        >
          Your Career{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #0E7A5A 0%, #0A5A42 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 800,
            }}
          >
            Operating System
          </span>
        </h1>

        <p
          style={{
            color: '#5B6573',
            fontSize: '1.05rem',
            maxWidth: '500px',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          One platform that aggregates your resume, LinkedIn, and certifications —
          then tells you exactly what to do next to land your target role.
        </p>

        {/* Audience tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.25rem',
          }}
        >
          {audiences.map(a => (
            <span
              key={a}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #DCE0E4',
                color: '#5B6573',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
              }}
            >
              <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem', color: '#0E7A5A' }} />
              {a}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '4.5rem',
          }}
        >
          <button
            onClick={() => navigate('/connect')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0E7A5A',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.85rem 2rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Start your career scan <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.85rem 2rem',
              borderRadius: '12px',
              border: '1.5px solid #DCE0E4',
              backgroundColor: 'transparent',
              color: '#5B6573',
              cursor: 'pointer',
              transition: 'border-color 150ms, background 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(14,122,90,0.4)'
              e.currentTarget.style.background = '#E7F3EE'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#DCE0E4'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            View demo dashboard
          </button>
        </div>

        {/* Feature grid */}
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <p
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#8A94A2',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '1.5rem',
            }}
          >
            Everything in one platform
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
              textAlign: 'left',
            }}
          >
            {features.map(({ icon: Icon, title, desc, iconColor, iconBg }) => (
              <div
                key={title}
                className="card-warm"
                style={{ padding: '1.25rem' }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '10px',
                    backgroundColor: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                  }}
                >
                  <Icon style={{ width: '1.1rem', height: '1.1rem', color: iconColor }} />
                </div>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B1E26', marginBottom: '0.3rem' }}>
                  {title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#5B6573', lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid #DCE0E4',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: '#8A94A2',
        }}
      >
        <span>© 2026 CareerOS · Built for India's ambitious professionals</span>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A94A2', fontSize: '0.7rem', transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#0E7A5A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8A94A2')}
        >
          View demo →
        </button>
      </footer>
    </div>
  )
}
