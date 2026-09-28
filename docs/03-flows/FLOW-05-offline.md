---
title: FLOW-05 Offline operation
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1, section ٤
---

# FLOW-05 Offline operation

Offline is the **default** design assumption, not a fallback.

| # | Step | Detail | Ref |
|---|---|---|---|
| 1 | During outage | Selling, printing, reports and shift close continue locally | OFF-01, OFF-03, OFF-04 |
| 2 | Visibility | Connection status + last sync time visible to staff | OFF-07 |
| 3 | Back online | Automatic sync, no user action, conflict rules applied | OFF-05, OFF-06 |
| 4 | Power cut | Safe resume without losing the current order | OFF-08 |
| 5 | Retention | Local data covers at least one full business day | OFF-09 |

## Behaviour settled in the HTML prototype (step 2 C–D, 28 Sep)
| Case | Behaviour | Ref |
|---|---|---|
| Offline for hours | Status pill shows how long; after **4 h** (assumption, D-12) the banner turns red and says to call support. Selling never stops | OFF-01, OFF-07 |
| New day while offline | The last known USD rate keeps being used; a banner and the receipt say "last known rate from <date>" until HQ sends today's rate | PAY-04 |
| Retention | Register keeps up to **7 days** of offline records (assumption, D-12); a red banner shows when less than 2 days are left | OFF-09 |
| Back online | Sync runs by itself; a sync report lists what was sent (invoices, shifts, audit) and what HQ changed meanwhile (price, paused item). HQ's values win; sales keep the price they were sold at. Sales, refunds and shift closes never conflict | OFF-05, OFF-06, D-26 |
| Power cut during payment | The open payment comes back exactly (order, tenders, method). A non-cash payment entered before the cut is confirmed by the cashier ("Was this payment received?") | OFF-08 |
| Power cut right after the invoice was saved | The same payment can never become two invoices: every payment carries an ID; on restart the till shows the saved invoice | OFF-08, FIS-03 |
| Printer out of paper / off | Sale saved; job waits in *To print*; nothing is replayed by itself | FIS-01, HW-02 |

Try it: `prototype/pos.html` → status pill → Demo → *Long outage & power cut*. Flow guide section **Long outage and power cut mid-payment**.

**Known failure points (industry lessons):** duplicate orders on reconnect · two registers editing the same record · partial sync · printer commands replayed · reports wrong while sync is delayed. Each needs a rule in ADR-001 and a test case.

**Open decisions:** D-12 power-cut hours.
