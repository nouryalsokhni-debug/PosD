---
title: Module readiness — when the backend can start a module
status: living
owner: PO
last_updated: 2026-09-28
related: delivery-plan.md, sprint-02.md, ../05-architecture/module-01-platform-core.md
---

# Module readiness

The backend builds one module at a time, in parallel with design. It starts a module only when that module is **ready**. The HTML prototype is the reference for behaviour and data; Figma is the reference for looks.

## "Ready for backend" gate
A module is ready when all five are true:
1. **HTML complete** — every screen of the module works in `prototype/` (EN + AR), its requirements show *works* on the coverage page.
2. **Flows written** — the module's steps are in `docs/03-flows/` (or the handoff doc).
3. **Handoff doc** — entities, fields, ownership, API list and rules in `docs/05-architecture/module-NN-*.md`, reviewed by the backend developer.
4. **Decisions** — every decision the module's *data* depends on is decided, or has a written assumption the PO accepts.
5. **Stack** — ADR-001 accepted for the parts the module touches.

Figma is **not** a gate for the backend (it only changes looks). It is a gate for the front end.

## Module order and status (28 Sep)
| # | Module | Screens (HTML) | Requirements | HTML | Handoff | Blocking decisions | Backend sprint |
|---|---|---|---|---|---|---|---|
| M1 | **Platform core** — tenants, branches, registers, users & roles, catalogue | Tenants, tenant record, onboarding, branches, registers, people & roles, menu | GEN-01…03, CSH-08, USR-01…07, CAT-01…05, PRC-01 | ✓ | ✓ draft | ADR-001 #1 + #6 (stack) · D-25 ✓ · D-27 proposed | **Sprint 2 · 4–8 Oct** (epic POSD-96) |
| M2 | **Sale** — order, payment, invoice, prep ticket, online + offline | Cashier: sale, payment, done, orders, kitchen, customer display | POS-*, PAY-01…10, FIS-01…03, KDS-*, OFF-01/02/05/07/08 | ✓ (step 2 C–D done 28 Sep) | to write | ADR-001 #2–#5 (where the till runs, local storage, sync) · D-10 · D-11 · D-14 · D-29 | Sprint 3 · 11–15 Oct |
| M3 | **Shift & money** — shift, drawer, cancel/refund, printing, sync conflicts | Cashier: close shift, invoices, To print; HQ: shifts | CSH-*, PAY-12, FIS-06/07, HW-02/03, OFF-03/06 | ✓ (printing done 28 Sep) · step 2 E–F to finish | to write | D-05 · D-06 · D-23 · ADR-001 #7 (printing) | Sprint 4 · 18–22 Oct |
| M4 | **Back office** — prices & offers, exchange rate, reports, inventory | HQ: prices, promotions, payments, reports, inventory, till rules | PRC-*, PAY-04/05, RPT-*, STK-* | ✓ | to write | D-01 (stock by item or recipe) · D-03 (tax) · D-04 | Sprint 5 · 25–29 Oct |
| M5 | **Quantara minimum** — onboarding, support access, operations health | Quantara panel | GEN-01, USR-05, OFF-07 | ✓ | to write | D-32 only for billing (not needed 10 Nov) | Sprint 5 (small) |

Billing, subscriptions and the support queue are built in HTML but are **not** needed for 10 Nov (Electro Café is a design partner). They wait for D-32.

## What must be done to unlock the next module
- **Unlock M1 (by 1 Oct, POSD-104):** accept ADR-001 #1 (shared DB + `tenant_id`) and #6 (backend language, framework, database). Backend developer reads the M1 handoff and flags questions.
- **Unlock M2 (by 8 Oct, POSD-105):** ~~finish step 2 C–D in HTML~~ done 28 Sep; write the M2 handoff; decide ADR-001 #2–#5; answer D-10, D-11, D-14, D-29 (or accept assumptions).
- **Unlock M3 (by 15 Oct):** finish step 2 E–F; M3 handoff; D-05, D-06, D-23.
- **Unlock M4 (by 22 Oct):** M4 handoff; D-01, D-03, D-04.
