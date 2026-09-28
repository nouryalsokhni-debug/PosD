---
title: Doc conventions
status: approved
owner: PO
last_updated: 2026-09-28
---

# Doc conventions

- **Markdown only** in `docs/`. Binary files only in `source/` (frozen) and `exports/` (generated).
- **Front-matter** on every file: `title`, `status` (draft · living · proposed · approved), `owner`, `last_updated`.
- **IDs:** requirements `GEN-01` · decisions `D-01` · flows `FLOW-01` · screens `SCR-POS-01 / SCR-HQ-01 / SCR-OPS-01` · ADRs `ADR-001` · risks `R-01` · Jira `POSD-91`.
- **Reference, don't copy.** Link to the ID; never paste requirement text elsewhere.
- **One topic per file**, < ~400 lines, relative links.
- **Names:** `kebab-case.md`; flows/ADRs start with their ID.
- **Language:** docs in English; UI copy AR + EN from the glossary. Client-facing exports in Arabic.
- **Commits:** `docs(area): what changed [IDs]` — e.g. `docs(decisions): close D-03 tax rate [D-03, PRC-09]`.
- **Google Doc mirrors** (master plan, open decisions): humans edit in Drive; PO copies each approved version here and bumps `version`.
