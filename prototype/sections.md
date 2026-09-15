# LIFE OS display sections

This file is the working inventory for what every dashboard section displays,
what it needs, and where that information is expected to come from. It describes
the private live product; the public prototype uses synthetic replacements.

The detailed Android task-provider comparison is maintained in
[`docs/research/android-kanban-apps.md`](../docs/research/android-kanban-apps.md).

## Primary application views

| View | Purpose | Interaction |
| --- | --- | --- |
| Dashboard | Dense tracking, forecasting, source freshness, and rotating visual detail | Primarily view-only on the wall; drill down on laptop/phone |
| Tasks | Jira-backed personal workflow tied to LIFE OS sections | Add, edit, reorder, and move cards; Jira is the eventual source of truth |

The architecture map and exploratory component gallery remain development views,
not primary product tabs.

## Dashboard placement summary

| Region | Permanent contents | Approximate space |
| --- | --- | --- |
| Vision rail | 3x3 dream-board photos or short muted clips | 28-32% |
| Direction rail | Three to five highest-priority active goals/tasks | 8-10% |
| Financial freedom | Invested assets, tier progress, scenario forecast, savings/spend pulse | 22-26% |
| Body + recovery | Body composition and sleep/recovery summaries | 18-22% |
| Insight stage | One rotating detailed chart at a time | Remaining space |
| Source rail | Freshness, import failures, privacy/demo state | One compact footer row |

No quote card, general motivational copy, decorative KPI, or empty spacer gets
permanent wall space. A value must answer Money, Body, Health, Direction, or
Vision, or it belongs in a detail view.

## Section inventory

### 1. Financial freedom

| Item | Display | Required inputs | Derived output |
| --- | --- | --- | --- |
| Invested assets | Large current total and monthly change | Dated account balances; account type; include/exclude rule | Eligible invested-assets total |
| FIRE tiers | Progress, amount remaining, estimated date/age/time | Private tier names/targets; current assets; forecast assumptions | Completion percentage and estimated crossing date |
| Forecast | Conservative/base/optimistic curves and milestone lines | Starting assets; contribution schedule; nominal return; inflation; fees | Monthly portfolio paths |
| Capital layers | Contributions versus investment growth | Historical deposits/withdrawals and balances | Cumulative contributed capital and residual growth |
| Savings rate | Current month plus 3/6/12-month rolling values | After-tax income; transfers classified as saving; spending | After-tax savings percentages |
| Expenses | Total/fixed/variable, prior-month comparison, target comparison | Normalized transactions and category rules | Monthly summaries and rolling average |
| Money flow | Income-to-tax/take-home/category/investment Sankey | Income, tax, transaction categories, investment transfers | Flow nodes and links |

Expected V1 source: private brokerage/budgeting CSV import inbox plus manual
corrections. Every number needs an `as_of` timestamp and included-account list.

### 2. Physique

| Item | Display | Required inputs | Derived output |
| --- | --- | --- | --- |
| Weight | Current, 7/30/90-day trend, weekly rate | Dated scale weight | Smoothed trend and rate |
| Body fat | Current estimate, range, source | Dated scale or assessment value; method/source | Preferred-source series; uncertainty label |
| Fat-free mass | Current and target delta | Weight and body-fat observation from compatible timestamps | `weight * (1 - body_fat)` |
| FFMI | Current, range, target delta | FFM and private height | FFMI with named formula version |
| Composition signal | Likely FFM/fat/noise split | Weight/body-fat history and measurement consistency | Clearly labeled inference, never a measured fact |
| Goal progression | Current-to-target ranges | Private target ranges and due dates | Remaining delta and pace |

Conflicting body-fat assessments remain separate dated records with a source and
method. Selecting a preferred source never overwrites history.

### 3. Recovery and sleep

| Display | Required inputs | Derived output |
| --- | --- | --- |
| Last-night duration and score | Sleep session start/end and provider score | Total sleep and comparison to target |
| Deep and REM | Sleep stages | Stage totals and percentage |
| HRV and resting heart rate | Dated measurements with device/source | Last value, 7/30-day baseline, direction |
| Sleep consistency | Bed/wake timestamps | Timing variability and on-target nights |
| Eight-hour progress | Private sleep target and sessions | 7/30-day average versus target |

Expected path: compatible smart-scale or wearable app to Android Health Connect, then a phone-side
export/bridge into the mini PC. The wall shows the age of the newest successful
health import.

### 4. Direction and active goals

Display three to five goals. Each needs a section, title, desired outcome, next
action, status, priority, optional deadline, progress method, and wall-visibility
flag. The Direction rail can pull the highest-priority active cards from Tasks.

### 5. Dream board

The nine slots are physique, lifestyle, travel, face/style, home, career,
friends/social, experiences, and financial freedom. Each media record needs a
private file path, section, caption, media type, duration, crop/focal point,
active dates, rotation weight, and wall-visibility flag. Videos are muted and no
longer than ten seconds. Personal media stays in private storage, never GitHub.

### 6. Aesthetic scorecard

Needs dated measurements or assessments for physique, leanness,
shoulder-to-waist ratio, skin, tan, hair, style, and face. Show current and goal
radars together. Every grade needs its threshold table, source/date, and formula
version; subjective assessments must be labeled as such.

### 7. Appearance references

Needs private current/reference media, pose/view type, category, capture date,
goal notes, and visibility. Face morphs and generated goal imagery are optional
visual references, not objective predictions.

