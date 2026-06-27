import { useNavigate } from 'react-router-dom'
import { T, display, body, mono } from '../lib/theme'
import { Shell, Ember, Ghost, Spectrum } from '../lib/Shell'

export function Landing() {
  const nav = useNavigate()
  const col = (icon: string, title: string, copy: string, to: string) => (
    <div onClick={() => nav(to)} style={{
      flex: 1, minWidth: 150, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12,
      padding: '18px 16px', cursor: 'pointer',
    }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: T.text, fontFamily: display, margin: '10px 0 5px' }}>{title}</div>
      <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5 }}>{copy}</div>
      <div style={{ fontSize: 11, color: T.ember, fontFamily: body, marginTop: 8 }}>Learn more →</div>
    </div>
  )
  return (
    <Shell>
      <div style={{ textAlign: 'center', padding: '38px 12px 6px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', color: T.ember, fontFamily: mono, marginBottom: 16, textTransform: 'uppercase' }}>the clock is always running</div>
        <h1 style={{ fontSize: 42, lineHeight: 1.05, fontWeight: 500, color: T.text, fontFamily: display, letterSpacing: '-0.02em', margin: 0, maxWidth: 540, marginInline: 'auto' }}>
          Never miss another deadline.
        </h1>
        <p style={{ fontSize: 16, color: T.muted, fontFamily: body, maxWidth: 430, margin: '16px auto 26px', lineHeight: 1.5 }}>
          Your Canvas assignments, with reminders pushed to your phone and laptop before every deadline.
        </p>
        <div style={{ display: 'inline-flex', gap: 10 }}>
          <Ember onClick={() => nav('/signup')}>Get started</Ember>
          <Ghost onClick={() => nav('/signin')}>Sign in</Ghost>
        </div>
      </div>

      <div style={{ maxWidth: 460, margin: '32px auto 0' }}><Spectrum /></div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30, paddingBottom: 20 }}>
        {col('🔌', 'Connect your school', 'Link Canvas once with an access token.', '/connect')}
        {col('▦', 'Sorted by urgency', "See what's about to hurt, in order.", '/urgency')}
        {col('🔔', 'Pinged everywhere', 'Reminders on your phone and laptop.', '/alerts')}
      </div>
    </Shell>
  )
}
