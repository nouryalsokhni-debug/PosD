---
title: Risk register
status: living
owner: PO
last_updated: 2026-09-28
---

# Risk register

Score = Likelihood (1–3) × Impact (1–3). Review every Thursday; the PO agent flags risks whose trigger fired.

| ID | Risk | L | I | Score | Mitigation | Trigger | Owner |
|---|---|---|---|---|---|---|---|
| R-01 | Scope (105 launch items) doesn't fit 6 weeks | 3 | 3 | 9 | Scope cut 30 Sep; weekly burn-up check | < 70% of sprint goal done | PO |
| R-02 | Open decisions block build | 3 | 3 | 9 | Decision log with dates; weekly client check-in | Any group-A item open on 2 Oct | PO |
| R-03 | Offline sync bugs (duplicates, conflicts, double print) | 2 | 3 | 6 | Offline-first from S1; ADR-001; real outage tests | Sync defect found in S3 | Tech lead |
| R-04 | Local payments (Syriatel Cash, Sham Cash, cards) can't integrate in time | 2 | 3 | 6 | Spike in S1; fallback = record method manually | Spike fails by 8 Oct | Tech lead |
| R-05 | Team capacity unknown / not full-time | 2 | 3 | 6 | Confirm team this week | Not confirmed by 1 Oct | PO |
| R-06 | IP ownership not written (D-22) | 2 | 3 | 6 | Sign before G1 | Unsigned on 1 Oct | Management |
| R-07 | Hardware not on site / incompatible | 2 | 2 | 4 | Decide hardware in S1, order by 15 Oct | Not ordered by 15 Oct | Client tech contact |
| R-08 | Figma and HTML drift | 2 | 2 | 4 | Registry + sync rules; agent drift check | Screen changed without registry update | Designer |
| R-09 | Design focused on control panel; cashier app late | 3 | 3 | 9 | Move Figma focus to cashier flows now | Cashier sale not approved by 8 Oct | PO + Designer |
| R-10 | Client-specific requests turn into custom code | 2 | 2 | 4 | Settings-only rule in CLAUDE.md & DoR | Electro-specific ticket created | PO |
