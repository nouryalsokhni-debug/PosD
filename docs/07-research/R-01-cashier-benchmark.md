---
title: R-01 Cashier-side benchmark of 5 POS systems
status: approved
owner: PO
last_updated: 2026-09-28
jira: POSD-69
---

# R-01 Cashier-side benchmark of 5 POS systems

**Question:** Which cashier patterns should we adopt or avoid? · **Designer:** Mariam Kabbani · **Done:** 22 Sep 2026 · **Evidence:** Figma *POS Product* → *Research* page

## Scope
- Systems: **Lightspeed, Odoo, Square, Loyverse, Foodics** (≥2 café/quick-service, ≥1 Arabic/RTL).
- Captured: sale screen + payment checkout for each.
- Matrix (5 × 5): taps to complete a sale (target ≤ 3) · cognitive load (1–5) · menu & grid handling · payment & multi-currency · bilingual & RTL.

## Adopt
| Pattern | Why | Reqs |
|---|---|---|
| Flat favourites grid | Fewest taps; no category loop | GEN-05, CAT-05 |
| Inline item editing | Change qty/options in the basket, no extra screen | GEN-05 |
| Quick cash buttons | Exact / rounded amounts in one tap | PAY-01 |

## Avoid
| Pattern | Why | Reqs |
|---|---|---|
| Category-first loop | Forces 2+ taps per item | CAT-05, GEN-05 |
| Double payment confirmation | Slows every sale | GEN-05, PAY-01 |
| Surface-level language switching | Labels translate, layout/data don't — breaks Arabic | GEN-03 |

## Used in
[R-02 counter-sale hypothesis](R-02-counter-sale-hypothesis.md) · SCR-POS-02, SCR-POS-04
