---
title: Module 1 handoff — Platform core (backend)
status: draft
owner: PO + backend developer
last_updated: 2026-09-28
related: ../08-delivery/module-readiness.md, ../08-delivery/sprint-02.md, adr/ADR-001-offline-first-multi-tenant.md, ../01-product/ownership-boundaries.md
---

# Module 1 — Platform core

**What it is:** the data every other module stands on — who the tenant is, where it sells, who works there and what they may do, and what it sells.
**Reference:** HTML prototype `prototype/index.html` (behaviour + field names). Sample data: `prototype/js/data.js`, `data-ops.js`. Field names there are the starting point; the backend developer may rename, but records the mapping here.
**Backend sprint:** Sprint 2, 4–8 Oct (1 developer). Catalogue may spill into Sprint 3 day 1.

## Screens to open in the prototype
| Screen | Route | Shows |
|---|---|---|
| Tenants list | `#/tenants` | tenant, status, plan, branches, registers |
| Onboarding (new tenant) | `#/onboarding` | the create-tenant flow and its required fields |
| Tenant record | `#/t/<id>` | tenant detail, plan limits, activity |
| Branches & registers | `#/hq/<id>/branches` | branch list, registers per branch, status, last seen |
| People & roles | `#/hq/<id>/roles` | permission matrix, add person, several branches, card login |
| Menu | `#/hq/<id>/menu` | categories, items (EN + AR names), options, barcode, price |
| Support access | `#/t/<id>` → Support access | Quantara asks, owner approves, time-boxed, audited |

## Entities (minimum for 10 Nov)
Every row carries `tenant_id` except Quantara-owned ones. Names are bilingual: `name_en`, `name_ar`. Dates are ISO UTC. IDs are generated so a device can create them offline (UUID/ULID).

| Entity | Key fields | Owner (D-25) | Requirements |
|---|---|---|---|
| `plan` | id, name_en/ar, max_branches, max_registers | Quantara | GEN-01 |
| `tenant` | id, name_en/ar, status (trial·active·suspended), plan_id, invoice_prefix, currency, time_zone, modules_available[], contact, settings | Quantara creates; HQ edits its settings | GEN-01, GEN-03 |
| `branch` | id, tenant_id, code, name_en/ar, city_en/ar, status | HQ | GEN-02 |
| `register` | id, tenant_id, branch_id, n, label, status, last_seen_at, device_id | HQ creates; device reports status | CSH-08, OFF-07 |
| `quantara_staff` | id, name, team (support·onboarding·operations·finance) | Quantara | — |
| `user` (tenant staff) | id, tenant_id, name_en/ar, role, branch_ids[] (empty = all), pin_hash, card_id, status | HQ | USR-01, USR-03, USR-06 |
| `role_permission` | tenant_id, role, action, allowed | HQ (defaults from Quantara) | USR-01, USR-02 |
| `category` | id, tenant_id, parent_id (sub-category), name_en/ar, sort | HQ | CAT-01, CAT-02 |
| `item` | id, tenant_id, category_id, name_en/ar, price (SYP, integer), barcode, image_url, option_group_ids[], sold_at_branch_ids[], active, updated_by, updated_at | HQ | CAT-01…05, POS-09, PRC-01 |
| `option_group` / `option` | id, name_en/ar, required, price_delta | HQ | CAT-03, POS-04 |
| `branch_override` | id, tenant_id, branch_id, item_id, kind (pause·discount·price), value, starts_at, ends_at, by, at | Branch | PRC-01, D-26 |
| `support_access` | id, tenant_id, staff_id, scope, hours, status (pending·approved·declined·ended), reason, decided_by, timestamps | Shared: Quantara asks, owner decides | USR-05 |
| `audit_event` | id, tenant_id, actor, action, target, detail, at | Quantara guarantees (append-only) | USR-05 |

**Roles (6):** owner · hq_manager · accountant · branch_manager · cashier · barista. **Actions (21):** see `ACTIONS` and `ROLE_DEFAULTS` in `prototype/js/data-ops.js`. Actions marked with a decision (D-04, D-05, D-06, D-07, D-16) keep the default until decided.

## Rules the backend must enforce
1. **Tenant isolation:** every query is scoped by `tenant_id` from the token, never from the request body. A test proves tenant A can't read tenant B.
2. **Plan limits:** creating a branch or register above `plan.max_*` is refused with a clear error (the panel shows a limit banner).
3. **Ownership (D-25):** only the owner of a value can change it. HQ edits items and prices; a branch can only create `branch_override` records; Quantara can't edit tenant data except inside an approved support-access window.
4. **Support access:** Quantara staff read tenant data only while an approved window is open; every read/write in that window is audited.
5. **Permissions:** every sensitive action checks `role_permission`. The till asks for a manager PIN when the cashier's role lacks the action.
6. **PINs and cards:** stored hashed; 4 digits (prototype) — length is a setting. Quantara never sees PINs.
7. **Audit:** append-only. No update or delete endpoint.

## API (first cut — names are a proposal)
- `POST /tenants` (Quantara onboarding) · `GET /tenants` · `GET/PATCH /tenants/{id}`
- `GET/POST /branches` · `PATCH /branches/{id}` · `GET/POST /branches/{id}/registers` · `PATCH /registers/{id}`
- `POST /auth/login` (HQ, email + password) · `POST /auth/till` (register + user + PIN or card) · `POST /auth/approve` (manager PIN for one action)
- `GET/POST /users` · `PATCH /users/{id}` · `GET/PUT /roles` (matrix)
- `GET /catalogue?since=<ts>` (full catalogue for a register, incremental) · `POST/PATCH /categories` · `POST/PATCH /items` · `POST /items/import` (Excel, CAT-07 later)
- `POST /branches/{id}/overrides` · `DELETE /overrides/{id}` (ends it; the record stays)
- `POST /support-access` · `POST /support-access/{id}/decide` · `POST /support-access/{id}/end`
- `GET /audit?target=…`

`GET /catalogue?since=` is what the till downloads and keeps offline; design it now even though the till arrives in Module 2.

## Open points for the backend developer (answer in this file)
- Stack and hosting (ADR-001 #6, #8) — needed before 4 Oct.
- ID format (UUID v7 / ULID) and how devices register (`device_id`).
- Auth: token type and lifetime for a till that may stay offline for hours.
- Money: integers in SYP; USD kept as decimal with 2 places (Module 2).

## Not in Module 1
Sales, payments, shifts, stock, reports, exchange rate, billing/subscriptions (Quantara billing waits for D-32).
