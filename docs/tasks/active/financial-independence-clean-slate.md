# Task: Financial Independence clean-slate prototype

## Status
Completed

## Goal
Replace the current dense, decorative dashboard with a clean Financial
Independence-only canvas. The chart should borrow the useful interaction model
of Google Finance: a dominant line chart, restrained controls, pointer tracking,
range selection, and contextual values immediately below the plot.

## Context
The current prototype includes vision tiles, goals, body, recovery, tasks, and
other synthetic filler. Those sections make it difficult to judge the Financial
Independence experience and do not match the requested space-efficient design.
The user wants to build one real section at a time, beginning in the upper-left
and leaving the remaining canvas empty.

## Acceptance criteria
- [x] The prototype contains only a Financial Independence module; the remaining
      page is intentionally empty.
- [x] The module is anchored at the upper-left and gives most of its area to the graph.
- [x] Remove Northstar branding, vision tiles, health cards, task-board content,
      rotating scenes, motivational language, and other placeholder sections.
- [x] Show synthetic Fidelity history, a forward forecast, Lean/Medium/Fat targets,
      and optional Top 10%/Top 5% benchmark curves.
- [x] Pointer or touch movement produces a vertical guide and updates values and
      date/age context below the graph.
- [x] Range controls and comparison toggles work without dependencies.
- [x] Primary-residence equity remains excluded and the benchmark remains labeled approximate.
- [x] The prototype remains responsive and privacy masking still works.

## Relevant paths

### Inspected
- `prototype/index.html` — currently contains the entire multi-panel prototype.
- `prototype/styles.css` — currently styles the old dashboard, tasks, and system map.
- `prototype/app.js` — currently combines finance behavior with obsolete view and task interactions.
- `docs/sections/financial-independence.md` — defines the financial data and privacy contract.
- `data/benchmarks/financial-independence/` — contains the public approximate benchmark.

## Delegation
Not needed; markup, chart calculations, pointer behavior, and responsive styling
form one tightly coupled prototype slice.

## Implementation plan
1. Replace the prototype markup and styling with the single-section canvas.
2. Rebuild the chart renderer around range state, comparison state, and hover state.
3. Verify parsing and behavior, then inspect desktop and mobile screenshots.

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- `git diff --check`
- Serve from repository root and inspect desktop/mobile screenshots in headless Edge.

## Risks / edge cases
- Google Finance is inspiration for interaction and density, not a pixel-for-pixel copy.
- Benchmark values stop at age 45, while the FIRE forecast can continue farther.
- All visible personal-looking numbers remain unmistakably synthetic until private
  Fidelity and owner configuration are connected.

## Non-goals
- Fidelity authentication/import.
- Rebuilding the other dashboard sections in this change.
- Copying Google branding, proprietary assets, or implementation code.

## Completion notes
- Replaced the former multi-panel prototype with a single light, flat Financial
  Independence module anchored at the upper-left.
- Added area, forecast, benchmark, and target toggles; 5Y/10Y/15Y/MAX ranges;
  pointer/touch crosshair behavior; and a dynamic detail strip below the graph.
- `python -m html.parser prototype/index.html` passed.
- `node --check prototype/app.js` passed.
- Both the prototype and public benchmark returned HTTP 200 from the documented server.
- `git diff --check` passed with only line-ending conversion warnings.
- Final headless Edge renders were inspected at 1600x1000 and 430x1100. A stray
  hidden SVG marker and mobile control/footer overflow found during review were fixed.
- Fidelity connection and real owner configuration remain future private work.
