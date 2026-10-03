---
title: Project picture — what's missing
status: living
owner: PO
last_updated: 2026-10-03
last_analysis: 2026-10-03
related: ../../prototype/requirements.html, module-readiness.md, sprint-01.md, risk-register.md
---

# Project picture — what's missing

One page that says what the project still lacks to have a clear, full picture for 10 Nov. **Update it at every analysis session**, then run `python prototype/tools/build-coverage.py` — the dashboard `prototype/requirements.html` (tab *Project picture*) reads the tables below, and the questions in [open-questions](open-questions.md). Keep the table columns as they are.

## Area health
Health: `green` = nothing blocks · `amber` = gaps with a plan · `red` = gaps that block a gate or a module.

| Area | Health | Summary |
|---|---|---|
| Plan & scope | red | Client decided: everything on the launch list must work on opening day (D-21). No cut — the build order and capacity are now the main risk |
| Decisions | amber | 9 client and management decisions closed on 3 Oct (scope, ownership, tax, rounding, mixed payment, refunds, stations, offline, invoice numbers). Still open: stock level, card and wallet refunds, card payment, staff meals |
| Team | amber | Backend developer chosen and invited (name to record). The till app is built by Quantara, but no front-end developer is named; no QA; client technical contact unknown |
| Architecture | amber | Stack accepted (ADR-001). The till is an iPad, so the till technology changes: ADR-002 proposed (web app on iPad, whole-branch offline, head office offline) — tech lead to accept. Hosting and non-functional requirements open |
| HTML prototype | green | All 111 requirements shown; Module 1 corrected; the client's answers applied (three sections, two stations, new Syrian pound, tax as a head-office setting). Cashier logic fixes for Module 2 listed |
| Design (Figma) | amber | Library fixed, cashier part 1–2 drawn — but at desktop sizes; the till is an iPad, so till screens need iPad sizes. Module 1 screens need the Day 14 changes; 0 screens approved |
| Backend | amber | Module 1 passes all 5 gates and its Jira tickets match the handoff v2 (POSD-97…100, 108); developer not named; Modules 2–5 have no handoff |
| Testing | red | No test strategy, UAT plan or test cases (offline, sync, printing are the riskiest) |
| Go-live & operations | red | Hardware changes with the answers: iPads, branch server, network and UPS — models and counts not chosen; no install, data-load, training or support plan |
| Commercial | green | Quantara owns the software; Electro Café is the first subscriber (D-22). Pricing (D-32) proposed — not needed for 10 Nov |

## Module gates
Each module passes 5 gates before the backend starts it ([module-readiness](module-readiness.md)). Values: `yes` · `no` · `part`.

| Module | Backend sprint | HTML | Flows | Handoff | Decisions | Stack |
|---|---|---|---|---|---|---|
| M1 Platform core | Sprint 2 · 4–8 Oct | yes | yes | yes | yes | yes |
| M2 Sale | Sprint 3 · 11–15 Oct | part | yes | no | part | part |
| M3 Shift & money | Sprint 4 · 18–22 Oct | part | yes | no | part | part |
| M4 Back office | Sprint 5 · 25–29 Oct | yes | part | no | part | yes |
| M5 Quantara minimum | Sprint 5 · 25–29 Oct | yes | part | no | yes | yes |

## Build process
Where each module stands from specification to live. Values: `done` · `doing` · `todo`. *Front end* = the back-office screens for M1, M4, M5 and the iPad till app for M2, M3.

| Module | Specification | Design | Backend | Front end | Tested | Live |
|---|---|---|---|---|---|---|
| M1 Platform core | done | doing | todo | todo | todo | todo |
| M2 Sale | doing | doing | todo | todo | todo | todo |
| M3 Shift & money | doing | doing | todo | todo | todo | todo |
| M4 Back office | doing | todo | todo | todo | todo | todo |
| M5 Quantara minimum | doing | doing | todo | todo | todo | todo |

## Gaps
Status: `open` · `doing` · `done`. Due = the date it stops being fine. Blocks = what waits for it.

