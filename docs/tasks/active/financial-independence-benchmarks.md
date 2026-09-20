# Task: Financial Independence benchmark forecast

## Status
Completed

## Goal
Turn the prototype's static FIRE scene into a useful Financial Independence
forecast that compares synthetic Fidelity-style account history and a forward
projection with FIRE targets and age-based net-worth percentile estimates.

## Context
The current wall prototype shows decorative scenario paths but does not compute
milestone dates or compare the portfolio with external benchmarks. The desired
wealth definition excludes primary-residence equity. Public reference data and
synthetic demo data must remain separate from future private Fidelity balances,
target configuration, and date-of-birth information.

## Acceptance criteria
- [x] Rename the product section from Financial Freedom to Financial Independence.
- [x] Store the supplied age-percentile table as a versioned public benchmark
      dataset with explicit scope, quality, and missing-provenance metadata.
- [x] Render historical synthetic Fidelity balances and a calculated forward
      base forecast on the detailed Financial Independence graph.
- [x] Show Lean, Medium, and Fat FIRE targets while highlighting the projected
      calendar year and age at which Medium FIRE is reached.
- [x] Overlay Top 10% and Top 5% age benchmark lines without counting primary
      residence equity.
- [x] Preserve privacy masking, responsive layouts, task-board behavior, and
      public-repository privacy boundaries.

## Relevant paths

### Inspected
- `prototype/index.html` — contains the permanent financial summary and rotating
  static forecast scene.
- `prototype/styles.css` — contains the responsive wall and forecast styling.
- `prototype/app.js` — controls scene rotation and other prototype interactions.
- `prototype/sections.md` — current section data inventory.
- `docs/ARCHITECTURE.md` — establishes public demo/private runtime boundaries.

### Implement
- `data/benchmarks/financial-independence/` — public reference dataset.
- `docs/sections/financial-independence.md` — section-level behavior and data contract.
- `prototype/` — synthetic UI and calculation behavior.

## Delegation
Not needed; the dataset, calculation, markup, and styling are tightly coupled.

## Implementation plan
1. Add the benchmark dataset and section contract.
2. Replace the static forecast scene with calculated SVG output and milestone summaries.
3. Update durable documentation and verify markup, syntax, data parsing, and rendering.

## Verification
- Markup: `python -m html.parser prototype/index.html`
- Script syntax: `node --check prototype/app.js`
- Dataset parse: PowerShell `ConvertFrom-Json`
- Diff hygiene: `git diff --check`
- Visual smoke test: local static server and screenshots at desktop/mobile widths.

## Risks / edge cases
- The supplied benchmark is approximate and has no original source or methodology yet.
- Fidelity account totals equal the chosen net-worth definition only when all included
  accounts and liabilities are explicitly reconciled.
- Forecast dates depend strongly on private contributions and return assumptions.

## Non-goals
- Authenticating with or automatically importing from Fidelity.
- Treating approximate benchmark values as authoritative population statistics.
- Including home equity in the comparison series.

## Completion notes
- `python -m html.parser prototype/index.html` passed.
- `node --check prototype/app.js` passed.
- PowerShell JSON parsing confirmed the expected dataset metadata and 26 age rows.
- Both the prototype and benchmark dataset returned HTTP 200 from the documented
  repository-root smoke server.
- `git diff --check` passed with only existing line-ending conversion warnings.
- Headless Edge screenshots were inspected at 1600px desktop and 430px mobile
  widths. The first mobile inspection exposed fixed-row overlap; the responsive
  grid was corrected and re-inspected successfully.
- Fidelity authentication/import remains future private integration work. Benchmark
  provenance remains intentionally marked incomplete and approximate.
