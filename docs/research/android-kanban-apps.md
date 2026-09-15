# Android Kanban Apps for LIFE OS Dashboard Integration

> **Decision update (September 2026):** Jira Cloud was selected as the task
> source of truth because the goals workflow is already established there and
> Jira provides the hierarchy, status categories, automation, API, and AI/MCP
> path the dashboard needs. The comparison below is retained as research rather
> than current implementation guidance.

## Executive conclusion

Trello is the best first choice for this dashboard. It offers the cleanest
combination of real Kanban behavior, a usable Android app, a generous free tier,
and a mature API/webhook model. Its lists map directly to `To do`, `Research`,
`Plan`, `In progress`, and `Done`; labels map cleanly to LIFE OS sections.

Todoist is the strongest alternative when rapid Android capture and conventional
personal task management matter more than strict Kanban behavior. Its Android
app has substantially stronger Play Store sentiment than Trello, and its current
developer platform is excellent. However, Todoist's board columns are project
sections rather than true workflow statuses, and users report awkward behavior
around completed cards and “Done” columns.^1

Vikunja is the best privacy-first option. It can run in Docker on the same mini
PC as LIFE OS, exposes an API and signed webhooks, and keeps the task database at
home. The compromise is mobile experience: the official web interface is an
installable PWA, and Reddit feedback on phone usability remains mixed.^2

The recommended decision is:

1. Trial Trello and Todoist on Android using the exact five-column LIFE OS board.
2. Choose Trello unless its current Android interface is personally frustrating.
3. Choose Todoist if quick capture, reminders, and daily task use outweigh exact
   Kanban semantics.
4. Consider Vikunja later if keeping task data local becomes more important than
   having the most polished Android client.

## Scope and method

The comparison is optimized for a solo LIFE OS deployment, not team software in
general. The desired application must:

- work well enough on Android to add and move cards regularly;
- represent five workflow stages and attach each card to a LIFE OS section;
- allow a private mini PC to read changes and eventually write them back;
- avoid putting provider tokens in the public frontend;
- remain inexpensive for one person;
- avoid excessive operational complexity.

Scores use five weighted dimensions:

| Dimension | Weight | What is evaluated |
| --- | ---: | --- |
| Dashboard integration | 30% | Supported read/write API, webhooks, identifiers, authentication |
| Android experience | 25% | Native/PWA quality, capture, board interaction, user sentiment |
| Kanban fidelity | 20% | Real stages, card movement, Done behavior, board clarity |
| Personal simplicity | 15% | Setup burden and suitability for one person's goals |
| Cost and control | 10% | Useful free tier, paid cost, portability, self-hosting/privacy |

Official documentation is used for features, APIs, pricing, and platform
support. Reddit is used only as anecdotal evidence about lived usability. Reddit
threads are self-selected, sometimes outdated, and often contain vendor
promotion; repeated themes are more meaningful than individual comments.

## Overall ranking

| Rank | App | Weighted score | Android | Integration | Best use |
| ---: | --- | ---: | --- | --- | --- |
| 1 | Trello | 8.8/10 | Native; 3.8 Play rating | Mature REST API and signed webhooks | Best overall LIFE OS source |
| 2 | Todoist | 8.3/10 | Native; 4.6 Play rating | Excellent API, SDKs, sync endpoint, signed webhooks | Best phone-first alternative |
| 3 | Vikunja | 7.9/10 | Installable PWA; third-party clients | Self-hosted API and signed webhooks | Best privacy/control option |
| 4 | Asana | 7.4/10 | Native; 3.9 Play rating | Mature REST API and webhooks | Good free structured alternative |
| 5 | Notion | 6.9/10 | Native; 4.6 Play rating, mixed task UX | Capable database API and webhooks | Best if tasks share a knowledge base |
| 6 | ClickUp | 6.6/10 | Native; 4.0 Play rating | Broad API and webhooks | Maximum features, higher complexity |
| 7 | Jira | 6.4/10 | Native app | Very capable API and webhooks | True workflow power, excessive for solo use |
| 8 | TickTick | 6.2/10 | Native; 4.6 Play rating | Official API exists but is comparatively limited | Great personal app, risky dashboard source |

