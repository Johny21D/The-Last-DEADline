import { useNavigate } from 'react-router-dom'
import { T, display, body, FONT_IMPORT } from './theme'

export function Shell({ children, maxWidth = 640, back = false }: { children: React.ReactNode; maxWidth?: number; back?: boolean }) {
  const nav = useNavigate()
  return (
    <div style={{ background: T.ink, minHeight: '100vh', padding: '8px 16px 48px', fontFamily: body }}>
      <style>{FONT_IMPORT}</style>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 2px' }}>
          <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
            <span style={{ color: T.ember, fontSize: 18 }}>◷</span>
            <span style={{ fontSize: 16, fontWeight: 500, color: T.text, fontFamily: display, letterSpacing: '-0.01em' }}>The Last Deadline</span>
          </div>
          {back && (
            <button onClick={() => nav(-1)} style={{ background: 'transparent', color: T.muted, border: `1px solid ${T.borderHi}`, fontFamily: body, fontSize: 13, borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>← Back</button>
          )}
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
export const card: React.CSSProperties = { background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18 }
// eslint-disable-next-line react-refresh/only-export-components
export const input: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', background: T.ink, border: `1px solid ${T.border}`,
  borderRadius: 8, color: T.text, fontFamily: body, fontSize: 14, padding: '11px 12px', outline: 'none',
}