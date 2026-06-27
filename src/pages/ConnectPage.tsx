import { useNavigate } from 'react-router-dom'
import { T, display, body } from '../lib/theme'
import { Shell, Ember, card } from '../lib/Shell'

export function ConnectPage() {
  const nav = useNavigate()
  return (
    <Shell maxWidth={420} back>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 26 }}>🔌</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: T.text, fontFamily: display, marginTop: 6 }}>Link your Canvas account</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5, marginTop: 4 }}>
            We use a read-only token to see your assignments and due dates. We never post or submit anything.
          </div>
        </div>
        <div style={{ background: T.ink, borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.text, fontFamily: display, marginBottom: 6 }}>How to get your token</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.8 }}>
            1. Canvas → Account → Settings<br />
            2. Scroll to “Approved integrations”<br />
            3. New access token → copy it
          </div>
        </div>
        <Ember full onClick={() => nav('/signup')}>Get started</Ember>
        <div style={{ fontSize: 11, color: T.faint, fontFamily: body, textAlign: 'center', marginTop: 10 }}>
          🔒 Your token is stored privately — only you can see it.
        </div>
      </div>
    </Shell>
  )
}
