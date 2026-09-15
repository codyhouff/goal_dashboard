# Task: Jira goals workflow and integration boundary

## Status
Completed

## Goal
Make the Tasks prototype reflect the selected Jira goals workflow and document a
safe path for Jira synchronization and AI-assisted note-to-task creation.

## Context
Jira Cloud will become the source of truth for personal goals and tasks. The
current prototype uses a five-stage local board and still describes Trello as
the future provider.

## Acceptance criteria
- [x] Tasks use This Year, This Month, This Week, Research, In Progress, and Done.
- [x] The first three stages map to Jira's To do category, Research and In
      Progress map to In progress, and Done maps to Done.
- [x] The prototype retains drag/drop, arrow controls, counts, and local demo
      persistence across all six stages.
- [x] Public documentation describes Epic -> Goal/Task -> Subtask hierarchy,
      section mapping, WIP guidance, and AI note review.
- [x] `.env.example` contains placeholders only, while the ignored local `.env`
      shows exactly where the real Jira credentials belong.
- [x] Jira tokens never enter the browser bundle or public repository.

## Relevant paths

### Inspected
- `prototype/index.html` - current five-column task board.
- `prototype/app.js` - ordered stages and local persistence.
- `prototype/styles.css` - five-column desktop/mobile layouts.
- `prototype/sections.md` - obsolete Trello synchronization design.
- `docs/PRODUCT.md` - durable task workflow definition.
- `docs/ARCHITECTURE.md` - external task-adapter boundary.

## Implementation plan
1. Add safe public/private Jira configuration templates.
2. Replace the prototype workflow with the six selected Jira stages.
3. Document Jira hierarchy, status categories, synchronization, and AI review.
4. Verify markup, script syntax, privacy boundaries, and the integrated diff.

## Verification
- Prototype markup: `python -m html.parser prototype/index.html`
- Prototype script syntax: `node --check prototype/app.js`
- Privacy/config checks: `git check-ignore -v .env` and secret-pattern scan
- Diff integrity: `git diff --check`

## Risks / edge cases
- Jira transition IDs must be discovered from the live workflow rather than
  inferred from visible column names.
- API token authentication also requires the Atlassian account email and acts
  with that account's Jira permissions.
- Browser local storage is demo-only and will be replaced by Jira-backed state.

## Non-goals
- Calling the live Jira API before credentials and a private backend exist.
- Storing credentials in the public frontend.
- Automatically applying destructive or bulk AI changes without review.

## Completion notes
- Replaced the local five-stage board with the selected six-stage Jira workflow.
- Added status-category metadata, two-card WIP warnings, and a new local-storage
  namespace while preserving drag/drop, arrow movement, and counts.
- Replaced current Trello guidance with Jira hierarchy, synchronization, AI note
  review, and credential-boundary documentation.
- Added safe `.env.example` placeholders and an ignored local `.env` with blank
  account-email and token fields.
- `python -m html.parser prototype/index.html`, `node --check prototype/app.js`,
  structural stage/task checks, `git diff --check`, and privacy scans passed.
- Live Jira API behavior remains unverified until credentials and the private
  backend adapter are configured.