Play ratings are volatile snapshots observed in September 2026, not permanent
quality measurements. Trello, Todoist, and TickTick each showed more than ten
million Android downloads; Todoist and TickTick had 4.6 ratings, while Trello
showed 3.8.^3

## 1. Trello

### Fit for LIFE OS

Trello is a board-native system. The LIFE OS model requires almost no semantic
translation:

| LIFE OS | Trello |
| --- | --- |
| Task board | One private Trello board |
| Workflow stage | List |
| Task | Card |
| LIFE OS section | Label |
| Priority | Label initially; custom field if upgrading |
| Due date | Card due date |
| Notes/checklist | Description and checklist |
| External identity | Board, list, and card IDs |

Trello Free currently includes unlimited cards, up to ten boards per Workspace,
250 automation runs per month, due dates, Android/iOS apps, and 10 MB per file.
Standard is $5 per user/month billed annually ($6 monthly) and adds custom fields,
advanced checklists, card mirroring, and more automation.^4 One private board is
well within the free plan.

The REST API directly exposes boards, lists, and cards. Webhooks can observe a
board or card and are signed using the application secret. Trello recommends
webhooks over repeatedly polling unchanged data.^5 This is technically a strong
fit, with one deployment caveat: Trello verifies a callback URL and needs to
reach it from the internet. A LAN-only mini PC cannot receive Trello webhooks
without a carefully scoped HTTPS relay/tunnel, so periodic outbound polling is
the safest first implementation.

### Android and Reddit evidence

The Android application supports boards, card capture, dates, comments,
checklists, files, Planner, and a widget. Atlassian officially supports Android
10 or later.^6 The Play listing showed 10M+ downloads and a 3.8 rating.^3

Reddit repeatedly describes Trello as the straightforward or obvious Kanban
choice, particularly when visual stage movement is the primary need.^7 Negative
threads focus on recent interface changes, perceived product bloat, and mobile
limitations such as seeing few cards at once, missing workspace-wide views, and
Power-Ups that do not work fully on mobile.^8 These complaints are relevant, but
they do not undermine the API model or the board/list/card mapping.

### Verdict

Best overall. Start here. Use the free tier, one private board, five lists, and
LIFE OS labels. Avoid custom fields until there is a concrete need for Standard.

## 2. Todoist

### Fit for LIFE OS

Todoist is a task manager with a board layout, not a Kanban-first product. One
project could represent LIFE OS; its five sections become the board columns and
labels represent domains such as Financial, Physique, or Recovery.

Its developer platform is arguably the strongest in this comparison for a solo
integration. The unified API covers tasks, projects, sections, comments, and
labels; official Python and TypeScript SDKs are available; a sync endpoint
supports batched incremental updates; and signed webhooks cover task creation,
updates, deletion, completion, and reopening.^9 API use is available with free
accounts, subject to plan-specific feature restrictions.

The free Beginner plan includes five personal projects and list/board layouts.
As of August 2026, Pro is $7 monthly or $60 annually and adds 300 personal
projects, more filters, full history, backups, and other planning features.^10 A
single LIFE OS project can operate on the free plan.

### Android and Reddit evidence

Todoist's Android listing showed a 4.6 rating, more than 300,000 reviews, and
10M+ downloads. The official description emphasizes instant cross-device sync
and deliberately low complexity.^3 Reddit users commonly praise Todoist for fast
capture, a clean personal workflow, filters, and stronger everyday task behavior
than team-oriented tools.^11

The key drawback is Kanban fidelity. A highly supported 2025 Reddit thread notes
that completing a task does not naturally move it into a Done column; completed
cards may disappear or require display/workaround choices. Other users describe
the columns as organizational sections rather than lifecycle states.^1 Subtasks
and some filtered board arrangements also produce friction.^12 LIFE OS could
compensate in its adapter, but that creates behavior the source app does not
natively own.

### Verdict

