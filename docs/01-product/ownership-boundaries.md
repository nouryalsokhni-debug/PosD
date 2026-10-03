---
title: Ownership boundaries — Quantara · Tenant HQ · Branch
status: approved
owner: PO
last_updated: 2026-10-03
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
- **Invoice numbering:** gapless **per branch**, series `<TENANT>-<BRANCH>-000001`. The branch server gives every number, so all registers in a branch sell with no internet. Format pending accountant confirmation. (D-27, revised 3 Oct)
- **Live screen mirroring (NH-07):** dropped from launch; HQ gets a live order/activity feed per register instead. (D-28)

## Technical tiers (ADR-001, D-35)
The three layers above are about **who decides**. The system also has three tiers about **where data lives**:

| Tier | Authoritative for |
|---|---|
| Till (register) | Nothing — the order in progress and a cached menu |
| Branch server (one per branch) | The branch's day: stock, orders, shifts, cash, invoice numbers, printing |
| Quantara cloud | The tenant: menu, prices, offers, rate, people, permissions, settings; reports across branches |

- HQ values travel **down** (read-only at the branch); sales, shifts and stock movements travel **up** (append-only).
- A change made at HQ reaches a branch at its **next sync** — screens that edit such values say so.
- "Online / Offline" describes the branch server's link to Quantara; a register is "connected / not connected" to its branch server.

## Boundary states (one component each, used everywhere)
*Set by Quantara* (read-only) · *Set by HQ* (locked at branch) · *Overridden at this branch* · *Plan limit reached* · *Changed elsewhere / last synced* · *Quantara staff is inside* (support access open).
