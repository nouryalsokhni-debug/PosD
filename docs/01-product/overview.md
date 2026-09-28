---
title: Product overview
status: draft
owner: PO
last_updated: 2026-09-28
---

# Product overview

## What Quantara is
- Cloud POS for restaurants & cafés, sold by subscription.
- Hierarchy: **Operator (Quantara)** → **Tenant** (a business) → **Branch** → **Register** (POS terminal).
- Works fully **offline** at the branch and syncs when back online (OFF-01).
- Bilingual **Arabic / English**, switchable live (GEN-03).

## Components
| Component | Purpose | Ref |
|---|---|---|
| Cashier app | Sell, take payment, hold orders, refunds, shift & drawer. Several registers per branch share stock and orders; each has its own shift & drawer. | POS-*, PAY-*, CSH-* |
| Customer display | Shows items and total during the sale. | HW-* |
| Prep tickets / KDS | Order number + type (dine-in/takeaway) for preparation. | POS-02, KDS-* |
| Tenant back office | Catalogue, prices, promotions, purchasing, exchange rate, stock, permissions, reports, settings — all branches from one place. | CAT-*, PRC-*, STK-*, RPT-* |
| Operator control panel | Quantara staff run the service across all tenants: onboarding, support, operations, finance. | — (to be written) |

## Platform principles
- **Multi-tenant from day one** — full data isolation (GEN-01).
- **Configuration, not customisation** — client differences are settings (see [settings in spec v1](../../source/POS_Specs_Client_v1.ar.md), section ٥).
- **Offline-first** — offline is the default mode, not a fallback.
- **Fast** — a typical sale in max 3 taps; picture grid of items (GEN-05, CAT-05).
- **Auditable** — every sensitive action carries the employee's name; the audit log can't be edited (USR-04, USR-05).

## Roles (configurable, USR-01/02)
| Role | Scope |
|---|---|
| Cashier | Daily selling, logged refunds, closes own shift |
| Barista | Prepares orders from prep tickets |
| Branch manager | Approvals, stock counts, cancellations, drawer open with reason |
| Accountant | Financial review & reports |
| Owner | Full view of reports & performance |
| HQ admin | Catalogue, prices, purchasing, settings |
| Operator staff | Quantara employees (onboarding, support, ops, finance) |

Detailed permission split: [permissions matrix](../03-flows/permissions-matrix.md).
