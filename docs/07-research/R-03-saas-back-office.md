---
title: R-03 SaaS back office — Foodics & Square
status: approved
owner: PO
last_updated: 2026-09-28
jira: POSD-89
---

# R-03 SaaS back office — Foodics & Square

**Question:** How do established POS SaaS products onboard, package modules and structure the admin? · **Done:** 22 Sep 2026 · **Evidence:** Figma *POS Product* → *UX Analysis* page

## Why these two
- **Foodics** — largest restaurant SaaS in the region, Arabic by design; branches, devices, roles are first-class; base plan + add-on licences + app marketplace. The back office our subscribers will compare us to.
- **Square** — clearest self-service dashboard for a café owner with no IT; recently folded 18 subscriptions into 3 plans.

## Matrix (2 × 5)
| Metric | Foodics | Square |
|---|---|---|
| Sign-up → first sale | ~10–12 steps; may divert to sales call | ~10–12 steps; ID verification & bank linking first |
| Admin navigation clarity | 4/5 | 5/5 |
| Multi-branch | Chain-based | Catalogue-based |
| Packaging | Per device, yearly, by country; licences via sales; owner-only marketplace | Per location, monthly; self-service Plus/Premium with 30-day trial |
| Bilingual / RTL admin | Native Arabic; *local name* field on every entity | None |

## Adopt
- **Name + localised name on every entity** — bilingual in the data model, not a translation layer. → GEN-03, ADR-001
- **One permissions model** for dashboard and cashier app, explained on hover. → USR-01, USR-02
- **One catalogue with per-branch overrides.** → CAT-01, ownership boundaries

## Avoid
- A third login field (account number).
- Menu sections that vanish without permission — show them **locked** instead.
- Settings that save in conflict without warning.

## Questions it raised → decision log
- Plan change: self-service or through us? → **D-30**
- Inventory behind a paid tier? → **D-30**
- POS *mode* (quick / full service / bar) chosen on the device? → **D-30**
