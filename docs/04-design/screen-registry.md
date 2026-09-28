---
title: Screen registry
status: living
owner: Designer + PO
last_updated: 2026-09-28
---

# Screen registry

One row per screen. This table decides **which source leads** for each screen (see [figma-html-sync](figma-html-sync.md)).

**Status flow:** `todo` → `html-draft` (HTML leads) → `figma-wip` → `figma-approved` (Figma leads) → `in-dev` → `done`

**Nov-10:** `IN` must ship for go-live · `MIN` minimal version · `LATER` after go-live.

## Cashier app — SCR-POS
| ID | Screen | Flow | Key reqs | HTML | Figma | Jira | Status | Nov-10 |
|---|---|---|---|---|---|---|---|---|
| SCR-POS-01 | Login / switch user | — | USR-03 | — | — | POSD-91 | todo | IN |
| SCR-POS-02 | Sale — item grid & basket | FLOW-01 | CAT-05, POS-03, POS-04, POS-09 | Day 2 first pass | — | POSD-90, POSD-91 | html-draft | IN |
| SCR-POS-03 | Item options (size, sugar) | FLOW-01 | POS-04 | — | — | POSD-91 | todo | IN |
| SCR-POS-04 | Payment (mixed, SYP/USD, wallets) | FLOW-01 | PAY-01→10 | — | — | POSD-91 | todo | IN |
| SCR-POS-05 | Held orders | FLOW-01 | POS-06 | — | — | POSD-91 | todo | IN |
| SCR-POS-06 | Invoice list, cancel & refund | FLOW-03 | POS-10, PAY-12 | — | — | POSD-91 | todo | IN |
| SCR-POS-07 | Shift open | FLOW-04 | CSH-01 | — | — | POSD-91 | todo | IN |
| SCR-POS-08 | Shift close & cash count | FLOW-04 | CSH-02→04, CSH-07 | — | — | POSD-91 | todo | IN |
| SCR-POS-09 | Offline / sync status (component) | FLOW-05 | OFF-07 | — | — | POSD-91 | todo | IN |
| SCR-POS-10 | Customer display | FLOW-01 | HW-* | — | — | — | todo | MIN |
| SCR-POS-11 | Prep ticket & receipt (print layouts) | FLOW-01 | POS-02, FIS-01 | — | — | — | todo | IN |

## Tenant back office — SCR-HQ
| ID | Screen | Flow | Key reqs | HTML | Figma | Jira | Status | Nov-10 |
|---|---|---|---|---|---|---|---|---|
| SCR-HQ-01 | HQ dashboard | — | RPT-* | pages-hq.js | — | POSD-85 | html-draft | MIN |
| SCR-HQ-02 | Branch dashboard | — | RPT-* | pages-hq.js | — | POSD-85 | html-draft | MIN |
| SCR-HQ-03 | Catalogue (items, options, combos) | FLOW-06 | CAT-01, CAT-07 | TBD | — | — | todo | IN |
| SCR-HQ-04 | Prices & promotions | FLOW-06 | PRC-02→08 | TBD | — | — | todo | IN |
| SCR-HQ-05 | Exchange rate | FLOW-06 | PAY-04 | TBD | — | — | todo | IN |
| SCR-HQ-06 | Users, roles & permissions | — | USR-01, USR-02 | TBD | — | — | todo | IN |
| SCR-HQ-07 | Stock, purchasing, waste | FLOW-06 | STK-* | TBD | — | — | todo | per D-01 |
| SCR-HQ-08 | Reports (sales, shifts, cancels) | — | RPT-* | TBD | — | — | todo | MIN |
| SCR-HQ-09 | Settings (branch, sale, tax, drawer, invoice) | — | spec v1 §٥ | TBD | — | — | todo | IN |

## Operator control panel — SCR-OPS
The 13 HTML screens (list / record / settings / flow page kinds) from POSD-83 → Figma in POSD-95. **PO: list them here with their file in `prototype/`.**

| ID | Screen | Page kind | HTML | Figma | Jira | Status | Nov-10 |
|---|---|---|---|---|---|---|---|
| SCR-OPS-01 | Shell (nav, header, language switch) | — | shell.js | in progress | POSD-95 | figma-wip | IN |
| SCR-OPS-02 | Tenants list | list | pages.js | — | POSD-93 | html-draft | IN |
| SCR-OPS-03 | Tenant record | record | pages.js | — | POSD-93 | html-draft | IN |
| SCR-OPS-.. | _(add remaining screens)_ | | | | | | |
