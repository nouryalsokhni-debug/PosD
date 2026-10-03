---
title: Sprint 2 — Platform core
status: living
owner: PO
last_updated: 2026-10-03
related: module-readiness.md, ../05-architecture/module-01-platform-core.md
jira: Sprint 2 — Platform core (board 638, sprint 690)
---

# Sprint 2 — Platform core
**Dates:** Sun 4 – Thu 8 Oct 2026 (5 working days) · **Team:** 1 backend developer · designer (Mariam Kabbani) · PO
**Sprint goal:** The backend starts Module 1 (Platform core): tenants, branches, registers, users and roles running with tenant isolation, while design and the HTML get the Sale module ready for backend in Sprint 3.

## Where we are (3 Oct)
- **Module 1 is ready for the backend:** stack accepted (ADR-001, D-35), handoff v2, [FLOW-07](../03-flows/FLOW-07-platform-setup.md), one [seed set](../../clients/electro-cafe/seed.md), HTML corrected and tested.
- Sprint 1 stays open (D-34); design continues there with [Day 14](day-14.md).
- **Jira updated 3 Oct:** POSD-96 (epic), POSD-97, 98, 99, 100 rewritten for the stack; **POSD-108** (BE-6 sync skeleton) created in Sprint 2; **POSD-109** (Day 14) created in Sprint 1; status comment on POSD-104 (stays open until the developer is named and has read the handoff); cashier fixes added to POSD-105.
- **Answers of 3 Oct (management, client, accountant):** backend developer chosen and invited · the till is an iPad built by Quantara (D-37, ADR-002 proposed) · everything must work on opening day (D-21) · tax, rounding, mixed payment, refunds, stations and offline limits decided. All questions and their status: [open-questions](open-questions.md).
- Still to do: record the developer's name and assign the tickets.

## Capacity
| Person | Days | Plan to | Notes |
|---|---|---|---|
| Backend developer | 5 | 4 days (80%) | Starts only if G1 is met (POSD-104, closes with Sprint 1) |
| Designer | 5 | 4 days | POSD-95 carryover first |
| PO | — | — | Gate G1, Module 2 readiness, HTML step 2 C–D |

## Sprint backlog
Backend tickets follow the [Module 1 handoff v2](../05-architecture/module-01-platform-core.md). Stack: Node.js + TypeScript (Fastify), PostgreSQL with Row-Level Security; one repo for cloud API, branch server and shared schema.

| Pri | Jira | Item | Est. | Owner | Depends on |
|---|---|---|---|---|---|
| P0 | POSD-97 | **BE-1 Project setup:** one TypeScript repo (cloud API · branch server · shared schema and types), PostgreSQL + RLS, migrations, CI, staging, Docker Compose for the branch tier | 0.75 d | Backend | — |
| P0 | POSD-98 | **BE-2 Tenants, plans, branches, branch server, registers:** tenant code; branch code (unique, locked after the first invoice); pause / resume; registers rename / retire; plan limits (409); enrol-token endpoint; isolation test (tenant A can't read tenant B) | 1 d | Backend | POSD-97 |
| P0 | POSD-99 | **BE-3 People, roles, sign-in:** status invited / active / disabled; invite link + password for the back office; temporary PIN + `pin_must_change`; 8-digit card; hashes only; role matrix `GET/PUT /roles`; owner keeps "manage people" | 1.25 d | Backend | POSD-98 |
| P1 | POSD-100 | **BE-4 Catalogue:** categories (two levels, reorder, delete only when empty), items (`sold_at`, image, one barcode), option groups + item price overrides, branch overrides (pause, discount) | 1 d | Backend | POSD-98 |
| P1 | POSD-108 | **BE-6 Sync skeleton:** `POST /sync/enrol`, `GET /sync/down?since=` (one feed: branch, registers, people with hashes, matrix, menu), heartbeat on `POST /sync/up` (versions, events waiting, register last-seen), schema-version check; branch server boots, enrols and stores the feed | 1 d | Backend | POSD-99, POSD-100 |
| P2 | POSD-101 | **BE-5 Audit log + support-access windows** (stretch) | 0.5 d | Backend | POSD-98 |
| P0 | POSD-109 (in Sprint 1) | Day 14 — Module 1 changes after the PO answers ([day-14](day-14.md)) | 2 d | Designer | — |
| P0 | POSD-105 | Module 2 ready for backend: cashier logic fixes (gap G-39), check at iPad sizes, handoff doc (order lines saved on the branch server as they are entered), remaining decisions (due Thu 8 Oct) | — | PO | — |
| P0 | POSD-110 | Tech lead: accept ADR-002 and run the iPad spike (web app from the branch server, HTTPS in the branch, two tills at once) | 1 d | Tech lead | — |

**Backend load:** P0 = 3 d (75% of 4 days) · with P1 = 5 d — **over capacity by 1 day.** The catalogue and the sync skeleton are both needed before Module 2; whichever is not finished is the first item of Sprint 3 (R-14). Audit (P2) is cut first.

**Seed:** load [Electro Café seed](../../clients/electro-cafe/seed.md) in staging for the Thursday demo.

## Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Branch tier adds work to Sprint 2 (sync skeleton) | Catalogue or sync spills into Sprint 3 and squeezes Module 2 | Order P0 → P1; decide on Tue 6 Oct which of BE-4 / BE-6 spills |
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
| Sat 3 Oct | ADR-001 accepted (D-35); Module 1 handoff v2 |
| When the PO closes Sprint 1 | Sprint 1 review (weekly report) |
| Sun 4 Oct | Sprint 2 starts |
| Tue 6 Oct | Mid-sprint check |
| Thu 8 Oct | Demo (tenant + branch + person created through the API; back-office login; permission refused; a branch server enrols and receives the feed) · Module 2 readiness check · retro |
| Sun 11 Oct | Sprint 3 — backend Module 2 (Sale) |
