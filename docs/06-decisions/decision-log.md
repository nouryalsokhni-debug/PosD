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
- D-23 and D-24 were added on 28 Sep from the Electro Café config sheet.

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

## Decided

_None yet._
