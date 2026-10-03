---
title: ADR-001 Offline-first, multi-tenant foundation & stack
status: accepted
owner: Tech lead + PO
last_updated: 2026-10-03
accepted: 2026-10-03 (PO, from the tech lead's "Recommended Tech Stack" of 19 Sep — original in source/POS_Platform_Recommended_Tech_Stack_v1.docx)
supersedes: the "proposed" version of 28 Sep
---

# ADR-001 — Offline-first, multi-tenant foundation & stack

## Context
- Intermittent internet and daily power cuts at the branch (D-12).
- Several tills per branch share stock and orders (CSH-08).
- Ledger integrity: gapless numbering, immutable audit (FIS-03, FIS-05, USR-05).
- Device I/O: printer, drawer, scanner, card terminal (HW-02/03/04/06).
- Must sell to more tenants without code changes (GEN-01, GEN-02). Small team, short deadline: one language on every tier, boring technology, no microservices.

## Decision — three tiers, authority moves down as connectivity gets worse
| Tier | What it is | Authoritative for |
|---|---|---|
| **Till** | The sales screen on a touch screen or tablet | Nothing. Holds the in-progress order and a cached catalogue |
| **Branch server** | A local mini-PC in each branch (shipped appliance) | The branch during the day: stock, orders, shifts, cash, **invoice numbering**; drives printers and drawer |
| **Cloud** | Quantara's hosted service | The tenant: catalogue, prices, offers, tax, exchange rate, users, permissions, settings; aggregates branches for reports |

**Rule: every table has exactly one owning tier.** This is the technical form of the ownership boundaries (D-25).

## Decisions (was "to make")
| # | Question | Decision |
|---|---|---|
| 1 | Tenancy model | Shared schema + `tenant_id` on every row + PostgreSQL **Row-Level Security**. Schema-per-tenant only if a client demands physical separation |
| 2 | Where the cashier runs | **Electron + React + TypeScript** (kiosk mode, native device access) — not a browser PWA |
| 3 | Local storage | Till: SQLite (in-progress order, cached catalogue). Branch server: **PostgreSQL** (several tills write at once; same engine and schema as the cloud) |
| 4 | Sync model | **Append-only event log per branch**; each event has a UUIDv7 id, branch id, device id, per-device sequence. Idempotent ingestion on `(branch_id, event_uuid)`. Batched compressed HTTPS upward with resume, WebSocket downward |
| 5 | Tills together offline | Through the **branch server** on the LAN. Tills talk to the branch server, never to the cloud |
| 6 | Backend & database | **Node.js + TypeScript** (Fastify) on branch and cloud; PostgreSQL; Redis + BullMQ; S3-compatible storage. Dashboard: React + TypeScript sharing components and i18n with the till |
| 7 | Printing | From the **branch server**, ESC/POS to network printers; the drawer connects through the printer |
| 8 | Packaging | Branch tier as Docker Compose on a Debian mini-PC (N100-class, 16 GB, SSD) + UPS; till as a signed installer with auto-update |

## Sync ownership
| Direction | Data | Rule |
|---|---|---|
| Cloud → branch | Catalogue, prices, offers, tax, exchange rate, users, permissions, settings | Read-only at the branch |
| Branch → cloud | Sales, invoices, refunds, shifts, cash counts, stock movements, waste | Append-only |
| Two-way (only these) | Item pause (CAT-06), branch discount (PRC-10) | Created at the branch, sent up as events (D-26) |

- **Invoice numbers are allocated by the branch server only**, in the same transaction as the insert — never the till, never the cloud. So the series is **per branch** (FIS-03), not per register → D-27 revised.
- Invoices are hash-chained and signed (FIS-05): a later edit is detectable.
- The connection indicator (OFF-07) is fed from real sync state, not a ping.
- **Offline authentication:** credential hashes (PIN, card) and the permission matrix are cached at the branch server; a change made at HQ takes effect at a branch after its next sync.

## Non-negotiables
- Every record carries `tenant_id`; every query is tenant-scoped (RLS).
- Sale, shift close and printing work with no internet.
- Audit log append-only.
- Each branch release stays compatible with the cloud for at least one version (schema skew); the updater is built in the first backend sprint.

## Consequences
- Module 1 gains one entity: the **branch server** (enrolment, version, last sync, events waiting). "Online / offline" is about the branch server's link to the cloud; a till is "connected / not connected" to its branch server.
- Hardware list (HW-07) must include the branch box and UPS.
- Sync is hand-written and is the riskiest layer: it gets design time before Module 2.

## Still open
| # | Question | Owner | Needed by |
|---|---|---|---|
| a | Cloud hosting provider, region, backup and restore test | Tech lead | first deploy |
| b | A till that cannot reach the branch server (LAN or box down): proposal — it cannot sell; mitigate with UPS and a spare box. Confirm | Tech lead + PO | Module 2 |
| c | Syriatel Cash / Sham Cash when the line drops mid-payment (prototype: payment restored + "Was this payment received?") | PO + client | Module 2 |
| d | Card terminal: native helper on the branch box (D-29) | Tech lead | Module 3 |
| e | The stack document counts 124 requirements; the repo has 111 rows — reconcile | PO | this week |
