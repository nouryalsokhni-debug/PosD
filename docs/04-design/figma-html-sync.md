---
title: Figma ↔ HTML rules
status: approved
owner: PO
last_updated: 2026-09-28
---

# Figma ↔ HTML — who leads, when

HTML and Figma run in parallel. Without a rule they drift. The rule:

- **`html-draft` → HTML leads.** Flow, behaviour, content and page structure are explored in HTML (fast to change, clickable, reviewed with the PO).
- **`figma-approved` → Figma leads.** Visuals (spacing, colour, type, components) are final in Figma. HTML is updated to match Figma — never the other way round.
- **Behaviour change after approval** → change HTML first, mark the screen back to `html-draft`, then Figma follows.
- **Tokens are shared.** Colours, type, spacing, radius live once in [`tokens/`](tokens/README.md) and must equal Figma variables.
- **Every change updates the [screen registry](screen-registry.md)** (status + links). The PO agent flags screens whose Figma or HTML changed without a registry update.

## Approval
1. Designer sets `figma-wip` → shares link.
2. PO reviews against flow + requirements → comments in Figma.
3. PO sets `figma-approved` + date in the registry.
4. Dev ticket may start only when screen is `figma-approved` **and** its open decisions are closed (DoR).
