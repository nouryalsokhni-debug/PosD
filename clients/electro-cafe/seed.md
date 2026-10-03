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
| Currency · time zone | SYP · Asia/Damascus |
| Exchange rate (sample) | 13,000 SYP per USD, rounded to 500 |

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

Prototype till PINs: Hala 1111 · Samer 2222 · Maya (manager) 9999.

## Menu
Categories: Hot drinks · Cold drinks · Sweets · Snacks. Sub-categories of Hot drinks: Coffee, Tea.

| Item | Arabic | Category | Price (SYP) | Options |
|---|---|---|---|---|
| Espresso | إسبريسو | Hot › Coffee | 15,000 | Size, Sugar |
| Cappuccino | كابتشينو | Hot › Coffee | 20,000 | Size, Sugar, Milk |
| Latte | لاتيه | Hot › Coffee | 22,000 | Size, Sugar, Milk |
| Turkish coffee | قهوة تركية | Hot › Coffee | 12,000 | Sugar |
| Black tea | شاي أسود | Hot › Tea | 8,000 | Sugar |
| Iced coffee | قهوة مثلجة | Cold | 25,000 | Size, Sugar, Milk |
| Lemon mint | ليمون ونعناع | Cold | 18,000 | Size, Sugar |
| Water | مياه | Cold | 5,000 | — |
| Frappé | فرابيه | Cold | 28,000 | Size, Sugar |
| Brownie | براوني | Sweets | 16,000 | — |
| Cheesecake | تشيز كيك | Sweets | 30,000 | — |
| Croissant | كرواسان | Sweets | 14,000 | — |
| Cake slice | قطعة كيك | Sweets | 20,000 | — |
| Club sandwich | كلوب ساندويش | Snacks | 40,000 | — |
| Chips | شيبس | Snacks | 8,000 | — |

## Option groups (default prices)
| Group | Choices |
|---|---|
| Size (required) | Small +0 · Medium +4,000 · Large +7,000 |
| Sugar (required) | None · Light · Medium · Sweet — no price |
| Milk (required) | Full fat +0 · Oat +5,000 |

An item can set its own price for a choice (Module 1 handoff, `item_option`).

## For multi-branch tests
Use the sample tenants in `data.js` (e.g. Cedar Grill), not Electro Café.
