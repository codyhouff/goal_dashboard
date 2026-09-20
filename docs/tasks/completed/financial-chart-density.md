# Task: Financial chart density refinements

## Status
Completed

## Goal
Reduce hover and footer clutter while keeping the chart controls compact.

## Acceptance criteria
- [x] Hover shows only month/year, age, and total amount.
- [x] The chart key is a compact block on the right.
- [x] FIRE ETAs and account components are two compact vertical groups.
- [x] Time ranges are Now, 1Y, 3Y, 5Y, 10Y, and Max.
- [x] Desktop and narrow layouts remain usable.

## Relevant paths
- `prototype/index.html`
- `prototype/app.js`
- `prototype/styles.css`
- `prototype/README.md`

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- Headless browser interaction check for tooltip, ranges, and chart key.
- Desktop visual render.
- `git diff --check`
