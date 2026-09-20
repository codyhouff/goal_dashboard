# Task: Fidelity contribution and investment-growth history

## Status
Completed

## Goal
Generate a private, auditable daily series that separates contributed capital
from investment growth and display both layers in the Financial Independence
prototype without putting personal data in Git.

## Acceptance criteria
- [x] A reusable processor reads normalized Fidelity activity, balance-history,
  and positions CSV files.
- [x] The processor treats the configured opening balance as contributed capital
  and zero prior investment growth.
- [x] External cash flows affect net contributions; trades, income, fees, and
  internal transfers affect investment growth instead.
- [x] BrokerageLink is counted once when a workplace-plan summary row duplicates
  its separately listed holdings.
- [x] Every output row satisfies `net_worth = contributed_capital + investment_growth`.
- [x] Private transaction data and derived values remain ignored by Git.
- [x] The prototype loads the private series when available and otherwise keeps
  its public synthetic-data behavior.
- [x] The chart and hover details distinguish total assets, contributed capital,
  and investment growth.

## Relevant paths
- `scripts/process-fidelity-net-worth.ps1`
- `prototype/app.js`
- `prototype/index.html`
- `prototype/styles.css`
- `private/config/financial-independence.json` (ignored)
- `private/imports/fidelity/processed/` (ignored)

## Verification
- Run the processor against the private imports and require zero unclassified
  transactions.
- Verify the output identity for every row.
- Run `python -m html.parser prototype/index.html`.
- Run `node --check prototype/app.js`.
- Serve the repository and smoke-test public fallback and private-data loading.
- Run `git diff --check`.

## Privacy
The public repository contains only processing and display logic. Dates of
birth, account data, transaction data, balances, and generated series remain
under `private/` and are excluded from Git.

## Completion notes
- Generated and validated 285 private daily rows with zero unresolved
  transactions and zero component-identity failures.
- Counted the separately listed BrokerageLink holdings once by removing the
  matching parent-plan summary position from the aggregate.
- Added a private-data loader, current-pace projection, contribution line,
  investment-growth shading, component details, and a `?demo=1` public fallback.
- Verified processor execution, JavaScript syntax, HTML parsing, HTTP responses,
  Git ignore coverage, public-file privacy scanning, and desktop/mobile renders.
