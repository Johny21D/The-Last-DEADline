import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { T, display, body } from './theme'

export function CanvasSettings({ onSaved }: { onSaved?: () => void }) {
  const [domain, setDomain] = useState('')
  const [token, setToken] = useState('')
  const [hasExisting, setHasExisting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => { loadExisting() }, [])
  async function loadExisting() {
    const { data } = await supabase.from('canvas_tokens').select('canvas_domain').maybeSingle()
    if (data) { setDomain(data.canvas_domain); setHasExisting(true) }
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMessage(null)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setMessage('You must be signed in.'); setSaving(false); return }
    const { error } = await supabase.from('canvas_tokens').upsert(
      { user_id: userId, canvas_domain: domain, canvas_token: token },
      { onConflict: 'user_id' }
    )
    if (error) setMessage(error.message)
    else { setMessage('Saved.'); setHasExisting(true); setToken(''); onSaved?.() }
    setSaving(false)
  }
  const input: React.CSSProperties = { width: '100%', boxSizing: 'border-box', background: T.ink, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, fontFamily: body, fontSize: 13, padding: '9px 11px', outline: 'none' }
  const label: React.CSSProperties = { fontSize: 11, color: T.muted, fontFamily: body, margin: '10px 0 4px', display: 'block' }
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontSize: 14, fontWeight: 500, color: T.text, fontFamily: display }}>Canvas connection</div>
      <div style={{ fontSize: 11, color: T.faint, fontFamily: body, marginTop: 4 }}>Account → Settings → New Access Token.</div>
      <label style={label}>Canvas domain</label>
      <input type="text" placeholder="byui.instructure.com" value={domain} onChange={(e) => setDomain(e.target.value)} required style={input} />
      <label style={label}>API token {hasExisting && '(leave blank to keep existing)'}</label>
      <input type="password" placeholder={hasExisting ? '••••••••' : 'Paste your Canvas token'} value={token} onChange={(e) => setToken(e.target.value)} required={!hasExisting} style={input} />
      {message && <div style={{ fontSize: 12, color: message === 'Saved.' ? T.green : T.red, fontFamily: body, marginTop: 10 }}>{message}</div>}
      <button type="submit" disabled={saving} style={{ width: '100%', marginTop: 14, background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`, cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '10px', opacity: saving ? 0.5 : 1 }}>{saving ? 'Saving…' : hasExisting ? 'Update connection' : 'Connect Canvas'}</button>
    </form>
  )
}