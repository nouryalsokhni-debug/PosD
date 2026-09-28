---
title: FLOW-01 Counter sale — pay first
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1, section ٤
---

# FLOW-01 Counter sale — pay first

Electro Café launch mode: order at the counter, pay up front, takeaway.

| # | Step | Detail | Ref |
|---|---|---|---|
| 1 | Log in | Username + password (card login: USR-03) | USR-03 |
| 2 | Build order | Picture grid or search by name/barcode; options (size, sugar); edit basket; dine-in/takeaway | CAT-05, POS-09, POS-04, POS-03, POS-07 |
| 3 | Offers & discount | Combo, offer of the day, category discount apply automatically; manual discount = branch manager within ceiling | PRC-04 → PRC-08 |
| 4 | Hold (optional) | Park order, serve another customer, resume | POS-06 |
| 5 | Pay | One or more methods (mixed); USD at today's rate fixed on invoice; split by amount or items; rounding rule | PAY-01 → PAY-10, POS-05 |
| 6 | Invoice | Always recorded; printed on customer request; stock deducted automatically | FIS-01, FIS-02, POS-02, STK-03 |
| 7 | Prep & hand-over | Prep ticket with order number + type; number called when ready | POS-02, POS-07, HW-02 |

**Open decisions:** D-03 tax · D-04 discount ceiling · D-10 mixed payment · D-11 rounding · D-18 company invoice · D-01 stock level.

**Edge cases to specify:** offline during payment · printer offline · wallet payment confirmed late / twice · rate changed mid-shift · power cut mid-order (OFF-08).
