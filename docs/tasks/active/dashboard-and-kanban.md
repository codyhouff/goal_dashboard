# Task: Dense dashboard and Kanban task view

## Status
Completed

## Goal
Make Dashboard and Tasks the two primary application views, provide a usable
five-stage Kanban prototype, and document the required inputs for every display
section.

## Context
The wall view establishes the design direction but needs denser information use.
Task tracking should be a first-class companion view, with phone-friendly
external synchronization possible later.

## Acceptance criteria
- [x] The primary navigation contains Dashboard and Tasks.
- [x] Tasks are grouped into To do, Research, Plan, In progress, and Done.
- [x] Every task carries a LIFE OS section label.
- [x] Cards can move between columns by drag/drop and accessible move controls.
- [x] Prototype task state persists locally across refreshes.
- [x] The dashboard removes decorative filler and uses its main space efficiently.
- [x] `prototype/sections.md` inventories each section, metrics, inputs, sources,
      cadence, and privacy needs.
- [x] A future Trello adapter is documented without placing tokens in the browser.

## Relevant paths

### Inspected
- `prototype/index.html` - wall, detailed dashboard, and system views.
- `prototype/styles.css` - wall layout and responsive rules.
- `prototype/app.js` - view switching and prototype interactions.
- `prototype/sections.md` - approved public information architecture.

## Implementation plan
1. Document sections and Kanban integration boundary.
2. Add the Tasks view and interactions.
3. Densify the wall dashboard.
4. Render and verify desktop/mobile behavior.

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- `git diff --check`
- Desktop screenshots of Dashboard and Tasks.

## Risks / edge cases
- Trello webhooks need a publicly reachable HTTPS callback; a private mini PC may
  use authenticated polling or a narrow tunnel instead.
- Browser local storage is only prototype persistence and is not multi-device sync.
- Native drag/drop is weak on phones, so move controls are also required.

## Non-goals
- Connecting a real Trello account in this change.
- Production task database/API implementation.
- Removing the existing detail and architecture views from the codebase.

## Completion notes
- Added the two-tab Dashboard/Tasks navigation and a responsive five-stage board.
- Added desktop drag/drop, touch-friendly arrow movement, live counts, and local
  browser persistence.
- Densified the dashboard and expanded the FIRE insight stage into a useful chart.
- Documented all display requirements and the future Trello adapter boundary.
- HTML parsing, JavaScript syntax, HTTP loading, and whitespace checks passed;
  desktop Dashboard and Tasks renders were reviewed.