Best Android-first alternative. Prefer it if the phone will be used as a daily
inbox, reminder system, and conventional to-do list, and the wall board is a
secondary projection. Choose Trello instead if moving work visibly through five
stages is the central ritual.

## 3. Vikunja

### Fit for LIFE OS

Vikunja is open-source and self-hostable, with list, table, Gantt, and Kanban
views.^13 It could run as another Docker service on the LIFE OS mini PC. That
gives it three architectural advantages:

- task records and credentials remain at home;
- the dashboard can query the task API over the Docker/LAN network;
- webhooks can call the LIFE OS backend locally instead of crossing the public
  internet.

Vikunja supports API tokens/JWT and project- or user-level signed webhooks.
Project events include task create/update/delete, comments, attachments, and
relations.^14 Its webhook system does not retry failed deliveries, so the
dashboard must periodically reconcile with the API even when using webhooks.

### Android and Reddit evidence

The principal weakness is that the default Android experience is the responsive
web app installed as a PWA rather than an established first-party native client.
Reddit is divided: some users report that the PWA works acceptably or better than
other self-hosted alternatives; others call the mobile interface difficult and
build third-party frontends around it.^2 Self-hosted communities nevertheless
recommend Vikunja frequently for its balance of Kanban, dependencies, labels,
and control.^15

### Verdict

Best long-term privacy option, but not the first trial if effortless Android use
is the priority. Revisit after the core dashboard is stable, or test its PWA on
the actual phone before committing.

## 4. Asana

Asana Personal is free for one or two people and includes unlimited tasks and
projects plus list, board, and calendar views. Native Android/iOS apps are
included. Starter is $10.99 per user/month billed annually, but its team-oriented
features are unnecessary for this project.^16

The developer platform provides a mature REST API, personal access tokens for
testing, OAuth for integrations, and webhooks.^17 A project and sections map
reasonably well to the LIFE OS board. The Android listing showed a 3.9 rating and
5M+ downloads, with some recent device-specific UI complaints.^18

Asana is technically sound but is designed around work management. It adds more
structure than Trello without offering Jira's workflow depth or Todoist's quick
personal capture. It is a credible fallback, not the leading choice.

## 5. Notion

Notion can model the board elegantly as a database: a Status property supplies
the columns, a Section property supplies LIFE OS categories, and additional
properties store priority, dates, source IDs, and wall visibility. The free plan
includes databases, subtasks, dependencies, and custom properties; Plus is $10
per member/month.^19

The API can query and update database-backed pages, and current webhooks notify
the backend when pages or data sources change. Webhook payloads are signals; the
receiver then fetches current content via the API. Like Trello, the callback
must be secure and publicly reachable.^20

This flexibility is also the cost. Reddit users frequently describe Notion task
systems as requiring continuous configuration. Recent Notion threads report
slow, clunky database navigation on Android, although experiences vary and the
Play rating remains strong.^21 Use Notion only if LIFE OS tasks need to live
beside substantial notes, research, and reference databases.

## 6. ClickUp

ClickUp Free Forever includes unlimited tasks, Kanban boards, calendar view,
basic custom fields, and 60 MB storage. Unlimited is $7 per user/month billed
yearly.^22 Its API and webhooks can support full synchronization, and board view
is available on every plan.^23

The Android listing showed a 4.0 rating and 1M+ downloads.^24 The drawback is
scope: ClickUp deliberately combines tasks, docs, chat, AI, sprints, whiteboards,
dashboards, files, and many other functions. Reddit complaints about the free
plan mention upsell pressure and complexity.^25 This is more platform than LIFE
OS needs from an external task source.

## 7. Jira

Jira has the strongest true workflow engine in the group: customizable statuses,
transitions, work-item types, labels/components, Kanban boards, automation,
backlogs, and reporting. The free plan supports up to ten users with unlimited
projects and work items, Kanban/Scrum boards, 2 GB storage, and limited
automation.^26 Its REST API and webhooks are comprehensive.^27