### 8. Life in Weeks

Needs birth date in private configuration plus milestone title, date/range,
category, certainty, and display color. Education, career, relationships,
financial freedom, and experiences are factual milestones. AGI markers are
separate speculative scenarios with early/median/late ranges.

### 9. LIFE score / self-actualization

Potential components are wealth, career, knowledge, physique, health,
appearance, relationships, social life, experiences, freedom, style, and
environment. Each requires a personal target, normalized component score,
explicit weight, supporting inputs, and formula version. Population comparisons
need a reputable benchmark and uncertainty; personal-target progress is primary.

### 10. Wardrobe and daily outfit

Each owned item needs category, image, color, style, formality, weather range,
fit, availability, and compatibility tags. Outfit selection additionally needs
weather, occasion, desired aesthetic, and recently worn items. A generated
mannequin is a later presentation layer, not required for inventory V1.

### 11. Weather

Display current temperature, high/low, precipitation, UV, sunrise/sunset, and a
seven-day forecast. Required private configuration is approximate location and
units. Weather may feed outfit, outdoor-plan, and UV/tan recommendations.

### 12. Owner-only activity history

Sensitive dating, relationship, or social-history tracking belongs only in an
authenticated owner view. Required fields depend on the eventual design, but the
entire domain is classified Restricted and is never included in wall payloads or
automatic rotation.

## Tasks board schema

The selected visible workflow is:

```text
This Year -> This Month -> This Week -> Research -> In Progress -> Done
```

`This Week` is the commitment point: cards to its left are planned; cards to its
right are being actively learned or executed. Start with WIP limits of two cards
in Research and two cards in In Progress.

Every task needs:

| Field | Purpose |
| --- | --- |
| `id` | Stable local/provider identity |
| `title` | Short actionable description |
| `stage` | `year`, `month`, `week`, `research`, `progress`, or `done` |
| `section` | Financial, Physique, Recovery, Vision, Style, Life, Wardrobe, Weather, or Platform |
| `priority` | Ordering and Direction-rail eligibility |
| `due_at` | Optional due date/time |
| `notes` | Detail, links, and acceptance criteria |
| `source` / `external_id` | Local demo or Jira issue identity |
| `wall_visible` | Whether it may appear in Direction |
| `updated_at` | Conflict resolution and freshness |

## Jira goals model

Use Jira's normal team-managed hierarchy without inventing another layer:

```text
Epic = life area
  Goal or Task = outcome
    Subtask = step or milestone
```

Examples of life-area Epics include Financial, Physique, Recovery, Vision,
Career, Home/Life, and Learning. A custom standard work type named `Goal` can
represent an outcome; ordinary `Task` items remain available for one-off work.
Labels are reserved for genuinely cross-cutting concepts rather than repeating
the Epic.

The visible statuses map to Jira's three reporting categories as follows:

| Visible status | Jira category | Meaning |
| --- | --- | --- |
| This Year | To do | Annual commitment |
| This Month | To do | Current monthly focus |
| This Week | To do | Commitment to advance now |
| Research | In progress | Actively investigating; WIP limit 2 |
| In Progress | In progress | Actively executing; WIP limit 2 |
| Done | Done | Completion criteria met |

Due dates are used only for real deadlines. Recurring routines should be created
by Jira Automation rather than represented as a permanent workflow column.

## Jira synchronization boundary

Jira Cloud is the authoritative task store. The dashboard may cache a normalized
read model, but it does not maintain a competing editable task database.

```text
Jira mobile/web <-> Jira Cloud REST API <-> private Jira adapter
                                               |
                                               v
                                    normalized task cache
                                               |
                                               v
                                    dashboard API -> Tasks view
```

V1 can poll Jira using JQL and discover valid transition IDs from each issue's
available transitions. Later, a narrowly exposed authenticated webhook can
invalidate the local cache for faster updates. The private backend stores the
Jira credential; the browser receives task-shaped data only.

## AI-assisted note intake

AI converts notes into proposed Jira changes, never silent writes:

```text
private notes -> AI structured draft -> schema validation -> owner review
              -> create/update Jira issues -> refresh dashboard cache
```

Each draft contains a summary, description, Epic/life area, work type, proposed
status, priority, optional real due date, acceptance criteria, and subtasks. The
owner approves the draft before creation. Bulk changes, deletion, or moving work
to Done always require explicit confirmation and should be recorded in an audit
log.

## Private Jira configuration

The public `.env.example` contains placeholders. Real values belong only in the
ignored root `.env` on the private host:

```env
JIRA_BASE_URL=https://example.atlassian.net
JIRA_PROJECT_KEY=EXAMPLE
JIRA_BOARD_ID=123
JIRA_ACCOUNT_EMAIL=you@example.com
JIRA_API_TOKEN=
```

Never paste a token into source, browser JavaScript, issue descriptions, logs,
screenshots, or chat. Prefer OAuth for a distributable integration; an API token
is acceptable for the initial private single-user backend when protected with
least-privilege Jira permissions.

Provider references:

- [Jira Cloud issue REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/)
- [Jira OAuth scopes](https://developer.atlassian.com/cloud/jira/platform/scopes-for-oauth-2-3LO-and-forge-apps/)
- [Jira Automation triggers](https://support.atlassian.com/cloud-automation/docs/jira-automation-triggers/)
