# Task: Financial Independence canvas UI

## Status
Completed

## Goal
Replace the prototype's SVG financial chart with the user-supplied, Google
Finance-inspired canvas interaction model while retaining LIFE OS data and
forecast requirements.

## Context
The current compact prototype has the right information but its graph feels
less polished than the supplied `Net-Worth-Projection.zip`. The ZIP contains a
dependency-free canvas chart with strong hover, touch, keyboard, range, theme,
and responsive behavior, but its lump-sum random simulation is not the LIFE OS
financial model.

## Acceptance criteria
- [x] The Financial Independence module uses the supplied canvas visual and
  interaction language.
- [x] Synthetic history, contribution-aware forecast, FIRE targets, and Top
  10%/Top 5% reference lines remain available.
- [x] The chart supports range selection, hover/touch inspection, keyboard
  inspection, layer controls, and privacy masking.
- [x] The rest of the page remains empty.
- [x] No runtime dependency, credential, or personal datum is introduced.
- [x] The prototype remains usable at desktop and phone widths.

## Relevant paths

### Inspected
- `Net-Worth-Projection.zip` — source canvas UI and interaction reference.
- `prototype/index.html` — current compact Financial Independence markup.
- `prototype/styles.css` — current dark, fixed-width visual treatment.
- `prototype/app.js` — current history, forecast, benchmark, hover, and privacy logic.
- `data/benchmarks/financial-independence/southeast-us-men-net-worth-2024.json`
  — public age-based benchmark data.

## Implementation plan
1. Adapt the ZIP's compact header, toolbar, canvas, tooltip, range pills, legend,
   and overview-stat patterns.
2. Replace its lump-sum market simulation with LIFE OS history, forecast,
   benchmarks, and FIRE overlays.
3. Add responsive, privacy, mouse, touch, and keyboard behavior.
4. Run configured prototype checks and visually inspect representative widths.

## Verification
- Targeted markup check: `python -m html.parser prototype/index.html`
- Script syntax: `node --check prototype/app.js`
- Integration smoke: serve the repository and request the prototype and benchmark JSON.
- Diff hygiene: `git diff --check`

## Risks / edge cases
- Canvas content needs an accessible text summary because the pixels themselves
  are not exposed to assistive technology.
- Benchmark data stops at age 45, so percentile lines intentionally stop there.
- Demo forecasts remain illustrative until private Fidelity imports exist.

## Non-goals
- Live Fidelity connectivity.
- A research-grade stochastic retirement model.
- Restoring other dashboard sections.

## Completion notes
- Replaced the SVG graph with a responsive, dependency-free canvas adaptation
  of the supplied Google Finance-style UI.
- Retained LIFE OS history, contribution-aware base forecast, optional scenario
  comparisons, FIRE targets, age benchmarks, privacy masking, and an empty page
  outside the Financial Independence module.
- `python -m html.parser prototype/index.html` and `node --check prototype/app.js`
  passed.
- Prototype and benchmark requests both returned HTTP 200.
- Automated browser checks exercised range selection, scenario toggling,
  privacy masking, and pointer tooltip display successfully.
- Desktop and narrow viewport screenshots were visually inspected.
- `git diff --check` passed with only expected Windows line-ending warnings.
