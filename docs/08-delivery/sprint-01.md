---
title: Sprint 1 — Design first (close checklist)
status: living
owner: PO
last_updated: 2026-09-28
related: sprint-02.md, module-readiness.md, ../05-architecture/module-01-platform-core.md
jira: Sprint 1 — Design first (board 638, sprint 655)
---

# Sprint 1 — Design first
**Dates:** Sun 20 Sep – **Thu 1 Oct 2026** (closes end of Thursday) · **Team:** designer (Mariam Kabbani) · PO
**Goal:** Research the market, build the HTML sample of the panel, and the core design in Figma — so the **backend gets a good starting point**.

**Close rule (D-34):** Sprint 1 closes on Thu 1 Oct when the backend start pack below is ready. The design does **not** have to be finished — what's left continues in Sprint 2.

## Backend start pack — must be ✓ by Thu 1 Oct
| # | Item | Where | Status (28 Sep) | Blocks backend? |
|---|---|---|---|---|
| 1 | Module 1 handoff: entities, rules, API first cut | [module-01-platform-core](../05-architecture/module-01-platform-core.md) | ✓ draft — backend developer to review | yes |
| 2 | HTML for every Module 1 screen (tenants, branches, registers, people & roles, menu) | `prototype/index.html` | ✓ | yes |
| 3 | Stack accepted: ADR-001 #1 tenancy, #6 backend & database, #8 hosting; backend developer named | [ADR-001](../05-architecture/adr/ADR-001-offline-first-multi-tenant.md) · POSD-104 | ✗ open | **yes — critical** |
| 4 | Core design in Figma: foundations, components, 3 shells, Tenants, Tenant overview (EN + AR) | POSD-95 · [figma-map](../04-design/figma-map.md) | ~ nearly — References page and table row component missing | no (front end only) |
| 5 | Sprint 2 planned in Jira with backend tickets | Sprint 2 — Platform core (POSD-96…105) | ✓ | yes |
| 6 | Nov-10 scope cut accepted by the PO | [scope-nov10](../02-requirements/scope-nov10.md) | ✗ proposed | no for M1, yes for later modules |
| 7 | Decisions group A answered (D-01, D-08, D-09, D-14, D-15, D-20, D-21, D-22, D-24) | [decision log](../06-decisions/decision-log.md) | ✗ open / proposed | no for M1 · D-22 (IP) before contract |

**Rule:** items 1, 2, 3 and 5 are the pack. If item 3 is still open on Thu, close the sprint anyway and escalate the same day — the backend can't start Sun 4 Oct without it (risk R-11).

## Sprint 1 tickets
| Jira | Item | Status (28 Sep) | At close |
|---|---|---|---|
| POSD-69, 90, 89, 83, 85, 92, 94 | Days 1–8: research, HTML panel, walkthrough, references | Done | — |
| POSD-95 | Day 9 — Panel in Figma: foundations, shell, first pages | In Progress | If not Done on Thu → moves to Sprint 2 as P0 |
| POSD-104 | Gate G1: accept ADR-001 stack, hand Module 1 over (due Thu 1 Oct) | To Do | Must be Done (item 3) |

## Close on Thu 1 Oct
1. 16:45 — the weekly report (PO agent) serves as the Sprint 1 review: goal verdict, start pack ✓/✗, carry-over.
2. Review the start pack with the backend developer (15 min).
3. Close Sprint 1 in Jira; move open tickets to Sprint 2.
4. Changelog line; update this file's status table.
