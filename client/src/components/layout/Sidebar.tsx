import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Target, BookOpen,
  Briefcase, MessageSquare, Link2, Zap,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useUiStore } from '@/store/ui.store'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     to: '/dashboard' },
  { icon: FileText,        label: 'DNA Report',    to: '/report'    },
  { icon: Target,          label: 'Skill Gap',     to: '/skills'    },
  { icon: BookOpen,        label: 'Learning',      to: '/learning'  },
  { icon: Briefcase,       label: 'Job Match',     to: '/jobs'      },
  { icon: MessageSquare,   label: 'Interview Prep',to: '/interview' },
]

export function Sidebar() {
  const { sidebarOpen, setSidebar, sidebarCollapsed, toggleSidebarCollapsed } = useUiStore()

  function navClass(isActive: boolean) {
    const base = [
      'flex items-center py-2.5 text-sm font-medium transition-all duration-150 rounded-r-md',
      sidebarCollapsed ? 'justify-center px-2 rounded-md' : 'gap-3 px-3',
    ].join(' ')

    if (isActive) {
      return sidebarCollapsed
        ? `${base} text-white bg-[rgba(14,122,90,0.25)]`
        : `${base} text-white bg-[rgba(14,122,90,0.25)] border-l-2 border-[#9FE3CB] rounded-l-none pl-[calc(0.75rem-2px)]`
    }
    return `${base} text-[#9FE3CB] hover:text-white hover:bg-[rgba(255,255,255,0.06)]`
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 h-full z-40 overflow-hidden flex flex-col',
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-16' : 'w-60',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{ backgroundColor: '#1B1E26' }}
      >
        {/* Right edge hairline */}
        <div className="absolute inset-y-0 right-0 w-px bg-white/[0.06]" />

        {/* Logo row */}
        {sidebarCollapsed ? (
          <div
            className="flex items-center justify-center h-16 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center justify-between h-16 flex-shrink-0 px-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Zap className="w-5 h-5 flex-shrink-0" style={{ color: '#9FE3CB' }} />
              <span
                className="font-display text-white font-bold text-lg tracking-tight truncate"
              >
                CareerOS
              </span>
            </div>
            <button
              onClick={toggleSidebarCollapsed}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-white/8 transition-colors flex-shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebar(false)}
              title={sidebarCollapsed ? label : undefined}
              className={({ isActive }) => navClass(isActive)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Connect Profile */}
        <div
          className="px-3 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <NavLink
            to="/connect"
            onClick={() => setSidebar(false)}
            title={sidebarCollapsed ? 'Connect Profile' : undefined}
            className={({ isActive }) => navClass(isActive)}
          >
            <Link2 className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Connect Profile</span>}
          </NavLink>
        </div>
      </aside>
    </>
  )
}
