---
title: FLOW-03 Cancel & refund after payment
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1, section ٤
---

# FLOW-03 Cancel & refund after payment

| # | Step | Detail | Ref |
|---|---|---|---|
| 1 | Cancel | Mandatory reason; branch manager permission; logged with employee name; linked stock returned automatically | POS-10, USR-04 |
| 2 | Cash refund | Cashier permission; logged; opens drawer inside the logged operation | PAY-12 |
| 3 | Control | All cancels & refunds in a dedicated report with employee name | RPT-05 |

**Open decisions:** D-05 drawer/refund split (proposed answer in spec v1).
