---
title: Module 1 handoff — Platform core (backend)
status: approved
owner: PO + backend developer
version: 2.0
last_updated: 2026-10-03
related: adr/ADR-001-offline-first-multi-tenant.md, ../../clients/electro-cafe/seed.md, ../03-flows/FLOW-07-platform-setup.md, ../04-design/designer-questions.md, ../08-delivery/module-readiness.md
---

# Module 1 — Platform core (v2)

**What it is:** the data every other module stands on — who the tenant is, where it sells, the branch server and tills in each branch, who works there and what they may do, and what it sells.
**Stack (ADR-001, accepted):** Node.js + TypeScript (Fastify) · PostgreSQL with Row-Level Security · three tiers: till → branch server → cloud. Module 1 is mostly **cloud** tier, plus the branch server's enrolment and its "sync down" feed.
**Reference:** behaviour and fields — `prototype/index.html`; steps — [FLOW-07](../03-flows/FLOW-07-platform-setup.md); seed — [Electro Café seed](../../clients/electro-cafe/seed.md); looks — Figma (Tenant HQ page).
**v2 changes (3 Oct):** branch server entity · invoice series per branch (D-27 revised) · panel sign-in, status and PIN rules for people · branch record, code and register actions · menu: sub-category, sold-at set, item option prices, image · one sync-down feed. Source: the stack decision and the designer's 26 questions ([answers](../04-design/designer-questions.md)).

## Screens to open in the prototype
| Screen | Route | Shows |
|---|---|---|
| Tenants · Onboarding · Tenant record | `#/tenants` · `#/onboarding` · `#/t/<id>` | create a tenant with its owner invite, first branch, code and tills |
| Branches and registers | `#/hq/<id>/branches` | branch record (edit, pause), branch code, branch server status, tills (rename, retire), plan limit |
| People and roles | `#/hq/<id>/roles` | people (add, edit, disable, panel access, PIN, card), permission matrix |
| Menu setup | `#/hq/<id>/menu` | categories (rename, reorder, delete when empty), items, option groups and item prices, sold-at, image |
| Support access | `#/t/<id>` → Support access | Quantara asks, owner approves, time-boxed, audited |

## Entities
Every row carries `tenant_id` except Quantara-owned ones. Bilingual names `name_en`, `name_ar`. Dates ISO UTC. IDs are **UUIDv7**. *Tier* = the one owner (ADR-001).

| Entity | Key fields | Tier · owner | Requirements |
|---|---|---|---|
| `plan` | id, name_en/ar, max_branches, max_registers | Cloud · Quantara | GEN-01 |
| `tenant` | id, name_en/ar, code (2–4 letters, in every invoice number), status (onboarding·active·suspended), plan_id, currency, time_zone, modules_available[], contact, settings | Cloud · Quantara creates, HQ edits settings | GEN-01, GEN-03 |
| `branch` | id, **code** (2–4 letters, unique in tenant, **locked after the first invoice**), name_en/ar, city_en/ar, **status (active · paused)** | Cloud · HQ | GEN-02 |
| `branch_server` | id, branch_id, enrol_token_hash, enrolled_at, app_version, schema_version, last_sync_at, events_waiting, status (never enrolled · online · offline — derived from last_sync_at) | Cloud records it; the box reports itself | OFF-05, OFF-07 |
| `register` (till) | id, branch_id, n, label_en/ar, **status (active · retired)**, last_seen_at (reported by the branch server) | Cloud · HQ | CSH-08 |
| `invoice_series` | branch_id, prefix `<TENANT>-<BRANCH>`, next_number | **Branch server** allocates; cloud only stores what arrives | FIS-03, D-27 |
| `quantara_staff` | id, name, team | Cloud · Quantara | — |
| `user` | id, name_en/ar, role, branch_ids[] (empty = all / head office), **status (invited · active · disabled)**, **email or phone + password_hash (panel access, optional)**, invite_token_hash, pin_hash, **pin_must_change**, card_hash, sign_in (pin · card · card_or_pin) | Cloud · HQ | USR-01, USR-03, USR-06 |
| `role_permission` | role, action, allowed, updated_by, updated_at | Cloud · HQ (defaults from Quantara) | USR-01, USR-02 |
| `category` | id, parent_id (two levels), name_en/ar, sort | Cloud · HQ | CAT-01, CAT-02 |
| `item` | id, category_id, name_en/ar, price (SYP integer), barcode (one per item), image_key, active, sold_at: all or branch_ids[], updated_by, updated_at | Cloud · HQ | CAT-01…05, POS-09, PRC-01 |
| `option_group` / `option_choice` | id, name_en/ar, required, price_delta (default) | Cloud · HQ | CAT-04, POS-04 |
| `item_option` | item_id, group_id, **price overrides per choice** (optional) | Cloud · HQ | CAT-04 |
| `branch_override` | id, branch_id, item_id, kind (pause · discount), value, starts_at, ends_at, by | **Branch** creates, sent up as an event | CAT-06, PRC-10, D-26 |
| `support_access` | id, staff_id, scope, hours, status, reason, decided_by, timestamps | Cloud · shared | USR-05 |
| `audit_event` | id, actor, action, target, detail, at | Append-only, both tiers | USR-05 |

