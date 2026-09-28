---
title: Prototype coverage of the requirements
status: living
owner: PO
last_updated: 2026-09-28
---

# Prototype coverage — 111 requirements

Live view: open `prototype/requirements.html` (filters by state, domain and *10 Nov* scope; every row links to its screen).

| State | Count | Meaning |
|---|---|---|
| Works | 95 | Clickable in the prototype (some with a placeholder value tagged *Waits for D-xx*) |
| Waits for a decision | 7 | Shown, but the behaviour depends on D-01, D-03, D-14, D-17, D-29 |
| Shown (guaranteed) | 2 | A rule Quantara guarantees; nothing to click (FIS-05, OFF-06) |
| Phase 2 | 5 | Shown as out of the first launch (POS-08, PRC-07, PAY-11, STK-08, STK-10) |
| Dropped | 1 | NH-07 live mirroring — replaced by the live feed (D-28) |
| Missing text | 1 | PRC-11 — the source row is empty |

The prototype is a reference for **behaviour and labels**. Visuals come from Figma (see [figma-html-sync](figma-html-sync.md)).
Regenerate after changes: `python prototype/tools/build-coverage.py`.
