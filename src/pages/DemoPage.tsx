import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/useAuth'
import { T, display, body, mono } from '../lib/theme'
import { Shell, Ember, card } from '../lib/Shell'

const PRESETS = [
  { label: '24 hour heads-up', title: 'Due in 24 hours', body: 'CSE 210 milestone — project planning' },
  { label: '3 hour warning', title: 'Due in 3 hours', body: 'Physics Lab 4 — spectrogram analysis' },
  { label: 'Final call', title: 'Due in 15 minutes!', body: 'WDD 131 final — submit now' },
]

type FnError = { message: string; context?: { text?: () => Promise<string> } }

export function DemoPage() {
  const { user } = useAuth()
  const [status, setStatus] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [preview, setPreview] = useState(PRESETS[1])
  const [banner, setBanner] = useState<{ title: string; body: string } | null>(null)

  // in-page simulated notification (works on EVERY device, incl. iPhone Safari)
  function showBanner(title: string, msg: string) {
    setBanner({ title, body: msg })
    setTimeout(() => setBanner(null), 4200)
  }

  // "Try it on this device": real local notification when supported,
  // graceful simulated banner when not (e.g. iPhone Safari tab)
  async function tryLocal() {
    setStatus(null)
    const canNotify = 'Notification' in window
    if (canNotify) {
      try {
        const perm = await Notification.requestPermission()
        if (perm === 'granted') {
          const reg = await navigator.serviceWorker?.getRegistration()
          const opts = { body: preview.body, icon: '/icon-192.png', badge: '/icon-192.png' }
          if (reg) await reg.showNotification(preview.title, opts)
          else new Notification(preview.title, opts)
          setStatus('✅ Check your notifications — nothing was saved or collected.')
          return
        }
        // permission declined → fall through to simulated banner
      } catch { /* fall through to simulated banner */ }
    }
    // fallback: simulated in-page notification
    showBanner(preview.title, preview.body)
    setStatus(canNotify
      ? 'Shown as a preview — allow notifications to see the real thing.'
      : 'Shown as a preview — on iPhone, install the app to your Home Screen for real notifications.')
  }

  async function fireReal(title: string, msg: string) {
    setSending(true); setStatus(null)
    try {
      const { data: sess } = await supabase.auth.getSession()
      const token = sess.session?.access_token
      if (!token) { setStatus('Sign in and enable alerts to send a real push.'); setSending(false); return }

      const { data, error } = await supabase.functions.invoke('send-demo', {
        headers: { Authorization: `Bearer ${token}` },
        body: { title, body: msg },
      })
      if (error) {
        const err = error as FnError
        let detail = err.message
        try { if (err.context?.text) detail = (await err.context.text()) || detail } catch { /* ignore */ }
        setStatus(`⚠️ ${detail}`)
      } else if (data && data.sent > 0) {
        setStatus(`✅ Sent to ${data.sent} device${data.sent === 1 ? '' : 's'} — check your screen!`)
      } else {
        setStatus('⚠️ No subscribed device. Enable alerts on this device first (Alerts page).')
      }
    } catch (e) {
      setStatus(`⚠️ ${String(e)}`)
    }
    setSending(false)
  }

  return (
    <Shell maxWidth={420} back>
      {/* simulated notification banner — slides in from the top */}
      {banner && (
        <div style={{
          position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 'min(92vw, 380px)', zIndex: 100,
          background: T.panel, border: `1px solid ${T.borderHi}`, borderRadius: 14,
          padding: '10px 13px', boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
          animation: 'tldSlideIn .35s ease',
        }}>
          <style>{`@keyframes tldSlideIn { from { transform: translate(-50%,-120%); opacity: 0 } to { transform: translate(-50%,0); opacity: 1 } }`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ width: 18, height: 18, background: T.ember + '26', borderRadius: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>⏳</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.text, fontFamily: body }}>The Last Deadline</span>
            <span style={{ fontSize: 10, color: T.faint, marginLeft: 'auto', fontFamily: body }}>now</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: body }}>{banner.title}</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, marginTop: 1 }}>{banner.body}</div>
        </div>
      )}

      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 26 }}>🔔</div>
          <div style={{ fontSize: 18, fontWeight: 500, color: T.text, fontFamily: display, marginTop: 6 }}>
            This is what a reminder looks like
          </div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5, marginTop: 4 }}>
            When an assignment enters one of your reminder windows, this lands on your lock screen — even with the app closed.
          </div>
        </div>

        {/* mock lock-screen preview */}
        <div style={{ background: T.ink, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: T.faint, fontFamily: mono, letterSpacing: '0.08em', marginBottom: 8, textAlign: 'center' }}>
            YOUR LOCK SCREEN
          </div>
          <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <span style={{ width: 17, height: 17, background: T.ember + '26', borderRadius: 5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>⏳</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: T.text, fontFamily: body }}>The Last Deadline</span>
              <span style={{ fontSize: 9, color: T.faint, marginLeft: 'auto', fontFamily: body }}>now</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, fontFamily: body }}>{preview.title}</div>
            <div style={{ fontSize: 11, color: T.muted, fontFamily: body, marginTop: 1 }}>{preview.body}</div>
          </div>
        </div>

        {/* presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPreview(p)}
              style={{
                background: preview.label === p.label ? T.panelHi : 'transparent',
                border: `1px solid ${preview.label === p.label ? T.borderHi : T.border}`, borderRadius: 10,
                padding: '11px 13px', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: display }}>{p.label}</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: body, marginTop: 2 }}>{p.title} · {p.body}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Ember full onClick={tryLocal}>Try it on this device</Ember>
          <div style={{ fontSize: 10, color: T.faint, fontFamily: body, textAlign: 'center', marginTop: 6 }}>
            No account needed — nothing is saved or collected.
          </div>
        </div>

        {user && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => fireReal(preview.title, preview.body)}
              disabled={sending}
              style={{
                width: '100%', background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`,
                cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8,
                padding: '11px', opacity: sending ? 0.5 : 1,
              }}
            >
              {sending ? 'Sending…' : 'Send a real push to my devices'}
            </button>
          </div>
        )}

        {status && (
          <div style={{ fontSize: 13, fontFamily: body, marginTop: 14, textAlign: 'center', color: status.startsWith('✅') ? T.green : T.amber }}>
            {status}
          </div>
        )}
      </div>
    </Shell>
  )
}