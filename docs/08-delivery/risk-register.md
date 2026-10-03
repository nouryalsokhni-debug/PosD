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
| R-01 | Scope: the client wants **everything** on the launch list on opening day (D-21) — 105 items, 5 weeks, one backend developer | 3 | 3 | 9 | Build in the agreed order (IN → MIN → LATER, Q-29); weekly burn-up check; ask management for more developers; tell the client early what is at risk | < 70% of a sprint goal done, or Module 2 not finished on 15 Oct | PO + management |
| R-02 | Open decisions block build (9 closed on 3 Oct; stock level, card, card and wallet refunds still open) | 2 | 3 | 6 | Decision log with dates; weekly client check-in | Any group-A item open on Thu 1 Oct (Sprint 1 close) | PO |
| R-03 | Offline sync bugs (duplicates, conflicts, double print) | 2 | 3 | 6 | Offline behaviour settled in HTML before M2; append-only events, idempotent on (branch, event id) — ADR-001; no auto-replay of prints; real outage tests | Sync defect found in Sprint 4 | Tech lead |
| R-04 | Local payments (Syriatel Cash, Sham Cash, cards) can't integrate in time | 2 | 3 | 6 | Spike on day 1 of M2 (Sprint 3); fallback = record method + reference manually | Spike fails by 13 Oct | Tech lead |
| R-05 | Only 1 backend developer, who is also the tech lead; till developer not named | 3 | 3 | 9 | One module per sprint; P0/P1/P2 order; catalogue may spill one day; name front-end dev before Sprint 3 | Any Sprint 2 P0 not done on 8 Oct | PO |
| R-06 | ~~IP ownership not written~~ — closed 3 Oct: Quantara owns the software (D-22) | — | — | — | — | — | Management |
| R-07 | Hardware not on site / incompatible | 2 | 2 | 4 | Decide hardware in S1, order by 15 Oct | Not ordered by 15 Oct | Client tech contact |
| R-08 | Figma and HTML drift | 2 | 2 | 4 | Registry + sync rules; agent drift check | Screen changed without registry update | Designer |
| R-09 | Design focused on control panel; cashier app late | 3 | 3 | 9 | Move Figma focus to cashier flows now | Cashier sale not approved by 8 Oct | PO + Designer |
| R-11 | ~~ADR-001 stack not accepted by G1~~ — closed 3 Oct (D-35) | — | — | — | — | — | PO |
| R-13 | The branch server is one box per branch: if it fails, the branch can't sell | 2 | 3 | 6 | UPS on every box; a spare box per city; "replace the branch server" flow (setup code); restore from the cloud + last local backup; decide ADR-001 b | A box fails in UAT, or no spare ordered by 15 Oct | Tech lead |
| R-14 | Three tiers instead of two: more backend work than planned for one developer | 3 | 3 | 9 | Sync skeleton in Sprint 2; hand-written sync designed before Module 2; cut P2 first; ask management for a second developer | POSD-100 (BE-4) or POSD-108 (BE-6) not done on 8 Oct | PO + tech lead |
| R-15 | The iPad till app is built by Quantara (D-37) but has no named developer | 3 | 3 | 9 | Name the developer before Sprint 3 (Q-25); till screens at iPad sizes on Day 14; reuse the HTML prototype's behaviour | Nobody named by 8 Oct | Management |
| R-16 | Till as an installed web app on iPad, with HTTPS inside the branch, is unproven | 2 | 3 | 6 | ADR-002 first-week spike on a real iPad: offline reach, restart, two tills at once; fallback = thin native shell | Spike not passed by 8 Oct | Tech lead |
| R-12 | Next module not ready when the backend finishes one | 2 | 3 | 6 | Readiness gate checked every Thursday; open decisions get a written assumption | A module row not all ✓ on the Thursday before its sprint | PO |
| R-10 | Client-specific requests turn into custom code | 2 | 2 | 4 | Settings-only rule in CLAUDE.md & DoR | Electro-specific ticket created | PO |
