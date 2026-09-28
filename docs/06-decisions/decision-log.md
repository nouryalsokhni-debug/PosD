---
title: Decision log
status: living
owner: PO
last_updated: 2026-09-28
mirror: Google Doc 'Quantara POS — Open Decisions' (humans edit there; PO syncs here)
---

# Decision log

- One row per decision. **Status:** `open` → `proposed` → `decided` (never delete a row).
- **Ref** = requirement IDs · questionnaire question numbers (Q).
- *Proposed* = an answer already written in client spec v1 that the client has **not** confirmed yet.
- When a decision is made: fill Answer + Date, set `decided`, update the affected requirements / config, add a line to `docs/08-delivery/changelog.md`.
- D-23 and D-24 were added on 28 Sep from the Electro Café config sheet. D-25 → D-30 are product decisions taken from the design research (Jira POSD).

## A. Needed by Thu 1 Oct — blocks design & dev start

| ID | Question | Why it matters | Ref | Owner | Status | Answer | Date |
|---|---|---|---|---|---|---|---|
| D-21 | Name 3 things that must work on opening day, and 3 that can wait. | This is how we fit the scope into 10 Nov. | Whole scope · Q78, Q79 | Owner | open |  | |
| D-22 | Who owns the product's IP? Put it in writing. | Decides if Quantara can be sold to other clients. | GEN-01 | Both parties | open |  | |
| D-01 | Track stock by finished item, or by recipe ingredients? | Recipes = the biggest cost & time item in the project. | STK-02, STK-10 · Q57 | Owner + Admin | open |  | |
| D-24 | Central warehouse & transfers: at launch or later? | xlsx says out of scope; spec v1 says Phase 1 (STK-08). Must pick one. | STK-08 · Q58 | Admin | open |  | |
| D-20 | Who is the client's technical contact? | Needed for setup, testing and the 1-hour support promise. | OPS-01 · Q75 | Owner | open |  | |
| D-08 | How many branches in 2 years, and which are outside the mall? | Shapes HQ panel, sync and rollout. | GEN-02 · Q2, Q3 | Owner | open |  | |
| D-09 | How many tables? Any table tabs at launch? | Table service is a full module. | POS-08 · Q6, Q7 | Owner | proposed | Spec v1: table service = Phase 2; launch is counter + takeaway only. | |
| D-14 | How many preparation stations, and which items go where? | Decides item routing vs one kitchen screen. | KDS-04 | Admin | open |  | |
| D-15 | Can one employee work in more than one branch? | Affects login, permissions and staff reports. | USR-06 · Q41 | Admin | proposed | Spec v1: yes, an employee can be linked to more than one branch. | |

## B. Needed by Thu 8 Oct — before checkout, invoice & cash are built

| ID | Question | Why it matters | Ref | Owner | Status | Answer | Date |
|---|---|---|---|---|---|---|---|
| D-03 | Is sales tax applied? What rate? Different per item? | Affects invoice, reports, e-invoicing. | PRC-09, FIS-04, FIS-05 · Q52 | Accountant | open |  | |
| D-18 | Will customers ask for invoices in a company name? | Adds company fields to the sale. | FIS-06 · Q55 | Accountant | open |  | |
| D-04 | Who can give a discount, and what is the maximum? | An open discount is the biggest cash leak in a POS. | PRC-08 · Q38 | Owner | proposed | Spec v1: branch manager, within a ceiling set centrally. Ceiling value still open. | |
| D-05 | Cashier can refund cash and close shift but can't open the drawer — who does what? | Current split lets a cashier take cash and close alone. | PAY-12, CSH-02, CSH-06 | Owner | proposed | Spec v1: sale/refund open the drawer inside the logged operation; free drawer-open = branch manager + reason; cashier closes shift, branch manager counts cash. | |
| D-10 | Can one bill be paid with mixed methods / currencies? | 2 currencies + 5 methods: will happen on day one. | PAY-09 · Q26 | Owner | proposed | Spec v1 sale flow: yes, one or more methods (mixed payment). | |
| D-11 | How is the final amount rounded? | Without it, the drawer never balances. | PAY-10, CSH-03 · Q29 | Accountant | open |  | |
| D-23 | What is the opening float amount per shift (per currency)? | Needed for shift open/close. | CSH-01 · Q33 | Owner | open |  | |
| D-06 | Cash variance: allowed limit, who approves, what happens above it? | Prevents daily cashier–manager disputes. | CSH-03, CSH-04 · Q35 | Owner + Accountant | open |  | |
| D-13 | How many POS terminals and shifts per branch? | Affects licensing, pricing and shift close. | CSH-01, CSH-08 · Q31, Q32 | Owner | open |  | |
| D-02 | Mall's share of sales: %, basis (before/after tax & discounts), frequency, what mall sees. | Changes the calculation logic; can't be guessed. | MAL-01 → MAL-04 · Q43–Q49 | Owner + Mall mgmt | open |  | |
| D-12 | Expected power-cut hours per day? | Sizes UPS and offline storage; hardware must be ordered early. | OFF-09 · Q68, Q69 | Admin | open |  | |

