---
title: Requirements — master list
status: draft
owner: PO
last_updated: 2026-09-28
source: source/POS_Requirements_EN_v1.xlsx (converted 2026-09-28)
---

# Requirements — master list

> **This file is now the source of truth.** The xlsx in `source/` is frozen v1. Edit here, never there.

- **Classification:** Standard = every client · Configurable = value set per tenant (never hard-coded) · Electro-specific = review: generalise or reject
- **Priority:** Must = no launch without it · Should = plan to add · Could = if time allows
- **Phase:** Launch / Phase 2 · **Nov-10** = scope for go-live: `IN` full · `MIN` minimal version · `LATER` after go-live · `TBD` waits for a decision. **Status: proposed 28 Sep — confirm in the scope-cut session (D-21). Rationale: [scope-nov10.md](scope-nov10.md)**
- Client values live in [`clients/electro-cafe/config.md`](../../clients/electro-cafe/config.md), not here.


## General & Platform

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| GEN-01 | Multi-tenant system | Each client's data is fully isolated from every other client's, and more than one client can run on the same instance | Standard | Must | Launch | IN | An irreversible decision: deferring it prevents selling to other clients later |
| GEN-02 | Support for multiple branches under a single client | Adding a new branch is an administrative action requiring no code change | Standard | Must | Launch | IN |  |
| GEN-03 | Bilingual interface with switching | Arabic and English, switched from inside the interface without restarting | Standard | Must | Launch | IN |  |
| GEN-05 | Measurable ease of use | A typical sale completed in three taps maximum, and a new employee trained within thirty minutes | Standard | Must | Launch | IN | The client named difficulty of use as an explicit failure criterion |

## Sales

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| POS-01 | Order-at-counter sale, pay first | The order is paid for before preparation | Standard | Must | Launch | IN |  |
| POS-01-01 | Order-at-counter sale, pay later | The order is paid for after preparation | Standard | Must | Launch | LATER |  |
| POS-02 | Daily random order number | Four digits | Standard | Must | Launch | IN | Duplicate ID in the source: two separate requirements both numbered POS-02 |
| POS-02 | Sequential invoice number | JV:20260800001 — not shown when printing; hidden from the customer | Standard | Must | Launch | IN | Duplicate ID in the source (see row above) |
| POS-03 | Edit the order cart before payment | Add, remove and change quantity | Standard | Must | Launch | IN |  |
| POS-04 | Select item options at the point of sale | Size and sugar level, with size affecting the price | Standard | Must | Launch | IN |  |
| POS-05 | Split the bill between more than one customer | Split by amount or by item | Configurable | Should | Launch | LATER |  |
| POS-06 | Park an order and resume it | To serve another customer without cancelling the first order | Standard | Should | Launch | IN |  |
| POS-07 | Flag the order: dine-in or takeaway | Appears on the preparation screen and in the reports | Configurable | Should | Launch | IN | Source wrote “bee order” next to takeaway — assumed to mean takeaway; to confirm |
| POS-08 | Table service and opening a tab on a table | Pay-after-consumption model | Configurable | Could | Phase 2 | LATER | The branch is described as “mixed” but the number of tables is undefined — needs a decision |
| POS-09 | Find an item by name or barcode |  | Standard | Must | Launch | IN |  |
| POS-10 | Void an invoice after payment, with a mandatory reason | The operation is permission-restricted and logged; two methods together — via QR and via a free-form random return | Standard | Must | Launch | IN |  |

## Items & Menu

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| CAT-01 | Central catalogue reflected across all branches or selected branches, presenting only specific items per client | Editing is done by central administration only | Standard | Must | Launch | IN |  |
| CAT-02 | Item name in two languages | On screen and on the invoice | Standard | Must | Launch | IN |  |
| CAT-03 | Categorise items into categories (more than one level) |  | Standard | Must | Launch | MIN |  |
| CAT-04 | Item options/attributes with or without a price effect | Size changes the price; sugar level does not | Configurable | Must | Launch | IN |  |
| CAT-05 | Item images on the cashier screen (multiple images per variant) | Serves the ease-of-use requirement for a low-experience employee | Standard | Should | Launch | IN |  |
| CAT-06 | Temporarily suspend an item at branch level | When an ingredient runs out | Standard | Must | Launch | IN |  |
| CAT-07 | Ability to import the catalogue via Excel |  |  |  |  | LATER | Classification, priority and phase are blank in the source — to be filled in |

