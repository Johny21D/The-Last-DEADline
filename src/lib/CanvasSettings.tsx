import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function CanvasSettings() {
  const [domain, setDomain] = useState('')
  const [token, setToken] = useState('')
  const [hasExisting, setHasExisting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadExisting()
  }, [])

  async function loadExisting() {
    const { data } = await supabase
      .from('canvas_tokens')
      .select('canvas_domain')
      .maybeSingle()

    if (data) {
      setDomain(data.canvas_domain)
      setHasExisting(true)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      setMessage('You must be signed in.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('canvas_tokens')
      .upsert(
        {
          user_id: userId,
          canvas_domain: domain,
          canvas_token: token,
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Saved successfully.')
      setHasExisting(true)
      setToken('')
    }

    setSaving(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm"
    >
      <h2 className="font-semibold text-gray-900">Canvas Connection</h2>
      <p className="text-xs text-gray-500">
        Find your token in Canvas under Account → Settings → New Access Token.
      </p>

      <label className="text-xs font-medium text-gray-600">Canvas Domain</label>
      <input
        type="text"
        placeholder="byui.instructure.com"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        required
        className="rounded-md border px-3 py-2 text-sm"
      />

      <label className="text-xs font-medium text-gray-600">
        API Token {hasExisting && '(leave blank to keep existing token)'}
      </label>
      <input
        type="password"
        placeholder={hasExisting ? '••••••••' : 'Paste your Canvas token'}
        value={token}
        onChange={(e) => setToken(e.target.value)}
        required={!hasExisting}
        className="rounded-md border px-3 py-2 text-sm"
      />

      {message && <p className="text-sm text-gray-700">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : hasExisting ? 'Update Connection' : 'Connect Canvas'}
      </button>
    </form>
  )
}