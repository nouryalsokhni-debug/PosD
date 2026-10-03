---
title: Screen registry
status: living
owner: Designer + PO
last_updated: 2026-10-03
---

# Screen registry

One row per screen. This table decides **which source leads** for each screen (see [figma-html-sync](figma-html-sync.md)). Figma file, page IDs and frame IDs: [figma-map](figma-map.md).

**Status flow:** `todo` → `html-draft` (HTML leads) → `figma-wip` → `figma-approved` (Figma leads) → `in-dev` → `done`

**Nov-10:** `IN` must ship for go-live · `MIN` minimal version · `LATER` after go-live.

## Cashier app — SCR-POS
All in `prototype/pos.html` (28 Sep). Flows FLOW-01 → FLOW-05 clickable end-to-end. Coverage of all 111 requirements: `prototype/requirements.html`.

| ID | Screen | Flow | Key reqs | HTML | Figma | Jira | Status | Nov-10 |
|---|---|---|---|---|---|---|---|---|
| SCR-POS-01 | Login / switch user (PIN) | — | USR-03 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-02 | Sale — favourites grid, categories, search/barcode, basket | FLOW-01 | CAT-05, POS-03, POS-04, POS-09 | pos.html | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=124-2) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=124-680) (1440 — till sizes due Day 12) | POSD-90, POSD-91 | figma-wip | IN |
| SCR-POS-03 | Item options (size, sugar, note) | FLOW-01 | POS-04 | pos.html | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=124-326) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=124-1004) | POSD-91 | figma-wip | IN |
| SCR-POS-04 | Payment (mixed tenders, SYP/USD pinned rate, wallets with ref) | FLOW-01 | PAY-01→10 | pos.html | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=126-932) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=126-1280) · Paid [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=126-1169) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=126-1517) | POSD-91 | figma-wip | IN |
| SCR-POS-05 | Held orders | FLOW-01 | POS-06 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-06 | Invoices, cancel (manager) & refund (cashier) | FLOW-03 | POS-10, PAY-12, RPT-05 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-07 | Shift open (float per currency) | FLOW-04 | CSH-01 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-08 | Shift close — cash count, variance, report | FLOW-04 | CSH-02→07 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-09 | Offline / sync status + banner | FLOW-05 | OFF-01→09 | pos.html | — | POSD-91 | html-draft | IN |
| SCR-POS-10 | Customer display | FLOW-01 | HW-* | — | — | — | todo | MIN |
| SCR-POS-11 | Receipt & prep ticket (print layouts) | FLOW-01 | POS-02, FIS-01 | pos.html | — | — | html-draft | IN |
| SCR-POS-12 | Orders board — preparing / ready / handed over (+ unpaid) | FLOW-01, FLOW-02 | POS-02, POS-07 | pos.html | — | — | html-draft | IN |
| SCR-POS-13 | Manager approval (discount, cancel, drawer, close) | FLOW-01/03/04 | USR-02, USR-04 | pos.html | — | — | html-draft | IN |
| SCR-POS-14 | Audit log | FLOW-03 | USR-04, USR-05 | pos.html | — | — | html-draft | MIN |
| SCR-POS-15 | Kitchen view — by station, waiting time, start / ready | FLOW-01 | KDS-01…06 | pos.html | — | — | html-draft | LATER (MIN = printed ticket) |
| SCR-POS-16 | Customer display (second window) | FLOW-01 | HW-05, KDS-06 | pos.html#display | — | — | html-draft | LATER |
| SCR-POS-17 | Split bill by items | FLOW-01 | POS-05 | pos.html | — | — | html-draft | LATER |
| SCR-POS-18 | Staff meal (manager, daily limit) | — | USR-07 | pos.html | — | — | html-draft | LATER |
| SCR-POS-19 | Invoice to a company · reprint | FLOW-01, FLOW-03 | FIS-06, FIS-07 | pos.html | — | — | html-draft | TBD / IN |

## Tenant back office — HQ & Branch (POSD-85 sections)
Layers & ownership: [ownership boundaries](../01-product/ownership-boundaries.md). All exist in the HTML build (`#/hq/<tenant>/…`, `#/hq/<tenant>/b/<branch>/…`); unfinished ones show "Not built yet".