Those strengths solve organizational software delivery problems that a solo
goal board does not have. Configuration, terminology, permissions, and workflow
administration create ongoing overhead. Jira is appropriate only if designing
and maintaining workflows is itself desirable; otherwise Trello gives the
needed visual stages at a fraction of the cognitive load.

## 8. TickTick

TickTick may be the strongest standalone Android productivity app here. Its Play
listing showed a 4.6 rating, 10M+ downloads, widgets, reminders, natural-language
capture, recurring tasks, calendar integration, habits, Pomodoro, and cross-
platform sync.^3 Free includes list and Kanban views; Premium is $49.99/year.^28

It ranks last for this specific integration because the dashboard connection is
the deciding constraint. TickTick has an official developer portal and an Open
API, but developer discussions repeatedly describe limited documentation,
missing functionality compared with private/internal endpoints, authentication
friction, and reliance on unofficial libraries.^29 A 2025 Reddit discussion from
an assistant developer specifically favored Todoist for its public API.^30

TickTick is worth trying as a personal organizer, but it should not become the
system of record for LIFE OS unless a small proof of concept first demonstrates
reliable read/write access to every required task and project field.

## Reddit synthesis

### Themes that repeated

1. **Trello remains the reference point for simple Kanban.** Even threads seeking
   alternatives commonly define success as “Trello, but self-hosted/faster/less
   bloated.” Users still recommend it when direct board manipulation matters.^7
2. **Todoist and TickTick are favored for personal task capture.** Their reminders,
   recurrence, widgets, and quick-add experiences fit everyday chores better than
   project-management products.^11
3. **Board view does not guarantee Kanban semantics.** Todoist's Done behavior and
   filtered-board movement illustrate the difference between horizontal task
   grouping and workflow state.^1
4. **Notion and ClickUp can become systems-maintenance projects.** Their power is
   attractive, but several users report avoiding them when they want a fast,
   low-friction personal tool.^21
5. **Self-hosting shifts the compromise to mobile.** Vikunja, Planka, Wekan,
   Kanboard, and similar tools are frequently recommended, but PWA quality,
   notifications, offline behavior, and native clients remain recurring concerns.^2
6. **Novel alternatives need skepticism.** Recommendation threads contain many
   founder promotions and young products. A good-looking board without a stable,
   documented API is a poor source of record for LIFE OS.

### What Reddit cannot establish

Reddit cannot reliably determine security, long-term product viability, current
pricing, or API completeness. Positive comments may come from founders; negative
threads overrepresent people experiencing problems. The strongest use of Reddit
here is identifying friction to test personally: Android card density, Done
behavior, quick capture, offline/PWA behavior, and perceived bloat.

## Integration designs

### Recommended V1: outbound polling

```text
Android app -> provider cloud
                    ^
                    | HTTPS every 1-5 minutes
                    v
private task adapter on mini PC -> SQLite task mirror -> dashboard API
```

This requires no inbound firewall rule, public callback, or cloud relay. The
adapter stores the last provider cursor/change token where available and performs
a periodic full reconciliation. A one-to-five-minute delay is effectively live
for an ambient wall task board.

### Later: webhook plus reconciliation

```text
provider webhook -> narrow public HTTPS relay -> private task adapter
                                              -> immediate refresh

scheduled API reconciliation ----------------> repairs missed events
```

Webhook signatures must be verified before processing. Events must be idempotent,
and a scheduled source-of-truth comparison is still necessary. Do not expose the
entire dashboard server solely to receive task events.

### Privacy-first: co-hosted Vikunja

```text
Android PWA -> private Vikunja on mini PC -> local signed webhook/API
                                          -> LIFE OS task mirror
```

Remote phone access would use the same private network/tunnel as the dashboard.
This keeps all task content local and removes the third-party webhook problem.

## Data mapping and conflict rules

The local dashboard should use a provider-neutral task record even if Trello is
selected first:

