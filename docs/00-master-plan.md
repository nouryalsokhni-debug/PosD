---
title: Quantara POS — Master Plan
status: living
owner: PO
version: 1.4
last_updated: 2026-10-03
mirror: Google Doc "Quantara POS — Master Plan" (humans edit there; PO syncs each approved version here)
---

# Quantara POS — Master Plan

## 1. Goal
- Launch **Quantara**, a multi-tenant POS SaaS for restaurants & cafés, live at **Electro Café** on **Tue 10 Nov 2026**.
- Build it as a **product**, not a client project: Electro Café is tenant #1; everything client-specific is a setting.

## 2. Success on 10 Nov
- Cashiers at Electro Café sell, take payment (SYP / USD, cash, card, wallets), print prep tickets and close shifts — **with or without internet**.
- HQ manages menu, prices, exchange rate and sees daily sales per branch.
- A new cashier is productive after **30 minutes** of training (GEN-05).
- Zero lost orders during power/internet cuts (OFF-01, OFF-08).
- A second tenant could be onboarded without code changes (GEN-01, GEN-02).

## 2b. How it is built (ADR-001)
Three tiers: **till** (Electron + React) → **branch server** (a mini-PC in each branch: stock, orders, shifts, invoice numbers, printing) → **Quantara cloud** (menu, prices, people, reports). The branch sells with no internet; it syncs when the line is back.

## 3. Scope
- **Master list:** [requirements](02-requirements/requirements.md) — 111 requirements (87 Must, 105 Launch).
- **Excluded:** [out-of-scope](02-requirements/out-of-scope.md) — tables, QR ordering, reservations, loyalty, mall-% module, deferred sales.
- **10-Nov cut:** 105 "Launch" items do **not** fit 6 weeks. A proposal is in the *Nov-10* column (66 IN · 14 MIN · 23 LATER · 8 TBD) — see [scope-nov10](02-requirements/scope-nov10.md). Confirmed in the **scope-cut session (Wed 30 Sep)**, driven by D-21.
- **Three surfaces**, in priority order:
  1. **Cashier app** (+ customer display, prep tickets) — must be complete.
  2. **Tenant back office** — essentials only (catalogue, prices, exchange rate, users, shift & sales reports).
  3. **Operator control panel** — minimum to onboard and support one tenant; rest after launch.

## 4. Timeline
Work week assumed **Sun–Thu** (confirm). Design runs one sprint ahead of development.

Sprints are **1 week, Sun–Thu**, named as in Jira. The backend builds **one module at a time**, starting a module only when it passes the [readiness gate](08-delivery/module-readiness.md) (HTML complete, flows, handoff doc, decisions, stack). Figma gates the front end, not the backend.

| Phase | Dates | Backend module | Design · PO / HTML | Gate |
|---|---|---|---|---|
| Sprint 1 — Design first | Sun 20 Sep – open (PO closes it) | — | Research, HTML prototype (all 111 requirements), core design in Figma — closes when the backend has a good start ([close checklist](08-delivery/sprint-01.md)); the rest of the design continues in Sprint 2 | Backend start pack ready |
| **Planning gate** | Mon 28 Sep – Sat 3 Oct | — | ADR-001 stack **accepted 3 Oct** · Module 1 handoff v2 · still open: scope cut, decisions group A | **G1: Ready to build** — met for Module 1 on 3 Oct |
| Sprint 2 — Platform core | Sun 4 – Thu 8 Oct | **M1** tenants, branches, branch server, registers, people & roles, catalogue, sync skeleton ([plan](08-delivery/sprint-02.md)) | Figma: platform core + cashier sale & payment · HTML: offline & power cut · M2 handoff | Decisions group B closed |
| Sprint 3 | Sun 11 – Thu 15 Oct | **M2** Sale → payment → invoice → prep ticket, online + offline | Figma: shift close, invoices, kitchen · HTML: mixed payment, shift close | — |
| Sprint 4 | Sun 18 – Thu 22 Oct | **M3** Shift & cash drawer, cancel/refund, printing, sync conflicts · hardware ordered | Figma: back office essentials | Decisions group C closed |
| Sprint 5 | Sun 25 – Thu 29 Oct | **M4** Back office: prices & offers, exchange rate, reports, inventory (per D-01) · **M5** Quantara minimum | States, polish · UAT script | **G2: Feature complete** (Thu 29 Oct) |
| Hardening & UAT | Sun 1 – Thu 5 Nov | Bug fixing, performance | Client UAT sign-off, menu data loaded | **G3: UAT signed** (Thu 5 Nov) |
| Install & training | Sat 7 – Mon 9 Nov | Hardware on site, dry run | Staff trained | **G4: Go / no-go** (Mon 9 Nov) |
| **Go-live** | **Tue 10 Nov** | Live at Electro Café, hyper-care 2 weeks | | — |

