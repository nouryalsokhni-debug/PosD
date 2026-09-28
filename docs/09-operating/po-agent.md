---
title: PO agent — specification
status: proposed
owner: PO
last_updated: 2026-09-28
---

# PO agent — specification

A Claude agent that follows the project every workday and reports to the PO. Definition for Claude Code: [`.claude/agents/po-agent.md`](../../.claude/agents/po-agent.md). Daily run: scheduled task in Claude (Cowork) using the `/daily-report` command.

## Schedule
Sun–Thu, 08:45 Damascus time → report ready before the 09:00 read.

## Access
| Source | Access | Used for |
|---|---|---|
| Jira (POSD + dev project) | read · comment | status changes, blockers, overdue tickets |
| Figma | read | files/frames changed, comments waiting |
| GitHub repo | read · write only `reports/` | commits, docs changed, registry & decision log |
| Google Drive | read (write when connector allows) | master plan & decisions mirrors |

## Daily report — sections
1. **Headline** — on track / at risk / off track vs 10 Nov, one line why.
2. **Yesterday** — Jira moved to Done / In Progress; commits; Figma changes.
3. **Blockers & overdue** — tickets stuck > 2 days, decisions past due (from decision log).
4. **Drift** — screen changed in Figma or HTML without registry update; Jira ticket without requirement ID; doc and Jira disagree.
5. **Risks** — risk-register triggers that fired.
6. **Today's asks for the PO** — max 5, each with a link.

## Rules
- Reads everything; **never** changes scope, requirements, decisions or ticket status.
- Writes only: its report (`reports/YYYY-MM-DD.md`), Jira comments tagged `[PO-agent]`.
- Always cites IDs and links; says "unknown" rather than guessing.