| Local field | Trello | Todoist | Vikunja |
| --- | --- | --- | --- |
| `external_id` | Card ID | Task ID | Task ID |
| `stage` | List ID/name | Section ID/name | Kanban bucket |
| `section` | Label | Label | Label |
| `title` | Card name | Task content | Task title |
| `notes` | Description | Description | Description |
| `due_at` | Due date | Due date/deadline | Due date |
| `completed` | Done list and/or dueComplete | Completed task | Done flag/bucket |
| `updated_at` | Card update time | Update/sync metadata | Task update time |

The adapter should retain both local and provider IDs. Provider updates normally
win for provider-owned cards. Dashboard-originated edits are written to the
provider and remain pending until read back. Deletions should first become local
tombstones so a temporary provider failure cannot recreate old cards.

Task cards should not contain exact balances, health measurements, credentials,
private photos, or intimate history. The external service needs only actionable
task metadata; sensitive goal data remains in the LIFE OS database.

## Two-week trial protocol

Create the same private board in Trello and Todoist:

- columns: To do, Research, Plan, In progress, Done;
- labels: Financial, Physique, Recovery, Vision, Style, Life, Wardrobe, Weather,
  Platform;
- ten realistic tasks with two due dates, two checklists, and two recurring or
  repeated tasks.

For seven days per app, record:

| Test | Pass condition |
| --- | --- |
| Quick capture | Add a correctly labeled task in under 15 seconds |
| Move card | Advance a card one stage without opening its detail page |
| Done behavior | Completion appears where expected without repair work |
| Morning use | Board loads and is understandable immediately |
| Notification | Due reminder arrives reliably and is easy to act on |
| Dashboard read | API returns title, stage, labels, due date, and update time |
| Dashboard write | Test card can be moved through the official API |
| Recovery | Revoked/reissued token can reconnect without data loss |

Do not subscribe during the trial. Both leading options can test this workflow
on free plans. The selection should be based on which app is actually opened and
used, not which has the longest feature list.

## Final recommendation

Use Trello as the default integration target for the first production task
adapter. Implement the dashboard against a provider-neutral local schema and
poll Trello from the private backend. Retain the current local board as a demo
and offline fallback.

If the Trello Android trial reveals unacceptable mobile friction, switch the
adapter target to Todoist. Its developer tooling makes this technically easy,
but explicitly decide how `Done` should work before importing real tasks.

Keep Vikunja as the strategic privacy option. Its local API/webhook architecture
is ideal for LIFE OS, but the actual Android/PWA experience should improve or be
personally validated before it becomes the primary capture tool.

## Sources

