---
title: Architecture
status: living
owner: Tech lead
last_updated: 2026-10-03
---

# Architecture

Decisions are recorded as ADRs in [`adr/`](adr/). One decision per file, never edited after `accepted` — supersede with a new ADR.

| ADR | Title | Status |
|---|---|---|
| [ADR-001](adr/ADR-001-offline-first-multi-tenant.md) | Offline-first, multi-tenant foundation & stack | **accepted 3 Oct** (D-35) — hosting provider still open; #2 (till) replaced by ADR-002 |
| [ADR-002](adr/ADR-002-ipad-till-and-offline-branch.md) | Till on iPad, whole-branch offline, head office offline | **proposed 3 Oct** — tech lead to accept (Q-28) |

## Module handoffs
| Module | Doc | Status |
|---|---|---|
| M1 Platform core | [module-01-platform-core](module-01-platform-core.md) | v2.0 approved — backend starts here |
| M2 Sale | to write (POSD-105) | — |

Seed data for the first client: [clients/electro-cafe/seed.md](../../clients/electro-cafe/seed.md). Setup flow: [FLOW-07](../03-flows/FLOW-07-platform-setup.md).
