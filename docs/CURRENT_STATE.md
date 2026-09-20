# Current State

Keep this file short. It is for facts an agent needs to know *right now* that do not yet belong in stable architecture/product documentation.

## Active migrations / transitions
- None documented.

## Known limitations
- The repository currently contains a dependency-free interactive prototype,
  product documentation, and research. It does not yet contain the production
  private API, database, scheduled importers, authentication, or Jira sync.
- The current visual prototype intentionally renders only the Financial
  Independence section on an otherwise empty canvas. Other documented sections
  will return individually after their designs are approved.
- The public prototype uses synthetic financial history. When an ignored private
  Fidelity-derived CSV is present locally, the same prototype loads contributed
  capital, investment growth, and a current-pace forecast from that file. This is
  a manual local bridge, not the future private API or scheduled integration.
- The Financial Independence forecast can switch contributions and returns
  independently between observed values and custom assumptions; either change
  recalculates the graph and all three FIRE ETAs in the browser.

## Known issues that affect development
- None documented.

## Temporary constraints
- None documented.

## Cleanup rule
Delete stale entries as soon as they are no longer true. Do not let this become an append-only project history.
