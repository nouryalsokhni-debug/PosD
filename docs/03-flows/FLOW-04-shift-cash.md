---
title: FLOW-04 Shift & cash drawer
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1, section ٤
---

# FLOW-04 Shift & cash drawer

Each register has its own shift and drawer; reports roll up to branch (CSH-08).

| # | Step | Detail | Ref |
|---|---|---|---|
| 1 | Open | Opening float per currency, default amount from settings | CSH-01 |
| 2 | During the day | No cash withdrawal; drawer open without sale = branch manager + reason | CSH-05, CSH-06 |
| 3 | Close | Branch manager counts actual cash per currency; variance calculated, shown, logged | CSH-02, CSH-03 |
| 4 | Variance | Within limit → closes; above → manager approval + reason, shown in reports | CSH-04, RPT-04 |
| 5 | Report | Shift report shown & printed; full close works offline | CSH-07, OFF-03 |

**Open decisions:** D-05 · D-06 variance rule · D-11 rounding · D-13 terminals & shifts · D-23 opening float.
