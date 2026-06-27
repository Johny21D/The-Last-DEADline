import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { T, display, body } from './theme'

export function CanvasSettings({ onSaved }: { onSaved?: () => void }) {
  const [domain, setDomain] = useState('')
  const [token, setToken] = useState('')
  const [hasExisting, setHasExisting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [editingToken, setEditingToken] = useState(false) // controls the inline expand

  useEffect(() => { loadExisting() }, [])
  async function loadExisting() {
    const { data } = await supabase.from('canvas_tokens').select('canvas_domain').maybeSingle()
    if (data) { setDomain(data.canvas_domain); setHasExisting(true) }
  }

  async function saveConnection(includeToken: boolean) {
    setSaving(true); setMessage(null)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setMessage('You must be signed in.'); setSaving(false); return }

    // build the row — only include the token when we actually have a new one
    const row: Record<string, unknown> = { user_id: userId, canvas_domain: domain }
    if (includeToken && token.trim()) row.canvas_token = token.trim()

    const { error } = await supabase.from('canvas_tokens').upsert(row, { onConflict: 'user_id' })
    if (error) setMessage(error.message)
    else {
      setMessage('Saved.')
      setHasExisting(true)
      setToken('')
      setEditingToken(false)
      onSaved?.()
    }
    setSaving(false)
  }

  const input: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: T.ink, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontFamily: body, fontSize: 13, padding: '9px 11px', outline: 'none' }
  const label: React.CSSProperties = { fontSize: 11, color: T.muted, fontFamily: body, margin: '10px 0 4px', display: 'block' }
  const saveBtn: React.CSSProperties = { width: '100%', marginTop: 12, background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`, cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '10px', opacity: saving ? 0.5 : 1 }

  // ---------- CONNECTED VIEW: status + "Update token" inline-expand ----------
  if (hasExisting) {
    return (
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: display }}>Canvas connection</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 12, color: T.text, fontFamily: body, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: T.green }}>✓</span> Connected · {domain}
          </span>
          <span
            onClick={() => { setEditingToken(!editingToken); setMessage(null) }}
            style={{ fontSize: 11, color: T.blue, fontFamily: body, cursor: 'pointer', userSelect: 'none' }}
          >
            Update token {editingToken ? '▲' : '▼'}
          </span>
        </div>

        {/* inline-expand panel */}
        <div style={{ maxHeight: editingToken ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
          <div style={{ background: T.ink, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: 11, color: T.faint, fontFamily: body, marginBottom: 6 }}>
              Paste a fresh token from Canvas → Account → Settings → New Access Token.
            </div>
            <label style={label}>New access token</label>
            <input
              type="password"
              placeholder="Paste your new Canvas token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={input}
            />
            <button
              type="button"
              disabled={saving || !token.trim()}
              onClick={() => saveConnection(true)}
              style={{ ...saveBtn, opacity: saving || !token.trim() ? 0.5 : 1 }}
            >
              {saving ? 'Saving…' : 'Save token'}
            </button>
          </div>
        </div>

        {message && (
          <div style={{ fontSize: 12, color: message === 'Saved.' ? T.green : T.red, fontFamily: body, marginTop: 10 }}>{message}</div>
        )}
      </div>
    )
  }

  // ---------- FIRST-TIME VIEW: full domain + token form ----------
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: display }}>Canvas connection</div>
      <div style={{ fontSize: 11, color: T.faint, fontFamily: body, marginTop: 4 }}>Account → Settings → New Access Token.</div>

      <label style={label}>Canvas domain</label>
      <input type="text" placeholder="byui.instructure.com" value={domain} onChange={(e) => setDomain(e.target.value)} style={input} />

      <label style={label}>API token</label>
      <input type="password" placeholder="Paste your Canvas token" value={token} onChange={(e) => setToken(e.target.value)} style={input} />

      {message && <div style={{ fontSize: 12, color: message === 'Saved.' ? T.green : T.red, fontFamily: body, marginTop: 10 }}>{message}</div>}

      <button
        type="button"
        disabled={saving || !domain.trim() || !token.trim()}
        onClick={() => saveConnection(true)}
        style={{ ...saveBtn, opacity: saving || !domain.trim() || !token.trim() ? 0.5 : 1 }}
      >
        {saving ? 'Saving…' : 'Connect Canvas'}
      </button>
    </div>
  )
}