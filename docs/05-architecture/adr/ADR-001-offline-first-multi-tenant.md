---
title: ADR-001 Offline-first, multi-tenant foundation & stack
status: proposed
owner: Tech lead (TBD) + PO
last_updated: 2026-09-28
decide_by: 2026-10-01
---

# ADR-001 — Offline-first, multi-tenant foundation & stack

## Context
- Intermittent internet and daily power cuts at the branch (config: fixed line, unreliable; D-12).
- Several registers per branch share orders & stock (spec v1 §١).
- Must sell to more tenants later without code changes (GEN-01, GEN-02).
- 6 weeks to go-live; team size & skills TBD.

## Decisions to make (fill in)
| # | Question | Options | Proposed |
|---|---|---|---|
| 1 | Tenancy model | shared DB + `tenant_id` · schema per tenant · DB per tenant | shared DB + `tenant_id` (cheapest, fastest to onboard) |
| 2 | Where the cashier runs | web PWA · desktop (Electron/Tauri) · Android | TBD — depends on hardware (printers, drawer, customer display) |
| 3 | Local storage on register | IndexedDB/SQLite on device · branch local server | TBD — single register vs multi-register sync |
| 4 | Sync model | event log (append-only) · last-write-wins records | event log with device-generated IDs (idempotent) |
| 5 | Multi-register in a branch offline | through cloud only · LAN branch hub | TBD — if registers must see each other offline, a branch hub is needed |
| 6 | Backend & DB | TBD by team skills | — |
| 7 | Printing | ESC/POS direct · print server | TBD |
| 8 | Hosting & backups | TBD | daily backups + tested restore |

## Non-negotiables
- Every record carries `tenant_id`; every query is tenant-scoped.
- Sale, shift close and printing work with no internet.
- Invoice numbering safe offline across registers (prefix per register).
- Audit log append-only.

## Consequences
_Fill in when accepted._
