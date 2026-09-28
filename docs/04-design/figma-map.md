---
title: Figma map — POS Product file
status: living
owner: Designer + PO
last_updated: 2026-09-28
related: screen-registry.md, figma-html-sync.md, ../09-operating/po-agent.md
---

# Figma map — "POS Product"

**File:** https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product · **fileKey:** `oMDP77W6vVs5lD3GRZurFE`
**Link to a frame:** `https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=<id with - instead of :>`

## Pages (node IDs)
| Page | ID | Holds |
|---|---|---|
| Foundations | `1:348` | Colour and type specimen (frame `1:349`) |
| Components | `1:87` | Icons, Button, Badge, Owner tag, Sidebar item, Scope bar, Top bar, Table cell |
| Quantara | `1:535` | Quantara-layer screens (components, EN + AR) |
| Tenant HQ | `1:536` | Tenant HQ screens |
| Branch | `1:537` | Branch screens |
| Prototype · POSD-93 | `1:1836` | Instances of the screens, wired for click-through |
| Design System | `18:1856` | Button set, grid system (newer work) |
| Grid System | `6:1824` | empty |
| Page 1 | `0:1` | empty |

A Figma MCP page list (`get_metadata` without a node) may show only "Page 1". To list pages, run a read-only `use_figma` script: `return figma.root.children.map(p => ({id: p.id, name: p.name}))`.

## Naming rule (screens)
`NN Layer · Screen — EN` and `NN Layer · Screen — AR`, 1440 × 900, one per language, on the page of its layer. Example: `02 Quantara · Tenants — EN`. The agent matches screens to the [screen registry](screen-registry.md) by this name.

## Variables and styles
- Collections: `Quantara · Color` (29, Light + Dark) · `Quantara · Spacing` (10) · `Quantara · Radius` (4) · `Quantara · Size` (16)
- Text styles: `Quantara/English/*` (10) · `Quantara/Arabic/*` (9)
- Rule: every solid fill bound to a colour variable; every text layer outside a component instance uses a text style.

## Inventory — baseline 28 Sep 2026
| Screen | EN | AR | Page | Colours bound | Ticket |
|---|---|---|---|---|---|
| 01 Quantara · Shell | `1:538` | `1:616` | Quantara | 31/31 | POSD-95 |
| 02 Quantara · Tenants | `1:694` | `1:880` | Quantara | 134/134 | POSD-95 |
| 03 Quantara · Tenant overview | `1:1066` | `1:1281` | Quantara | 130/130 | POSD-95 |
| 04 Tenant HQ · Shell | `1:1496` | `1:1583` | Tenant HQ | — | POSD-95 |
| 05 Branch · Shell | `1:1670` | `1:1753` | Branch | — | POSD-95 |

**POSD-95 check (28 Sep):** done — Foundations, components, 3 shells, Tenants, Tenant overview in EN + AR, colours all bound. Missing — the **References** page named in the ticket; a **table header + row** component (only "Table cell" exists). Housekeeping — two Button components (Components page and Design System page), empty pages "Page 1" and "Grid System".

The PO agent updates nothing here; the designer or PO refreshes this table when screens are added.
