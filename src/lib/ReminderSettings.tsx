import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { T, display, body, mono } from './theme'

type Unit = 'minutes' | 'hours' | 'days'
const toMin = (n: number, u: Unit) => u === 'minutes' ? n : u === 'hours' ? n * 60 : n * 1440
const fromMin = (m: number) => {
  if (m % 1440 === 0) return `${m / 1440} day${m / 1440 > 1 ? 's' : ''} before`
  if (m % 60 === 0) return `${m / 60} hour${m / 60 > 1 ? 's' : ''} before`
  return `${m} min before`
}

export function ReminderSettings() {
  const [offsets, setOffsets] = useState<number[]>([2880, 1440, 180]) // 48h,24h,3h
  const [num, setNum] = useState('48')
  const [unit, setUnit] = useState<Unit>('hours')
  const [repeatOn, setRepeatOn] = useState(false)
  const [repNum, setRepNum] = useState('3')
  const [repUnit, setRepUnit] = useState<Unit>('hours')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('reminder_settings').select('*').maybeSingle()
    if (data) {
      if (Array.isArray(data.before_offsets_min)) setOffsets(data.before_offsets_min)
      setRepeatOn(!!data.repeat_enabled)
      if (data.repeat_interval_min) { setRepNum(String(data.repeat_interval_min / 60 || 3)); setRepUnit('hours') }
    }
  }
  function addOffset() {
    const m = toMin(Number(num), unit)
    if (!m || offsets.includes(m)) return
    setOffsets([...offsets, m].sort((a, b) => b - a))
  }
  async function save() {
    setSaving(true); setMsg(null)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setMsg('Sign in first.'); setSaving(false); return }
    const { error } = await supabase.from('reminder_settings').upsert({
      user_id: userId,
      before_offsets_min: offsets,
      repeat_enabled: repeatOn,
      repeat_interval_min: toMin(Number(repNum), repUnit),
    }, { onConflict: 'user_id' })
    setMsg(error ? error.message : 'Saved.')
    setSaving(false)
  }

  const sel: React.CSSProperties = { background: T.ink, border: `1px solid ${T.borderHi}`, color: T.text, borderRadius: 8, fontFamily: body, fontSize: 12, padding: '7px 8px' }
  const numIn: React.CSSProperties = { width: 56, background: T.ink, border: `1px solid ${T.borderHi}`, color: T.text, borderRadius: 8, fontFamily: mono, fontSize: 12, padding: '7px 8px', boxSizing: 'border-box' }

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: display }}>Remind me before each deadline</div>
      <div style={{ fontSize: 11, color: T.faint, fontFamily: body, margin: '3px 0 10px' }}>One ping at each time you add.</div>
      {offsets.map((m) => (
        <div key={m} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${T.border}`, borderRadius: 8, padding: '7px 10px', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontFamily: mono, color: T.text }}>{fromMin(m)}</span>
          <span onClick={() => setOffsets(offsets.filter((x) => x !== m))} style={{ color: T.faint, cursor: 'pointer', fontSize: 14 }}>✕</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, marginBottom: 18 }}>
        <input style={numIn} value={num} onChange={(e) => setNum(e.target.value)} inputMode="numeric" />
        <select style={{ ...sel, flex: 1 }} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
          <option value="minutes">minutes before</option>
          <option value="hours">hours before</option>
          <option value="days">days before</option>
        </select>
        <button onClick={addOffset} style={{ background: T.ember, color: '#1A0E08', border: 'none', borderRadius: 8, padding: '0 14px', cursor: 'pointer', fontWeight: 500 }}>+</button>
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: display }}>Keep nagging until done</span>
          <span onClick={() => setRepeatOn(!repeatOn)} style={{ width: 38, height: 22, borderRadius: 11, background: repeatOn ? T.green : T.border, position: 'relative', cursor: 'pointer', transition: 'background .15s' }}>
            <span style={{ width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: repeatOn ? 18 : 2, transition: 'left .15s' }} />
          </span>
        </div>
        <div style={{ fontSize: 11, color: T.faint, fontFamily: body, margin: '3px 0 10px' }}>Repeat a ping on an interval while an assignment is still unchecked.</div>
        {repeatOn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: T.muted, fontFamily: body }}>Every</span>
            <input style={numIn} value={repNum} onChange={(e) => setRepNum(e.target.value)} inputMode="numeric" />
            <select style={{ ...sel, flex: 1 }} value={repUnit} onChange={(e) => setRepUnit(e.target.value as Unit)}>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>
        )}
      </div>

      {msg && <div style={{ fontSize: 12, color: msg === 'Saved.' ? T.green : T.red, fontFamily: body, marginTop: 12 }}>{msg}</div>}
      <button onClick={save} disabled={saving} style={{ width: '100%', marginTop: 14, background: T.ember, color: '#1A0E08', border: 'none', cursor: 'pointer', fontFamily: display, fontWeight: 500, fontSize: 14, borderRadius: 8, padding: '11px', opacity: saving ? 0.5 : 1 }}>{saving ? 'Saving…' : 'Save reminders'}</button>
    </div>
  )
}
