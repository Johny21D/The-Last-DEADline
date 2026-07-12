import { T, body, type ThemeMode } from './theme'

/**
 * A small floating sun/moon toggle, fixed to the top-right of the screen.
 * Pass the current mode + toggle from useTheme().
 */
export function ThemeToggle({ mode, toggle }: { mode: ThemeMode; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
      style={{
        position: 'fixed', top: 14, right: 14, zIndex: 50,
        width: 38, height: 38, borderRadius: 10,
        background: T.panel, border: `1px solid ${T.border}`,
        color: T.text, cursor: 'pointer', fontFamily: body, fontSize: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      {mode === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}