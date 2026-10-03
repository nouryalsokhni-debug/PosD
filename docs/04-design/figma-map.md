---
title: Figma map — POS Product file
status: living
owner: Designer + PO
last_updated: 2026-10-03
related: screen-registry.md, figma-html-sync.md, ../09-operating/po-agent.md
---

# Figma map — "POS Product"

**File:** https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product · **fileKey:** `oMDP77W6vVs5lD3GRZurFE`
**Link to a frame:** `https://www.figma.com/design/oMDP77W6vVs5lD3GRZurFE/POS-Product?node-id=<id with - instead of :>`

## Pages (node IDs) — checked 3 Oct 2026
| Page | ID | Holds |
|---|---|---|
| References | `162:7304` | Day 8 reference boards (restored on Day 12) |
| Foundations | `1:348` | Colour and type specimen (frame `1:349`) |
| Components | `1:87` | `Quantara · Components` (`53:954`) and `Cashier · Components` (`121:26`) |
| Quantara | `1:535` | Quantara-layer screens (EN + AR) |
| Tenant HQ | `1:536` | Tenant HQ screens + "For the PO" notes |
| Branch | `1:537` | Branch screens |
| Cashier | `120:2` | Till screens + "For the PO" notes |

Removed since 28 Sep: Page 1, Prototype · POSD-93, Design System, Grid System.

A Figma MCP page list (`get_metadata` without a node) may show only "Page 1". To list pages, run a read-only `use_figma` script: `return figma.root.children.map(p => ({id: p.id, name: p.name}))`.

## Naming rule (screens)
`NN Layer · Screen — EN` and `NN Layer · Screen — AR`, 1440 × 900, one per language, on the page of its layer. Example: `02 Quantara · Tenants — EN`. The agent matches screens to the [screen registry](screen-registry.md) by this name.

## Variables and styles
- Collections: `Quantara · Layer` (brand, brand-soft — one value per layer: Quantara · Tenant HQ · Branch) · `Quantara · Color` (29, Light + Dark) · `Quantara · Spacing` (10) · `Quantara · Radius` (4) · `Quantara · Size` (16)
- Text styles: `Quantara/English/*` (10) · `Quantara/Arabic/*` (9)
- Rule: every solid fill bound to a colour variable; every text layer outside a component instance uses a text style.

## Inventory — 3 Oct 2026
All frames below: every solid fill bound to a colour variable. "Text styled" counts text layers with a text style (the rest sit inside component instances or are unstyled).

| Screen | EN | AR | Page | Size | Ticket |
|---|---|---|---|---|---|
| 02 Quantara › Tenants | `53:2031` | `53:2311` | Quantara | 1440×900 | POSD-95 |
| 03 Quantara › Tenant overview | `53:2591` | `53:2914` | Quantara | 1440×900 | POSD-95 |
| 01 Quantara · Shell | `162:3602` | `162:3791` | Quantara | 1440×900 (restored on Day 12) | POSD-95 |
| 04 Tenant HQ · Shell | `53:3237` | `53:3413` | Tenant HQ | 1440×900 | POSD-95 |
| 05 Branch · Shell | `53:3589` | `53:3751` | Branch | 1440×900 | POSD-95 |
| 05 Tenant HQ › Branches and registers | `109:206` | `109:560` | Tenant HQ | 1440×1332 | POSD-102 |
| 05b Branches · Plan-limit banner | `110:528` | `110:549` | Tenant HQ | 1184×288 | POSD-102 |
| 06a People and roles · People | `110:570` | `110:915` | Tenant HQ | 1440×935 | POSD-102 |
| 06b People and roles · Roles and permissions | `111:1166` | `111:1762` | Tenant HQ | 1440×1685 | POSD-102 |
| 06c People and roles · Add a person | `110:1261` | `110:1531` | Tenant HQ | 1440×935 | POSD-102 |
| 07a Menu setup · Items | `112:1384` | `112:1750` | Tenant HQ | 1440×1060 | POSD-102 |
| 07b Menu setup · Item record (Latte) | `113:1674` | `113:1988` | Tenant HQ | 1440×1271 | POSD-102 |
| Till · 01 Sale | `124:2` | `124:680` | Cashier | 1440×900 (ticket: 1280×800 + 1366×768) | POSD-103 |
| Till · 02 Options sheet | `124:326` | `124:1004` | Cashier | 1440×900 | POSD-103 |
| Till · 03 Payment | `126:932` | `126:1280` | Cashier | 1440×900 | POSD-103 |
| Till · 03b Payment · wallet reference, 03c Payment · offline | on page | on page | Cashier | 1440×900 | POSD-106 |
| Till · 04 Paid | `126:1169` | `126:1517` | Cashier | 1440×900 | POSD-103 |

| Till · Orders board, Kitchen, Invoices 07a–e | on page | on page | Cashier | 1366×768 | POSD-107 |
| Till · 08a–d offline states, 09a–b power cut, 10 To print | on page | on page | Cashier | 1366×768 | POSD-107 |

Cashier page: 44 frames (12 at 1440×900, 28 at 1366×768). **Still missing:** Sale and Payment at 1280×800 and 1366×768 (POSD-106).

**Module 1 screens are behind the rules** since 3 Oct (series per branch, branch server, person status, back-office access, item option prices) — see [Day 14](../08-delivery/day-14.md) (POSD-109).

**Notes in the file**
| Note | Designer's questions | PO answers (3 Oct) |
|---|---|---|
| Branches and registers | `114:1888` (7) | `196:3110` |
| People and roles | `114:1898` (9) | `196:3122` |
| Menu | `114:1910` (10) | `196:3135` |
| Cashier sale and payment | `127:2568` (14) | `196:9992` |
| Cashier part 2 (Day 13) | `181:8174` (20) | `196:10009` |

"For design" notes: library gaps `114:1923` (fixed on Day 12), cashier components `127:2585`. The answers are also in [designer-questions](designer-questions.md).

**Components:** Quantara set (Button, Badge, Owner tag, Sidebar item, Top bar, Scope bar, Table cell (header + row), Decision tag, icons Bold/Outline; since Day 12: Checkbox, Radio, Tab, Sync note, Override tag, Meter, Text input, Select, Banner, Dialog, with Lang=AR variants) and Cashier set (Till / Banner, Top bar, Category tab, Segmented, Item tile, Order line, Choice, Key, Payment method, Sum row). Known gaps: Arabic variants detached; IBM Plex Sans Arabic not installed; "brand" variables outside local collections; no input, select, checkbox, radio, tabs, banner, dialog, meter components (designer's own list → Day 12).

The PO agent updates nothing here; the designer or PO refreshes this table when screens are added.