## Pricing & Promotions

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| PRC-01 | One price across all branches, with a structure that allows a price per branch | The current value is uniform; the structure supports variation in future | Configurable | Must | Launch | IN |  |
| PRC-02 | Price changes restricted to central administration |  | Configurable | Must | Launch | IN |  |
| PRC-03 | Historical log of price changes | Who changed it, when, and the previous value | Standard | Should | Launch | LATER |  |
| PRC-04 | Combo offers — centrally only | A group of items at a single price | Standard | Must | Launch | IN |  |
| PRC-05 | Offer of the day — centrally only | A discount on an item or a category within a time window | Standard | Must | Launch | IN |  |
| PRC-06 | Discount for a defined customer segment — centrally only | Mall-staff discount at a configurable percentage, tied to proof of identity | Configurable | Must | Launch | TBD |  |
| PRC-07 | Points-based loyalty programme — centrally only | Accumulating and redeeming points | Standard | Should | Phase 2 | LATER | Adds considerable workload; deferral from launch is proposed |
| PRC-08 | Manual discount and its limits, configured centrally only | Who holds the permission, and the discount ceiling | Configurable | Must | Launch | IN | The client left the discount-permission field blank |
| PRC-09 | Displayed prices are tax-inclusive | Tax is extracted for reporting, not added at payment | Configurable | Must | Launch | IN |  |
| PRC-10 | The branch can set a custom price (discount) on a specific item in the cart, with a time window |  | Configurable | Must | Launch | LATER |  |
| PRC-11 | (Empty row in the source — requirement text missing) |  | Configurable | Must | Launch | TBD | Placeholder row carried over from the source; text needed or the row should be deleted |

## Payment & Currencies

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| PAY-01 | Multiple payment methods, enableable per branch |  | Standard | Must | Launch | IN | An explicit goal the client listed among his top three items |
| PAY-02 | Cash in Syrian pounds |  | Configurable | Must | Launch | IN |  |
| PAY-03 | Cash in US dollars as a second currency | Automatic conversion and display of the amount in both currencies | Configurable | Must | Launch | IN |  |
| PAY-04 | Central daily exchange rate | Entered centrally, applies to all branches, and is fixed onto the invoice at the time of sale | Configurable | Must | Launch | IN |  |
| PAY-05 | Exchange-difference report |  | Standard | Should | Launch | LATER |  |
| PAY-06 | Card payment via the payment terminal | Linking the terminal to the system to avoid entering the amount manually twice | Standard | Must | Launch | TBD | The technical integration method is settled in the design document |
| PAY-07 | Syriatel Cash |  | Configurable | Must | Launch | MIN | Requires a formal integration agreement; no unofficial intermediary is used |
| PAY-08 | Sham Cash |  | Configurable | Must | Launch | MIN | Same condition |
| PAY-09 | Mixed payment on a single invoice | More than one payment method for the same invoice | Configurable | Should | Launch | IN | With two currencies and five methods, it is most likely needed in practice |
| PAY-10 | Rounding rule for the final amount |  | Configurable | Must | Launch | IN | Cash-drawer accounts cannot be closed accurately before this is settled |
| PAY-11 | Tips and deferred/credit sales disabled | The structure exists but both features are switched off | Configurable | Could | Phase 2 | LATER |  |
| PAY-12 | Cash refund to the customer with a mandatory reason | Logged under the employee's name | Standard | Must | Launch | IN | See the open decision on the permissions conflict |

