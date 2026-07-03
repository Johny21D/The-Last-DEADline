import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CanvasSettings } from '../lib/CanvasSettings'
import { T, display, body, mono } from '../lib/theme'
import { Shell, Ember } from '../lib/Shell'

export function Setup() {
  const nav = useNavigate()
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  async function handleSignOut() { await supabase.auth.signOut(); nav('/') }

  async function handleSync() {
    setSyncing(true); setSyncMsg(null)
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token
    const { data, error } = await supabase.functions.invoke('sync-canvas-assignments', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (error) {
      let detail = error.message
      try {
  const ctx = (error as { context?: { text?: () => Promise<string> } }).context 
    if (ctx?.text) detail = (await ctx.text()) || detail} catch { /* */ }
      console.error('SYNC ERROR:', detail); setSyncMsg(`Sync failed: ${detail}`)
    } else setSyncMsg(`Synced ${data.synced} assignments.`)
    setSyncing(false)
  }

  const cardStyle: React.CSSProperties = { background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 14 }
  const step: React.CSSProperties = { fontFamily: mono, fontSize: 12, color: T.ember, marginBottom: 10, letterSpacing: '0.05em' }
  const linkBtn: React.CSSProperties = { background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`, fontFamily: body, fontSize: 13, borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }

  return (
    <Shell maxWidth={420}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -8, marginBottom: 8 }}>
        <button onClick={() => nav('/')} style={linkBtn}>← Home</button>
        <button onClick={handleSignOut} style={{ ...linkBtn, color: T.muted }}>Sign out</button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: T.text, fontFamily: display, marginBottom: 6 }}>Connect &amp; sync.</div>
        <div style={{ fontSize: 13, color: T.muted, fontFamily: body, lineHeight: 1.5 }}>Link Canvas, then set your reminders on the alerts page.</div>
      </div>

      {/* STEP 1 — connect canvas only */}
      <div style={cardStyle}>
        <div style={step}>STEP 1 · CONNECT CANVAS</div>
        <CanvasSettings />
        <Ember full onClick={handleSync} disabled={syncing}>{syncing ? 'Syncing…' : 'Sync assignments'}</Ember>
        {syncMsg && <div style={{ fontSize: 12, marginTop: 10, fontFamily: body, color: syncMsg.startsWith('Sync failed') ? T.red : T.green }}>{syncMsg}</div>}
      </div>

      {/* STEP 2 — go to alerts */}
      <div style={cardStyle}>
        <div style={step}>STEP 2 · SET UP ALERTS</div>
        <div style={{ fontSize: 13, color: T.muted, fontFamily: body, marginBottom: 12, lineHeight: 1.5 }}>Turn on notifications and choose when you want to be reminded.</div>
        <button onClick={() => nav('/alerts')} style={{ width: '100%', background: T.ember, color: '#1A0E08', border: 'none', cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '11px' }}>Go to alerts &amp; reminders →</button>
      </div>

      <div style={{ fontSize: 11, color: T.faint, fontFamily: body, textAlign: 'center', lineHeight: 1.6, marginTop: 6 }}>
        On iPhone, add this app to your Home Screen so alerts reach your lock screen.
      </div>
    </Shell>
  )
}