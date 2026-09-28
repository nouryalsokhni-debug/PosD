---
title: Sprint 2 — Platform core
status: living
owner: PO
last_updated: 2026-09-28
related: module-readiness.md, ../05-architecture/module-01-platform-core.md
jira: Sprint 2 — Platform core (board 638, sprint 690)
---

# Sprint 2 — Platform core
**Dates:** Sun 4 – Thu 8 Oct 2026 (5 working days) · **Team:** 1 backend developer · designer (Mariam Kabbani) · PO
**Sprint goal:** The backend starts Module 1 (Platform core): tenants, branches, registers, users and roles running with tenant isolation, while design and the HTML get the Sale module ready for backend in Sprint 3.

## Where we are (28 Sep)
- Sprint 1 (design, 20 Sep – 2 Oct): 8 of 9 tasks done. **POSD-95** (panel in Figma: foundations, shell, Tenants, Tenant overview) is in progress → carries over if not done by Fri 2 Oct.
- HTML prototype: covers all 111 requirements; Quantara panel complete; cashier printing done (step 2 A–B).
- No backend yet. ADR-001 (stack) still *proposed*. No dev project; backend tickets live in POSD with label `backend`.

## Capacity
| Person | Days | Plan to | Notes |
|---|---|---|---|
| Backend developer | 5 | 4 days (80%) | Starts only if G1 is met (POSD-104) |
| Designer | 5 | 4 days | POSD-95 carryover first |
| PO | — | — | Gate G1, Module 2 readiness, HTML step 2 C–D |

## Sprint backlog
| Pri | Jira | Item | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| P0 | POSD-104 | Gate G1: accept ADR-001 stack, hand Module 1 over (**due Thu 1 Oct**) | — | PO | — |
| P0 | POSD-97 | BE-1 Project setup: repo, stack, CI, environments | 0.5 d | Backend | POSD-104 |
| P0 | POSD-98 | BE-2 Tenants, plans, branches, registers — isolation + plan limits | 1 d | Backend | POSD-97 |
| P0 | POSD-99 | BE-3 Users, roles & permission matrix, login (HQ, till PIN/card, manager approval) | 1.5 d | Backend | POSD-98 |
| P1 | POSD-100 | BE-4 Catalogue + branch overrides + `GET /catalogue?since=` | 1.5 d | Backend | POSD-98 |
| P2 | POSD-101 | BE-5 Audit log + support-access windows (stretch) | 0.5 d | Backend | POSD-98 |
| P0 | POSD-95 | Day 9 — Panel in Figma (carryover from Sprint 1) | ~1 d | Designer | — |
| P0 | POSD-102 | Day 10 — Platform core in Figma: branches & registers, people & roles, menu | 2 d | Designer | — |
| P1 | POSD-103 | Day 11 — Cashier sale & payment in Figma | 2 d | Designer | — |
| P0 | POSD-105 | Module 2 ready for backend: HTML step 2 C–D, handoff doc, decisions (due Thu 8 Oct) | — | PO | — |

**Backend load:** P0 = 3 d (60%) · with P1 = 4.5 d (90%) · with P2 = 5 d. The catalogue (P1) is needed by Module 2; if it doesn't finish, it is the first item of Sprint 3. Audit (P2) is cut first.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| ADR-001 not accepted by 1 Oct | Backend can't start on 4 Oct; whole plan slips | POSD-104 due 1 Oct; PO escalates on 30 Sep if no tech lead |
| One backend developer | Any sick day loses 20% of the sprint | Order P0 → P1 → P2; catalogue can spill to Sprint 3 day 1 |
| Figma behind the backend | Front end has no design for Module 1 screens | Backend doesn't need Figma; HTML is its reference. Front end starts from Figma one sprint later |
| Module 2 not ready by 8 Oct | Backend idles or starts Sale without clear rules | POSD-105 due 8 Oct; open decisions get a written assumption the PO accepts |

## Definition of done (backend)
- [ ] Code reviewed and merged; CI green
- [ ] Automated tests for the rules in the ticket (isolation, permissions, limits)
- [ ] Deployed to staging
- [ ] Handoff doc updated with any field/API change
- [ ] PO checked it against the HTML screen

## Key dates
| Date | Event |
|---|---|
| Thu 1 Oct | Gate G1 — ADR-001 accepted, Module 1 handed over |
| Fri 2 Oct | Sprint 1 ends; review + move POSD-95 if open |
| Sun 4 Oct | Sprint 2 starts |
| Tue 6 Oct | Mid-sprint check |
| Thu 8 Oct | Demo (tenant + branch + user created through the API; login; permission refused) · Module 2 readiness check · retro |
| Sun 11 Oct | Sprint 3 — backend Module 2 (Sale) |