Not on the item in Module 1: cost, reorder level, supplier (Module 4), tax rate (D-03).
Roles (6) and actions (21) with defaults: `ACTIONS`, `ROLE_DEFAULTS` in `prototype/js/data-ops.js`.

## Rules the backend must enforce
1. **Tenant isolation:** RLS on every table; `tenant_id` comes from the token. A test proves tenant A can't read tenant B.
2. **Plan limits:** a branch or till above `plan.max_*` is refused (409 with a clear code). The panel disables the button and offers "Request upgrade" — never hides it.
3. **Ownership (D-25):** HQ edits items, prices, people. A branch only creates `branch_override`. Quantara edits tenant data only inside an approved support-access window.
4. **Branch code:** chosen by HQ when the branch is created; unique in the tenant; cannot change once the branch has an invoice.
5. **Pause a branch:** its tills can't open a new shift; open shifts can close; data stays. No delete, no close in Module 1.
6. **Tills:** rename and retire only. Retired = no new shifts, history kept, frees a plan slot. No move between branches.
7. **Invoice series:** one per branch, `<TENANT>-<BRANCH>-000001`, allocated by the branch server in the insert transaction. The till id is a field on the invoice, not part of the number.
8. **People:** never deleted — disabled. A disabled person can't sign in anywhere after the branch's next sync. The Owner role always keeps "manage people".
9. **Panel access:** email or phone + password, set through a one-time invite link (expires in 7 days). Allowed for owner, HQ manager, accountant, branch manager. Till-only staff have none.
10. **PIN and card:** HQ sets a temporary 4-digit PIN (shown once); the person must change it at the first till sign-in. Card = the printed 8-digit number, scanned or typed. Both stored hashed; Quantara never sees them. PIN unique within a branch.
11. **Offline sign-in:** PIN/card hashes and the permission matrix travel in sync-down; the branch server checks them. A change at HQ reaches a branch on its next sync — the panel says so.
12. **Categories:** two levels; rename and reorder freely; delete only when empty.
13. **Audit:** append-only, no update or delete endpoint. Every write above writes one event.

## API — cloud (first cut)
- **Quantara:** `POST /tenants` (creates tenant + owner invite + first branch + tills) · `GET /tenants` · `GET/PATCH /tenants/{id}`
- **Branches:** `GET/POST /branches` · `PATCH /branches/{id}` (name, city, status; code only before the first invoice) · `POST /branches/{id}/server/enrol-token` · `GET/POST /branches/{id}/registers` · `PATCH /registers/{id}` (label, status)
- **Auth:** `POST /auth/login` (panel) · `POST /auth/invite/accept` · `POST /auth/password/reset`
- **People:** `GET/POST /users` · `PATCH /users/{id}` (incl. status) · `POST /users/{id}/invite` · `POST /users/{id}/pin/reset` · `GET/PUT /roles`
- **Menu:** `GET/POST/PATCH /categories` · `DELETE /categories/{id}` (empty only) · `POST /categories/reorder` · `GET/POST/PATCH /items` · `PUT /items/{id}/image` · `GET/POST/PATCH /option-groups` · `POST /items/import` (Excel, later)
- **Support and audit:** `POST /support-access` · `…/decide` · `…/end` · `GET /audit?target=`

## API — branch server ↔ cloud
- `POST /sync/enrol` — the box exchanges its enrol token for credentials; reports app and schema versions.
- `GET /sync/down?since=<cursor>` — **one feed** of everything the branch is allowed to hold: branch, tills, users with hashes, role matrix, categories, items, options, prices, settings. Full on first call, changes after. WebSocket nudge when something changes.
- `POST /sync/up` — batched events, idempotent on `(branch_id, event_uuid)`; Module 1 sends only heartbeats (`events_waiting`, till last-seen, versions) and `branch_override` events. Sales arrive with Module 2.
- Compatibility: the cloud accepts the current and the previous branch `schema_version`.

## Still to settle (does not block the start)
- Cloud hosting provider and backups (ADR-001 a).
- Token lifetimes: panel session; branch-server credential rotation.
- Matrix defaults P7 (Owner can't sell or close a shift; HQ manager can't manage people) — keep spec v1 defaults until the client confirms.
- Image storage sizes for the till grid.

## Not in Module 1
Sales, payments, shifts, stock, reports, exchange rate, printing, billing/subscriptions (D-32).