| ID | Area | Gap | Fix | Owner | Due | Status | Blocks |
|---|---|---|---|---|---|---|---|
| G-01 | Architecture | Stack not accepted — ADR-001 | Accepted 3 Oct from the tech lead's recommendation (D-35); POSD-104 stays open only for the developer's review | Tech lead + PO | 2026-10-01 | done | — |
| G-02 | Team | Backend developer chosen and invited; the name is not recorded and the tickets are unassigned | PO records the name, assigns POSD-97…100 and 108; developer reads the handoff v2.1 (POSD-104) | PO | 2026-10-04 | doing | M1 |
| G-03 | Decisions | Group A client decisions: 3 closed on 3 Oct (D-14, D-21, D-22). Still open: D-01 stock level, D-08 branches in 2 years, D-20 technical contact, D-24 warehouse; D-09 and D-15 proposed | Next client check-in | PO + client owner | 2026-10-08 | doing | M4 |
| G-04 | Plan & scope | Everything on the launch list must work on opening day (D-21) — 105 launch items, one backend developer, no till developer yet | Agree the build order with the client (Q-29); ask management for more hands; weekly burn-up check | PO + management | 2026-10-08 | open | G2 feature complete |
| G-05 | Plan & scope | PRC-11 is an empty row carried from the client spec | Ask the client what it was, or delete it | PO | 2026-10-01 | open | — |
| G-06 | Commercial | IP ownership | Decided 3 Oct: Quantara owns the software (D-22); the signed paper is handled outside this plan | Management | 2026-10-01 | done | — |
| G-07 | Team | Client technical contact unknown (D-20) | Owner names one person for site, hardware and UAT | Client owner | 2026-10-01 | open | Hardware, UAT |
| G-08 | Design (Figma) | References page and Quantara shell were missing | Restored on Day 12 (checked 3 Oct) | Designer | 2026-10-04 | done | — |
| G-09 | Architecture | No non-functional requirements: security (auth, PIN hashing, tenant isolation tests), backups & restore, performance (sale time), availability, data retention, supported devices | PO + tech lead write `docs/02-requirements/non-functional.md` | PO + tech lead | 2026-10-08 | open | M2 |
| G-10 | Architecture | ADR-001 #2–#5: where the till runs, local storage, sync model, registers offline together | Decided in ADR-001 (Electron till, branch server, event log) | Tech lead | 2026-10-08 | done | — |
| G-11 | Backend | Module 2 (Sale) handoff doc missing | PO writes `module-02-sale.md` (POSD-105) | PO | 2026-10-08 | open | M2 |
| G-12 | Decisions | Decisions for the Sale module: D-10, D-11, D-14, D-03, D-05 closed on 3 Oct. Left: card payment and change in USD (D-29), card and wallet refunds (D-40) | PO + tech lead settle D-29 as "card recorded only"; client answers D-40 | PO + client owner | 2026-10-08 | doing | M2 |
| G-13 | Team | The till app is built by Quantara for iPad (D-37), but no front-end developer is named | Management names the developer; start no later than Sprint 3 (Q-25) | Management | 2026-10-08 | open | The till app |
| G-14 | Team | No QA | Management names QA (can be part-time) from Sprint 3 | Management | 2026-10-08 | open | Testing |
| G-15 | Testing | No test strategy, UAT plan or test cases; offline, sync and printing need real-outage tests | QA + PO write `docs/08-delivery/test-plan.md` and UAT script | QA + PO | 2026-10-15 | open | G3 UAT |
| G-16 | Design (Figma) | Till screens are drawn at 1440×900 and 1366×768; the till is an iPad (D-37) | Redraw Sale and Payment at 1180×820 first, check at 1080×810; then the Day 13 screens ([Day 14](day-14.md) — POSD-109) | Designer | 2026-10-08 | open | The till app |
| G-17 | Go-live & operations | Hardware not chosen or ordered: iPads (model, count), branch server, access point, switch, printers, UPS (hours), scanner | Client picks the iPad model and count (Q-24) and the UPS hours (Q-31); PO writes the list; order by 15 Oct | Client + PO | 2026-10-15 | open | Install |
| G-18 | Architecture | Printing decided (ESC/POS from the branch server, drawer through the printer); not yet proven on the chosen printer | Tech lead spikes on the chosen printer | Tech lead | 2026-10-15 | doing | M3 |
| G-19 | Backend | Module 3 handoff missing; step 2 E–F (mixed payment, shift close) not yet in HTML | PO: HTML E–F + `module-03-shift-money.md` | PO | 2026-10-15 | open | M3 |
| G-20 | Design (Figma) | Module 1 HQ screens and cashier part 1–2 drawn; other HQ and branch screens not started; 0 screens `figma-approved` | PO approves Module 1 screens after Day 14; designer continues back-office essentials | Designer + PO | 2026-10-22 | doing | Front end |
| G-21 | Backend | Module 4 and 5 handoffs missing; D-01, D-03, D-04 open | PO writes both handoffs; client decides stock level and tax | PO + client | 2026-10-22 | open | M4, M5 |
| G-22 | Go-live & operations | Electro Café menu, prices and staff list not received | Owner sends the menu and staff list; import through Menu → Excel | Client owner | 2026-10-22 | open | Data load, UAT |
| G-23 | Go-live & operations | No go-live plan: install runbook, data load, training material (AR), go/no-go checklist, hyper-care and 1-hour support process | PO writes `docs/08-delivery/go-live-plan.md` | PO | 2026-10-29 | open | G4 go/no-go |
| G-24 | Design (Figma) | Screen states (empty, loading, error, offline, no access) not in Figma | Designer, after the core screens | Designer | 2026-10-29 | open | Front end |
| G-25 | Plan & scope | Master plan links: Drive folder not recorded | PO adds the Drive folder link (Figma now in figma-map) | PO | 2026-10-01 | open | — |
| G-26 | Commercial | Pricing (D-32) proposed; design-partner price not written | Decide after 5 café interviews; write the Electro price with the IP agreement | Management | 2026-11-30 | open | Second client |
| G-27 | Backend | Only Module 1 has Jira tickets; no front-end or QA tickets | PO creates each module's epic and tickets on the Thursday before its sprint | PO | 2026-10-08 | doing | Sprints 3–5 |
| G-28 | Design (Figma) | 60 designer questions: 26 Module 1 answered (D-36); 34 cashier have proposals, 6 wait for the client | PO closes the cashier answers with the Module 2 handoff | PO | 2026-10-08 | doing | M2 |
| G-29 | Backend | Module 1 handoff lacked panel sign-in, person status, branch-code rule, branch server | Handoff v2 (3 Oct) | PO | 2026-10-04 | done | — |
| G-30 | Backend | Three different sample data sets (panel, Figma, till) | One seed set ([seed](../../clients/electro-cafe/seed.md)); a test keeps till and panel equal | PO | 2026-10-04 | done | — |
| G-31 | Design (Figma) | Component library gaps | Fixed on Day 12 (checked 3 Oct) | Designer | 2026-10-04 | done | — |
| G-32 | Plan & scope | Jira was connected as another account without create permission; Day 12–13 tickets were missing | Reconnected with the PO's account; POSD-106 (Day 12) and POSD-107 (Day 13) created | PO | 2026-10-01 | done | — |
| G-33 | Backend | Jira was not updated for the stack | Done 3 Oct: POSD-96…100 rewritten, POSD-108 (sync skeleton) and POSD-109 (Day 14) created, comments on POSD-104…107 | PO | 2026-10-04 | done | — |
| G-34 | Design (Figma) | Module 1 screens in Figma differ from the answered rules: series per register, no branch server, no person status or back-office access, no item option prices | [Day 14](day-14.md) — POSD-109 | Designer | 2026-10-08 | open | Front end |
| G-35 | Architecture | Cloud hosting provider, region, backups and restore test not chosen (ADR-001 a) | Tech lead proposes; PO accepts | Tech lead | 2026-10-08 | open | First deploy |
| G-36 | Architecture | A till that can't reach the branch server; a wallet payment when the line drops | Wallet: answered by the client (reference number + "Was this payment received?"). Till without server: recommended in ADR-002 — tech lead confirms | Tech lead + PO | 2026-10-08 | doing | M2 |
| G-37 | Go-live & operations | Hardware list lacks the branch server, network kit and UPS | Folded into G-17 | Tech lead + PO | 2026-10-15 | done | — |
| G-38 | Plan & scope | The stack document counts 124 requirements; the repo and the source workbook have 111 | PO checks with the tech lead which list was used | PO | 2026-10-08 | open | — |
| G-39 | HTML prototype | Cashier logic errors found by the designer: order number not daily, refund can over-refund, first print marked COPY, till ignores HQ's payment methods, sync pills unclear | Fix in `pos.html` with the Module 2 handoff (POSD-105) | PO | 2026-10-08 | open | M2 |
| G-40 | Decisions | Two Module 1 points for the client: staff card confirmed (8-digit number); Owner and head-office manager permissions still to confirm (Q-09) | Ask in the next client check-in | PO + client owner | 2026-10-15 | doing | — |
| G-41 | Plan & scope | Arabic word for "register": glossary says "نقطة البيع", the panel says "جهاز البيع", Figma "الجهاز" | PO picks one; update glossary, HTML, Figma | PO | 2026-10-08 | open | — |
| G-42 | Architecture | The till is an iPad: Electron (ADR-001 #2) is out, and an installed web app with HTTPS inside the branch is unproven | Tech lead accepts ADR-002 (Q-28) and runs the first-week spike on a real iPad | Tech lead | 2026-10-08 | open | M2 · the till app |
| G-43 | HTML prototype | The cashier prototype is not yet checked at iPad sizes and with touch only | PO tests `pos.html` at 1180×820 and 1080×810 with the Module 2 fixes (POSD-105) | PO | 2026-10-08 | open | M2 |
| G-44 | Decisions | New questions from the 3 Oct answers: card and wallet refunds (D-40), beans sold in packs with no ticket (Q-27), which small notes are in use (Q-30) | Client and accountant answer; tracked in [open-questions](open-questions.md) | PO + client | 2026-10-15 | open | M2, M3 |
