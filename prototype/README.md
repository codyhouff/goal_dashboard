# Dashboard visual prototype

This dependency-free prototype validates the information hierarchy, responsive
layout, privacy control, and system architecture before a production frontend
framework is selected. All displayed information is synthetic.

## Run locally

From the repository root:

```powershell
python -m http.server 3000 --directory prototype
```

Open `http://localhost:3000` in a browser. The two primary tabs are Dashboard
and Tasks. Add `?view=wall` or `?view=tasks` to open one directly. Development
views remain available at `?view=dashboard` and `?view=system`.

The wall view uses a synthetic 3x3 vision board and synthetic metrics. Its
insight stage rotates every 30 seconds and can also be changed manually.

The Tasks view uses synthetic cards. Drag cards between stages or use the arrow
buttons. Their positions persist in browser local storage. This is prototype
persistence only; multi-device synchronization will require the private backend
and a task provider adapter such as Trello.

The static files can also be opened directly, but the local server more closely
matches the eventual kiosk environment.
