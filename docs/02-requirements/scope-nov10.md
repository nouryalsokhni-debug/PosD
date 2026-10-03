---
title: Scope for 10 Nov — proposal
status: living
owner: PO
last_updated: 2026-10-03
decide_in: scope-cut session, Wed 30 Sep (D-21)
---

# Scope for 10 Nov — build order

> **Decided 3 Oct (D-21): everything on the launch list must work on opening day.** There is no cut. The IN / MIN / LATER split below is now the **order we build in**: IN first, MIN next, LATER last — so that if time runs out, what slips is what matters least. Capacity is the top risk (R-01); the order is still to be agreed with the client (Q-29).

The *Nov-10* column in [requirements.md](requirements.md) is filled with a **proposal**. The PO and the client owner confirm or change it on Wed 30 Sep (D-21). Nothing here is decided yet.

## Rule used
- **IN** — Electro Café cannot sell, get paid, close the day or trust the numbers without it; or it is the multi-tenant/offline foundation that is too expensive to add later (GEN-01, OFF-*).
- **MIN** — needed, but a smaller first version is enough on day one (e.g., PIN login before card login).
- **LATER** — can arrive in the weeks after go-live without stopping the café.
- **TBD** — blocked by an open decision; it moves to IN/MIN/LATER when the decision closes.

## Result
| | Count | Share |
|---|---|---|
| IN | 66 | 59% |
| MIN | 14 | 13% |
| LATER | 23 | 21% |
| TBD | 8 | 7% |
| **Total** | **111** | |

80 of 111 still go into 4 build sprints. **This is still heavy** — confirm team size (R-05) before accepting it. If capacity is small, the next items to move to LATER are: CAT-05 images, POS-06 hold, FIS-07 reprint, RPT-02/03, CSH-08 multi-register.

## MIN — what the minimal version is
| ID | Minimal version on 10 Nov |
|---|---|
| CAT-03 | One category level |
| PAY-07, PAY-08 | Syriatel Cash / Sham Cash recorded manually with a reference no. (no API) — as in the prototype |
| KDS-02, KDS-03, KDS-06 | Printed prep ticket + orders board on the till (preparing → ready → handed over); no kitchen screen |
| USR-02 | Fixed roles with the approved defaults (permissions matrix); editor later |
| USR-03 | PIN login; staff cards later |
| FIS-05 | Data model ready for e-invoicing (tax fields, numbering); no submission |
| STK-01, STK-04, STK-05 | Stock by finished item: quantities, goods-in, waste with reason (assumes D-01 = by item) |
| OFF-04 | Shift report offline; full branch reports online |
| HW-01 | One approved device type for launch |

## LATER — notable items
POS-01-01 pay later (Electro uses pay-first; prototype already shows it) · POS-05 split bill (mixed payment covers most cases) · CAT-07 Excel import (20–50 items entered by us) · PRC-03 price history · PRC-10 branch item discount · PAY-05 exchange-difference report · KDS-01 kitchen screen · USR-06 multi-branch staff · USR-07 staff meals · STK-06 stocktake · STK-09 purchasing · RPT-06/07/09 · HW-05 customer display · NH-07 live mirroring (dropped, D-28) · all Phase 2 items.

## TBD — waiting for
| ID | Decision |
|---|---|
| PRC-06 segment discount | D-17 mall-staff discount |
| PRC-11 | Row is empty in the source — PO to write or delete |
| PAY-06, HW-06 card terminal | D-29 + integration spike (R-04) |
| KDS-04 routing | D-14 preparation stations |
| FIS-04 tax per product | D-03 tax |
| FIS-06 company invoice | D-18 |
| STK-02 deduction level | D-01 |

## Data problems found while cutting
- **POS-02 is used twice** (daily order number *and* sequential invoice number). Proposal: keep POS-02 for the order number, renumber the invoice number to **POS-11**.
- **PRC-11** has no text.
- **CAT-07** has no classification/priority.
- **NH-07** is Must/Launch in the list but was dropped by the PO (D-28) → set to LATER here; update the row after confirmation.
- **STK-08** central warehouse: Phase 2 in the list, Phase 1 in client spec v1 → D-24.
