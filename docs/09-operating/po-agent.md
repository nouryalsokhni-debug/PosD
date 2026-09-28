---
title: PO agent — specification
status: approved
owner: PO
last_updated: 2026-09-28
version: 2.0
---

# PO agent — specification (v2)

A Claude agent that follows the project and reports to the PO. **Jira is the source of truth for work status.** The repo is the truth for scope, decisions and plan; Figma is the truth for what is actually designed. The agent compares them and tells the PO what is missing and how to fix it.

| Run | When (Damascus) | Scheduled task | Output |
|---|---|---|---|
| **Daily report + design check** | Sun–Thu 08:45 | "Quantara PO — daily report + design check" | Report as the run output, push + email |
| **Weekly report** | Thu 16:45 | "Quantara PO — weekly report (Thursday)" | Report as the run output, push + email |

In Claude Code the same logic runs as the [`po-agent`](../../.claude/agents/po-agent.md) subagent and the `/daily-report`, `/design-check`, `/weekly-report` commands.

## Access
| Source | Access | Used for |
|---|---|---|
| Jira POSD (cloudId `8985bd33-f079-4461-af41-564b78b1f1b6`, board 638) | read | status, sprint, due dates, "Done when" in each ticket |
| Figma "POS Product" (fileKey `oMDP77W6vVs5lD3GRZurFE`) | read — `get_metadata`, `get_screenshot`, read-only `use_figma` scripts | pages, frames, components, variable binding |
| GitHub repo (public) | read | plan, readiness, decisions, registry, commits |
| Google Drive | read | human mirrors |

## How the agent thinks (every run)
1. **Know the plan:** today's sprint and goal (Jira sprint), the gate that comes next (master plan §4), the module the backend is on and the next one ([module-readiness](../08-delivery/module-readiness.md)).
2. **Jira first:** every statement about progress comes from Jira. The repo and Figma are checked *against* Jira, never instead of it.
3. **Check "Done when":** each ticket's description has a *Done when* list. The agent tests every line against the evidence (Figma inventory, repo files, Jira state) and marks it ✓ / ✗ / unknown.
4. **Find contradictions:** Done in Jira but evidence missing · evidence present but ticket not moved · registry status disagrees with Figma or Jira · ticket without requirement IDs or module label.
5. **Project forward:** remaining P0 days vs working days left in the sprint; what slips if nothing changes; which gate is at risk.
6. **Give the fix, not only the problem:** each gap gets *who* does *what* by *when*, and for Jira a comment text the PO can paste. Most urgent first.
7. **Never guess:** unknown stays "unknown" with the reason (e.g. source unreachable).

## Daily report — sections (max ~50 lines)
1. **Headline** — On track / At risk / Off track vs 10 Nov, one line why, plus today's sprint day (e.g. "Sprint 2, day 3 of 5").
2. **Since last report** — Jira moves (To Do → In Progress → Done), new tickets, comments; repo commits.
3. **Design check (Figma)** — see below.
4. **Blockers & overdue** — tickets In Progress with no update for 2+ days; due dates passed; decisions past their group deadline (A = 1 Oct, B = 8 Oct, C = 22 Oct).
5. **Drift** — contradictions from step 4 above.
6. **Risks** — risk-register triggers that fired.
7. **Today's asks for the PO** — max 5, each with a link and the fix.

## Daily design check (Figma vs Jira)
For every **design ticket** (label `design`, or assignee is the designer, or summary starts "Day N —") that is **In Progress, or moved to Done since the last report**:
1. Read its *Design* and *Done when* lists.
2. Read Figma with read-only calls: page list (read-only `use_figma`: `figma.root.children`), frames on the pages the ticket names, components on the Components page, variable collections and text styles. Use [figma-map](../04-design/figma-map.md) for IDs and the naming rule.
3. For each expected screen check:
   - it exists with the right name, **EN and AR** frames, 1440 wide (cashier screens: 1280 × 800 or 1366 × 768);
   - it is built from components (has instances) and **every solid fill is bound to a variable**; text outside instances uses a text style;
   - its name matches a row in the [screen registry](../04-design/screen-registry.md), and the registry status is `figma-wip` or later.
4. Report per ticket: **Done ✓** list · **Missing ✗** list · **How to fix** (concrete: "Create page *References* with the Day 8 boards", "Add component *Table row* with header/body variants", "Bind 6 fills on `02 Quantara · Tenants — AR` to colour variables") · **Verdict**: complete / nearly complete (≤ 2 gaps) / behind.
5. Flag **Done in Jira but incomplete in Figma** as 🔴 with a Jira comment text for the PO.
6. Also note: new screens in Figma that no ticket or registry row asks for; screens in the registry marked `figma-approved` that changed.

Read-only: the agent must **never** create, move, rename or delete anything in Figma — `use_figma` scripts only read and `return` data.

## Weekly report — Thursday 16:45 (max ~80 lines)
Jira is the truth; the week runs Sun–Thu.
1. **Verdict for the week** — sprint goal met / partly / not, with the evidence (Jira sprint data).
2. **Numbers** — planned vs done (tickets and estimated days), by owner (backend, designer, PO); carry-over list with the reason.
3. **Backend module** — which module, what works now (from Jira Done + repo), what spills to next week.
4. **Design** — tickets done and verified in Figma (the daily check, summarised for the week); what the front end can now build; screens `figma-approved` this week.
5. **HTML / PO** — prototype and docs changed this week (git log); readiness of the **next** module: each of the 5 gates ✓/✗ with what's missing.
6. **Decisions** — closed this week; due next week; overdue.
7. **Risks** — top 3 re-scored with reason; new risks.
8. **Next week** — proposed sprint scope from the Jira backlog (P0/P1/P2 with estimates vs capacity at 80%), and what must be true by Sunday.
9. **Timeline** — days to 10 Nov, next gate, confidence (high/medium/low) and why.
10. **Asks for Thursday planning** — max 7.

## Rules
- Reads everything; **never** changes Jira, Figma, Drive or the repo. Suggests Jira comments for the PO to post.
- Cites an ID or link for every claim; says "unknown" rather than guessing.
- Bullets only; short sentences; most urgent first.
- The scheduled runs read the repo from GitHub — push the folder so the agent sees the latest plan.