## Cash Drawer & Shifts

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| CSH-01 | Open a shift with an opening float | Per currency separately | Configurable | Must | Launch | IN |  |
| CSH-02 | Close a shift with a physical cash count | Entering the actual amount for each currency | Standard | Must | Launch | IN |  |
| CSH-03 | Calculate the variance between expected and actual | Displayed and recorded | Standard | Must | Launch | IN |  |
| CSH-04 | Variance-handling procedure | Permitted threshold, approving authority, and the consequence of exceeding it | Configurable | Must | Launch | IN | The client stated the procedure needs further study |
| CSH-05 | Prevent cash withdrawals during the day |  | Configurable | Must | Launch | IN |  |
| CSH-06 | Open the cash drawer without a sale | Permission-restricted and logged with the reason | Standard | Must | Launch | IN |  |
| CSH-07 | Shift report at close | Displayed and printable | Standard | Must | Launch | IN |  |
| CSH-08 | Number of POS terminals in the branch | Running more than one cashier against the same stock and the same orders | Configurable | Must | Launch | IN |  |

## Kitchen Display (KDS)

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| KDS-01 | Order display screen in the preparation area | Replaces paper and calling out orders verbally | Standard | Must | Launch | LATER |  |
| KDS-02 | The order arrives as soon as payment is confirmed |  | Standard | Must | Launch | MIN |  |
| KDS-03 | Order states: new, in preparation, ready |  | Standard | Must | Launch | MIN |  |
| KDS-04 | Route items to different preparation stations | Coffee, kitchen, juices | Configurable | Should | Launch | TBD |  |
| KDS-05 | Order waiting-time indicator |  | Standard | Should | Launch | LATER |  |
| KDS-06 | Announce the number of the ready order |  | Standard | Should | Launch | MIN |  |

## Users & Permissions

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| USR-01 | Predefined roles | Cashier, barista, branch manager, accountant, owner | Configurable | Must | Launch | IN | There is no waiter role and no mall-administration role at launch |
| USR-02 | Editable permissions matrix | Every sensitive operation is tied to a role | Standard | Must | Launch | MIN |  |
| USR-03 | Employee login by card | An alternative to a password, to speed up work | Configurable | Must | Launch | MIN |  |
| USR-04 | Record the employee's name on every sensitive operation | Voids, discounts, refunds and drawer openings | Standard | Must | Launch | IN |  |
| USR-05 | Tamper-proof audit log | No entry can be deleted or modified after it is created | Standard | Must | Launch | IN | The basis of any later trust in the sales figures in front of a third party |
| USR-06 | Assign an employee to more than one branch |  | Configurable | Should | Launch | LATER |  |
| USR-07 | Employee consumption and hospitality | Recorded at zero price within a daily limit | Configurable | Should | Launch | LATER | Left unconfigured, it becomes a hole in the stock reports |

## Invoicing & Compliance

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| FIS-01 | Record every sale regardless of printing | Printing on request only, but the accounting entry is always created | Standard | Must | Launch | IN | A fundamental distinction: not printing does not mean not issuing an invoice |
| FIS-02 | Invoice content | Name and logo, tax ID, address and phone, sequential number, date and time, cashier name, order number | Configurable | Must | Launch | IN |  |
| FIS-03 | Gapless sequential numbering per branch | A gap in the sequence is an indicator of tampering | Standard | Must | Launch | IN |  |
| FIS-04 | Configurable tax rate at the individual product level | At item and category level | Configurable | Must | Launch | TBD |  |
| FIS-05 | Readiness for e-invoicing | Every invoice stored in a transmittable structure, with a sequence and signature that prevent retroactive modification | Standard | Must | Launch | MIN | The client requested this readiness explicitly |
| FIS-06 | Invoice issued to an organisation or company | The organisation's details and tax ID | Configurable | Should | Launch | TBD |  |
| FIS-07 | Reprint a previous invoice | Marked as a copy | Standard | Should | Launch | IN |  |
| FIS-08 | Archive and retrieve invoices | By number, date or amount | Standard | Must | Launch | IN |  |

