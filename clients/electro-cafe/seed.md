---
title: Electro Café — seed data (sample)
status: living
owner: PO
last_updated: 2026-10-03
related: config.md, ../../docs/05-architecture/module-01-platform-core.md, ../../prototype/js/data.js, ../../prototype/js/pos-data.js
---

# Electro Café — seed data

**One set**, used by the back-office prototype (`prototype/js/data.js`, `data-ops.js`), the till prototype (`pos-data.js`) and the backend's first seed. A test (`m1.py`) checks that the till and the back office match.

**These are sample values**, not the client's real menu or staff. The real menu, prices and staff list replace them when the owner sends them (gap G-22).

## Tenant
| Field | Value |
|---|---|
| Name | Electro Café · إلكترو كافيه |
| Tenant code (invoice prefix) | `EC` |
| Plan | Growth (5 branches, 15 registers) |
| Currency · time zone | SYP (new Syrian pound: 1 new = 100 old, since 1 Jan 2026) · Asia/Damascus |
| Exchange rate (sample) | 130 SYP per USD |
| Rounding | Nearest 5 SYP (head-office setting) |
| Sales tax | Off. Each business sets its own at head office (D-03) |

## Branch, branch server, registers
| Branch | Code | City | Status | Branch server | Registers | Invoice series |
|---|---|---|---|---|---|---|
| Main branch · الفرع الرئيسي | `MAIN` | Damascus | active | enrolled, online | Register 1, Register 2 | `EC-MAIN-000001` … |

## People
| Name | Role | Works at | Status | Back-office access | Till sign-in |
|---|---|---|---|---|---|
| Jad · جاد | Owner | Head office | active | email | — |
| [HQ manager] | HQ manager | Head office | active | email | — |
| [Accountant] | Accountant | Head office | invited | email | — |
| Maya · مايا | Branch manager | Main branch | active | phone | card or PIN (card `4002 1877`) |
| Hala · هلا | Cashier | Main branch | active | — | PIN |
| Samer · سامر | Cashier | Main branch | active | — | PIN (must change) |
| [Barista] | Barista | Main branch | disabled | — | PIN |

All till roles (branch manager, cashier, barista) may sell (D-38).

Prototype till PINs: Hala 1111 · Samer 2222 · Maya (manager) 9999.

## Menu
Three sections (D-38), with sub-categories under them. Every staff member can sell from all three.

| Section | Sub-categories | Station |
|---|---|---|
| To drink · للشرب | Hot drinks, Cold drinks | Drinks bar |
| To eat · للأكل | Sweets, Snacks, Soups | Food counter |
| Our beans · بنّنا | — | none (packed; no ticket) |

| Item | Arabic | Section › sub-category | Price (SYP) | Options |
|---|---|---|---|---|
| Espresso | إسبريسو | To drink › Hot | 150 | Size, Sugar |
| Cappuccino | كابتشينو | To drink › Hot | 200 | Size, Sugar, Milk |
| Latte | لاتيه | To drink › Hot | 220 | Size, Sugar, Milk |
| Turkish coffee | قهوة تركية | To drink › Hot | 120 | Sugar |
| Black tea | شاي أسود | To drink › Hot | 80 | Sugar |
| Iced coffee | قهوة مثلجة | To drink › Cold | 250 | Size, Sugar, Milk |
| Lemon mint | ليمون ونعناع | To drink › Cold | 180 | Size, Sugar |
| Water | مياه | To drink › Cold | 50 | — |
| Frappé | فرابيه | To drink › Cold | 280 | Size, Sugar |
| Brownie | براوني | To eat › Sweets | 160 | — |
| Cheesecake | تشيز كيك | To eat › Sweets | 300 | — |
| Croissant | كرواسان | To eat › Sweets | 140 | — |
| Cake slice | قطعة كيك | To eat › Sweets | 200 | — |
| Club sandwich | كلوب ساندويش | To eat › Snacks | 400 | — |
| Chips | شيبس | To eat › Snacks | 80 | — |
| Lentil soup | شوربة عدس | To eat › Soups | 180 | — |
| House blend beans 250 g | بنّ الخلطة الخاصة 250 غ | Our beans | 1,200 | — |
| Espresso roast beans 250 g | بنّ إسبريسو 250 غ | Our beans | 1,350 | — |

## Option groups (default prices)
| Group | Choices |
|---|---|
| Size (required) | Small +0 · Medium +40 · Large +70 |
| Sugar (required) | None · Light · Medium · Sweet — no price |
| Milk (required) | Full fat +0 · Oat +50 |

An item can set its own price for a choice (Module 1 handoff, `item_option`).

## Other sample values
Opening float 2,000 SYP · allowed variance 50 SYP · staff meal limit 300 SYP a day · warn after 4 hours offline · keep selling up to 7 days offline.

## For multi-branch tests
Use the sample tenants in `data.js` (e.g. Cedar Grill), not Electro Café.