## 5. Team & roles
| Role | Who | Owns |
|---|---|---|
| Product Owner | Sankari DT (PO) | Scope, priorities, decisions, this plan |
| Designer | Mariam Kabbani | Figma, screen registry |
| Tech lead | wrote the recommended stack (name to record) | ADR-001, hosting, sync design |
| Developers | 1 backend developer (name to confirm); front end TBD | Build, module handoffs |
| QA | TBD | Test cases, UAT support |
| Client owner | Electro Café owner | Business decisions |
| Client technical contact | TBD (D-20) | Site, hardware, UAT |
| PO agent (Claude) | Scheduled daily | Daily report, drift & risk flags |

## 6. How we work
- **Truth lives in the repo**; Jira tracks work; Figma holds visuals; Drive holds human/client docs. See [CLAUDE.md](../CLAUDE.md).
- **Cadence:** daily report (PO agent, 09:00) · daily 15-min stand-up · weekly sprint review & planning (Thu) · weekly client check-in (decisions).
- **Gates:** Definition of Ready / Done in [po-playbook](09-operating/po-playbook.md); module readiness in [module-readiness](08-delivery/module-readiness.md).
- **Jira:** everything in POSD — design, PO and backend (label `backend`, one epic per module).
- **Change control:** after G1, any scope addition needs a decision-log entry and must name what moves out.

## 7. Top risks
Full list: [risk register](08-delivery/risk-register.md).
1. Scope too large for 6 weeks → scope cut on 30 Sep, weekly re-check.
2. Open decisions block build → owners & dates in [decision log](06-decisions/decision-log.md).
3. Offline sync bugs (duplicates, conflicts, double printing) → offline behaviour settled in HTML before M2 (Sprint 3); tested with real cuts.
4. Local payment integrations (Syriatel Cash, Sham Cash, cards) → spike at the start of M2 (Sprint 3); manual-record fallback.
5. One backend developer, and the stack adds a branch-server tier → one module per sprint, strict P0/P1/P2; sync designed before Module 2.
6. IP ownership not in writing (D-22) → sign before G1.

## 8. Key links
- Requirements · Decision log · Screen registry · Delivery plan · Risk register · PO playbook (all in `docs/`)
- Jira POSD: https://sankari-holding.atlassian.net/browse/POSD
- Figma: https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product ([map](04-design/figma-map.md)) · Drive folder: TBD

## 9. Change history
| Version | Date | Change |
|---|---|---|
| 1.4 | 3 Oct 2026 | Stack accepted (ADR-001, D-35): till → branch server → cloud; Module 1 ready for the backend (handoff v2, D-36); invoice series per branch (D-27 revised) |
| 1.0 | 28 Sep 2026 | First version |
| 1.3 | 1 Oct 2026 | Sprint 1 kept open until the PO closes it (D-34 updated) |
| 1.2 | 28 Sep 2026 | Sprint 1 ends Thu 1 Oct (was Fri 2 Oct); it closes on "backend has a good start", not on finished design (D-34) |
| 1.1 | 28 Sep 2026 | Sprints renamed as in Jira (design sprint = Sprint 1); backend builds one module per sprint behind a readiness gate; team: designer named, 1 backend developer |
