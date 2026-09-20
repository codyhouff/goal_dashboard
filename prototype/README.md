# Financial Independence visual prototype

This dependency-free prototype isolates the Financial Independence section so
its information density, graph behavior, responsive layout, and privacy control
can be evaluated before other dashboard sections return. It uses synthetic data
in the public repository and can load an ignored private Fidelity-derived series
when running locally.

## Run locally

From the repository root:

```powershell
python -m http.server 3000
```

Open `http://localhost:3000/prototype/` in a browser. Serving from the repository
root is required because the prototype loads the public benchmark under
`data/benchmarks/`.

Append `?demo=1` to force synthetic public-demo mode even when private data is
available locally.

## Optional private Fidelity data

Copy `config/financial-independence.example.json` to the ignored path
`private/config/financial-independence.json`, then set the private dates. Place
one normalized CSV in each of these ignored directories:

- `private/imports/fidelity/processed/activity/`
- `private/imports/fidelity/processed/balance-history/`
- `private/imports/fidelity/processed/positions/`

Generate the reconciled daily series:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/process-fidelity-net-worth.ps1
```

The processor classifies external cash flows, removes paired internal transfers,
deduplicates a BrokerageLink summary position when present, and writes ignored
CSV/JSON files under `private/imports/fidelity/processed/net-worth/`. It stops
with a private review CSV instead of guessing when a transaction is ambiguous.

## Interactions

- Move the pointer or a finger across the graph to inspect only the month, year,
  age, and total portfolio value.
- Focus the graph and use the left/right arrow keys for keyboard inspection;
  press Escape to return to the current snapshot.
- Use `Now`, `1Y`, `3Y`, `5Y`, `10Y`, and `Max` to change the visible projection
  horizon.
- Use **Area** to switch the portfolio fill on or off, **Compare** to show
  conservative and optimistic forecasts, and **Indicators** to toggle age
  benchmarks, FIRE targets, and contribution/growth layers.
- Use **Contributions** to forecast with the observed current-job monthly average
  or a custom monthly amount. Use **Returns** to forecast with the observed
  annualized return or a custom annual percentage; the return input steps by one
  percentage point. Either change redraws the forecast and recalculates all
  three FIRE dates immediately.
- Use the compact legend to distinguish history, forecast, benchmark, scenario,
  and FIRE-target lines.
- Use **Hide values** to mask headline, forecast-setting, FIRE-date, and summary
  financial values.

The graph is rendered on a responsive canvas adapted from the user-supplied
Google Finance-style prototype. No charting dependency or external font request
is required.

This is a local file-processing bridge, not a production Fidelity connection or
private API. The public benchmark remains labeled approximate until its original
source and methodology are documented.
