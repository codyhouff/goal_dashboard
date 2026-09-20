# Financial Independence

## Question answered

How close is the owner to financial independence, how does the current path
compare with age-based wealth benchmarks, and when is each FIRE tier projected
to be reached?

## Wealth definition

The primary comparison series is individual net worth excluding equity in the
owner's primary residence. A residence is useful and may have equity, but it is
not treated as readily spendable FIRE capital in this product. The UI must state
this scope anywhere the series is compared with population benchmarks.

FIRE forecasting uses eligible investable assets. The benchmark graph may use
the same series only when all included Fidelity accounts, external assets, and
liabilities have been reconciled to the stated net-worth definition. Otherwise,
the UI labels the Fidelity total as a scoped account balance rather than complete
net worth.

## Permanent wall summary

- Current eligible invested assets and most recent change.
- Lean, Medium, and Fat FIRE progress.
- Estimated calendar year and age at Medium FIRE under the base case.
- Compact historical-to-forecast direction.
- Source freshness, scope, and privacy-mask state.

## Detailed forecast graph

- Use a flat, light, high-density presentation inspired by the useful interaction
  patterns of Google Finance; do not copy branding or proprietary assets.
- The graph owns most of the section area. Evenly spaced range controls sit
  directly above it, while a compact series key and three-column fact table sit
  below it without a separate bulky toolbar.
- Pointer and touch movement show a vertical guide, focus markers, date, age,
  portfolio value, and available benchmark values.
- Historical account totals use a solid line.
- The forward base forecast uses a distinct solid line after an explicit Today marker.
- Optional conservative and optimistic scenarios form a range rather than pretending
  one return assumption is certain.
- Lean, Medium, and Fat FIRE targets are horizontal milestone lines.
- Top 10% and Top 5% benchmark thresholds are age-based curves.
- Additional percentiles are optional laptop controls and are not permanently shown
  on the wall.
- The graph reports the first projected crossing year and age for Medium FIRE.

## Inputs

| Input | Privacy | Initial source |
| --- | --- | --- |
| Dated account totals | Sensitive | Synthetic demo; later Fidelity CSV/export |
| Included accounts and liabilities | Sensitive | Private configuration |
| Lean/Medium/Fat FIRE targets | Personal | Private configuration |
| Current age/date of birth | Sensitive | Private configuration; API should prefer derived age |
| Monthly contribution | Sensitive | Private calculation/configuration |
| Return and inflation assumptions | Personal | Private configuration with public demo defaults |
| Age percentile table | Public reference | Versioned benchmark dataset |

## Derived outputs

- Progress and dollars remaining for each FIRE tier.
- Monthly projected balance under named assumptions.
- Estimated crossing month, year, and age for each tier.
- Benchmark threshold at each age and first projected crossing where applicable.
- Contribution capital and estimated investment growth as separate values.

## Public benchmark

The current public reference file is
`data/benchmarks/financial-independence/southeast-us-men-net-worth-2024.json`.
It covers selected Southeast U.S. states, excludes Florida and primary-residence
equity, and is expressed in approximate 2024 dollars.

Its original source, sample size, methodology, interpolation method, and Top 1%
asterisk explanation are not yet known. Until those fields are completed, every
use must be labeled **Approximate benchmark estimate** and must not be presented
as an authoritative population percentile.

## Missing, stale, and incompatible data

- Never extend a forecast from a missing or invalid latest balance.
- Show the age of the latest Fidelity import.
- Do not silently combine balances whose ownership or account scope differs.
- Do not compare invested assets with a broader net-worth benchmark without a scope label.
- If date of birth is unavailable, show forecast duration and year but omit age.
- If the benchmark file fails to load, retain the FIRE forecast and show benchmark
  lines as unavailable.

## Delivery

- V1: clean-slate single-section canvas, synthetic history, configurable targets,
  interactive base forecast, milestone estimate, Top 10%/Top 5% lines, range and
  comparison controls, and transparent assumptions.
- Later: private Fidelity imports, reconciliation, scenario controls, inflation
  toggles, contribution-versus-growth layers, and additional percentile controls.
