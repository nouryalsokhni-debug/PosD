---
title: Design Day 14 — Module 1 changes after the PO answers
status: living
owner: PO
last_updated: 2026-10-03
related: day-12-13.md, ../04-design/designer-questions.md, ../04-design/figma-map.md, ../05-architecture/module-01-platform-core.md
---

# Design Day 14 — plan

Days carry no calendar date; Day 14 follows Day 13 in the designer's sequence. Sprint 1 stays open.

## Check on 3 Oct — Figma vs the tickets
| Ticket | Done ✓ | Missing ✗ | Verdict |
|---|---|---|---|
| POSD-106 Day 12 | Library fixed: Arabic variants inside the sets, brand colours in the "Quantara · Layer" collection, new components (text input, select, checkbox, radio, tab, banner, dialog, meter, sync note, override tag), radius-xs · References page · Quantara shell restored · wallet-reference (03b) and offline (03c) payment states | **Sale and Payment at 1280 × 800 and 1366 × 768** — only the 1440 × 900 frames exist | nearly complete (1 gap) |
| POSD-107 Day 13 | Orders board, Kitchen, Invoices 07a–e, offline states 08a–d, power cut 09a–b, To print 10 — EN + AR at 1366 × 768 · "For the PO" note with 20 questions | — | complete |
| Jira (checked 3 Oct, after reconnecting) | POSD-103 Day 11 **Done** · POSD-106 Day 12 and POSD-107 Day 13 **In Review** — review comments posted on both | POSD-106 stays open for the two till sizes; POSD-107 has nothing missing | — |

> **Update 3 Oct (evening):** the till is an iPad. Item 1 changed from the desktop till sizes to iPad sizes; POSD-109 and POSD-106 are updated in Jira.

## Why Day 14
The PO answered the 26 Module 1 questions ([designer-questions](../04-design/designer-questions.md)) and the stack was accepted (ADR-001). Both change the Module 1 screens the backend starts from. The HTML is already updated: `prototype/index.html` → Tenant HQ → Branches and registers · People and roles · Menu setup; Quantara → Onboard a tenant.

## Ticket — POSD-109 (created 3 Oct)
**Day 14 — Platform Core: Apply the PO Answers (Branches, People, Menu)**
Sprint 1 · parent POSD-68 · assignee Mariam Kabbani · labels `design`, `module-1`. The text below is what was created.

**Context** — The answers to your Module 1 questions are beside each note in Figma ("PO answers") and in the HTML. Two things come from the technical decision: every branch has a **branch server**, and invoices have **one series per branch**.

**Design (Tenant HQ, 1440 wide, English and Arabic)**
1. **Till at iPad size (replaces the Day 12 till sizes):** the till is an iPad (D-37). Sale and Payment at **1180 × 820**, checked at 1080 × 810, landscape, touch only. Menu tabs are the three sections: To eat, To drink, Our beans. Prices in the new Syrian pound (for example Latte 220).
2. **Branches and registers (05, 05b)**
   - Invoice series per branch: `EC-MAZ-000001` — remove `-R1` everywhere.
   - Branch server block per branch: link to Quantara (Online / Offline / Not set up), last sync, waiting to sync, version, "Create setup code".
   - "12 sales waiting to sync" moves from the register to the branch server.
   - Branch actions: Edit (code field; locked state "this branch has invoices"), Pause / Resume, paused banner.
   - Register row actions: Rename, Retire; retired state.
   - Dialogs: Add / edit branch · Setup code · Retire register.
3. **People and roles (06a–c)**
   - People tab: Status (Invited / Active / Disabled), Back-office access (email or phone, "invite not accepted yet"), Till sign-in ("must change PIN"), Edit.
   - Sync note above the list: changes reach a branch at its next sync.
   - Add / edit a person: three groups — Person · Back-office access · Till sign-in. Card = 8 digits.
   - Dialogs: Temporary PIN (shown once) · Disable a person.
   - Sidebar: one entry "People and roles".
4. **Menu (07a–b)**
   - Item record: option prices for this item; image Add / Replace / Remove with the rule text; "Sold at: all / these branches".
   - Categories tab: Rename, Move up / down, Delete (blocked when not empty).
   - Options tab: Add / edit an option group.
5. **Quantara · Onboarding** (if time): tenant code, owner name + email, branch code, first invoice number on the review step.

**Done when**
- No `-R<n>` series is left on any screen
- Each of the three areas shows the new states in English and Arabic, built from the library components
- New questions go into a "For the PO" note

**Not in this task:** the other cashier screens at iPad size (next design day) · billing · reports.

## Backend in parallel
Sprint 2 starts Module 1 from the [handoff v2](../05-architecture/module-01-platform-core.md) — see [sprint-02](sprint-02.md).
