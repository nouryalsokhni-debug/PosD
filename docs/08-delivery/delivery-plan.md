---
title: Delivery plan
status: living
owner: PO
last_updated: 2026-10-01
---

# Delivery plan

Dates & gates: [master plan §4](../00-master-plan.md). This file = sprint goals and Jira structure.

## Jira structure
- **POSD** holds design, PO and backend work (decided 28 Sep). Backend tickets carry the label `backend` and a module label (`module-1`…). A separate dev project can come later.
- Epics: POSD-1 Screens & design system · POSD-2 Process models · POSD-68 Sprint 1 design · **POSD-96 Backend — Module 1: Platform core**. One backend epic per module.
- Every ticket: requirement IDs as labels (e.g. `USR-01`), link to the handoff doc and HTML route, Definition of Done.

## How the backend runs in parallel
The backend builds **one module at a time**, starting a module only when it passes the readiness gate in [module-readiness.md](module-readiness.md) (HTML complete, flows, handoff doc, decisions, stack). Figma gates the front end, not the backend.

## Sprints (1 week, Sun–Thu)
| Sprint | Dates | Backend module | Design (one sprint ahead) | PO / HTML |
|---|---|---|---|---|
| Sprint 1 — Design first | 20 Sep – open (PO closes it) | — | Research, panel HTML, core design in Figma (POSD-95) | Backend start pack ([close checklist](sprint-01.md)) |
| **Sprint 2 — Platform core** | 4 – 8 Oct | **M1** tenants, branches, registers, users & roles, catalogue ([plan](sprint-02.md)) | Platform core screens; cashier sale & payment | G1 by 1 Oct; make M2 ready (step 2 C–D, handoff) |
| Sprint 3 | 11 – 15 Oct | **M2** Sale: order → payment → invoice → prep ticket, online + offline | Cashier: shift close, invoices, kitchen | Make M3 ready (step 2 E–F) |
| Sprint 4 | 18 – 22 Oct | **M3** Shift & money: shift, drawer, cancel/refund, printing, sync conflicts | HQ back office: prices, reports | Make M4 ready |
| Sprint 5 | 25 – 29 Oct | **M4** Back office: prices & offers, exchange rate, reports, inventory · **M5** Quantara minimum | States, polish | UAT script |
| Hardening | 1 – 5 Nov | Bugs, performance, UAT | UAT support | UAT with Electro Café |
| Install | 7 – 9 Nov | Hardware, data load, training, dry run | Training material | Go-live Tue 10 Nov |
