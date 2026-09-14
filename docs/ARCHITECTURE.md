# Architecture

## System overview
The target system is a responsive web application hosted on a private mini PC.
The public GitHub repository is the source of code and synthetic demo data, not
the runtime data store. Scheduled importers normalize approved external inputs
into SQLite; a private API exposes only dashboard-shaped summaries to the
frontend. Chromium displays the same frontend locally in kiosk mode, while
authenticated devices can use it over the home network.

## Repository map
- `prototype/` — dependency-free visual prototype using synthetic data.
- `docs/` — product, architecture, testing, and task records.

## Major components
| Component | Responsibility | Key paths |
| --- | --- | --- |
| Prototype frontend | Validate information hierarchy and responsive layout | `prototype/` |
| Production frontend | Future responsive web client | Not selected |
| Private API | Future authenticated, read-oriented dashboard API | Not selected |
| Importers | Future scheduled source adapters and normalization | Not selected |
| Data store | Future local SQLite database on internal SSD | Runtime only |

## Data / control flow
1. Financial CSVs arrive in a private import inbox. Health measurements arrive
   through an explicit phone-side export/bridge because Health Connect is an
   on-device Android store. Manual forms, optional Sheets, weather, and private
   media use separate adapters.
2. Importers validate and normalize source records into a common local model.
3. SQLite retains imported facts, private goal configuration, import status,
   and derived snapshots. Personal media uses a separate private directory.
4. A calculation layer produces versioned FIRE, savings, body-composition,
   trend, and score snapshots without rewriting imported facts.
5. The private API returns only the fields and sensitivity class a view needs.
6. The responsive frontend presents wall, laptop, and phone layouts.
7. Chromium opens the local frontend in kiosk mode on the wall display.
8. Backup jobs encrypt and copy the database, private media metadata, and configuration to an approved
   backup destination.
9. A task adapter maps external lists to local workflow stages and external
   labels to LIFE OS sections. Provider credentials remain server-side.

## Boundaries and invariants
- GitHub never contains personal data, runtime databases, credentials, or exports.
- Importers cannot initiate trades or modify source financial accounts.
- The browser never receives upstream provider credentials.
- Demo mode uses synthetic data and cannot connect to production imports.
- Source freshness accompanies derived data from that source.
- Every displayed fact has a source, observation time, and quality indicator.
- Conflicting measurements remain separate dated observations.
- Wall access and administrative access are separate authorization roles.

## External dependencies / integrations
- GitHub for source control and releases.
- Brokerage CSV or an approved read-only financial connector.
- Google Health/Health Connect export.
- Google Sheets and manual-entry adapters.
- Optional private-network access such as Tailscale.
- Optional Trello API adapter for phone-friendly task capture and movement.

## Architecture rules
- Follow existing module boundaries unless the task explicitly changes them.
- Prefer narrow interfaces between components.
- Record significant architecture decisions in `docs/decisions/`.
