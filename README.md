# Quantara POS — project hub

Multi-tenant POS SaaS for restaurants & cafés. First client: **Electro Café**. Go-live: **Tue 10 Nov 2026**.

This repo is the **single source of truth** for the product. People and Claude read the same files.

## Start here
| If you are… | Read |
|---|---|
| New to the project | [Master plan](docs/00-master-plan.md) → [Product overview](docs/01-product/overview.md) → [Glossary](docs/01-product/glossary.md) |
| Designer | [Screen registry](docs/04-design/screen-registry.md) → [Figma ↔ HTML rules](docs/04-design/figma-html-sync.md) → [Flows](docs/03-flows/README.md) |
| Developer | [Requirements](docs/02-requirements/requirements.md) → [Flows](docs/03-flows/README.md) → [ADRs](docs/05-architecture/adr/) |
| Client-facing / PO | [Decision log](docs/06-decisions/decision-log.md) → [Electro Café config](clients/electro-cafe/config.md) → [PO playbook](docs/09-operating/po-playbook.md) |
| Claude | [CLAUDE.md](CLAUDE.md) |

## Where things live
| Place | For | Holds |
|---|---|---|
| **This repo** | Everyone + Claude | All product docs (Markdown) |
| **Google Drive — "Quantara POS"** | People, client | Master plan (editable Google Doc), open decisions, contracts, recordings, client exports |
| **Jira — POSD** | Work tracking | Design tasks & stories. Dev project: TBD |
| **Figma** | Visual design | Screens, components (links in the screen registry) |

## Status (28 Sep 2026)
- ✅ Research & HTML prototypes (POSD-69, 83, 85, 89, 90, 92, 94)
- 🔄 Figma: control panel (POSD-95), cashier's day (POSD-91)
- 🔄 Planning gate: scope cut, open decisions group A, ADR-001 — due **Thu 1 Oct**
- ⏳ Development starts **Sun 4 Oct**

## Conventions
IDs everywhere (`GEN-01`, `D-04`, `SCR-POS-02`, `ADR-001`, `POSD-91`) · front-matter on every doc · see [doc conventions](docs/09-operating/doc-conventions.md).
