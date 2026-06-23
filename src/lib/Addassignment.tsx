import { useState } from 'react'
import { supabase } from './supabase'

export function AddAssignmentForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState('')
  const [course, setCourse] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id

    if (!userId) {
      setError('You must be signed in.')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('assignments').insert({
      title,
      course_name: course,
      due_at: dueAt,
      user_id: userId,
      canvas_assignment_id: Date.now(), // placeholder until real Canvas sync exists
    })

    if (error) {
      setError(error.message)
    } else {
      setTitle('')
      setCourse('')
      setDueAt('')
      onAdded()
    }

    setSaving(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm"
    >
      <h2 className="font-semibold text-gray-900">Add Assignment</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="rounded-md border px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Course (e.g. CSE 210)"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        required
        className="rounded-md border px-3 py-2 text-sm"
      />
      <input
        type="datetime-local"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        required
        className="rounded-md border px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Add Assignment'}
      </button>
    </form>
  )
}