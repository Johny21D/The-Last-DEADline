import type { Urgency } from './Types'

export function getUrgency(dueAt: string): Urgency {
  const due = new Date(dueAt).getTime()
  const now = Date.now()
  const hoursUntilDue = (due - now) / (1000 * 60 * 60)

  if (hoursUntilDue < 0) return 'overdue'
  if (hoursUntilDue <= 24) return 'critical'
  if (hoursUntilDue <= 72) return 'soon'
  if (hoursUntilDue <= 168) return 'upcoming'
  return 'later'
}