import { useEffect, useState } from 'react'
import type { Urgency } from './Types'

/**
 * Dark/light theming via CSS variables.
 * T.* now points at CSS variables, so components don't change at all —
 * flipping the `data-theme` attribute on <html> swaps every color at once.
 */

export const T = {
  ink: 'var(--ink)', panel: 'var(--panel)', panelHi: 'var(--panelHi)',
  border: 'var(--border)', borderHi: 'var(--borderHi)',
  ember: 'var(--ember)', red: 'var(--red)', amber: 'var(--amber)', green: 'var(--green)', blue: 'var(--blue)',
  text: 'var(--text)', muted: 'var(--muted)', faint: 'var(--faint)',
} as const

// the two palettes
export const DARK = {
  ink: '#0E1117', panel: '#161B22', panelHi: '#1C232C',
  border: '#262D38', borderHi: '#333C49',
  ember: '#FF6B35', red: '#FF4D4D', amber: '#FFB020', green: '#3FB950', blue: '#4D9FFF',
  text: '#E6EDF3', muted: '#8B949E', faint: '#5B6470',
}
export const LIGHT = {
  ink: '#F7F8FA', panel: '#FFFFFF', panelHi: '#F0F2F5',
  border: '#DBE0E6', borderHi: '#C4CBD4',
  ember: '#E8552A', red: '#E03B3B', amber: '#C77800', green: '#2A9D46', blue: '#2C7BE5',
  text: '#1A1F26', muted: '#5B6470', faint: '#98A0AB',
}

export const display = "'Space Grotesk', system-ui, sans-serif"
export const body = "'Inter', system-ui, sans-serif"
export const mono = "'JetBrains Mono', ui-monospace, monospace"

export const urgencyColor: Record<Urgency, string> = {
  overdue: T.red, critical: T.red, soon: T.amber, upcoming: T.blue, later: T.faint,
}
export const urgencyLabel: Record<Urgency, string> = {
  overdue: 'overdue', critical: 'due now', soon: 'soon', upcoming: 'upcoming', later: 'later',
}
export const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');"

// write a palette into CSS variables on <html>
function applyPalette(p: Record<string, string>) {
  const root = document.documentElement
  for (const [k, v] of Object.entries(p)) root.style.setProperty(`--${k}`, v)
}

export type ThemeMode = 'dark' | 'light'

/**
 * useTheme — call once near the top of your app (e.g. in App.tsx).
 * Persists choice in localStorage and applies the CSS variables.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) as ThemeMode | null
    return saved === 'light' || saved === 'dark' ? saved : 'dark'
  })

  useEffect(() => {
    applyPalette(mode === 'light' ? LIGHT : DARK)
    document.documentElement.setAttribute('data-theme', mode)
    document.documentElement.style.background = mode === 'light' ? LIGHT.ink : DARK.ink
    try { localStorage.setItem('theme', mode) } catch { /* ignore */ }
  }, [mode])

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'))
  return { mode, setMode, toggle }
}