# Task: Financial chart scaling and benchmark edges

## Status
Completed

## Goal
Make forecast controls and chart scaling more natural at every time range.

## Acceptance criteria
- [x] Custom annual return arrows change the value by one percentage point.
- [x] Observed contribution pace uses the compact `$X/mo avg` label.
- [x] Percentile lines interpolate to both visible chart edges when source data permits.
- [x] Vertical scale leaves modest headroom above the highest visible forecast.
- [x] Reference lines cannot draw outside the plot area.

## Relevant paths
- `prototype/index.html`
- `prototype/app.js`
- `prototype/README.md`

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- Browser render of the default and one-year ranges.
- Browser assertion for contribution text and annual-return input step.
- `git diff --check`
