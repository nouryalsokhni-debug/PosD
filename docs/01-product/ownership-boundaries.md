---
title: Ownership boundaries — Quantara · Tenant HQ · Branch
status: approved
owner: PO
last_updated: 2026-09-28
source: POSD-85 (decided by PO); POSD-83
---

# Ownership boundaries — three layers

- **Quantara** — our staff panel (onboarding, support, operations, finance). Scope *All tenants* by default; opening a tenant swaps the navigation and shows a scope bar.
- **Tenant HQ** — the café's head office. In the client spec, **"central / الإدارة المركزية" means tenant HQ, never Quantara.**
- **Branch** — branch manager and cashier.

A screen must never leave the user unsure which layer they are in.

| Topic | Quantara | Tenant HQ | Branch |
|---|---|---|---|
| Plan, limits, billing, suspension | Owns | Sees; asks to upgrade | — |
| Branches & registers | Sets the limits | Adds them, within the plan | — |
| Modules (tips, credit sales, loyalty, table service) | Decides if **available** | Decides if **on**, and where | — |
| Catalogue, prices, offers, exchange rate | — | Owns | Pause item (CAT-06) · timed item discount (PRC-10) · manual discount under HQ cap (PRC-08) |
| Business settings (spec §٥) | Read-only | Owns | — |
| Sales & item data | Only during support access | Owns all | Own branch |
| Support access | Requests | Owner approves/refuses; can end any time | — |
| Invoice numbering, audit log, e-invoicing, approved hardware | Guarantees; nobody edits | Sees | — |

## Rules
- **Sync conflicts:** the owner of a value wins; the other side is told ("changed by HQ at 10:42"). Branch overrides are separate records and never overwrite HQ values. Sales, refunds and shift closes never conflict. (D-26)
- **Invoice numbering:** gapless **per register**, series `<TENANT>-<BRANCH>-R<n>`, so registers sell offline in parallel. Pending accountant confirmation. (D-27)
- **Live screen mirroring (NH-07):** dropped from launch; HQ gets a live order/activity feed per register instead. (D-28)

## Boundary states (one component each, used everywhere)
*Set by Quantara* (read-only) · *Set by HQ* (locked at branch) · *Overridden at this branch* · *Plan limit reached* · *Changed elsewhere / last synced* · *Quantara staff is inside* (support access open).
