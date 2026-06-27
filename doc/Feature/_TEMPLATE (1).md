# {Feature ID} — {Story Name}
> Story spec (independently deployable). Source: [docs/MISSING_FEATURES.md](../../MISSING_FEATURES.md) §{section}.

## Metadata
| Field | Value |
|---|---|
| **Feature ID** | {e.g. 1.1} |
| **Feature** | {e.g. Canvas Integration} |
| **Severity** | BLOCKER \| MAJOR \| MINOR |
| **Status (today)** | MISSING \| PARTIAL \| THIN \| DONE |
| **Estimated effort** | XS (≤1d) \| S (1w) \| M (2–4w) \| L (1–2mo) |
| **Owner** | {individual} |
| **Depends on** | {Feature IDs that must ship first} |
| **Unblocks** | {Feature IDs this enables} |

---

## 1. Problem Statement
2–4 sentences. What is missing today, who is hurt by the gap, and what outcome does fixing it create?

## 2. Goals
- 3–5 outcomes the work must achieve.

## 3. Non-Goals
- Explicit out-of-scope items so reviewers do not chase scope creep.

## 4. User Stories
- **As a {role}**, I want to {action} so that {value}.

## 5. Functional Requirements
RFC 2119 (MUST / SHOULD / MAY), numbered, testable.
- **FR-1.** The system MUST …

## 6. Non-Functional Requirements
- **Performance** — p95 latency / payload limits.
- **Security** — authn/authz, secret handling, threat notes.
- **Privacy** — what student/Canvas data is stored and for how long.
- **Accessibility** — WCAG 2.1 AA for any UI added.
- **Reliability** — failure modes, idempotency, retries.
- **Observability** — metrics, log fields, alerts.

## 7. Acceptance Criteria
Given/When/Then; each AC maps to ≥1 automated test.
- **AC-1.** *Given* … *When* … *Then* …

## 8. Data Model
- New tables / columns / enums, indexes, constraints.
- Migration file: `supabase/migrations/NNN_*.sql`.
- Backfill strategy for existing rows.

## 9. API Surface
- Routes (path, verb, auth scope), request/response shapes, rate limits.

## 10. UI / UX
- New/changed pages & components, key flows, empty/loading/error states, responsive + a11y notes. Respect the "ink + ember" tokens.

## 11. AI / ML Considerations
(Skip if not AI-touching.) Model, prompt, eval metric, fallback, cost budget.

## 12. Integration Points
- External services/APIs (with versions) and internal modules (with file paths).

## 13. Dependencies & Sequencing
- Must ship after / before; shared infra needed.

## 14. Risks & Mitigations
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| … | L/M/H | L/M/H | … |

## 15. Rollout Plan
- Feature flag name & default, migration sequencing, pilot, GA criteria, rollback path.

## 16. Test Plan
- Unit / Integration / E2E (Playwright) / Security / Accessibility (axe) / Manual.

## 17. Documentation
- README / help updates, API reference, runbook.

## 18. Open Questions
- Numbered decisions still needing an owner.

## 19. References
- Files touched, external specs (Canvas API, Web Push), related stories.
