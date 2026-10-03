---
title: Module readiness — when the backend can start a module
status: living
owner: PO
last_updated: 2026-10-03
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

## Module order and status (3 Oct)
| # | Module | Screens (HTML) | Requirements | HTML | Handoff | Blocking decisions | Backend sprint |
|---|---|---|---|---|---|---|---|
| M1 | **Platform core** — tenants, branches, branch server, registers, users & roles, catalogue | Tenants, tenant record, onboarding, branches and registers, people and roles, menu | GEN-01…03, CSH-08, USR-01…07, CAT-01…05, PRC-01, OFF-05/07 | ✓ (corrected 3 Oct) | ✓ v2 + [FLOW-07](../03-flows/FLOW-07-platform-setup.md) + [seed](../../clients/electro-cafe/seed.md) | none — ADR-001 accepted (D-35) · D-36 · D-27 revised (accountant confirms the format) | **Sprint 2 · 4–8 Oct** (epic POSD-96) — **ready** |
| M2 | **Sale** — order, payment, invoice, prep ticket, online + offline | Cashier: sale, payment, done, orders, kitchen, customer display | POS-*, PAY-01…10, FIS-01…03, KDS-*, OFF-01/02/05/07/08 | ✓ (step 2 C–D done 28 Sep) | to write | ADR-002 accepted (iPad till; till without branch server) · D-29 card · D-40 card and wallet refunds — closed on 3 Oct: D-10 · D-11 · D-14 · D-29 | Sprint 3 · 11–15 Oct |
| M3 | **Shift & money** — shift, drawer, cancel/refund, printing, sync conflicts | Cashier: close shift, invoices, To print; HQ: shifts | CSH-*, PAY-12, FIS-06/07, HW-02/03, OFF-03/06 | ✓ (printing done 28 Sep) · step 2 E–F to finish | to write | D-06 · D-23 · D-40 · printer spike — closed on 3 Oct: D-05 (cash refunds) | Sprint 4 · 18–22 Oct |
| M4 | **Back office** — prices & offers, exchange rate, reports, inventory | HQ: prices, promotions, payments, reports, inventory, till rules | PRC-*, PAY-04/05, RPT-*, STK-* | ✓ | to write | D-01 (stock by item or recipe) · D-04 — closed on 3 Oct: D-03 (tax is a head-office setting) | Sprint 5 · 25–29 Oct |
| M5 | **Quantara minimum** — onboarding, support access, operations health | Quantara panel | GEN-01, USR-05, OFF-07 | ✓ | to write | D-32 only for billing (not needed 10 Nov) | Sprint 5 (small) |

Billing, subscriptions and the support queue are built in HTML but are **not** needed for 10 Nov (Electro Café is a design partner). They wait for D-32.

## What must be done to unlock the next module
- **M1 — unlocked 3 Oct:** all five gates pass. Left: the backend developer is named, reads the handoff v2 and flags questions (POSD-104). Jira tickets match the handoff (POSD-97…100, POSD-108).
- **Unlock M2 (by 8 Oct, POSD-105):** ~~finish step 2 C–D in HTML~~ done 28 Sep; write the M2 handoff; fix the cashier logic errors (gap G-39); settle ADR-001 b and c; answer D-10, D-11, D-14, D-29 (or accept assumptions).
- **Unlock M3 (by 15 Oct):** finish step 2 E–F; M3 handoff; D-05, D-06, D-23.
- **Unlock M4 (by 22 Oct):** M4 handoff; D-01, D-03, D-04.
