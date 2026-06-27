import { useAuth } from '../lib/useAuth'
import { usePushNotifications } from '../lib/usePushNotifications'
import { ReminderSettings } from '../lib/ReminderSettings'
import { T, display, body, mono } from '../lib/theme'
import { Shell, card } from '../lib/Shell'

export function AlertsPage() {
  const { user } = useAuth()
  const { subscribed, loading: pushLoading, error: pushError, subscribe } = usePushNotifications()
  const isReal = !!user

  const chip = (t: string, l: string, danger?: boolean) => (
    <div style={{ flex: 1, background: T.ink, borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 500, fontFamily: mono, color: danger ? T.red : T.text }}>{t}</div>
      <div style={{ fontSize: 9, color: T.faint, fontFamily: body }}>{l}</div>
    </div>
  )

  return (
    <Shell maxWidth={420} back>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 26 }}>🔔</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: T.text, fontFamily: display, marginTop: 6 }}>Get pinged before it's due</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5, marginTop: 4 }}>
            Reminders land on your phone and laptop — even when the app is closed. You choose the timing.
          </div>
        </div>

        {!isReal ? (
          <>
            {/* logged out: explainer only */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {chip('48h', 'heads up')}{chip('24h', 'reminder')}{chip('3h', 'get on it')}{chip('1h', 'last call', true)}
            </div>
            <div style={{ background: T.ink, borderRadius: 8, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: T.faint, fontFamily: body, marginBottom: 6, textAlign: 'center' }}>what lands on your lock screen</div>
              <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 15, height: 15, background: T.red + '22', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>⏰</span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: T.text, fontFamily: body }}>The Last Deadline</span>
                  <span style={{ fontSize: 8, color: T.faint, marginLeft: 'auto', fontFamily: body }}>now</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: T.text, fontFamily: body }}>Due in 1 hour</div>
                <div style={{ fontSize: 9, color: T.muted, fontFamily: body }}>Physics lab 4 — spectrogram analysis</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.faint, fontFamily: body, textAlign: 'center', lineHeight: 1.5 }}>
              Sign in to turn on alerts and set your reminder times.
            </div>
          </>
        ) : (
          <>
            {/* logged in: real controls */}
            {!subscribed ? (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 13, color: T.muted, fontFamily: body, marginBottom: 10, lineHeight: 1.5 }}>Turn on notifications for this device first.</div>
                <button onClick={subscribe} disabled={pushLoading} style={{ width: '100%', background: 'transparent', color: T.text, border: `1px solid ${T.borderHi}`, cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '11px', opacity: pushLoading ? 0.5 : 1 }}>{pushLoading ? 'Enabling…' : 'Enable phone alerts'}</button>
                {pushError && <div style={{ fontSize: 12, color: T.red, fontFamily: body, marginTop: 10 }}>{pushError}</div>}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: T.green, fontFamily: body, marginBottom: 18 }}>✓ Alerts on for this device.</div>
            )}

            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
              <ReminderSettings />
            </div>

            <div style={{ fontSize: 11, color: T.faint, fontFamily: body, textAlign: 'center', lineHeight: 1.5, marginTop: 14 }}>
              On iPhone, add this app to your Home Screen so alerts reach your lock screen.
            </div>
          </>
        )}
      </div>
    </Shell>
  )
}