## Inventory

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| STK-01 | Stock tracking from first launch |  | Standard | Must | Launch | MIN | An explicit goal the client listed among his top three items |
| STK-02 | Define the stock-deduction level | By finished item, or by ingredients according to a recipe per item | Configurable | Must | Launch | TBD | The single largest driver of workload, cost and schedule in the whole document |
| STK-03 | Deduct stock automatically at the point of sale |  | Standard | Must | Launch | IN |  |
| STK-04 | Record goods received from central |  | Standard | Must | Launch | MIN | Source contains a typo in “central”; meaning is central administration |
| STK-05 | Record spoilage and waste with a reason |  | Standard | Must | Launch | MIN | The client stated the matter needs further study |
| STK-06 | Periodic stocktake and variance reconciliation |  | Standard | Must | Launch | LATER |  |
| STK-07 | Alert on reaching the reorder threshold, at central level |  | Standard | Should | Launch | LATER |  |
| STK-08 | Central warehouse, inter-branch transfers and minimum-level alerts |  | Configurable | Could | Phase 2 | LATER |  |
| STK-09 | Purchasing from suppliers, centrally (within procurement) |  | Configurable | Should | Launch | LATER |  |
| STK-10 | Item cost and profit margin |  | Standard | Should | Phase 2 | LATER | Depends on decision STK-02 |

## Reports

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| RPT-01 | Today's sales in total |  | Standard | Must | Launch | IN |  |
| RPT-02 | Sales by item and best sellers |  | Standard | Must | Launch | IN |  |
| RPT-03 | Sales by shift and by employee |  | Standard | Must | Launch | IN |  |
| RPT-04 | Cash movement and cash-drawer variances |  | Standard | Must | Launch | IN |  |
| RPT-05 | Discounts and voids with the name of the person who performed them |  | Standard | Must | Launch | IN |  |
| RPT-06 | Comparison between branches |  | Standard | Must | Launch | LATER |  |
| RPT-07 | Sales by hour of day |  | Standard | Must | Launch | LATER |  |
| RPT-08 | View reports inside the system | For the owner and the accountant | Configurable | Must | Launch | IN |  |
| RPT-09 | Export reports to Excel |  | Standard | Should | Launch | LATER |  |

## Offline Operation

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| OFF-01 | Sell and print the invoice offline | With no dependency on the network | Standard | Must | Launch | IN | Internet at the site is intermittent |
| OFF-02 | Send the order to preparation offline | Over the local network | Standard | Must | Launch | IN |  |
| OFF-03 | Close the shift and count the cash drawer offline |  | Standard | Must | Launch | IN |  |
| OFF-04 | Branch reports available offline |  | Standard | Must | Launch | MIN | The client asked that reporting continue as well |
| OFF-05 | Automatic sync when the connection returns | Without any action from the employee | Standard | Must | Launch | IN |  |
| OFF-06 | Sync conflict-resolution rules | When the same data is modified from two sources | Standard | Must | Launch | IN |  |
| OFF-07 | Connection status and last-sync indicator | Visible to the employee | Standard | Must | Launch | IN |  |
| OFF-08 | Safe resume after a power cut | Without losing the order in progress | Standard | Must | Launch | IN |  |
| OFF-09 | Local data retention period | Sufficient for the longest expected outage | Configurable | Must | Launch | IN | The number of power-cut hours is undefined |

## Hardware

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| HW-01 | Runs on tablet, desktop computer and touch screen | The same interface adapts to the size | Standard | Must | Launch | MIN |  |
| HW-02 | Thermal receipt printer |  | Standard | Must | Launch | IN |  |
| HW-03 | Cash drawer opened from the system |  | Standard | Must | Launch | IN |  |
| HW-04 | Barcode reader |  | Standard | Must | Launch | IN |  |
| HW-05 | Customer-facing display | Shows the items and the amount | Standard | Should | Launch | LATER |  |
| HW-06 | Support for the card payment terminal |  | Standard | Must | Launch | TBD |  |
| HW-07 | Approved hardware list | The client buys the hardware himself from a list we approve | Standard | Must | Launch | IN | Avoids supporting untested hardware |

## Nice to Have

| ID | Requirement | Detail & acceptance criteria | Class | Priority | Phase | Nov-10 | Notes |
|---|---|---|---|---|---|---|---|
| NH-07 | Central administration can watch every POS terminal live and trace everything happening on it (screen mirroring) | Live view and activity tracing per terminal | Standard | Must | Launch | LATER | In the source, the detail and notes cells were copied from HW-07 and do not match this requirement — corrected here; please confirm |
