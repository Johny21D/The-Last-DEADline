import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { T, display, body, mono } from '../lib/theme'
import { Shell, Ember, card } from '../lib/Shell'

// preset notifications to show off during the live demo
const PRESETS = [
  { label: '1 hour warning', title: 'Due in 1 hour', body: 'Physics Lab 4 — spectrogram analysis' },
  { label: '24 hour heads-up', title: 'Due in 24 hours', body: 'CSE 210 milestone — project planning' },
  { label: 'Final call', title: 'Due in 15 minutes!', body: 'WDD 131 final — submit now' },
]

export function DemoPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function fire(title: string, msg: string) {
    setSending(true); setStatus(null)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) { setStatus('⚠️ Sign in first (and enable alerts).'); setSending(false); return }

      const { data, error } = await supabase.functions.invoke('send-demo', {
        headers: { Authorization: `Bearer ${token}` },
        body: { title, body: msg },
      })
      if (error) {
        let detail = error.message
        try { const ctx = (error as any).context; if (ctx?.text) detail = (await ctx.text()) || detail } catch { /* */ }
        setStatus(`⚠️ ${detail}`)
      } else if (data?.sent > 0) {
        setStatus(`✅ Sent to ${data.sent} device${data.sent === 1 ? '' : 's'} — check your screen!`)
      } else {
        setStatus('⚠️ No device got it. Enable alerts on this device first.')
      }
    } catch (e) {
      setStatus(`⚠️ ${String(e)}`)
    }
    setSending(false)
  }

  return (
    <Shell maxWidth={420} back>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 26 }}>🎤</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: T.text, fontFamily: display, marginTop: 6 }}>Demo mode</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5, marginTop: 4 }}>
            Tap a button to fire a real push notification to your device right now.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => fire(p.title, p.body)}
              disabled={sending}
              style={{
                background: T.panelHi, border: `1px solid ${T.border}`, borderRadius: 10,
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left', opacity: sending ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: display }}>{p.label}</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: body, marginTop: 2 }}>{p.title} · {p.body}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <Ember full disabled={sending} onClick={() => fire('The Last Deadline', 'This is a live demo notification 🎯')}>
            {sending ? 'Sending…' : 'Fire a custom demo ping'}
          </Ember>
        </div>

        {status && (
          <div style={{ fontSize: 13, fontFamily: body, marginTop: 14, textAlign: 'center', color: status.startsWith('✅') ? T.green : T.amber }}>
            {status}
          </div>
        )}

        <div style={{ fontSize: 11, color: T.faint, fontFamily: mono, marginTop: 18, textAlign: 'center', lineHeight: 1.5 }}>
          Make sure alerts are enabled on this device first (Alerts page → Enable phone alerts).
        </div>
      </div>
    </Shell>
  )
}