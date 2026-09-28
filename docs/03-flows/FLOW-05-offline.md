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

**Known failure points (industry lessons):** duplicate orders on reconnect · two registers editing the same record · partial sync · printer commands replayed · reports wrong while sync is delayed. Each needs a rule in ADR-001 and a test case.

**Open decisions:** D-12 power-cut hours.
