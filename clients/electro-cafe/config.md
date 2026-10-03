---
title: Electro Café — client configuration
status: draft
owner: PO
last_updated: 2026-10-03
client: electro-cafe
---

# Electro Café — client configuration

Only this client's **values**. Product behaviour lives in `docs/`. Anything *Awaiting decision* has a D-number in the [decision log](../../docs/06-decisions/decision-log.md).

| Domain | Parameter | Value | Status | Source (Q) |
|---|---|---|---|---|
| Identity | Client name | Electro Café | Confirmed | — |
| Identity | Number of branches at launch | Undefined — some branches are outside the mall | Awaiting decision | Q2, Q3 |
| Identity | Target opening date | Within three months | Confirmed | Q1 |
| Service model | Sales model | Order at the counter with payment up front | Confirmed | Q8, Q9 |
| Service model | Table service | Disabled at launch | Awaiting decision | Q6, Q7 |
| Service model | Additional services | Takeaway only | Confirmed | Q10 |
| Service model | Opening hours | Undefined | Awaiting decision | Q11 |
| Menu | Number of items | 20 to 50 | Confirmed | Q13 |
| Menu | Sections | To eat (with soups), To drink, Our beans (D-38) | Confirmed 3 Oct | — |
| Menu | Preparation stations | Two: drinks bar, food counter (D-14) | Confirmed 3 Oct | — |
| Users | Who may sell | Every staff member, everything, at the same time (D-38) | Confirmed 3 Oct | — |
| Scope | Opening day | Everything on the launch list must work (D-21) | Confirmed 3 Oct | — |
| Commercial | Ownership | Quantara owns the software; Electro Café is the first subscriber (D-22) | Confirmed 3 Oct | — |
| Menu | Item options | Size (affects the price) and sugar level (does not) | Confirmed | Q15 |
| Menu | Menu and invoice language | Arabic and English | Confirmed | Q19 |
| Pricing | Price policy across branches | One uniform price | Confirmed | Q16 |
| Pricing | Price-change permission | Central administration | Confirmed | Q18 |
| Pricing | Active promotions | Combo, offer of the day, mall-staff discount, loyalty (Phase 2) | Confirmed | Q17 |
| Pricing | Mall-staff discount percentage | Undefined | Awaiting decision | Q17 |
| Pricing | Manual discount ceiling and permission | Undefined | Awaiting decision | Q38 |
| Pricing | Tax included in the price | Yes, the price is tax-inclusive | Confirmed | Q53 |
| Pricing | Tax rate | Set by the business at head office; no fixed rate (D-03). Value still to enter | Confirmed 3 Oct | Q52 |
| Payment | Payment methods | Cash SYP, cash USD, card, Syriatel Cash, Sham Cash | Confirmed | Q23 |
| Payment | Primary and secondary currency | Syrian pound / US dollar | Confirmed | Q23 |
| Payment | Source of the exchange rate | Central administration, daily | Confirmed | Q25 |
| Payment | Mixed payment | Yes — several methods and currencies on one bill (D-10) | Confirmed 3 Oct | Q26 |
| Payment | Bill splitting | Enabled | Confirmed | Q27 |
| Payment | Rounding rule | New Syrian pound; nearest step, 5 by default, set at head office (D-11) | Confirmed 3 Oct | Q29 |
| Payment | Tips / deferred sales | Disabled / disabled | Confirmed | Q28, Q30 |
| Cash drawer | Opening float | Enabled — amount undefined | Awaiting decision | Q33 |
| Cash drawer | Who performs the cash count | Branch manager | Confirmed | Q34 |
| Cash drawer | Variance handling | Undefined | Awaiting decision | Q35 |
| Cash drawer | Cash withdrawals during the day | Not permitted | Confirmed | Q36 |
| Cash drawer | Number of POS terminals in the branch | Undefined | Awaiting decision | Q31 |
| Cash drawer | Number of shifts | Undefined | Awaiting decision | Q32 |
| Users | Active roles | Cashier, barista, branch manager, accountant, owner | Confirmed | Q37 |
| Users | Login method | Employee card with a printed 8-digit number, or PIN | Confirmed 3 Oct | Q40 |
| Users | Recording the operator's name | Mandatory on every void and discount | Confirmed | Q39 |
| Users | Remove an item before payment | Cashier | Confirmed | Q38 |
| Users | Void an invoice after payment | Branch manager | Confirmed | Q38 |
| Users | Cash refund | Manager's PIN and a reason, in the currency the customer paid (D-05). Card and wallet refunds open (D-40) | Confirmed 3 Oct | Q38 |
| Users | Open the cash drawer without a sale | Branch manager | Confirmed | Q38 |
| Users | Close the shift | Cashier | Confirmed | Q38 |
| Users | Change an item price | Administration | Confirmed | Q38 |
| Users | View reports | Administration and branch manager | Confirmed | Q38 |
| Users | Grant a discount | Undefined | Awaiting decision | Q38 |
| Users | Employee working in more than one branch | Undefined | Awaiting decision | Q41 |
| Users | Employee consumption | Undefined | Awaiting decision | Q42 |
| Invoice | Invoice printing | On customer request only (with every transaction recorded) | Confirmed | Q50 |
| Invoice | Invoice content | Logo, tax ID, address and phone, sequential number, date and time, cashier name, order number | Confirmed | Q51 |
| Invoice | E-invoicing readiness | Required from launch | Confirmed | Q54 |
| Invoice | Invoice issued to an organisation | Undefined | Awaiting decision | Q55 |
| Inventory | Stock tracking | From first launch | Confirmed | Q56 |
| Inventory | Deduction level | Undefined — by item or by recipe | Awaiting decision | Q57 |
| Inventory | Central warehouse | Undefined | Awaiting decision | Q58 |
| Inventory | Inter-branch transfers | Disabled | Confirmed | Q59 |
| Inventory | Purchasing from suppliers | Central administration | Confirmed | Q61 |
| Inventory | Waste recording | Procedure undefined | Awaiting decision | Q60 |
| Mall | Mall's percentage of sales | Entirely undefined | Awaiting decision | Q43 to Q49 |
| Mall | Mall management's visibility | Undefined | Awaiting decision | Q49 |
| Infrastructure | Internet status | Fixed line, intermittent | Confirmed | Q67 |
| Infrastructure | Power cuts | Warn after 4 hours offline; sell up to 7 days; the whole branch works together offline (D-12, D-39). UPS hours open (Q-31) | Confirmed 3 Oct | Q68, Q69 |
| Infrastructure | What must work offline | Selling, printing, preparation, shift close and reports | Confirmed | Q70 |
| Infrastructure | Hardware | **iPad tills** (D-37), branch server (mini-PC), network printers, cash drawer, barcode scanner, customer display, UPS. iPad model and count open (Q-24) | Confirmed 3 Oct | Q65 |
| Infrastructure | Hardware ownership | Purchased by the client | Confirmed | Q66 |
| Operations | Staff experience | Low | Confirmed | Q72 |
| Operations | Interface language | Arabic and English with switching | Confirmed | Q73 |
| Operations | Support response time | Within one hour | Confirmed | Q74 |
| Operations | Technical point of contact | Undefined | Awaiting decision | Q75 |
| Operations | Number of staff in the branch | Undefined | Awaiting decision | Q71 |
