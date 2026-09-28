---
title: R-05 Subscription models — how POS SaaS products charge
status: approved
owner: PO
last_updated: 2026-09-28
related: D-30, D-32, GEN-01, POSD-93
---

# R-05 — Subscription models: how POS SaaS products charge

**Question:** How should Quantara charge its tenants? · **Method:** 10 studies: 9 POS products (global, Gulf, free-core) plus SaaS pricing research. Prices are published list prices found in September 2026; they change often.

## The 10 studies

| # | Product / source | What they charge on | Tiers and indicative price | Add-ons | What to learn |
|---|---|---|---|---|---|
| 1 | **Foodics** (KSA, Arabic-first) | Per branch/device, **billed annually** | Starter ~SAR 392/mo · Basic ~SAR 742/mo · Advanced ~SAR 1,133/mo | Delivery integrations SAR 200–400/mo each, KDS, inventory, pay | The regional reference. Its costs climb fast as branches and add-ons are added, which leaves room for a cheaper option |
| 2 | **Square for Restaurants** | **Per location** + card processing | Free $0 · Plus $49 · Premium $149 per location/mo, 30-day trial | KDS $20–30/device, kiosk $30–50/device | 3 simple tiers; devices beyond the POS are paid extras. Its free tier is funded by card fees |
| 3 | **Toast** | Per terminal + processing, 1–3-year contracts | Starter $0 (higher card fees) · POS from $69/mo · custom for multi-location | Online ordering $75, loyalty $50, gift cards $50, KDS $25/mo | Many paid modules. Contracts and early-termination fees are its biggest complaint |
| 4 | **Lightspeed Restaurant** | Per location, discount for paying yearly | Starter $69 · Essential $189 · Premium $399 · Enterprise custom | KDS $30/screen, reservations, advanced inventory | Multi-location and advanced inventory sit in the top tier |
| 5 | **Loyverse** | **Free core** + add-ons per store | POS, KDS, customer display, multi-store free | Sales history $5, staff management $25, advanced inventory $25 per store/mo; yearly = ~2 months free; 14-day trials | Cheap entry for small cafés. Money comes from paid add-ons per store |
| 6 | **TouchBistro** | **Per terminal**, annual contract | From $69/terminal/mo; bundle $119 | Online ordering, reservations, loyalty, KDS, inventory — quote only | Add-on prices that are "quote only" are criticised as unclear |
| 7 | **Odoo POS** | **Per user**, price set by country | 1 app free · Standard ~$9/user/mo (Middle East) to ~$31 (US) · Custom +50–70% | Hosting, customisation | Charging per user fits back-office work, not a café with many shift staff |
| 8 | **Sapaad** (GCC) | Per outlet, longer commitment gets cheaper | $59.99 monthly · $49.99 yearly · $39.99 two-year | Inventory, QR ordering, loyalty, e-commerce | A published per-outlet price, with discounts for committing longer |
| 9 | **Marn / Geidea** (KSA) | Quote; software sold with hardware and payments | Not published | KDS, waiter app, loyalty, inventory | Selling a bundle with payments works where card payments are common. Syria isn't there yet |
| 10 | **SaaS pricing research** (Revenera 2025, SoftwarePricing.com) | — | Most B2B SaaS now **mixes models**: a base subscription plus variable add-ons or usage | — | Charge on what the customer values, keep the bill easy to predict, and package plans by customer type |

## What the studies show
- **Almost everyone charges per location (branch).** Terminals or devices beyond the first are paid extras (Square, Toast, Lightspeed, TouchBistro, Sapaad).
- **3 or 4 tiers**, with multi-branch management and advanced inventory in the higher tiers.
- **Modules are sold as add-ons:** KDS, online ordering and delivery, loyalty, advanced inventory, staff and payroll.
- **Free tiers work only with card-processing revenue** (Square, Toast) **or huge volume** (Loyverse). Neither exists for Quantara in Syria today.
- **Paying yearly saves about 2 months**, or you get a lower monthly price for committing longer (Foodics, Loyverse, Sapaad, Lightspeed).
- **Complaints to avoid:** long lock-in contracts (Toast, TouchBistro), add-on prices shown only as "quote" (TouchBistro, Marn), and costs that rise sharply with each branch (Foodics).

## Syria-specific constraints
- Mostly cash; card payments are only starting. There's no processing revenue to fund a free tier.
- Prices are thought of in USD, while the pound moves. Subscriptions will be collected by wallet (Syriatel Cash, Sham Cash), bank transfer or cash.
- Power and internet cuts: a tenant with an expired plan must never be locked out while it is offline (OFF-01).

## Top 3 recommendations
1. **Three plans priced per branch (Starter · Growth · Chain), each including a set number of registers, with extra registers charged separately.** The branch is how every studied POS measures value, and Quantara's data model already has plan limits per branch and per register (`plans.max_branches`, `max_registers`). Avoid charging per user (Odoo) because café staff change often, and avoid charging on transactions because there's no card revenue.
2. **Keep the core plan complete, and sell modules as add-ons per branch.** Candidate add-ons: kitchen screen, recipe-level inventory and purchasing, loyalty, online ordering and delivery integrations, extra registers, and later tips and credit sales. Quantara already works this way: Quantara makes a module *available*, and HQ switches it *on* per branch. Many of the LATER items in the 10 Nov scope can become paid upgrades instead of launch work.
3. **Price in USD, bill monthly or yearly (yearly = 2 months free), offer a 30-day trial, and don't lock customers into contracts.** Collect through local wallets or bank transfer. A missed payment should lead to a grace period, then read-only back office. **The till never stops selling.** Offer Electro Café a written design-partner price, linked to the IP decision (D-22).

## Proposed structure — to validate, not final
| | Starter | Growth | Chain |
|---|---|---|---|
| For | One café | Small chain | Franchise or group |
| Branches | 1 | up to 5 | custom |
| Registers included per branch | 2 | 3 | custom |
| Core (sell, shifts, cash, offline, reports, HQ panel) | ✓ | ✓ | ✓ |
| Multi-branch HQ, price overrides, branch comparison | — | ✓ | ✓ |
| Add-ons | Paid | Paid, some included | Mostly included |
| Price | To set after 5 café interviews; start below Foodics Starter (~$105/mo) and near Sapaad ($40–60) | | Quote |

## What this means for the product
- **Operator panel → Billing**: built in the prototype on Day 11 (`#/billing`, `#/t/<id>/subscription`, `#/settings`) — plan, add-ons, invoices, trial and grace states, payment reference.
- **Module on/off:** already built (Subscription page); add a price per module.
- **Plan limits and upgrade request:** already built; add a self-service upgrade later (D-30).
- **Suspension:** the till keeps selling offline; HQ becomes read-only (the answer to panel question 16 in D-31).

## Sources
- Foodics — https://lkwjd.com/foodics-review · https://help.foodics.com/hc/en-us/articles/9526937173020
- Square — https://squareup.com/us/en/point-of-sale/restaurants/pricing
- Toast — https://www.merchantmaverick.com/toast-pricing-guide/
- Lightspeed — https://www.lightspeedhq.com/pos/restaurant/pricing/
- Loyverse — https://loyverse.com/pricing
- TouchBistro — https://www.posusa.com/touchbistro-pos-review/
- Odoo — https://oec.sh/odoo-pricing
- Sapaad, Marn, Geidea (KSA comparison) — https://chefpin.com/sa/blog/restaurant-pos-software-pricing-saudi-arabia
- SaaS pricing research — https://softwarepricing.com/blog/saas-pricing-models/ · https://www.revenera.com/blog/software-monetization/saas-pricing-models-guide/
