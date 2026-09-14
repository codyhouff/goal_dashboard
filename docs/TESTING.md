# Testing and Verification

## Philosophy
Use the narrowest verification that gives adequate confidence for the risk of the change. Escalate from targeted checks to broad suites only when necessary.

## Commands
<!-- Replace these placeholders with real commands as soon as the tech stack is initialized. Remove rows that do not apply. -->

| Check | Command | When to run |
| --- | --- | --- |
| Prototype markup | `python -m html.parser prototype/index.html` | Prototype edits |
| Prototype script syntax | `node --check prototype/app.js` | Prototype script edits |
| Prototype smoke server | `python -m http.server 3000 --directory prototype` | Visual review |

Production checks remain unconfigured until the production stack is selected.

Treat this file as the single source of truth for project verification commands. Until the commands are configured, or when a check was not run, report verification as unverified.

## Verification ladder
1. Reproduce or understand the target behavior.
2. Run the narrowest relevant test/check.
3. Implement the change.
4. Re-run the targeted check.
5. Add type/lint checks where useful.
6. Run integration/E2E only when justified by scope/risk.

## Rules
- Do not claim success for checks that were not run.
- Do not hide failing unrelated tests; distinguish pre-existing failures from regressions.
- Prefer deterministic automated checks when practical.
