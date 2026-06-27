import type { Urgency } from './Types'

export const T = {
  ink: '#0E1117', panel: '#161B22', panelHi: '#1C232C',
  border: '#262D38', borderHi: '#333C49',
  ember: '#FF6B35', red: '#FF4D4D', amber: '#FFB020', green: '#3FB950', blue: '#4D9FFF',
  text: '#E6EDF3', muted: '#8B949E', faint: '#5B6470',
} as const

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