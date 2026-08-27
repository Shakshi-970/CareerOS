import { create } from 'zustand'

interface UiStore {
  sidebarOpen: boolean       // mobile drawer open/close
  sidebarCollapsed: boolean  // desktop icon-only mode
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  toggleSidebarCollapsed: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
