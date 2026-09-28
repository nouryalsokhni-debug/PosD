---
title: Delivery plan
status: living
owner: PO
last_updated: 2026-09-28
---

# Delivery plan

Dates & gates: [master plan §4](../00-master-plan.md). This file = sprint goals and Jira structure.

## Jira structure
- **POSD** — design (existing). Epics: POSD-1 Screens & design system · POSD-2 Process models · POSD-68 Sprint 1 design.
- **Dev project** — to create by Thu 1 Oct. Proposed key: `QPOS`. One epic per requirement domain:
  Platform & tenancy · Sales · Items & menu · Pricing & promotions · Payment & currencies · Cash drawer & shifts · Kitchen/prep · Users & permissions · Invoicing & compliance · Inventory · Reports · Offline · Hardware.
- Every ticket: requirement IDs in the title or a label (e.g. `POS-06`), link to flow + screen ID, Definition of Done checklist.

## Sprint goals
| Sprint | Dates | Dev goal | Design goal (one sprint ahead) |
|---|---|---|---|
| Planning gate | 28 Sep – 1 Oct | Stack, repo, CI, environments | Cashier: sale + payment in Figma |
| S1 | 4 – 8 Oct | Tenancy, auth & roles, catalogue API, offline storage skeleton, payment-integration spike | Cashier flows approved; back office essentials start |
| S2 | 11 – 15 Oct | Sale → payment → invoice → prep ticket (online + offline) | Back office essentials approved |
| S3 | 18 – 22 Oct | Shift & drawer, cancel/refund, sync & conflict rules, printing | Operator panel minimum; print layouts |
| S4 | 25 – 29 Oct | Back office essentials, reports, exchange rate, inventory per D-01 | Polish, empty/error states |
| Hardening | 1 – 5 Nov | Bugs, performance, UAT | UAT support |
| Install | 7 – 9 Nov | Hardware, data load, training, dry run | Training material |
