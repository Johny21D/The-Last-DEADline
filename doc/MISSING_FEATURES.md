# Missing Features — The Last Deadline

Source-of-truth backlog. Each section is a **feature** (a folder under
`docs/features/`); each numbered item becomes a **story** (one markdown file).
Stories link back here from their header.

## §1 — Canvas Integration
Get a user's real assignments into the app, reliably and observably.

| ID | Story | Status |
|---|---|---|
| 1.1 | Canvas Account Connection | PARTIAL |
| 1.2 | Assignment Sync | THIN (returns 0 — RPC failing) |
| 1.3 | Course filtering / archived-course handling | MISSING |

## §2 — Notifications
Deliver "pinged on your phone before it bites."

| ID | Story | Status |
|---|---|---|
| 2.1 | Web Push Subscription | MISSING |
| 2.2 | Scheduled Deadline Digest (cron) | MISSING |
| 2.3 | Urgency-tiered alert copy (Haiku-generated) | MISSING |

## §3 — Dashboard & UI
The screen the user lives in.

| ID | Story | Status |
|---|---|---|
| 3.1 | Deadline List View (urgency spectrum) | THIN |
| 3.2 | Filtering & sorting controls | MISSING |

## §0 — Foundations
Cross-cutting prerequisites.

| ID | Story | Status |
|---|---|---|
| 0.1 | Supabase Auth / accounts | PARTIAL |
