import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { T, display, body } from '../lib/theme'
import { Shell, Ember, card, input } from '../lib/Shell'

export function SignIn() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else nav('/setup')
  }

  return (
    <Shell maxWidth={380} back>
      <div style={{ ...card, marginTop: 24 }}>
        <div style={{ fontSize: 17, fontWeight: 500, color: T.text, fontFamily: display, marginBottom: 4 }}>Welcome back</div>
        <div style={{ fontSize: 12, color: T.muted, fontFamily: body, marginBottom: 16 }}>Sign in to your account.</div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={input} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={input} />
          {error && <p style={{ fontSize: 13, color: T.red, fontFamily: body, margin: 0 }}>{error}</p>}
          <Ember type="submit" full disabled={loading}>{loading ? 'Loading…' : 'Sign in'}</Ember>
        </form>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: T.muted, fontFamily: body }}>
          No account yet? <Link to="/signup" style={{ color: T.ember, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </Shell>
  )
}
