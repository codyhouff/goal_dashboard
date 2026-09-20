# Task: Financial forecast controls and compact summary

## Status
Completed

## Goal
Make the Financial Independence forecast directly adjustable while reducing the
bottom summary to the six values currently useful to the owner.

## Acceptance criteria
- [x] Contribution forecasting can use the observed current-job monthly pace or
  a user-entered monthly amount.
- [x] Return forecasting can use the observed annualized return or a user-entered
  annual percentage.
- [x] Forecast changes immediately update the chart and all FIRE ETAs.
- [x] The bottom summary contains only Lean, Medium, and Fat FIRE ETAs plus Net
  Worth, Interest, and Contributions.
- [x] Private values remain compatible with privacy masking.
- [x] Public demo mode remains functional without private files.
- [x] Desktop and mobile layouts remain usable.

## Relevant paths
- `prototype/index.html`
- `prototype/app.js`
- `prototype/styles.css`
- `prototype/README.md`

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- Render private and public demo modes.
- Exercise observed and custom control paths.
- `git diff --check`
