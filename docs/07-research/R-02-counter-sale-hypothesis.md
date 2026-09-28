---
title: R-02 Counter sale — first-pass hypothesis
status: approved
owner: PO
last_updated: 2026-09-28
jira: POSD-90
---

# R-02 Counter sale — first-pass hypothesis

**Question:** What does *our* counter sale look like, applying R-01? · **Done:** 22 Sep 2026 · **Status:** hypothesis, **not** a design to build · **Evidence:** Figma *POS Product*, next to the benchmark

## Three screens (Arabic, RTL, Western numerals)
1. **Sale** — header (branch, cashier, shift, day's rate) · search by name/barcode/PLU · *Favourites* tab first, then categories · tiles with SYP price + USD equivalent · order panel: order no., dine-in/takeaway/delivery, lines with stepper, extras, note (edited in place) · subtotal, discount, total in both currencies · one Pay button.
2. **Payment** — method (cash now, card *later*) · SYP/USD toggle · quick amounts (exact, rounded up) · keypad · each tender converted at the pinned rate · remaining balance · split · single *confirm & close order*.
3. **Change & print** — paid + *sent to kitchen* · change in SYP (mixed-change alternative) · print invoice · WhatsApp copy · new sale · tenders by currency; rate pinned and printed on invoice.

## Questions it raised → decision log
- Mixed-currency tender on one order → **D-10**
- Change given in USD or mixed → **D-29**
- Delivery mode (not in Electro scope: takeaway only) → **D-29**
- When does card payment arrive → **D-29**

## Next
Becomes SCR-POS-02 / 04 in Figma under POSD-91 *The Cashier's Day*.
