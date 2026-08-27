import type { CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUiStore } from '@/store/ui.store'

export function AppLayout() {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div
        className="app-shell flex flex-col min-h-screen"
        style={{ '--sidebar-w': sidebarCollapsed ? '4rem' : '15rem' } as CSSProperties}
      >
        <Header />
        <main className="flex-1 px-5 py-5 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
