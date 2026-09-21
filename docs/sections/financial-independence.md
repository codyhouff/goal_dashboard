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

- Estimated calendar year and age for Lean, Medium, and Fat FIRE.
- Current net worth split into net contributions and estimated investment growth
  (labeled `Interest` in the compact UI).
- Compact historical-to-forecast direction.

## Detailed forecast graph

- Use a flat, light, high-density presentation inspired by the useful interaction
  patterns of Google Finance; do not copy branding or proprietary assets.
- The graph owns most of the section area. A compact top bar stacks forecast
  assumptions on the left and pairs the FIRE and portfolio summaries on the
  right. Only range controls sit below the graph. The section has no separate
  headline, chart toolbar, or series legend.
- On dashboard-sized screens, the complete section is a half-scale top-left tile
  occupying roughly one quarter of its former area. Narrow screens retain the
  full-size responsive layout.
- Pointer and touch movement show a vertical guide and a compact tooltip with
  month, year, age, and total portfolio value.
- Historical account totals use a solid line.
- The forward base forecast uses a distinct solid line after an explicit Today marker.
- Lean, Medium, and Fat FIRE targets are horizontal milestone lines.
- Top 10%, Top 5%, and Top 1% benchmark thresholds are age-based curves through
  the final available source age of 45. Curves interpolate to the visible chart
  boundaries instead of stopping at the nearest whole-number age.
- The vertical scale follows the highest visible portfolio forecast with modest
  headroom; benchmarks and milestones outside that scale are clipped to the plot.
- Additional percentiles are optional laptop controls and are not permanently shown
  on the wall.
- The graph reports the first projected crossing year and age for every FIRE tier.
- Forecast controls can independently use the observed current-job contribution
  pace or a custom monthly contribution, and the observed annualized return or a
  custom annual return. Changes immediately recalculate the chart and FIRE ETAs.

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
- Local prototype bridge: manual Fidelity imports are reconciled into a private
  daily contribution-versus-growth series. The browser loads that derived file
  when available and otherwise falls back to synthetic demo data.
- Later: private API/SQLite ingestion, scheduled imports, inflation controls,
  and additional percentile controls.
