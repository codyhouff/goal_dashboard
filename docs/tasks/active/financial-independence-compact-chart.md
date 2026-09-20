# Task: Compact Google-stocks-style Financial Independence chart

## Status
Completed

## Goal
Revise the clean-slate Financial Independence prototype to match the compact,
dark information density and interaction hierarchy shown in the supplied Google
stocks screenshot.

## Context
The first clean-slate version is still too large and spread out. The reference
uses a roughly 750px-wide module with a compact quote header, one evenly spaced
range-selector row, a short dominant chart, a hover tooltip, and a three-column
fact table directly below the plot.

## Acceptance criteria
- [x] Constrain the desktop module to approximately the proportions of the supplied reference.
- [x] Use a dark neutral surface, green primary series, subtle grid, and compact typography.
- [x] Place the current portfolio, gain, update/scope details, and privacy action in the header.
- [x] Place evenly spaced range controls immediately above the chart.
- [x] Keep history, forecast, FIRE targets, and benchmark comparisons readable without a bulky toolbar.
- [x] Keep pointer/touch tooltip behavior and dynamic point-in-time details.
- [x] Present useful Financial Independence facts in a compact three-column table below the graph.
- [x] Leave the rest of the page empty and retain responsive behavior.

## Relevant paths
- `prototype/index.html`
- `prototype/styles.css`
- `prototype/app.js`
- `docs/sections/financial-independence.md`
- User-supplied Google Stocks screenshot — visual reference only; never copied into the public repository.

## Delegation
Not needed; the visual proportions, chart geometry, and interaction behavior are tightly coupled.

## Verification
- `python -m html.parser prototype/index.html`
- `node --check prototype/app.js`
- `git diff --check`
- Headless Edge screenshots at desktop and phone widths.

## Non-goals
- Pixel-for-pixel copying of Google branding or proprietary assets.
- Live Fidelity integration.
- Adding any other dashboard section.

## Completion notes
- Reworked the light 1180px section into a dark 760px compact module based on
  the supplied visual reference's hierarchy and proportions.
- Preserved calculated history, forecast, benchmark, target, hover, range, and
  privacy behavior while removing the bulky display toolbar.
- `python -m html.parser prototype/index.html` passed.
- `node --check prototype/app.js` passed.
- `git diff --check` passed with only line-ending conversion warnings.
- The local prototype and benchmark dataset both returned HTTP 200.
- The 1200x850 desktop render was visually compared with the supplied screenshot.
  The responsive mobile rules were also exercised. Windows headless Edge reports
  a 492px CSS viewport for a requested 430px capture, which explains the capture's
  right-edge crop rather than an application overflow at the reported viewport.
- A second measured pass matched the reference's 708px module width, seven-item
  range row, chart height, direct-to-stats spacing, typography scale, and dark
  `#22242a` surface. The dedicated legend and assumptions footer were removed so
  the graph uses the same compact visual rhythm as the reference.
