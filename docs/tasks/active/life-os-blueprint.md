# Task: LIFE OS information architecture and wall wireframe

## Status
Completed

## Goal
Turn the expanded product notes into a coherent product hierarchy, realistic
data flow, and a wall-first visual prototype.

## Context
The first prototype proved the visual direction but reads like a laptop
analytics page. The intended product is a calm, always-on 16:9 wall display
that permanently answers five questions and rotates deeper detail through one
controlled area.

## Acceptance criteria
- [x] Product scope is organized by permanent wall content, rotating content,
      private-only content, and delivery phase.
- [x] The architecture explains realistic first-version paths for financial
      financial CSVs, Health Connect data, manual data, media, and weather.
- [x] Imported facts, user goals, and derived metrics are visibly separated.
- [x] The prototype includes a 25-35% vision board, permanent FIRE/body/recovery
      summaries, current priorities, and a rotating detail stage.
- [x] The public prototype contains synthetic data only.
- [x] The existing detailed dashboard and system-map views remain available.

## Relevant paths

### Inspected
- `docs/PRODUCT.md` - existing product scope and privacy constraints.
- `docs/ARCHITECTURE.md` - existing private-host architecture.
- `prototype/index.html` - current dashboard and system-map markup.
- `prototype/styles.css` - current visual system and responsive behavior.
- `prototype/app.js` - view switching, privacy masking, and demo chart.

## Implementation plan
1. Create a durable product, UI, and integration blueprint.
2. Add a wall-first view to the prototype.
3. Refine the architecture map around source adapters and derived metrics.
4. Run syntax checks and render the primary views.

## Verification
- HTML parse: `python -m html.parser prototype/index.html`
- JavaScript syntax: `node --check prototype/app.js`
- Whitespace: `git diff --check`
- Visual: render wall and architecture views in headless Chromium.

## Risks / edge cases
- Provider capabilities and access rules can change; implementation must validate
  them again before building a connector.
- Health Connect is an on-device Android store, so it needs a phone-side export
  or bridge before the mini PC can import it.
- Sensitive categories must never enter the default wall rotation.

## Non-goals
- Production backend or database implementation.
- Real credentials, exports, photos, or personal measurements.
- Selecting the final frontend framework.

## Completion notes
- Added a private dashboard blueprint and refined public product/architecture docs.
- Added a wall-first prototype view and expanded the system map.
- HTML parsing, JavaScript syntax, and `git diff --check` passed.
- Rendered and reviewed the 1600x900 wall view and 1440x1600 system map.
