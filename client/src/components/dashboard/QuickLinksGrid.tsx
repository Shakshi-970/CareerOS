import { Link } from 'react-router-dom'
import { FileText, Target, BookOpen, Briefcase, MessageSquare, ArrowRight } from 'lucide-react'

const links = [
  {
    icon: FileText,
    label: 'DNA Report',
    sublabel: 'Full diagnostic',
    href: '/report',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.1)',
  },
  {
    icon: Target,
    label: 'Skill Gap',
    sublabel: '5 gaps open',
    href: '/skills',
    iconColor: '#C05A12',
    iconBg: 'rgba(192,90,18,0.08)',
  },
  {
    icon: BookOpen,
    label: 'Learning',
    sublabel: '30/90/180 day',
    href: '/learning',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
  {
    icon: Briefcase,
    label: 'Job Match',
    sublabel: '72% top match',
    href: '/jobs',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
  {
    icon: MessageSquare,
    label: 'Interview',
    sublabel: 'Prep questions',
    href: '/interview',
    iconColor: '#0E7A5A',
    iconBg: 'rgba(14,122,90,0.08)',
  },
]

export function QuickLinksGrid() {
  return (
    <div className="card-warm p-6">
      <h2 style={{ fontWeight: 700, color: '#1B1E26', fontSize: '1rem', marginBottom: '1rem' }}>
        Quick Access
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {links.map(({ icon: Icon, label, sublabel, href, iconColor, iconBg }) => (
          <Link
            key={href}
            to={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 0.75rem',
              borderRadius: '14px',
              backgroundColor: '#F2F4F5',
              border: '1px solid rgba(14,122,90,0.07)',
              textDecoration: 'none',
              transition: 'box-shadow 180ms, transform 180ms, border-color 180ms, background 180ms',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = '0 6px 20px rgba(14,122,90,0.12)'
              el.style.transform = 'translateY(-2px)'
              el.style.borderColor = 'rgba(14,122,90,0.25)'
              el.style.backgroundColor = '#E7F3EE'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.boxShadow = 'none'
              el.style.transform = 'none'
              el.style.borderColor = 'rgba(14,122,90,0.07)'
              el.style.backgroundColor = '#F2F4F5'
            }}
          >
            <div
              style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: '12px',
                backgroundColor: iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon style={{ width: '1.2rem', height: '1.2rem', color: iconColor }} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1B1E26' }}>{label}</p>
              <p style={{ fontSize: '0.65rem', color: '#8A94A2', marginTop: '0.1rem' }}>{sublabel}</p>
            </div>
            <ArrowRight style={{ width: '0.85rem', height: '0.85rem', color: '#8A94A2' }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