| ID | Screen | Page kind | Key reqs | HTML | Figma | Status | Nov-10 |
|---|---|---|---|---|---|---|---|
| SCR-HQ-01 | Home — today's sales + live feed per register | record | RPT-* | pages-hq.js | — | html-draft | MIN |
| SCR-HQ-02 | Catalogue | list/record | CAT-01, CAT-07 | pages-hq.js | — | html-draft | IN |
| SCR-HQ-03 | Prices & offers | list | PRC-02→08 | pages-hq.js | — | html-draft | IN |
| SCR-HQ-04 | Exchange rate | settings | PAY-04 | pages-hq.js | — | html-draft | IN |
| SCR-HQ-05 | Inventory & purchasing | record | STK-01…10 | pages-ops2.js | — | html-draft | per D-01 |
| SCR-HQ-06 | Branches and registers — branch record (code, pause), branch server, registers (rename, retire), plan usage · **Figma behind the HTML since 3 Oct (Day 14)** | list | GEN-02, CSH-08, OFF-05/07, FIS-03 | pages-m1.js | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=109-206) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=109-560) · limit banner [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-528) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-549) | figma-wip | IN |
| SCR-HQ-07 | People and roles — People tab (status, back-office access, till sign-in, add / edit / disable, temporary PIN) · **Figma behind the HTML since 3 Oct (Day 14)** | list/record | USR-01…06 | pages-m1.js | People [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-570) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-915) · Add a person [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-1261) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=110-1531) | figma-wip | IN |
| SCR-HQ-08 | Reports | record | RPT-01…09, PAY-05 | pages-ops.js | — | html-draft | MIN |
| SCR-HQ-09 | Settings (spec §٥) | settings | — | pages-hq.js | — | html-draft | IN |
| SCR-HQ-10 | Subscription & modules (on/off per branch) | settings | — | pages-hq.js | — | html-draft | MIN |
| SCR-HQ-11 | Support access (approve, who's inside, end, audit log) | list | USR-05 | pages-hq.js | — | html-draft | MIN |
| SCR-BR-01 | Branch — Today | record | RPT-* | pages-hq.js | — | html-draft | IN |
| SCR-BR-02 | Branch — Items: pause / resume | list | CAT-06 | pages-hq.js | — | html-draft | IN |
| SCR-BR-03 | Branch — Discounts | list | PRC-08, PRC-10 | pages-hq.js | — | html-draft | MIN |
| SCR-BR-04 | Branch — Cash & shifts | list | CSH-* | pages-hq.js | — | html-draft | IN |
| SCR-BR-05 | Branch — Reports | record | RPT-01…09 | pages-ops.js | — | html-draft | MIN |
| SCR-BR-06 | Branch — Shift reports & cash count | list | CSH-02…07 | pages-ops.js | — | html-draft | IN |
| SCR-BR-07 | Branch — Stock (waste, count) | record | STK-01, 05, 06 | pages-ops2.js | — | html-draft | MIN |
| SCR-HQ-12 | Menu setup — items (sub-category, sold-at, image, item option prices), categories (rename, reorder, delete), option groups, Excel import · **Figma behind the HTML since 3 Oct (Day 14)** | record | CAT-01…07, POS-09 | pages-ops2.js | Items [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=112-1384) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=112-1750) · Item record [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=113-1674) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=113-1988) | figma-wip | IN (import LATER) |
| SCR-HQ-13 | Offers & price history | record | PRC-02…09 | pages-ops2.js | — | html-draft | IN |
| SCR-HQ-14 | People and roles — Permissions tab (matrix); same page as SCR-HQ-07 | matrix | USR-01…07 | pages-m1.js | Roles matrix [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=111-1166) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=111-1762) | figma-wip | MIN |
| SCR-HQ-15 | Payment methods | settings | PAY-01…11 | pages-ops2.js | — | html-draft | IN |
| SCR-HQ-16 | Till & invoice rules | settings | CSH, POS, FIS, KDS, OFF, USR | pages-ops2.js | — | html-draft | IN |
| SCR-HQ-17 | Devices & approved hardware | list | HW-01…07 | pages-ops2.js | — | html-draft | IN |

## Operator control panel — SCR-OPS
Built on one shell + four page kinds (list · record · settings · flow) — POSD-83; Figma in POSD-95. Scope *All tenants* by default; opening a tenant swaps the navigation. **13 screens, all in the HTML build (Day 11 finished the last 6 + shared screen states).** Prices on Billing/Subscription are placeholders until D-32.

| ID | Screen | Page kind | HTML | Figma | Jira | Status | Nov-10 |
|---|---|---|---|---|---|---|---|
| SCR-OPS-01 | Shell (nav, header, language switch) | — | shell.js | Quantara shell missing since 1 Oct (Day 12) · HQ shell [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-3237) · Branch shell [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-3589) | POSD-95 | figma-wip | IN |
| SCR-OPS-02 | Tenants list | list | pages.js | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-2031) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-2311) | POSD-93 | figma-wip | IN |
| SCR-OPS-03 | Tenant record | record | pages.js | [EN](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-2591) · [AR](https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=53-2914) | POSD-93 | figma-wip | IN |
| SCR-OPS-04 | Operations health — every register, every tenant | list | pages-ops2.js | — | — | html-draft | MIN |
| SCR-OPS-05 | Onboarding (new tenant) — tenant code, owner invite, branch code, first invoice number | flow | pages.js | — | POSD-93 | html-draft | IN |
| SCR-OPS-06 | Support access (ask, approve, audit) | list | pages.js | — | POSD-93 | html-draft | IN |
| SCR-OPS-07 | Billing — every invoice, record payment, reminders | list | pages-quantara.js | — | — | html-draft | MIN |
| SCR-OPS-08 | Support queue — every ticket, reply, solve, ask access | list | pages-quantara.js | — | — | html-draft | IN |
| SCR-OPS-09 | Platform settings — plans, add-on prices, approved hardware, billing rules | settings | pages-quantara.js | — | — | html-draft | MIN |
| SCR-OPS-10 | Tenant · subscription — plan, add-ons, price breakdown, invoices, lifecycle | record | pages-quantara.js | — | — | html-draft | MIN |
| SCR-OPS-11 | Tenant · people — names and roles (no PINs) | list | pages-quantara.js | — | — | html-draft | IN |
| SCR-OPS-12 | Tenant · support tickets | list | pages-quantara.js | — | — | html-draft | IN |
| SCR-OPS-13 | Screen states — empty, loading, error, offline, forbidden (`#/states`) | — | pages-quantara.js | — | POSD-95 | html-draft | IN |
