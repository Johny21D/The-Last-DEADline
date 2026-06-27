import { useEffect, useState } from 'react'
import { useAuth } from '../lib/useAuth'
import { supabase } from '../lib/supabase'
import { getUrgency } from '../lib/GetUrgency'
import type { Assignment } from '../lib/Types'
import { T, display, body, mono, urgencyColor } from '../lib/theme'
import { Shell, card } from '../lib/Shell'

function fmt(ms: number): string {
  const neg = ms < 0
  let s = Math.floor(Math.abs(ms) / 1000)
  const d = Math.floor(s / 86400); s -= d * 86400
  const h = Math.floor(s / 3600); s -= h * 3600
  const m = Math.floor(s / 60); s -= m * 60
  let out: string
  if (d >= 1) out = `${d}d ${h}h`
  else if (h >= 1) out = `${h}h ${m}m`
  else out = `${m}m ${s}s`
  return (neg ? '-' : '') + out
}
function fmtBig(ms: number): string {
  const neg = ms < 0
  let s = Math.floor(Math.abs(ms) / 1000)
  const d = Math.floor(s / 86400); s -= d * 86400
  const h = Math.floor(s / 3600); s -= h * 3600
  const m = Math.floor(s / 60); s -= m * 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (d >= 1) return `${neg ? '-' : ''}${d}d ${pad(h)}h`
  return `${neg ? '-' : ''}${pad(h)}:${pad(m)}:${pad(s)}`
}

// sample rows used only when logged out
const SAMPLE = [
  { name: 'Conflict reflection', time: '-1d 4h', c: T.red },
  { name: 'CSE 210 milestone', time: '8h', c: T.amber },
  { name: 'WDD 131 final', time: '4d', c: T.blue },
]

export function UrgencyPage() {
  const { user, } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [fetching, setFetching] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])

  useEffect(() => {
    if (!user) return
    setFetching(true)
    supabase.from('assignments').select('*').order('due_at', { ascending: true }).then(({ data }) => {
      if (data) setAssignments(data as Assignment[])
      setFetching(false)
    })
  }, [user])

  // logged in: real ranked data
  const live = assignments.filter((a) => !a.completed)
  const ranked = [...live]
  .filter((a) => new Date(a.due_at).getTime() > now)   // only future / not-yet-due
  .sort((a, b) => +new Date(a.due_at) - +new Date(b.due_at))
  const focal = ranked.filter((a) => new Date(a.due_at).getTime() > now)[0]
  const focalMs = focal ? new Date(focal.due_at).getTime() - now : 0
  const focalColor = focal ? urgencyColor[getUrgency(focal.due_at)] : T.red

  const isReal = !!user

  return (
    <Shell maxWidth={420} back>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 26 }}>▦</div>
          <div style={{ fontSize: 17, fontWeight: 500, color: T.text, fontFamily: display, marginTop: 6 }}>Not a list. A ranking.</div>
          <div style={{ fontSize: 12, color: T.muted, fontFamily: body, lineHeight: 1.5, marginTop: 4 }}>
            Canvas dumps everything in a pile. We rank by what's about to hurt — soonest first.
          </div>
        </div>

        {/* focal countdown */}
        <div style={{ background: T.ink, borderRadius: 8, padding: 14, textAlign: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: T.faint, fontFamily: mono, marginBottom: 6 }}>
            {isReal ? 'NEXT DEADLINE' : 'PREVIEW · NEXT DEADLINE'}
          </div>
          {isReal ? (
            focal ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 500, fontFamily: mono, color: focalColor }}>{fmtBig(focalMs)}</div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: body, marginTop: 4 }}>{focal.title} · {focal.course_name}</div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: T.muted, fontFamily: body, padding: '6px 0' }}>{fetching ? 'Loading…' : "Nothing upcoming. You're clear."}</div>
            )
          ) : (
            <>
              <div style={{ fontSize: 28, fontWeight: 500, fontFamily: mono, color: T.red }}>02:14:36</div>
              <div style={{ fontSize: 11, color: T.muted, fontFamily: body, marginTop: 4 }}>Physics lab 4 · PH 220</div>
            </>
          )}
        </div>

        {/* ranked list */}
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
          {isReal ? (
            fetching ? (
              <div style={{ padding: 12, fontSize: 12, color: T.muted, fontFamily: body }}>Loading your assignments…</div>
            ) : ranked.length === 0 ? (
              <div style={{ padding: 12, fontSize: 12, color: T.muted, fontFamily: body }}>No upcoming assignments — sync on the Setup page.</div>
            ) : (
              ranked.slice(0, 25).map((a) => {
                const ms = new Date(a.due_at).getTime() - now
                const c = urgencyColor[getUrgency(a.due_at)]
                return (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: `1px solid ${T.border}`, borderLeft: `3px solid ${c}` }}>
                    <span style={{ fontSize: 11, color: T.text, fontFamily: body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 8 }}>{a.title}</span>
                    <span style={{ fontSize: 11, fontFamily: mono, color: c, whiteSpace: 'nowrap' }}>{fmt(ms)}</span>
                  </div>
                )
              })
            )
          ) : (
            SAMPLE.map((r) => (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: `1px solid ${T.border}`, borderLeft: `3px solid ${r.c}` }}>
                <span style={{ fontSize: 11, color: T.text, fontFamily: body }}>{r.name}</span>
                <span style={{ fontSize: 11, fontFamily: mono, color: r.c }}>{r.time}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ fontSize: 11, color: T.faint, fontFamily: body, textAlign: 'center' }}>
          {isReal ? `Showing your ${ranked.length} upcoming assignment${ranked.length === 1 ? '' : 's'}, most urgent first.` : 'Sample shown. Sign in to see your real assignments.'}
        </div>
      </div>
    </Shell>
  )
}