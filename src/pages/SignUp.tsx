import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { T, display, body } from '../lib/theme'
import { Shell, Ember, card, input } from '../lib/Shell'

export function SignUp() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setNotice(null); setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    if (data.session) nav('/setup')
    else setNotice('Check your email to confirm your account, then sign in.')
  }

  return (
    <Shell maxWidth={380} back>
      <div style={{ ...card, marginTop: 24 }}>
        <div style={{ fontSize: 17, fontWeight: 500, color: T.text, fontFamily: display, marginBottom: 4 }}>Create your account</div>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: body, marginBottom: 16 }}>Sign up to get started.</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={input} />
          {error && <p style={{ fontSize: 13, color: T.red, fontFamily: body, margin: 0 }}>{error}</p>}
          {notice && <p style={{ fontSize: 13, color: T.green, fontFamily: body, margin: 0 }}>{notice}</p>}
          <Ember type="submit" full disabled={loading}>{loading ? 'Loading…' : 'Create account'}</Ember>
        </form>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: T.muted, fontFamily: body }}>
          Already have an account? <Link to="/signin" style={{ color: T.ember, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </Shell>
  )
}
