---
title: Quantara POS — Master Plan
status: living
owner: PO
version: 1.0
last_updated: 2026-09-28
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

## 3. Scope
- **Master list:** [requirements](02-requirements/requirements.md) — 111 requirements (87 Must, 105 Launch).
- **Excluded:** [out-of-scope](02-requirements/out-of-scope.md) — tables, QR ordering, reservations, loyalty, mall-% module, deferred sales.
- **10-Nov cut:** 105 "Launch" items do **not** fit 6 weeks. Each requirement gets `IN / LATER` in the *Nov-10* column during the **scope-cut session (Wed 30 Sep)**, driven by D-21.
- **Three surfaces**, in priority order:
  1. **Cashier app** (+ customer display, prep tickets) — must be complete.
  2. **Tenant back office** — essentials only (catalogue, prices, exchange rate, users, shift & sales reports).
  3. **Operator control panel** — minimum to onboard and support one tenant; rest after launch.

## 4. Timeline
Work week assumed **Sun–Thu** (confirm). Design runs one sprint ahead of development.

| Phase | Dates | Output | Gate |
|---|---|---|---|
| Design & research | 18 Sep → ongoing | Benchmarks, HTML prototypes, Figma | — |
| **Planning gate** | Mon 28 Sep – Thu 1 Oct | Scope cut, decisions group A, ADR-001, dev Jira project, repo | **G1: Ready to build** (Thu 1 Oct) |
| Sprint 1 | Sun 4 – Thu 8 Oct | Tenancy, auth & roles, catalogue, offline storage skeleton · Figma: cashier flows approved | Decisions group B closed |
| Sprint 2 | Sun 11 – Thu 15 Oct | Sale → payment → receipt & prep ticket · Figma: back office essentials | — |
| Sprint 3 | Sun 18 – Thu 22 Oct | Shift & cash drawer, cancel/refund, offline sync · hardware ordered | Decisions group C closed |
| Sprint 4 | Sun 25 – Thu 29 Oct | Back office essentials, reports, exchange rate, inventory (per D-01) | **G2: Feature complete** (Thu 29 Oct) |
| Hardening & UAT | Sun 1 – Thu 5 Nov | Bug fixing, client UAT sign-off, menu data loaded | **G3: UAT signed** (Thu 5 Nov) |
| Install & training | Sat 7 – Mon 9 Nov | Hardware on site, staff trained, dry run | **G4: Go / no-go** (Mon 9 Nov) |
| **Go-live** | **Tue 10 Nov** | Live at Electro Café, hyper-care 2 weeks | — |

## 5. Team & roles
| Role | Who | Owns |
|---|---|---|
| Product Owner | Sankari DT (PO) | Scope, priorities, decisions, this plan |
| Designer | TBD | Figma, screen registry |
| Developers | TBD (count, stack, full-time?) | Build, ADRs |
| QA | TBD | Test cases, UAT support |
| Client owner | Electro Café owner | Business decisions |
| Client technical contact | TBD (D-20) | Site, hardware, UAT |
| PO agent (Claude) | Scheduled daily | Daily report, drift & risk flags |

## 6. How we work
- **Truth lives in the repo**; Jira tracks work; Figma holds visuals; Drive holds human/client docs. See [CLAUDE.md](../CLAUDE.md).
- **Cadence:** daily report (PO agent, 09:00) · daily 15-min stand-up · weekly sprint review & planning (Thu) · weekly client check-in (decisions).
- **Gates:** Definition of Ready / Done in [po-playbook](09-operating/po-playbook.md).
- **Change control:** after G1, any scope addition needs a decision-log entry and must name what moves out.

## 7. Top risks
Full list: [risk register](08-delivery/risk-register.md).
1. Scope too large for 6 weeks → scope cut on 30 Sep, weekly re-check.
2. Open decisions block build → owners & dates in [decision log](06-decisions/decision-log.md).
3. Offline sync bugs (duplicates, conflicts, double printing) → offline-first from sprint 1, tested with real cuts.
4. Local payment integrations (Syriatel Cash, Sham Cash, cards) → spike in sprint 1; manual-record fallback.
5. Team capacity unknown → confirm this week.
6. IP ownership not in writing (D-22) → sign before G1.

## 8. Key links
- Requirements · Decision log · Screen registry · Delivery plan · Risk register · PO playbook (all in `docs/`)
- Jira POSD: https://sankari-holding.atlassian.net/browse/POSD
- Figma: TBD · Drive folder: TBD

## 9. Change history
| Version | Date | Change |
|---|---|---|
| 1.0 | 28 Sep 2026 | First version |
