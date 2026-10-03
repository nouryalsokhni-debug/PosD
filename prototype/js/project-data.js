/* Generated from docs/08-delivery/project-picture.md + live counts (requirements, decision log, screen registry). Regenerate: python prototype/tools/build-coverage.py */
window.PROJECT = {
"last_analysis": "2026-10-03",
"areas": [
{
"Area": "Plan & scope",
"Health": "amber",
"Summary": "Plan, sprints and gates set; the 10-Nov scope cut is still only proposed and 8 requirements are TBD"
},
{
"Area": "Decisions",
"Health": "red",
"Summary": "21 open + 8 proposed of 36; stack (D-35) and Module 1 answers (D-36) decided on 3 Oct; all 9 group-A client decisions still open"
},
{
"Area": "Team",
"Health": "red",
"Summary": "Backend developer not confirmed by name; no front-end developer or QA; client technical contact unknown"
},
{
"Area": "Architecture",
"Health": "amber",
"Summary": "Stack accepted (ADR-001: till → branch server → cloud); hosting, two offline edge cases and non-functional requirements still open"
},
{
"Area": "HTML prototype",
"Health": "green",
"Summary": "All 111 requirements shown; Module 1 screens corrected against the stack and the designer's questions (branch server, series per branch, people, menu); cashier fixes for Module 2 listed"
},
{
"Area": "Design (Figma)",
"Health": "amber",
"Summary": "Library fixed, Day 13 cashier screens done; till sizes still missing; Module 1 screens need the Day 14 changes; 0 screens approved"
},
{
"Area": "Backend",
"Health": "amber",
"Summary": "Module 1 passes all 5 gates and its Jira tickets match the handoff v2 (POSD-97…100, 108); developer not named; Modules 2–5 have no handoff"
},
{
"Area": "Testing",
"Health": "red",
"Summary": "No test strategy, UAT plan or test cases (offline, sync, printing are the riskiest)"
},
{
"Area": "Go-live & operations",
"Health": "red",
"Summary": "Hardware not chosen; no install, data-load, training or support plan"
},
{
"Area": "Commercial",
"Health": "amber",
"Summary": "IP agreement (D-22) unsigned; pricing (D-32) proposed — not needed for 10 Nov"
}
],
"modules": [
{
"Module": "M1 Platform core",
"Backend sprint": "Sprint 2 · 4–8 Oct",
"HTML": "yes",
"Flows": "yes",
"Handoff": "yes",
"Decisions": "yes",
"Stack": "yes"
},
{
"Module": "M2 Sale",
"Backend sprint": "Sprint 3 · 11–15 Oct",
"HTML": "part",
"Flows": "yes",
"Handoff": "no",
"Decisions": "no",
"Stack": "part"
},
{
"Module": "M3 Shift & money",
"Backend sprint": "Sprint 4 · 18–22 Oct",
"HTML": "part",
"Flows": "yes",
"Handoff": "no",
"Decisions": "no",
"Stack": "part"
},
{
"Module": "M4 Back office",
"Backend sprint": "Sprint 5 · 25–29 Oct",
"HTML": "yes",
"Flows": "part",
"Handoff": "no",
"Decisions": "no",
"Stack": "yes"
},
{
"Module": "M5 Quantara minimum",
"Backend sprint": "Sprint 5 · 25–29 Oct",
"HTML": "yes",
"Flows": "part",
"Handoff": "no",
"Decisions": "yes",
"Stack": "yes"
}
],
"gaps": [
{
"ID": "G-01",
"Area": "Architecture",
"Gap": "Stack not accepted — ADR-001",
"Fix": "Accepted 3 Oct from the tech lead's recommendation (D-35); POSD-104 stays open only for the developer's review",
"Owner": "Tech lead + PO",
"Due": "2026-10-01",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-02",
"Area": "Team",
"Gap": "Backend developer not confirmed by name",
"Fix": "Management confirms who builds Module 1; developer reviews the handoff v2",
"Owner": "Management",
"Due": "2026-10-04",
"Status": "open",
"Blocks": "M1"
},
{
"ID": "G-03",
"Area": "Decisions",
"Gap": "Group A decisions all open (D-01, D-08, D-09, D-14, D-15, D-20, D-21, D-22, D-24)",
"Fix": "Client meeting before Thu; accept written assumptions for the rest",
"Owner": "PO + client owner",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "M2, M4"
},
{
"ID": "G-04",
"Area": "Plan & scope",
"Gap": "10-Nov scope cut still proposed (66 IN · 14 MIN · 23 LATER · 8 TBD)",
"Fix": "PO accepts the cut with the client owner; decide the 8 TBD rows",
"Owner": "PO + client owner",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "M2–M5"
},
{
"ID": "G-05",
"Area": "Plan & scope",
"Gap": "PRC-11 is an empty row carried from the client spec",
"Fix": "Ask the client what it was, or delete it",
"Owner": "PO",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "—"
},
{
"ID": "G-06",
"Area": "Commercial",
"Gap": "IP ownership not in writing (D-22)",
"Fix": "Management signs the IP agreement with Electro Café",
"Owner": "Management",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "Contract"
},
{
"ID": "G-07",
"Area": "Team",
"Gap": "Client technical contact unknown (D-20)",
"Fix": "Owner names one person for site, hardware and UAT",
"Owner": "Client owner",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "Hardware, UAT"
},
{
"ID": "G-08",
"Area": "Design (Figma)",
"Gap": "References page and Quantara shell were missing",
"Fix": "Restored on Day 12 (checked 3 Oct)",
"Owner": "Designer",
"Due": "2026-10-04",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-09",
"Area": "Architecture",
"Gap": "No non-functional requirements: security (auth, PIN hashing, tenant isolation tests), backups & restore, performance (sale time), availability, data retention, supported devices",
"Fix": "PO + tech lead write `docs/02-requirements/non-functional.md`",
"Owner": "PO + tech lead",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-10",
"Area": "Architecture",
"Gap": "ADR-001 #2–#5: where the till runs, local storage, sync model, registers offline together",
"Fix": "Decided in ADR-001 (Electron till, branch server, event log)",
"Owner": "Tech lead",
"Due": "2026-10-08",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-11",
"Area": "Backend",
"Gap": "Module 2 (Sale) handoff doc missing",
"Fix": "PO writes `module-02-sale.md` (POSD-105)",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-12",
"Area": "Decisions",
"Gap": "Decisions for the Sale module: D-10 mixed payment, D-11 rounding, D-14 stations, D-29 change/card",
"Fix": "Decide, or accept the prototype's written assumption",
"Owner": "PO + client owner",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-13",
"Area": "Team",
"Gap": "No front-end developer — Figma screens have nobody to build them; the cashier app is what goes live",
"Fix": "Management staffs a front-end developer",
"Owner": "Management",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "Front end"
},
{
"ID": "G-14",
"Area": "Team",
"Gap": "No QA",
"Fix": "Management names QA (can be part-time) from Sprint 3",
"Owner": "Management",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "Testing"
},
{
"ID": "G-15",
"Area": "Testing",
"Gap": "No test strategy, UAT plan or test cases; offline, sync and printing need real-outage tests",
"Fix": "QA + PO write `docs/08-delivery/test-plan.md` and UAT script",
"Owner": "QA + PO",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "G3 UAT"
},
{
"ID": "G-16",
"Area": "Design (Figma)",
"Gap": "Cashier: Sale and Payment still only at 1440×900 — the till sizes 1280×800 and 1366×768 are missing (everything else from Day 12–13 is done; POSD-106 In Review)",
"Fix": "First item of [Day 14](day-14.md) — POSD-109",
"Owner": "Designer",
"Due": "2026-10-06",
"Status": "doing",
"Blocks": "Front end"
},
{
"ID": "G-17",
"Area": "Go-live & operations",
"Gap": "Hardware not chosen or ordered; card terminal waits for D-29",
"Fix": "Client tech contact picks from the approved list; order by 15 Oct",
"Owner": "Client tech + PO",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "Install"
},
{
"ID": "G-18",
"Area": "Architecture",
"Gap": "Printing decided (ESC/POS from the branch server, drawer through the printer); not yet proven on the chosen printer",
"Fix": "Tech lead spikes on the chosen printer",
"Owner": "Tech lead",
"Due": "2026-10-15",
"Status": "doing",
"Blocks": "M3"
},
{
"ID": "G-19",
"Area": "Backend",
"Gap": "Module 3 handoff missing; step 2 E–F (mixed payment, shift close) not yet in HTML",
"Fix": "PO: HTML E–F + `module-03-shift-money.md`",
"Owner": "PO",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "M3"
},
{
"ID": "G-20",
"Area": "Design (Figma)",
"Gap": "Module 1 HQ screens and cashier part 1–2 drawn; other HQ and branch screens not started; 0 screens `figma-approved`",
"Fix": "PO approves Module 1 screens after Day 14; designer continues back-office essentials",
"Owner": "Designer + PO",
"Due": "2026-10-22",
"Status": "doing",
"Blocks": "Front end"
},
{
"ID": "G-21",
"Area": "Backend",
"Gap": "Module 4 and 5 handoffs missing; D-01, D-03, D-04 open",
"Fix": "PO writes both handoffs; client decides stock level and tax",
"Owner": "PO + client",
"Due": "2026-10-22",
"Status": "open",
"Blocks": "M4, M5"
},
{
"ID": "G-22",
"Area": "Go-live & operations",
"Gap": "Electro Café menu, prices and staff list not received",
"Fix": "Owner sends the menu and staff list; import through Menu → Excel",
"Owner": "Client owner",
"Due": "2026-10-22",
"Status": "open",
"Blocks": "Data load, UAT"
},
{
"ID": "G-23",
"Area": "Go-live & operations",
"Gap": "No go-live plan: install runbook, data load, training material (AR), go/no-go checklist, hyper-care and 1-hour support process",
"Fix": "PO writes `docs/08-delivery/go-live-plan.md`",
"Owner": "PO",
"Due": "2026-10-29",
"Status": "open",
"Blocks": "G4 go/no-go"
},
{
"ID": "G-24",
"Area": "Design (Figma)",
"Gap": "Screen states (empty, loading, error, offline, no access) not in Figma",
"Fix": "Designer, after the core screens",
"Owner": "Designer",
"Due": "2026-10-29",
"Status": "open",
"Blocks": "Front end"
},
{
"ID": "G-25",
"Area": "Plan & scope",
"Gap": "Master plan links: Drive folder not recorded",
"Fix": "PO adds the Drive folder link (Figma now in figma-map)",
"Owner": "PO",
"Due": "2026-10-01",
"Status": "open",
"Blocks": "—"
},
{
"ID": "G-26",
"Area": "Commercial",
"Gap": "Pricing (D-32) proposed; design-partner price not written",
"Fix": "Decide after 5 café interviews; write the Electro price with the IP agreement",
"Owner": "Management",
"Due": "2026-11-30",
"Status": "open",
"Blocks": "Second client"
},
{
"ID": "G-27",
"Area": "Backend",
"Gap": "Only Module 1 has Jira tickets; no front-end or QA tickets",
"Fix": "PO creates each module's epic and tickets on the Thursday before its sprint",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "doing",
"Blocks": "Sprints 3–5"
},
{
"ID": "G-28",
"Area": "Design (Figma)",
"Gap": "60 designer questions: 26 Module 1 answered (D-36); 34 cashier have proposals, 6 wait for the client",
"Fix": "PO closes the cashier answers with the Module 2 handoff",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "doing",
"Blocks": "M2"
},
{
"ID": "G-29",
"Area": "Backend",
"Gap": "Module 1 handoff lacked panel sign-in, person status, branch-code rule, branch server",
"Fix": "Handoff v2 (3 Oct)",
"Owner": "PO",
"Due": "2026-10-04",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-30",
"Area": "Backend",
"Gap": "Three different sample data sets (panel, Figma, till)",
"Fix": "One seed set ([seed](../../clients/electro-cafe/seed.md)); a test keeps till and panel equal",
"Owner": "PO",
"Due": "2026-10-04",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-31",
"Area": "Design (Figma)",
"Gap": "Component library gaps",
"Fix": "Fixed on Day 12 (checked 3 Oct)",
"Owner": "Designer",
"Due": "2026-10-04",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-32",
"Area": "Plan & scope",
"Gap": "Jira was connected as another account without create permission; Day 12–13 tickets were missing",
"Fix": "Reconnected with the PO's account; POSD-106 (Day 12) and POSD-107 (Day 13) created",
"Owner": "PO",
"Due": "2026-10-01",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-33",
"Area": "Backend",
"Gap": "Jira was not updated for the stack",
"Fix": "Done 3 Oct: POSD-96…100 rewritten, POSD-108 (sync skeleton) and POSD-109 (Day 14) created, comments on POSD-104…107",
"Owner": "PO",
"Due": "2026-10-04",
"Status": "done",
"Blocks": "—"
},
{
"ID": "G-34",
"Area": "Design (Figma)",
"Gap": "Module 1 screens in Figma differ from the answered rules: series per register, no branch server, no person status or back-office access, no item option prices",
"Fix": "[Day 14](day-14.md) — POSD-109",
"Owner": "Designer",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "Front end"
},
{
"ID": "G-35",
"Area": "Architecture",
"Gap": "Cloud hosting provider, region, backups and restore test not chosen (ADR-001 a)",
"Fix": "Tech lead proposes; PO accepts",
"Owner": "Tech lead",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "First deploy"
},
{
"ID": "G-36",
"Area": "Architecture",
"Gap": "Two offline cases open: a till that can't reach the branch server; a wallet payment when the line drops (ADR-001 b, c)",
"Fix": "Tech lead + PO decide; write into the Module 2 handoff",
"Owner": "Tech lead + PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-37",
"Area": "Go-live & operations",
"Gap": "Hardware list lacks the branch server (mini-PC) and UPS for each branch",
"Fix": "Add to the approved hardware list (HW-07) and the order",
"Owner": "Tech lead + PO",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "Install"
},
{
"ID": "G-38",
"Area": "Plan & scope",
"Gap": "The stack document counts 124 requirements; the repo and the source workbook have 111",
"Fix": "PO checks with the tech lead which list was used",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "—"
},
{
"ID": "G-39",
"Area": "HTML prototype",
"Gap": "Cashier logic errors found by the designer: order number not daily, refund can over-refund, first print marked COPY, till ignores HQ's payment methods, sync pills unclear",
"Fix": "Fix in `pos.html` with the Module 2 handoff (POSD-105)",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-40",
"Area": "Decisions",
"Gap": "Client to confirm two Module 1 points: permission defaults for Owner and HQ manager; staff card stock",
"Fix": "Ask in the next client check-in",
"Owner": "PO + client owner",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "—"
},
{
"ID": "G-41",
"Area": "Plan & scope",
"Gap": "Arabic word for \"register\": glossary says \"نقطة البيع\", the panel says \"جهاز البيع\", Figma \"الجهاز\"",
"Fix": "PO picks one; update glossary, HTML, Figma",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "—"
}
],
"counts": {
"requirements": 111,
"req_state": {
"works": 96,
"phase2": 5,
"decision": 7,
"open": 1,
"shown": 1,
"dropped": 1
},
"nov10": {
"IN": 66,
"LATER": 23,
"MIN": 14,
"TBD": 8
},
"decisions": {
"open": 21,
"proposed": 8,
"decided": 7
},
"screens": {
"html-draft": 45,
"figma-wip": 10,
"todo": 1
}
}
};