## C. Needed by Thu 22 Oct — before testing & training

| ID | Question | Why it matters | Ref | Owner | Status | Answer | Date |
|---|---|---|---|---|---|---|---|
| D-07 | Waste/spoilage: who records it, when, which reasons? | Otherwise stock never reconciles. | STK-05 · Q60 | Admin | open |  | |
| D-16 | Policy for staff meals and free items? | Otherwise a permanent gap in stock & sales. | USR-07 · Q42 | Owner | proposed | Spec v1: zero-price within a daily limit. Limit value still open. | |
| D-17 | Mall-staff discount %, and how staff prove eligibility? | Needed to configure the discount. | PRC-06 · Q17 | Owner + Mall mgmt | open |  | |
| D-19 | Opening hours, closing days, staff per branch? | Sets support window, shifts and training plan. | OPS-01, OPS-02 · Q11, Q71 | Admin | open |  | |

## P. Product decisions (PO) — from design research

| ID | Question | Why it matters | Ref | Owner | Status | Answer | Date |
|---|---|---|---|---|---|---|---|
| D-25 | Who owns what across Quantara / tenant HQ / branch? | Every screen and permission depends on it | POSD-85 · [ownership boundaries](../01-product/ownership-boundaries.md) | PO | decided | Boundary table in ownership-boundaries.md | 2026-09-24 |
| D-26 | Sync conflict rule | Offline registers vs HQ edits | OFF-05, OFF-06 · POSD-85 | PO | decided | Owner of the value wins, other side notified; branch overrides are separate records; sales/refunds/shift closes never conflict | 2026-09-24 |
| D-27 | Invoice numbering scheme | Must stay gapless while registers sell offline | FIS-01 · POSD-85 | PO + Accountant | proposed | Gapless per register, `<TENANT>-<BRANCH>-R<n>` — awaiting accountant | |
| D-28 | Live screen mirroring (NH-07) at launch? | Scope | NH-07 · POSD-85 | PO | decided | Dropped; HQ gets live order/activity feed per register | 2026-09-24 |
| D-29 | Cashier payment details: change in USD or mixed? delivery mode? card payment when? | Payment & change screens | PAY-* · POSD-90 · R-02 | PO | open | | |
| D-30 | SaaS packaging: plan changes self-service or via us? inventory behind a paid tier? POS mode per device? | Operator panel, pricing, modules | POSD-89 · R-03 | PO | open | | |
| D-31 | 17 open UX questions from the panel walkthrough (layers, catalogue & prices, branches & plan, support access, suspension) | They decide behaviour on 9 panel screens | POSD-92 · [prototype README → Open questions](../../prototype/README.md) | PO | open | Each question lists what the prototype does for now | |
| D-34 | When does Sprint 1 end? | Sets when the backend may start | [sprint-01](../08-delivery/sprint-01.md) · Jira sprint 655 | PO | decided | Sprint 1 closes Thu 1 Oct (not Fri 2 Oct) when the backend start pack is ready (Module 1 handoff, HTML, stack accepted, Sprint 2 planned). Design need not be finished; it continues in Sprint 2 | 2026-09-28 |
| D-33 | How the backend runs next to design | Order of work for 10 Nov | [module-readiness](../08-delivery/module-readiness.md) · [sprint-02](../08-delivery/sprint-02.md) | PO | decided | One module at a time behind a 5-point readiness gate; M1 Platform core first (Sprint 2, 4–8 Oct); 1-week sprints; backend tickets in POSD with label `backend`; 1 backend developer | 2026-09-28 |
| D-32 | How Quantara charges tenants: plans, add-ons, billing | Pricing, billing screen, suspension rules | [R-05](../07-research/R-05-subscription-models.md) · D-30 | PO + management | proposed | Per-branch plans (Starter · Growth · Chain) with registers included · modules as add-ons · USD, monthly or yearly, 30-day trial, no lock-in, till never stops | |

## Decided

_None yet._
