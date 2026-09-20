# Financial Independence visual prototype

This dependency-free prototype isolates the Financial Independence section so
its information density, graph behavior, responsive layout, and privacy control
can be evaluated before other dashboard sections return. All account history,
ages, contributions, targets, and forecast results displayed here are synthetic.

## Run locally

From the repository root:

```powershell
python -m http.server 3000
```

Open `http://localhost:3000/prototype/` in a browser. Serving from the repository
root is required because the prototype loads the public benchmark under
`data/benchmarks/`.

## Interactions

- Move the pointer or a finger across the graph to inspect a date, age, portfolio
  value, and available age benchmark values.
- Focus the graph and use the left/right arrow keys for keyboard inspection;
  press Escape to return to the current snapshot.
- Use `History`, `5Y`, `10Y`, `15Y`, `20Y`, `Age 50`, and `Max` to change the
  visible projection horizon.
- Use **Area** to switch the portfolio fill on or off, **Compare** to show
  conservative and optimistic forecasts, and **Indicators** to toggle age
  benchmarks and FIRE targets.
- Use the compact legend to distinguish history, forecast, benchmark, scenario,
  and FIRE-target lines.
- Use **Hide values** to mask headline and detail-strip financial values.

The graph is rendered on a responsive canvas adapted from the user-supplied
Google Finance-style prototype. No charting dependency or external font request
is required.

Fidelity integration is not implemented. The public benchmark remains labeled
approximate until its original source and methodology are documented.