1. Reddit, r/todoist, “[Todoist really needs a real Kanban board — where Done actually works](https://www.reddit.com/r/todoist/comments/1nzdc5q/todoist_really_needs_a_real_kanban_board_where/),” October 2025.
2. Reddit, r/selfhosted and r/Vikunja, “[Kanban and mobile](https://www.reddit.com/r/selfhosted/comments/1l7raor/),” June 2025; “[Unofficial third-party Vikunja client](https://www.reddit.com/r/Vikunja/comments/1s4lcje/unofficial_thirdparty_vikunja_client/),” 2026.
3. Google Play, “[Trello](https://play.google.com/store/apps/details?id=com.trello),” “[Todoist](https://play.google.com/store/apps/details?id=com.todoist),” “[TickTick](https://play.google.com/store/apps/details?id=com.ticktick.task),” accessed September 2026.
4. Atlassian, “[Trello pricing](https://trello.com/en-US/pricing),” accessed September 2026.
5. Atlassian Developer, “[Trello API introduction](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)” and “[Webhooks](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/),” accessed September 2026.
6. Atlassian Support, “[What browsers and platforms does Trello support?](https://support.atlassian.com/trello/docs/what-browsers-and-mobile-platforms-does-trello-support/),” accessed September 2026.
7. Reddit, r/androidapps, “[To Do Manager with board view of multiple lists?](https://www.reddit.com/r/androidapps/comments/znh6at/),” December 2022; r/ProductivityApps, “[Free or almost free app with similar interface](https://www.reddit.com/r/ProductivityApps/comments/1cb9qcy/),” April 2024.
8. Reddit, r/trello, “[Trello mobile users: What frustrates you most?](https://www.reddit.com/r/trello/comments/1hsocdg/),” January 2025; “[I'm leaving Trello](https://www.reddit.com/r/trello/comments/1m8qdn9/),” July 2025.
9. Doist, “[Todoist Developer Platform](https://developer.todoist.com/)” and “[Todoist API](https://developer.todoist.com/api/v1/),” accessed September 2026.
10. Doist, “[Todoist plans, pricing, and billing FAQ](https://www.todoist.com/help/todoist/billing/todoist-plans-pricing-and-billing-faq-Vq2z0HWL6),” updated August 2026.
11. Reddit, r/productivity, “[Todoist Project board vs Trello](https://www.reddit.com/r/productivity/comments/zr1ga0/),” December 2022; r/ProductivityApps, “[Suggestions for alternative apps](https://www.reddit.com/r/ProductivityApps/comments/1i4qnrs/),” January 2025.
12. Reddit, r/todoist, “[Kanban app that syncs with Todoist](https://www.reddit.com/r/todoist/comments/1kv6he6/),” May 2025; “[Is the Kanban view no longer draggable?](https://www.reddit.com/r/todoist/comments/1ro43op/),” March 2026.
13. Vikunja, “[The task manager you actually own](https://vikunja.io/),” accessed September 2026.
14. Vikunja, “[Webhooks API](https://vikunja.io/docs/webhooks/),” accessed September 2026.
15. Reddit, r/selfhosted, “[Selfhosted todo apps (Kanban-style)](https://www.reddit.com/r/selfhosted/comments/1jo5cj1/),” March 2025.
16. Asana, “[Pricing](https://asana.com/pricing),” accessed September 2026.
17. Asana Developers, “[Build an app with Asana](https://developers.asana.com/docs/overview),” accessed September 2026.
18. Google Play, “[Asana: Work Management](https://play.google.com/store/apps/details?id=com.asana.app),” accessed September 2026.
19. Notion, “[Pricing](https://www.notion.com/pricing),” accessed September 2026.
20. Notion Developers, “[Webhooks](https://developers.notion.com/reference/webhooks),” accessed September 2026.
21. Reddit, r/Notion, “[Why is Notion's mobile app still so bad in 2026?](https://www.reddit.com/r/Notion/comments/1rm22u6/),” March 2026; “[Notion is too slow](https://www.reddit.com/r/Notion/comments/1ofxaiz/),” October 2025.
22. ClickUp, “[Pricing FAQ](https://clickup.com/faqs),” accessed September 2026.
23. ClickUp Developer, “[Webhooks](https://developer.clickup.com/docs/webhooks),” and ClickUp Help, “[Views availability](https://help.clickup.com/hc/en-us/articles/32274881672599-Views-feature-availability-and-limits),” accessed September 2026.
24. Google Play, “[ClickUp](https://play.google.com/store/apps/details?id=co.mangotechnologies.clickup),” accessed September 2026.
25. Reddit, r/clickup, “[Real limitations of the Free Plan](https://www.reddit.com/r/clickup/comments/1jhm929/),” 2025.
26. Atlassian, “[Jira pricing](https://www.atlassian.com/software/jira/pricing)” and “[Jira plans](https://www.atlassian.com/software/jira/guides/more/jira-editions),” accessed September 2026.
27. Atlassian Developer, “[Jira Cloud REST API: issues](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/)” and “[Jira webhooks](https://developer.atlassian.com/cloud/jira/software/webhooks/),” accessed September 2026.
28. TickTick, “[Upgrade](https://ticktick.com/upgrade),” accessed September 2026.
29. Reddit, r/ticktick, “[API v2 documentation?](https://www.reddit.com/r/ticktick/comments/yob4h4/),” November 2022; “[Expanded API for TickTick](https://www.reddit.com/r/ticktick/comments/1ka361k/),” 2025.
30. Reddit, r/ticktick, “[What TickTick alternatives have a better public API?](https://www.reddit.com/r/ticktick/comments/1pe3cgc/),” 2025.
