import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '@/store/ui.store'
import { useProfileStore } from '@/store/profile.store'
import { mockUser, mockCareerScore } from '@/lib/mock-data'
import { AccountPanel } from './AccountPanel'

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

export function Header() {
  const toggleSidebar = useUiStore(s => s.toggleSidebar)
  const navigate = useNavigate()
  const profile = useProfileStore()
  const [panelOpen, setPanelOpen] = useState(false)

  const displayName = profile.isAnalyzed ? profile.analysis!.userInfo.name : mockUser.name
  const score = profile.isAnalyzed ? profile.analysis!.careerScore.overallScore : mockCareerScore.overallScore
  const initials = getInitials(displayName)

  return (
    <>
      <header
        className="h-14 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 flex-shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #DCE0E4',
          boxShadow: '0 1px 0 rgba(27,30,38,0.04)',
        }}
      >
        {/* Left: mobile menu + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-canvas"
            style={{ color: '#8A94A2' }}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            className="text-lg lg:hidden font-display"
            style={{
              fontWeight: 700,
              color: '#1B1E26',
            }}
          >
            CareerOS
          </span>
        </div>

        {/* Right: bell + score + avatar */}
        <div className="flex items-center gap-2.5">
          <button
            className="relative p-2 rounded-lg transition-colors hover:bg-canvas"
            style={{ color: '#8A94A2' }}
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#0E7A5A' }}
            />
          </button>

          {/* Score pill */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              backgroundColor: '#E7F3EE',
              color: '#0A5A42',
              border: '1px solid rgba(14,122,90,0.25)',
            }}
            title="Career Readiness Score"
          >
            <span
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: '0.65rem', opacity: 0.55, fontWeight: 500 }}>/ 100</span>
          </button>

          {/* Avatar */}
          <button
            onClick={() => setPanelOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold select-none hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0E7A5A' }}
            title={`${displayName} — click to manage account`}
          >
            {initials}
          </button>
        </div>
      </header>

      <AccountPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}
