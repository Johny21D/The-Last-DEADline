# Feature Specs — The Last Deadline

This folder is the planning layer the coding agents read before implementing.
The structure follows one rule: **features are folders, stories are files.**

```
docs/
├── MISSING_FEATURES.md          ← backlog; every story links back to a section
└── features/
    ├── _TEMPLATE.md             ← the 19-section story template (all stories use it)
    ├── canvas-integration/      ← a FEATURE (theme; not deployable alone)
    │   ├── 1.1-canvas-account-connection.md   ← a STORY (independently deployable)
    │   └── 1.2-assignment-sync.md
    └── notifications/
        └── 2.1-web-push-subscription.md
```

## Definitions
- **Feature** — a folder. A theme of related work (Canvas Integration). Not shippable on its own.
- **Story** — a single `.md`. An *independently deployable* slice that can ship behind a flag without its siblings.

## Conventions
- File name: `{featureId}.{n}-{kebab-title}.md` (e.g. `1.2-assignment-sync.md`).
- Every story fills all 19 sections of `_TEMPLATE.md`; non-applicable sections say `N/A — reason`.
- Requirements use RFC 2119 (MUST / SHOULD / MAY). Acceptance criteria are Given/When/Then and map to tests.
- **No secrets** in any spec — env-var names only (`CANVAS_TOKEN_ENC_KEY`, `VAPID_PRIVATE_KEY`).

## Planning workflow
Feature breakdown is done with the `feature-planning` skill
(`.claude/skills/feature-planning/`), which is pinned to a more capable model
(Opus) because decomposition needs the whole system in view. The human owns the
decisions; the model drafts and structures the specs, which are then reviewed
against the skill's checklist before commit.
