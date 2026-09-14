# Task: Initial dashboard wireframe

## Status
Completed

## Goal
Create a locally viewable, responsive visual prototype of the goal dashboard and
a detailed system map explaining how public code and private data remain separate.

## Context
The repository contains workflow documentation but no application. Hardware and
production framework decisions are intentionally deferred until the information
hierarchy and visual direction can be evaluated on a laptop.

## Acceptance criteria
- [x] A dependency-free prototype runs through a local static web server.
- [x] The main view shows overall trajectory, today's focus, goals, health,
  finance, habits, milestones, schedule, and source freshness using synthetic data.
- [x] Privacy mode masks sensitive financial values.
- [x] A system-map view depicts source imports, normalization, private storage,
  API delivery, GitHub releases, kiosk display, device access, and backups.
- [x] The layout responds appropriately at laptop and phone widths.
- [x] No personal data, credentials, or production integrations are introduced.

## Relevant paths

### Inspected
- `docs/PRODUCT.md` — contained initial placeholders.
- `docs/ARCHITECTURE.md` — contained initial placeholders.
- `docs/TESTING.md` — verification commands were not configured.

### Implemented
- `prototype/index.html` — semantic prototype structure.
- `prototype/styles.css` — responsive visual system and layout.
- `prototype/app.js` — demo interactions and generated charts.

## Delegation
Not needed; the prototype files are tightly coupled.

## Implementation plan
1. Establish durable product and architecture boundaries.
2. Build a responsive, demo-only dashboard view.
3. Add a detailed system-map view and privacy interaction.
4. Validate markup and scripts, then visually inspect desktop and mobile layouts.

## Verification
- Markup: `python -m html.parser prototype/index.html`
- Script syntax: `node --check prototype/app.js`
- Visual smoke test: serve `prototype/` on port 3000 and inspect rendered output.

## Risks / edge cases
- Dense information may need adjustment after testing at the actual wall distance.
- Synthetic metrics establish hierarchy but do not finalize the production data model.

## Non-goals
- Selecting the production frontend framework.
- Implementing authentication, provider integrations, or persistence.
- Purchasing or configuring hardware.

## Completion notes
- `python -m html.parser prototype/index.html` passed.
- `node --check prototype/app.js` passed.
- `git diff --check` passed with only pre-existing repository line-ending warnings.
- Local server returned HTTP 200 from `http://127.0.0.1:3000/`.
- Headless Chromium renders were inspected at wide and compact viewport sizes.
- Production framework, authentication, persistence, and integrations remain
  intentionally unselected.
