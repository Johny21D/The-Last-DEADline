---
name: feature-planning
description: >-
  Use when breaking a large feature for "The Last Deadline" into independently
  deployable stories, or when writing/refining a story spec under
  docs/features/. Triggers: "plan this feature", "break this into stories",
  "write a story spec", "fill out the template", or any edit to a file matching
  docs/features/**/*.md. Produces RFC-2119 story specs that follow
  docs/features/_TEMPLATE.md so downstream coding agents can implement from a
  consistent pattern.
model: opus
---

# Feature Planning

Planning is the highest-leverage step in this repo: every coding agent that
comes after reads these specs as ground truth. Spend the smarter model's budget
here so the cheaper implementation passes have an unambiguous target.

## When to use

- Decomposing a feature folder (e.g. `canvas-integration/`) into stories.
- Authoring or revising a single story spec.
- Sanity-checking that a story is *independently deployable* before coding starts.

## Model

This skill is pinned to `opus` (Claude Opus 4.8) via the frontmatter above.
Feature breakdown requires holding the whole system in view at once —
dependencies, data model, rollout sequencing — which is where the more capable
model earns its cost. Implementation stories are then handed to the default
model for coding, with this spec as the contract.

## The pattern (do not deviate)

1. **One folder per feature.** A feature is a theme (e.g. Canvas Integration).
   It is *not* deployable on its own.
2. **One markdown file per story.** A story IS independently deployable — it can
   ship to production behind a flag without any sibling story. Name files
   `{feature}.{n}-{kebab-title}.md` (e.g. `1.2-assignment-sync.md`).
3. **Every story follows `docs/features/_TEMPLATE.md`.** All 19 sections present.
   If a section truly does not apply, write `N/A — {one-line reason}` rather
   than deleting it. Consistency is what makes the corpus agent-readable.
4. **Trace every story back to the backlog.** The header link points at
   `docs/MISSING_FEATURES.md §{section}` so scope is auditable.

## Authoring checklist

- [ ] Metadata table complete; `Depends on` / `Unblocks` reference real Feature IDs.
- [ ] Functional requirements use MUST / SHOULD / MAY (RFC 2119) and are testable.
- [ ] Each Acceptance Criterion is Given/When/Then and maps to ≥1 automated test.
- [ ] Data Model names concrete tables/columns and a migration file
      (`supabase/migrations/NNN_*.sql`).
- [ ] API Surface lists path, verb, and auth scope for every route.
- [ ] **No secrets.** Canvas tokens, Supabase service keys, and VAPID private
      keys are referenced by env-var name only — never pasted.
- [ ] Story is independently deployable, or its dependency is stated explicitly.

## Verification discipline

Generate the spec, then read it back against the checklist before saving. The
human owns the decisions (which feature is the signature, what ships first, what
is out of scope); the model drafts and structures. Flag open questions in
section 18 rather than inventing an answer.

## Project context (The Last Deadline)

- **Frontend:** React + Vite + TypeScript + Tailwind, React Router, deployed on Vercel.
- **Backend:** Node.js / Express; Supabase (Postgres + Auth) as the data layer.
- **Notifications:** Web Push API (VAPID); a scheduled cron is planned, not yet built.
- **Integration:** Canvas LMS REST API via a user-supplied access token.
- **Design system:** "ink + ember" — dark ink base, ember/urgency-spectrum accents,
  monospace numerals for countdowns. Any UI section should respect these tokens.
