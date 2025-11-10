import { defineStore } from 'pinia'

const STORAGE_KEY = 'theme' // 'system' | 'dark' | 'light'

function applyTheme(mode) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  // Remove/add .dark on <html> based on mode
  if (mode === 'dark' || (mode === 'system' && prefersDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: localStorage.getItem(STORAGE_KEY) || 'system', // 'system' by default
  }),
  actions: {
    init() {
      // Apply current mode on load
      applyTheme(this.mode)

      // React to OS theme changes only when in 'system'
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => { if (this.mode === 'system') applyTheme('system') }
      mq.addEventListener?.('change', handler)
    },

    set(mode) {
      this.mode = mode
      localStorage.setItem(STORAGE_KEY, mode)
      applyTheme(mode)
    },

    // Cycle: system -> dark -> light -> system...
    toggle() {
      const next = this.mode === 'system' ? 'dark' : this.mode === 'dark' ? 'light' : 'system'
      this.set(next)
    },
  },
})
