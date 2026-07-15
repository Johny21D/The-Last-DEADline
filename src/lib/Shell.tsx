import { useNavigate } from 'react-router-dom'
import { T, display, body, FONT_IMPORT, useTheme } from './theme'

export function Shell({ children, maxWidth = 640, back = false }: { children: React.ReactNode; maxWidth?: number; back?: boolean }) {
  const nav = useNavigate()
  const { mode, toggle } = useTheme()
  return (
    <div style={{ background: T.ink, minHeight: '100vh', padding: '4px 14px 40px', fontFamily: body }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', minWidth: 0 }}>
            <span style={{ color: T.ember, fontSize: 15 }}>◷</span>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: T.text, fontFamily: display, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>The Last Deadline</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {back && (
              <button onClick={() => nav(-1)} style={{ background: 'transparent', color: T.muted, border: `1px solid ${T.border}`, fontFamily: body, fontSize: 12, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>← Back</button>
            )}
            <button
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={mode === 'dark' ? 'Light mode' : 'Dark mode'}
              style={{
                width: 30, height: 30, borderRadius: 7, background: 'transparent',
                border: `1px solid ${T.border}`, cursor: 'pointer', fontSize: 13,
                display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, padding: 0,
              }}
            >
              {mode === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
        {children}
      </div>
    </div>
  )
}

export function Ember({ children, onClick, type = 'button', disabled, full }: { children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; full?: boolean }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: T.ember, color: '#1A0E08', border: 'none', cursor: 'pointer',
      fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '11px 18px',
      width: full ? '100%' : undefined, opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  )
}

export function Ghost({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`,
      fontFamily: body, fontSize: 14, borderRadius: 8, padding: '10px 16px', cursor: 'pointer',
      width: full ? '100%' : undefined,
    }}>{children}</button>
  )
}

export function Spectrum({ height = 12 }: { height?: number }) {
  return (
    <div style={{ display: 'flex', height, borderRadius: 6, overflow: 'hidden' }}>
      <div style={{ flex: 2, background: T.red }} /><div style={{ flex: 2, background: T.amber }} />
      <div style={{ flex: 2, background: T.green }} /><div style={{ flex: 3, background: T.blue }} />
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const card: React.CSSProperties = { background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16 }
// eslint-disable-next-line react-refresh/only-export-components
export const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: T.ink, border: `1px solid ${T.border}`,
  borderRadius: 8, color: T.text, fontFamily: body, fontSize: 14, padding: '11px 12px', outline: 'none',
}