---
title: Project picture — what's missing
status: living
owner: PO
last_updated: 2026-10-03
last_analysis: 2026-10-03
related: ../../prototype/requirements.html, module-readiness.md, sprint-01.md, risk-register.md
---

# Project picture — what's missing

One page that says what the project still lacks to have a clear, full picture for 10 Nov. **Update it at every analysis session**, then run `python prototype/tools/build-coverage.py` — the dashboard `prototype/requirements.html` (tab *Project picture*) reads the three tables below. Keep the table columns as they are.

## Area health
Health: `green` = nothing blocks · `amber` = gaps with a plan · `red` = gaps that block a gate or a module.

| Area | Health | Summary |
|---|---|---|
| Plan & scope | amber | Plan, sprints and gates set; the 10-Nov scope cut is still only proposed and 8 requirements are TBD |
| Decisions | red | 21 open + 8 proposed of 36; stack (D-35) and Module 1 answers (D-36) decided on 3 Oct; all 9 group-A client decisions still open |
| Team | red | Backend developer not confirmed by name; no front-end developer or QA; client technical contact unknown |
| Architecture | amber | Stack accepted (ADR-001: till → branch server → cloud); hosting, two offline edge cases and non-functional requirements still open |
| HTML prototype | green | All 111 requirements shown; Module 1 screens corrected against the stack and the designer's questions (branch server, series per branch, people, menu); cashier fixes for Module 2 listed |
| Design (Figma) | amber | Library fixed, Day 13 cashier screens done; till sizes still missing; Module 1 screens need the Day 14 changes; 0 screens approved |
| Backend | amber | Module 1 passes all 5 gates and its Jira tickets match the handoff v2 (POSD-97…100, 108); developer not named; Modules 2–5 have no handoff |
| Testing | red | No test strategy, UAT plan or test cases (offline, sync, printing are the riskiest) |
| Go-live & operations | red | Hardware not chosen; no install, data-load, training or support plan |
| Commercial | amber | IP agreement (D-22) unsigned; pricing (D-32) proposed — not needed for 10 Nov |

## Module gates
Each module passes 5 gates before the backend starts it ([module-readiness](module-readiness.md)). Values: `yes` · `no` · `part`.

| Module | Backend sprint | HTML | Flows | Handoff | Decisions | Stack |
|---|---|---|---|---|---|---|
| M1 Platform core | Sprint 2 · 4–8 Oct | yes | yes | yes | yes | yes |
| M2 Sale | Sprint 3 · 11–15 Oct | part | yes | no | no | part |
| M3 Shift & money | Sprint 4 · 18–22 Oct | part | yes | no | no | part |
| M4 Back office | Sprint 5 · 25–29 Oct | yes | part | no | no | yes |
| M5 Quantara minimum | Sprint 5 · 25–29 Oct | yes | part | no | yes | yes |

## Gaps
Status: `open` · `doing` · `done`. Due = the date it stops being fine. Blocks = what waits for it.

