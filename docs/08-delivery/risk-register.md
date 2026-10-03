---
title: Risk register
status: living
owner: PO
last_updated: 2026-10-03
---

# Risk register

Score = Likelihood (1–3) × Impact (1–3). Review every Thursday; the PO agent flags risks whose trigger fired.

| ID | Risk | L | I | Score | Mitigation | Trigger | Owner |
|---|---|---|---|---|---|---|---|
| R-01 | Scope (105 launch items) doesn't fit 6 weeks | 3 | 3 | 9 | Scope cut 30 Sep; weekly burn-up check | < 70% of sprint goal done | PO |
| R-02 | Open decisions block build | 3 | 3 | 9 | Decision log with dates; weekly client check-in | Any group-A item open on Thu 1 Oct (Sprint 1 close) | PO |
| R-03 | Offline sync bugs (duplicates, conflicts, double print) | 2 | 3 | 6 | Offline behaviour settled in HTML before M2; append-only events, idempotent on (branch, event id) — ADR-001; no auto-replay of prints; real outage tests | Sync defect found in Sprint 4 | Tech lead |
| R-04 | Local payments (Syriatel Cash, Sham Cash, cards) can't integrate in time | 2 | 3 | 6 | Spike on day 1 of M2 (Sprint 3); fallback = record method + reference manually | Spike fails by 13 Oct | Tech lead |
| R-05 | Only 1 backend developer; front end not staffed | 3 | 3 | 9 | One module per sprint; P0/P1/P2 order; catalogue may spill one day; name front-end dev before Sprint 3 | Any Sprint 2 P0 not done on 8 Oct | PO |
| R-06 | IP ownership not written (D-22) | 2 | 3 | 6 | Sign before G1 | Unsigned on 1 Oct | Management |
| R-07 | Hardware not on site / incompatible | 2 | 2 | 4 | Decide hardware in S1, order by 15 Oct | Not ordered by 15 Oct | Client tech contact |
| R-08 | Figma and HTML drift | 2 | 2 | 4 | Registry + sync rules; agent drift check | Screen changed without registry update | Designer |
| R-09 | Design focused on control panel; cashier app late | 3 | 3 | 9 | Move Figma focus to cashier flows now | Cashier sale not approved by 8 Oct | PO + Designer |
| R-11 | ~~ADR-001 stack not accepted by G1~~ — closed 3 Oct (D-35) | — | — | — | — | — | PO |
| R-13 | The branch server is one box per branch: if it fails, the branch can't sell | 2 | 3 | 6 | UPS on every box; a spare box per city; "replace the branch server" flow (setup code); restore from the cloud + last local backup; decide ADR-001 b | A box fails in UAT, or no spare ordered by 15 Oct | Tech lead |
| R-14 | Three tiers instead of two: more backend work than planned for one developer | 3 | 3 | 9 | Sync skeleton in Sprint 2; hand-written sync designed before Module 2; cut P2 first; ask management for a second developer | POSD-100 (BE-4) or POSD-108 (BE-6) not done on 8 Oct | PO + tech lead |
| R-15 | Till app (Electron) has no front-end developer yet | 3 | 3 | 9 | Staff before Sprint 3; Figma till sizes finished on Day 14 | Nobody named by 8 Oct | Management |
| R-12 | Next module not ready when the backend finishes one | 2 | 3 | 6 | Readiness gate checked every Thursday; open decisions get a written assumption | A module row not all ✓ on the Thursday before its sprint | PO |
| R-10 | Client-specific requests turn into custom code | 2 | 2 | 4 | Settings-only rule in CLAUDE.md & DoR | Electro-specific ticket created | PO |
