---
title: Changelog
status: living
owner: PO
last_updated: 2026-09-28
---

# Changelog

Newest first. One line per meaningful change to scope, decisions, approved docs or releases.

- **2026-09-28** — Sprint 1 ends Thu 1 Oct (was Fri 2 Oct) and closes on the backend start pack, not finished design (D-34). POSD-104 moved into Sprint 1. Master plan v1.2; new sprint-01 close checklist.
- **2026-09-28** — PO agent v2: Jira is the truth for status; daily report adds a Figma design check (Done ✓ / Missing ✗ / How to fix per design ticket); new Thursday 16:45 weekly report. Figma map added; registry links for SCR-OPS-01…03.
- **2026-09-28** — Cashier prototype step 2 C–D: long outage (hours counter, stronger warning, last known rate on a new day, retention warning, sync report with HQ changes) and power cut mid-payment (payment restored, non-cash check, never two invoices). FLOW-05 updated. Fixed a duplicate text key that broke the offline pill.
- **2026-09-28** — Master plan v1.1 (timeline follows Jira sprints and backend modules), D-33 decided, risks R-05/R-11/R-12 updated, PO playbook adds the module readiness check.
- **2026-09-28** — Sprint 2 planned (4–8 Oct): backend starts Module 1 Platform core (POSD-96…101); module readiness gate and Module 1 handoff added; backend tickets live in POSD with label `backend`; sprints are 1 week.
- **2026-09-28** — Cashier prototype step 2 A+B: 80 mm receipt, kitchen ticket per station, refund and shift slips, printer out-of-paper/off handling with a *To print* queue (HW-02, FIS-01/02/07).
- **2026-09-28** — Prototype Day 11: Quantara control panel complete (Billing, Support queue, Platform settings, tenant Subscription/People/Support tickets, shared screen states). Prices follow R-05, placeholders until D-32.
- **2026-09-28** — Research R-05 subscription models (10 studies, 3 recommendations). D-32 proposed.
- **2026-09-28** — Prototype covers the 111 requirements: panel Day 10 screens (reports, shift counts, inventory & purchasing, menu setup & import, offers & price history, payment methods, till & invoice rules, devices, roles & permissions, operations health); cashier adds kitchen view, customer display, split bill, staff meal, company invoice, reprint, card login, random 4-digit order number. New `prototype/requirements.html` (95 works · 7 wait for a decision · 5 phase 2 · 2 shown · 1 dropped · 1 missing text). D-31 added (17 panel UX questions).
- **2026-09-28** — Scope for 10 Nov **proposed** (66 IN · 14 MIN · 23 LATER · 8 TBD) in requirements *Nov-10* column + scope-nov10.md. Data issues flagged: duplicate POS-02, empty PRC-11, unclassified CAT-07, NH-07 vs D-28.
- **2026-09-28** — Prototype: cashier app `prototype/pos.html` — FLOW-01 → FLOW-05 clickable (EN/AR, offline, power cut, manager approvals, flow guide). Screen registry SCR-POS-01 → 14 set to html-draft. Assumptions in `js/pos-data.js` tagged with D-numbers.
- **2026-09-28** — Research R-01→R-04 migrated from Jira (POSD-69, 89, 90, 92, 94). Ownership boundaries (POSD-85) added. Decision log: D-25→D-30. Screen registry: HQ & branch sections aligned with POSD-85. PO agent: report delivery set to scheduled-task output.
- **2026-09-28** — Repo created as source of truth. Requirements (111) converted from xlsx v1. Decision log: D-23, D-24 added; D-04, D-05, D-09, D-10, D-15, D-16 marked *proposed* from spec v1. Master plan v1.0.