| ID | Area | Gap | Fix | Owner | Due | Status | Blocks |
|---|---|---|---|---|---|---|---|
| G-01 | Architecture | Stack not accepted — ADR-001 | Accepted 3 Oct from the tech lead's recommendation (D-35); POSD-104 stays open only for the developer's review | Tech lead + PO | 2026-10-01 | done | — |
| G-02 | Team | Backend developer not confirmed by name | Management confirms who builds Module 1; developer reviews the handoff v2 | Management | 2026-10-04 | open | M1 |
| G-03 | Decisions | Group A decisions all open (D-01, D-08, D-09, D-14, D-15, D-20, D-21, D-22, D-24) | Client meeting before Thu; accept written assumptions for the rest | PO + client owner | 2026-10-01 | open | M2, M4 |
| G-04 | Plan & scope | 10-Nov scope cut still proposed (66 IN · 14 MIN · 23 LATER · 8 TBD) | PO accepts the cut with the client owner; decide the 8 TBD rows | PO + client owner | 2026-10-01 | open | M2–M5 |
| G-05 | Plan & scope | PRC-11 is an empty row carried from the client spec | Ask the client what it was, or delete it | PO | 2026-10-01 | open | — |
| G-06 | Commercial | IP ownership not in writing (D-22) | Management signs the IP agreement with Electro Café | Management | 2026-10-01 | open | Contract |
| G-07 | Team | Client technical contact unknown (D-20) | Owner names one person for site, hardware and UAT | Client owner | 2026-10-01 | open | Hardware, UAT |
| G-08 | Design (Figma) | References page and Quantara shell were missing | Restored on Day 12 (checked 3 Oct) | Designer | 2026-10-04 | done | — |
| G-09 | Architecture | No non-functional requirements: security (auth, PIN hashing, tenant isolation tests), backups & restore, performance (sale time), availability, data retention, supported devices | PO + tech lead write `docs/02-requirements/non-functional.md` | PO + tech lead | 2026-10-08 | open | M2 |
| G-10 | Architecture | ADR-001 #2–#5: where the till runs, local storage, sync model, registers offline together | Decided in ADR-001 (Electron till, branch server, event log) | Tech lead | 2026-10-08 | done | — |
| G-11 | Backend | Module 2 (Sale) handoff doc missing | PO writes `module-02-sale.md` (POSD-105) | PO | 2026-10-08 | open | M2 |
| G-12 | Decisions | Decisions for the Sale module: D-10 mixed payment, D-11 rounding, D-14 stations, D-29 change/card | Decide, or accept the prototype's written assumption | PO + client owner | 2026-10-08 | open | M2 |
| G-13 | Team | No front-end developer — Figma screens have nobody to build them; the cashier app is what goes live | Management staffs a front-end developer | Management | 2026-10-08 | open | Front end |
| G-14 | Team | No QA | Management names QA (can be part-time) from Sprint 3 | Management | 2026-10-08 | open | Testing |
| G-15 | Testing | No test strategy, UAT plan or test cases; offline, sync and printing need real-outage tests | QA + PO write `docs/08-delivery/test-plan.md` and UAT script | QA + PO | 2026-10-15 | open | G3 UAT |
| G-16 | Design (Figma) | Cashier: Sale and Payment still only at 1440×900 — the till sizes 1280×800 and 1366×768 are missing (everything else from Day 12–13 is done; POSD-106 In Review) | First item of [Day 14](day-14.md) — POSD-109 | Designer | 2026-10-06 | doing | Front end |
| G-17 | Go-live & operations | Hardware not chosen or ordered; card terminal waits for D-29 | Client tech contact picks from the approved list; order by 15 Oct | Client tech + PO | 2026-10-15 | open | Install |
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
| G-36 | Architecture | Two offline cases open: a till that can't reach the branch server; a wallet payment when the line drops (ADR-001 b, c) | Tech lead + PO decide; write into the Module 2 handoff | Tech lead + PO | 2026-10-08 | open | M2 |
| G-37 | Go-live & operations | Hardware list lacks the branch server (mini-PC) and UPS for each branch | Add to the approved hardware list (HW-07) and the order | Tech lead + PO | 2026-10-15 | open | Install |
| G-38 | Plan & scope | The stack document counts 124 requirements; the repo and the source workbook have 111 | PO checks with the tech lead which list was used | PO | 2026-10-08 | open | — |
| G-39 | HTML prototype | Cashier logic errors found by the designer: order number not daily, refund can over-refund, first print marked COPY, till ignores HQ's payment methods, sync pills unclear | Fix in `pos.html` with the Module 2 handoff (POSD-105) | PO | 2026-10-08 | open | M2 |
| G-40 | Decisions | Client to confirm two Module 1 points: permission defaults for Owner and HQ manager; staff card stock | Ask in the next client check-in | PO + client owner | 2026-10-15 | open | — |
| G-41 | Plan & scope | Arabic word for "register": glossary says "نقطة البيع", the panel says "جهاز البيع", Figma "الجهاز" | PO picks one; update glossary, HTML, Figma | PO | 2026-10-08 | open | — |
