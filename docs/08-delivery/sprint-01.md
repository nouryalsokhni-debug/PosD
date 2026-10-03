---
title: Sprint 1 — Design first (close checklist)
status: living
owner: PO
last_updated: 2026-10-03
related: sprint-02.md, module-readiness.md, ../05-architecture/module-01-platform-core.md
jira: Sprint 1 — Design first (board 638, sprint 655)
---

# Sprint 1 — Design first
**Dates:** from Sun 20 Sep 2026 — **stays open until the PO closes it** (planned Thu 1 Oct; kept open on 1 Oct) · **Team:** designer (Mariam Kabbani) · PO
**Goal:** Research the market, build the HTML sample of the panel, and the core design in Figma — so the **backend gets a good starting point**.

**Close rule (D-34):** Sprint 1 closes when the PO decides the backend start pack below is ready. The design does **not** have to be finished. Design days continue in sequence (Day 12, Day 13, …) while it is open.

## Backend start pack — must be ✓ before the PO closes the sprint
| # | Item | Where | Status (3 Oct) | Blocks backend? |
|---|---|---|---|---|
| 1 | Module 1 handoff: entities, rules, API first cut | [module-01-platform-core](../05-architecture/module-01-platform-core.md) v2 · [FLOW-07](../03-flows/FLOW-07-platform-setup.md) · [seed](../../clients/electro-cafe/seed.md) | ✓ v2 — backend developer to review | yes |
| 2 | HTML for every Module 1 screen (onboarding, branches and registers, people and roles, menu) | `prototype/index.html` | ✓ corrected 3 Oct (81 checks, EN + AR) | yes |
| 3 | Stack accepted; backend developer named | [ADR-001](../05-architecture/adr/ADR-001-offline-first-multi-tenant.md) · D-35 · POSD-104 | ✓ stack accepted 3 Oct · ✗ developer name not confirmed · POSD-104 stays open until the developer has read the handoff (status comment posted) | **yes** |
| 4 | Core design in Figma: foundations, components, 3 shells, Tenants, Tenant overview (EN + AR) | POSD-95 · [figma-map](../04-design/figma-map.md) | ✓ (References and shell restored on Day 12) | no (front end only) |
| 5 | Sprint 2 planned in Jira with backend tickets | Sprint 2 — Platform core (POSD-96…105) | ✓ tickets rewritten for the stack on 3 Oct; POSD-108 (sync skeleton) added | yes |
| 6 | Nov-10 scope cut accepted by the PO | [scope-nov10](../02-requirements/scope-nov10.md) | ✗ proposed | no for M1, yes for later modules |
| 7 | Decisions group A answered (D-01, D-08, D-09, D-14, D-15, D-20, D-21, D-22, D-24) | [decision log](../06-decisions/decision-log.md) | ✗ open / proposed | no for M1 · D-22 (IP) before contract |

**Rule:** items 1, 2, 3 and 5 are the pack. **On 3 Oct the pack is ready except one action:** confirm the developer's name (they then read the handoff). The PO decides when to close the sprint.

## Sprint 1 tickets
| Jira | Item | Status (28 Sep) | At close |
|---|---|---|---|
| POSD-69, 90, 89, 83, 85, 92, 94 | Days 1–8: research, HTML panel, walkthrough, references | Done | — |
| POSD-95 | Day 9 — Panel in Figma: foundations, shell, first pages | Done (1 Oct) — References page and Quantara shell still missing | Gaps go to Day 12 |
| POSD-102 | Day 10 — Platform core in Figma | Done (1 Oct) | — |
| POSD-103 | Day 11 — Cashier sale & payment | Done | — |
| POSD-106, POSD-107 | Day 12, Day 13 — see [day-12-13](day-12-13.md) | In Review (3 Oct). Figma check: Day 13 complete; Day 12 complete except the two till sizes | POSD-107 can close; POSD-106 closes with the till sizes |
| POSD-109 | Day 14 — Module 1 changes after the PO answers — see [day-14](day-14.md) | created 3 Oct | Stays in Sprint 1 while it is open |
| POSD-104 | Gate G1: accept ADR-001 stack, hand Module 1 over | In Progress | Must be Done (item 3) |

## When the PO closes it
1. The next Thursday weekly report (PO agent) serves as the Sprint 1 review: goal verdict, start pack ✓/✗, carry-over.
2. Review the start pack with the backend developer (15 min).
3. Close Sprint 1 in Jira; move open tickets to Sprint 2.
4. Changelog line; update this file's status table.
