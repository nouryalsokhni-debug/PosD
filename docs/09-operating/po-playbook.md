---
title: PO playbook — what, when, how
status: living
owner: PO
last_updated: 2026-09-28
---

# PO playbook — what, when, how

## Daily (Sun–Thu)
| When | What | How |
|---|---|---|
| 09:00 | Read the PO-agent daily report | Drive / email; act on 🔴 items first |
| 09:15 | Stand-up (15 min) | Yesterday / today / blockers — blockers become Jira tickets or decisions |
| Morning | Move Jira; answer designer & dev questions | Answers that change behaviour → update the flow/requirement, not only chat |
| During day | Review screens set to `figma-wip` | Comment in Figma; approve → set `figma-approved` in registry |
| End of day | Capture new terms, decisions, risks | glossary · decision log · risk register |

## Weekly
| Day | What | Output |
|---|---|---|
| Sun | Sprint start | Sprint goal in Jira; only DoR-ready tickets enter |
| Tue | Client check-in (30 min) | Decisions closed → decision log + config updated; meeting note in `clients/electro-cafe/meetings/` |
| Wed | Design review for next sprint | Screens for next sprint `figma-approved` |
| Thu | Sprint review + planning, risk review, **module readiness** | Demo, changelog line, risks re-scored, master plan updated if dates move; next module's row in `08-delivery/module-readiness.md` all ✓ or escalated; next `sprint-NN.md` written |

## Per feature
1. **Flow** exists in `docs/03-flows/` with requirement IDs.
2. **HTML draft** → PO walk-through → `html-draft` in registry.
3. **Figma** → review → `figma-approved`.
4. **Decisions** affecting it are `decided`.
5. **Module handoff** (`docs/05-architecture/module-NN-*.md`) written and read by the backend developer; the module passes the [readiness gate](../08-delivery/module-readiness.md).
6. **Jira dev ticket** (label `backend`, module epic): requirement IDs + handoff section + HTML route + acceptance criteria.
7. **Done** = DoD met, docs updated, changelog line if scope changed.

## Per client meeting
Before: agenda = open decisions due soonest. After (same day): meeting note · decision log · config · Google Doc mirror · regenerate client export if the spec changed.

## Definition of Ready (dev ticket)
- [ ] Requirement IDs linked, acceptance criteria written
- [ ] Flow documented
- [ ] Screen `figma-approved` (UI tickets) · backend tickets: module handoff reviewed instead
- [ ] Related decisions `decided`
- [ ] Nov-10 column = IN

## Definition of Done
- [ ] Acceptance criteria pass, **online and offline**
- [ ] Works in Arabic (RTL) and English
- [ ] Tenant-scoped (no data leaks between tenants)
- [ ] Sensitive actions logged with employee name
- [ ] Docs updated (flow/requirement/registry) · changelog if scope changed

## Change control (after G1, Thu 1 Oct)
New request → decision-log entry → name what moves out → PO approves → client informed if it changes the client spec.

## RACI
| Doc | Writes | Approves | Informed |
|---|---|---|---|
| Master plan | PO | Management | Team, client (summary) |
| Requirements & scope cut | PO | PO + client owner | Team |
| Decision log | PO | Client owner / accountant | Team |
| Flows | PO | PO | Design, dev |
| Screen registry & Figma | Designer | PO | Dev |
| ADRs | Tech lead | Tech lead + PO | Team |
| Risk register | PO | — | Management |
| UAT plan | QA | Client | Team |
