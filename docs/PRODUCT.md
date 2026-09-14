# Product

## What are we building?
A private, self-hosted personal goal dashboard that turns health, financial,
habit, project, and schedule data into an at-a-glance view. The same responsive
web application is intended for a wall display, laptop, and phone.

## Primary user / customer
One individual who owns and controls the underlying data and home server.

## Core outcomes
- Answer five questions at a glance: financial freedom, body progress,
  recovery, current direction, and future vision.
- Keep FIRE, physique, recovery, active goals, and a 3x3 vision board permanently
  visible while deeper analytics rotate through one secondary stage.
- Show data freshness and source health so stale data is never misleading.
- Keep private health and financial data out of the public source repository.

## In scope
- Two primary views: a dense tracking/forecasting Dashboard and a section-tagged
  Tasks board.
- A five-stage task workflow: To do, Research, Plan, In progress, and Done.
- Responsive wall, desktop, and mobile dashboard views.
- FIRE forecasting, body composition, recovery, goal, dream-board, milestone,
  weather, and supporting lifestyle summaries.
- A privacy mode that masks sensitive values on shared displays.
- A local API, SQLite data store, scheduled imports, and encrypted backups.
- Demo data for public development and screenshots.
- Optional phone-friendly task-provider synchronization through the private API.

## Out of scope
- Trading or moving money.
- Medical diagnosis or treatment recommendations.
- Storing credentials or personal data in GitHub.
- Public internet exposure without an explicit authentication design.

## Important constraints
- The public repository contains code, documentation, and synthetic demo data only.
- Personal data and credentials remain on the privately operated host.
- The wall display is glanceable from a distance and does not reveal exact
  financial values unless privacy mode permits it.
- Decorative quotes and generic motivation do not consume permanent dashboard space.
- Intimate/private categories are excluded from automatic wall rotation.
- Every imported-data module exposes its last successful refresh time.

## Product principles
- Prefer explicit, testable behavior over hidden magic.
- Separate measured facts, private targets, and derived scores.
- Show the assumptions and weights behind forecasts and composite scores.
- Keep the default wall calm; depth belongs in the rotating stage and detail views.
- Keep scope small enough that individual changes can have clear acceptance criteria.

## Success criteria
- The dashboard is useful on a 16:9 wall display and remains usable on a phone.
- A user can understand overall trajectory, today's focus, and stale sources in
  less than ten seconds.
- The application can run locally without any external cloud dependency.
