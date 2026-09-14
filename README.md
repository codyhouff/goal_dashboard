# LIFE OS Goal Dashboard

LIFE OS is a private-by-design personal goal dashboard built for an always-on
wall display, with responsive laptop and phone views. It combines financial
freedom forecasting, body-composition progress, sleep and recovery, active
goals, a visual dream board, and a Kanban task workflow.

This public repository contains the application design, synthetic prototype
data, documentation, and future integration code. It must never contain real
financial records, health exports, personal media, credentials, location data,
or other private runtime information.

## Prototype

The dependency-free prototype currently provides two primary views:

- **Dashboard** - a dense wall-first view for tracking, forecasting, recovery,
  direction, and vision.
- **Tasks** - a five-stage Kanban board with To do, Research, Plan, In progress,
  and Done columns.

Development-only Explore and System Map views remain accessible by URL.

### Run locally

From the repository root:

```powershell
python -m http.server 3000 --directory prototype
```

Then open <http://localhost:3000>.

Direct prototype routes:

- `http://localhost:3000/?view=wall`
- `http://localhost:3000/?view=tasks`
- `http://localhost:3000/?view=dashboard`
- `http://localhost:3000/?view=system`

All values and media included in the prototype are synthetic.

## Planned private deployment

```text
Public GitHub repository
code + docs + synthetic demo data
              |
              | approved release
              v
Private mini PC
Ubuntu + Docker
|- responsive frontend
|- authenticated private API
|- scheduled source adapters
|- transparent calculation engine
|- SQLite database
|- encrypted secrets
`- private dream-board media
              |
              v
Wall kiosk / laptop / phone
```

Financial CSVs, health exports, task-provider tokens, private media, and the
runtime database live only on the private host. They are excluded by repository
policy and `.gitignore`.

## Documentation

- [Product scope](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Display section and input inventory](prototype/sections.md)
- [Android Kanban application research](docs/research/android-kanban-apps.md)
- [Verification](docs/TESTING.md)

## Trello task synchronization

Trello is the leading external task-provider candidate. A production adapter is
expected to map Trello lists to workflow stages and labels to LIFE OS sections.
Provider credentials will be encrypted on the private backend and will never be
embedded in browser JavaScript or committed to this repository.

The current Kanban prototype uses browser-local persistence only. It does not
connect to a real Trello account.

## Project status

The project is currently in product-design and interactive-prototype stage. The
production frontend, API, database schema, and import services have not yet been
selected or implemented.

## Contributing and reuse

The goal is for another person to be able to run the demo and later self-host
their own private LIFE OS instance. Keep reusable code and synthetic fixtures in
the public repository; put individual configuration and data in ignored runtime
paths.

The project is available under the [MIT License](LICENSE).

Before submitting changes, run the checks documented in
[`docs/TESTING.md`](docs/TESTING.md).
