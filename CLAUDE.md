# CLAUDE.md — Quantara POS

Read this first. It tells you where the truth lives and the rules for changing it.

## What this is
- **Quantara** — a multi-tenant POS SaaS for restaurants & cafés (tenant → branch → register).
- **The till is an iPad** (D-37); ADR-002 (proposed) makes it a web app served by the branch server. Money is in the **new Syrian pound** (1 new = 100 old).
- **Three technical tiers** (ADR-001, accepted): till → **branch server** (one per branch; owns stock, orders, shifts, invoice numbers, printing) → cloud. Invoice series is per branch: `EC-MAIN-000001`.
- **First client / design partner:** Electro Café (Syria). Go-live target: **Tue 10 Nov 2026**.
- **Current phase:** design + HTML; backend starts Sun 4 Oct with Module 1 Platform core — ready since 3 Oct (see `docs/08-delivery/module-readiness.md`, handoff `docs/05-architecture/module-01-platform-core.md`).
- Built by Sankari Holding — Digital Transformation. PO owns this repo.

## Three product surfaces (never mix them up)
| Surface | Who uses it | Status |
|---|---|---|
| **Cashier app (POS)** + customer display + prep tickets | Cashier, barista | Design — first pass only (POSD-90, POSD-91) |
| **Tenant back office** (HQ + branch dashboard) | Owner, admin, branch manager, accountant | HTML prototype (POSD-85) |
| **Operator control panel** | Quantara staff: onboarding, support, ops, finance | HTML prototype (POSD-83) → Figma (POSD-95) |

## Source of truth — who wins
| Topic | Truth | Not truth |
|---|---|---|
| Plan, milestones, dates | `docs/00-master-plan.md` (mirror of the Google Doc) | chat, Jira descriptions |
| Who owns what (Quantara / HQ / branch) | `docs/01-product/ownership-boundaries.md` (D-25) | screens |
| What the product does | `docs/02-requirements/requirements.md` (IDs: GEN-01…) | `source/*.xlsx` (frozen v1) |
| Client values | `clients/electro-cafe/config.md` · sample seed data `clients/electro-cafe/seed.md` (the till and panel prototypes must match it) | requirements |
| Decisions | `docs/06-decisions/decision-log.md` (IDs: D-01…) | meeting memory |
| Designer's questions and the PO's answers | `docs/04-design/designer-questions.md` (also as "PO answers" notes in Figma) | chat |
| Step-by-step behaviour | `docs/03-flows/` | screens |
| Visuals of a screen | **Figma** once the screen is `figma-approved` in `docs/04-design/screen-registry.md` | HTML |
| Behaviour / flow exploration | **HTML prototype** in `prototype/` while screen is `html-draft` | Figma |
| Work status | **Jira** POSD (design, PO and backend — label `backend`) | this repo |
| Architecture | `docs/05-architecture/adr/` + module handoffs `docs/05-architecture/module-NN-*.md` | code comments |
| When the backend may start a module | `docs/08-delivery/module-readiness.md` | chat |
| What the project still lacks (gaps, owners, dates) | `docs/08-delivery/project-picture.md` → dashboard `prototype/requirements.html` | memory |
| Open questions and their answers | `docs/08-delivery/open-questions.md` → the same dashboard | chat |

If two sources disagree: follow the table, then **flag the conflict** to the PO — never silently pick one.

## Rules for Claude
1. **IDs, not copies.** Reference `GEN-01`, `D-04`, `SCR-POS-02`, `POSD-91`. Don't paste requirement text into other files.
2. **Product vs client.** Nothing Electro-specific in `docs/`. Client values → `clients/electro-cafe/`. Client differences are tenant **settings**, never custom code.
3. **Never decide scope or open decisions.** You may propose; the PO decides. Mark proposals `status: proposed`.
4. **Every doc has front-matter:** `title, status (draft|living|approved), owner, last_updated`. Update `last_updated` when you edit.
5. **Changing an approved doc** → add a line to `docs/08-delivery/changelog.md`.
6. **`source/` and `exports/` are read-only.** `source/` = frozen originals. `exports/` = generated for humans/clients.
7. **Bilingual.** UI copy is AR + EN; use terms from `docs/01-product/glossary.md` exactly. New term → add it there first.
8. **Offline-first and multi-tenant are non-negotiable** (GEN-01, OFF-01). Any design that assumes constant internet or a single tenant is wrong.
9. Keep files short (< ~400 lines), one topic per file, relative links.

## Map
```
docs/00-master-plan.md        plan, timeline, team, governance (mirror of Google Doc)
docs/01-product/              overview, glossary (EN/AR), roles, ownership boundaries (Quantara · HQ · branch)
docs/02-requirements/         requirements (master), out-of-scope
docs/03-flows/                business flows (sale, refund, shift, offline, back office)
docs/04-design/               screen registry, Figma↔HTML rules, design tokens
docs/05-architecture/         ADRs (adr/) and backend module handoffs (module-NN-*.md)
docs/06-decisions/            decision log (client/business decisions)
docs/07-research/             research conclusions (benchmarks etc.)
docs/08-delivery/             delivery plan, sprint plans, module readiness, project picture (gaps), risk register, changelog
docs/09-operating/            PO playbook, DoR/DoD, doc conventions, PO-agent spec
clients/electro-cafe/         config, meetings
prototype/                    HTML reference prototype (see its CLAUDE.md)
templates/                    ADR, screen spec, meeting note, feature brief
.claude/                      agents & commands (po-agent, daily-report…)
```

## Connected tools
- **Jira** site `sankari-holding.atlassian.net`, project **POSD** — design, PO and backend work (backend label `backend`, one epic per module, e.g. POSD-96).
- **Figma** — file "POS Product" (fileKey `oMDP77W6vVs5lD3GRZurFE`); page and frame IDs in `docs/04-design/figma-map.md`, links per screen in the screen registry.
- **Google Drive** — human folder "Quantara POS" (see `docs/09-operating/drive-structure.md`).
