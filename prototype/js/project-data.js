/* Generated from docs/08-delivery/project-picture.md + live counts (requirements, decision log, screen registry). Regenerate: python prototype/tools/build-coverage.py */
window.PROJECT = {
"last_analysis": "2026-10-03",
"areas": [
{
"Area": "Plan & scope",
"Health": "red",
"Summary": "Client decided: everything on the launch list must work on opening day (D-21). No cut — the build order and capacity are now the main risk"
},
{
"Area": "Decisions",
"Health": "amber",
"Summary": "9 client and management decisions closed on 3 Oct (scope, ownership, tax, rounding, mixed payment, refunds, stations, offline, invoice numbers). Still open: stock level, card and wallet refunds, card payment, staff meals"
},
{
"Area": "Team",
"Health": "amber",
"Summary": "Backend developer chosen and invited (name to record). The till app is built by Quantara, but no front-end developer is named; no QA; client technical contact unknown"
},
{
"Area": "Architecture",
"Health": "amber",
"Summary": "Stack accepted (ADR-001). The till is an iPad, so the till technology changes: ADR-002 proposed (web app on iPad, whole-branch offline, head office offline) — tech lead to accept. Hosting and non-functional requirements open"
},
{
"Area": "HTML prototype",
"Health": "green",
"Summary": "All 111 requirements shown; Module 1 corrected; the client's answers applied (three sections, two stations, new Syrian pound, tax as a head-office setting). Cashier logic fixes for Module 2 listed"
},
{
"Area": "Design (Figma)",
"Health": "amber",
"Summary": "Library fixed, cashier part 1–2 drawn — but at desktop sizes; the till is an iPad, so till screens need iPad sizes. Module 1 screens need the Day 14 changes; 0 screens approved"
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
"Summary": "Hardware changes with the answers: iPads, branch server, network and UPS — models and counts not chosen; no install, data-load, training or support plan"
},
{
"Area": "Commercial",
"Health": "green",
"Summary": "Quantara owns the software; Electro Café is the first subscriber (D-22). Pricing (D-32) proposed — not needed for 10 Nov"
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
"Decisions": "part",
"Stack": "part"
},
{
"Module": "M3 Shift & money",
"Backend sprint": "Sprint 4 · 18–22 Oct",
"HTML": "part",
"Flows": "yes",
"Handoff": "no",
"Decisions": "part",
"Stack": "part"
},
{
"Module": "M4 Back office",
"Backend sprint": "Sprint 5 · 25–29 Oct",
"HTML": "yes",
"Flows": "part",
"Handoff": "no",
"Decisions": "part",
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
"Gap": "Backend developer chosen and invited; the name is not recorded and the tickets are unassigned",
"Fix": "PO records the name, assigns POSD-97…100 and 108; developer reads the handoff v2.1 (POSD-104)",
"Owner": "PO",
"Due": "2026-10-04",
"Status": "doing",
"Blocks": "M1"
},
{
"ID": "G-03",
"Area": "Decisions",
"Gap": "Group A client decisions: 3 closed on 3 Oct (D-14, D-21, D-22). Still open: D-01 stock level, D-08 branches in 2 years, D-20 technical contact, D-24 warehouse; D-09 and D-15 proposed",
"Fix": "Next client check-in",
"Owner": "PO + client owner",
"Due": "2026-10-08",
"Status": "doing",
"Blocks": "M4"
},
{
"ID": "G-04",
"Area": "Plan & scope",
"Gap": "Everything on the launch list must work on opening day (D-21) — 105 launch items, one backend developer, no till developer yet",
"Fix": "Agree the build order with the client (Q-29); ask management for more hands; weekly burn-up check",
"Owner": "PO + management",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "G2 feature complete"
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
"Gap": "IP ownership",
"Fix": "Decided 3 Oct: Quantara owns the software (D-22); the signed paper is handled outside this plan",
"Owner": "Management",
"Due": "2026-10-01",
"Status": "done",
"Blocks": "—"
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
"Gap": "Decisions for the Sale module: D-10, D-11, D-14, D-03, D-05 closed on 3 Oct. Left: card payment and change in USD (D-29), card and wallet refunds (D-40)",
"Fix": "PO + tech lead settle D-29 as \"card recorded only\"; client answers D-40",
"Owner": "PO + client owner",
"Due": "2026-10-08",
"Status": "doing",
"Blocks": "M2"
},
{
"ID": "G-13",
"Area": "Team",
"Gap": "The till app is built by Quantara for iPad (D-37), but no front-end developer is named",
"Fix": "Management names the developer; start no later than Sprint 3 (Q-25)",
"Owner": "Management",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "The till app"
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
"Gap": "Till screens are drawn at 1440×900 and 1366×768; the till is an iPad (D-37)",
"Fix": "Redraw Sale and Payment at 1180×820 first, check at 1080×810; then the Day 13 screens ([Day 14](day-14.md) — POSD-109)",
"Owner": "Designer",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "The till app"
},
{
"ID": "G-17",
"Area": "Go-live & operations",
"Gap": "Hardware not chosen or ordered: iPads (model, count), branch server, access point, switch, printers, UPS (hours), scanner",
"Fix": "Client picks the iPad model and count (Q-24) and the UPS hours (Q-31); PO writes the list; order by 15 Oct",
"Owner": "Client + PO",
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
"Gap": "A till that can't reach the branch server; a wallet payment when the line drops",
"Fix": "Wallet: answered by the client (reference number + \"Was this payment received?\"). Till without server: recommended in ADR-002 — tech lead confirms",
"Owner": "Tech lead + PO",
"Due": "2026-10-08",
"Status": "doing",
"Blocks": "M2"
},
{
"ID": "G-37",
"Area": "Go-live & operations",
"Gap": "Hardware list lacks the branch server, network kit and UPS",
"Fix": "Folded into G-17",
"Owner": "Tech lead + PO",
"Due": "2026-10-15",
"Status": "done",
"Blocks": "—"
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
"Gap": "Two Module 1 points for the client: staff card confirmed (8-digit number); Owner and head-office manager permissions still to confirm (Q-09)",
"Fix": "Ask in the next client check-in",
"Owner": "PO + client owner",
"Due": "2026-10-15",
"Status": "doing",
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
},
{
"ID": "G-42",
"Area": "Architecture",
"Gap": "The till is an iPad: Electron (ADR-001 #2) is out, and an installed web app with HTTPS inside the branch is unproven",
"Fix": "Tech lead accepts ADR-002 (Q-28) and runs the first-week spike on a real iPad",
"Owner": "Tech lead",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2 · the till app"
},
{
"ID": "G-43",
"Area": "HTML prototype",
"Gap": "The cashier prototype is not yet checked at iPad sizes and with touch only",
"Fix": "PO tests `pos.html` at 1180×820 and 1080×810 with the Module 2 fixes (POSD-105)",
"Owner": "PO",
"Due": "2026-10-08",
"Status": "open",
"Blocks": "M2"
},
{
"ID": "G-44",
"Area": "Decisions",
"Gap": "New questions from the 3 Oct answers: card and wallet refunds (D-40), beans sold in packs with no ticket (Q-27), which small notes are in use (Q-30)",
"Fix": "Client and accountant answer; tracked in [open-questions](open-questions.md)",
"Owner": "PO + client",
"Due": "2026-10-15",
"Status": "open",
"Blocks": "M2, M3"
}
],
"build": [
{
"Module": "M1 Platform core",
"Specification": "done",
"Design": "doing",
"Backend": "todo",
"Front end": "todo",
"Tested": "todo",
"Live": "todo"
},
{
"Module": "M2 Sale",
"Specification": "doing",
"Design": "doing",
"Backend": "todo",
"Front end": "todo",
"Tested": "todo",
"Live": "todo"
},
{
"Module": "M3 Shift & money",
"Specification": "doing",
"Design": "doing",
"Backend": "todo",
"Front end": "todo",
"Tested": "todo",
"Live": "todo"
},
{
"Module": "M4 Back office",
"Specification": "doing",
"Design": "todo",
"Backend": "todo",
"Front end": "todo",
"Tested": "todo",
"Live": "todo"
},
{
"Module": "M5 Quantara minimum",
"Specification": "doing",
"Design": "doing",
"Backend": "todo",
"Front end": "todo",
"Tested": "todo",
"Live": "todo"
}
],
"questions": [
{
"ID": "Q-01",
"Sprint": "1",
"Group": "management",
"Question": "Who is the backend developer?",
"Who answers": "Management",
"Needed by": "2026-10-04",
"Status": "answered",
"Answer": "Chosen and invited (3 Oct). Left: record the name, assign POSD-97…100 and 108, and the developer reads the handoff (POSD-104)"
},
{
"ID": "Q-02",
"Sprint": "1",
"Group": "team",
"Question": "Does the PO confirm the calls of 3 Oct: stack accepted, invoice series per branch, the 26 Module 1 answers?",
"Who answers": "PO",
"Needed by": "2026-10-04",
"Status": "assumed",
"Answer": "Treated as confirmed: the PO worked on from them and pushed them. Say so if any should change"
},
{
"ID": "Q-03",
"Sprint": "1",
"Group": "team",
"Question": "When will Sale and Payment be drawn at the till sizes?",
"Who answers": "Designer",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "Changed by D-37: the till is an iPad. Draw at 1180 × 820 and check at 1080 × 810, once the model is known (Q-24)"
},
{
"ID": "Q-04",
"Sprint": "1",
"Group": "management",
"Question": "Who owns the product?",
"Who answers": "Management",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Quantara (Sankari) owns the SaaS software. Electro Café is the first café using it (D-22)"
},
{
"ID": "Q-05",
"Sprint": "2",
"Group": "team",
"Question": "Where does the code live?",
"Who answers": "Tech lead + PO",
"Needed by": "2026-10-04",
"Status": "answered",
"Answer": "Not in PosD — PosD is the specifications only (PO, 3 Oct). The tech lead names the code repository"
},
{
"ID": "Q-06",
"Sprint": "2",
"Group": "team",
"Question": "Which hosting provider is reachable and allowed from Syria?",
"Who answers": "Tech lead",
"Needed by": "2026-10-06",
"Status": "open",
"Answer": "Recommended: shortlist two, test from the café's line; staging on any single server meanwhile"
},
{
"ID": "Q-07",
"Sprint": "2",
"Group": "team",
"Question": "How are invites sent (email service, SMS in Syria)?",
"Who answers": "Tech lead",
"Needed by": "2026-10-06",
"Status": "open",
"Answer": "Recommended: email; otherwise show the invite link once for head office to pass on. SMS after go-live"
},
{
"ID": "Q-08",
"Sprint": "2",
"Group": "team",
"Question": "Sprint 2 is one day over capacity. What spills?",
"Who answers": "PO",
"Needed by": "2026-10-06",
"Status": "open",
"Answer": "Recommended: finish the catalogue; from the sync skeleton do enrolment and heartbeat; drop the audit log"
},
{
"ID": "Q-09",
"Sprint": "2",
"Group": "client",
"Question": "Should the Owner sell at the till, and the head-office manager add and disable staff?",
"Who answers": "Client owner",
"Needed by": "2026-10-08",
"Status": "assumed",
"Answer": "The client said every staff member can sell everything (D-38), so all till roles sell. Owner and head-office manager stay as in the spec until confirmed"
},
{
"ID": "Q-10",
"Sprint": "2",
"Group": "client",
"Question": "Which staff card?",
"Who answers": "Client admin",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "A printed 8-digit number, scanned or typed"
},
{
"ID": "Q-11",
"Sprint": "2",
"Group": "accountant",
"Question": "Which invoice number format for a business with 5 branches and one head office?",
"Who answers": "PO (research)",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "One gapless series per branch, `EC-MAIN-000001`, given by the branch server; head office checks each series for gaps (D-27)"
},
{
"ID": "Q-12",
"Sprint": "3",
"Group": "client",
"Question": "Can one bill be paid with several methods or currencies?",
"Who answers": "Client owner",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Yes (D-10)"
},
{
"ID": "Q-13",
"Sprint": "3",
"Group": "accountant",
"Question": "How is the final amount rounded?",
"Who answers": "Accountant",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "In the new Syrian pound (1 new = 100 old, since 1 Jan 2026). Round to the nearest step; the step is a head-office setting, 5 by default (D-11)"
},
{
"ID": "Q-14",
"Sprint": "3",
"Group": "accountant",
"Question": "Is sales tax applied, and at what rate?",
"Who answers": "Accountant",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Each business sets its own tax at head office: on or off, the rate, included in prices or added. Quantara fixes no rate (D-03)"
},
{
"ID": "Q-15",
"Sprint": "3",
"Group": "team",
"Question": "Is card payment available at launch, and how does the terminal connect?",
"Who answers": "PO + tech lead",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "Recommended: card as a recorded method only; no link to the bank terminal for 10 Nov"
},
{
"ID": "Q-16",
"Sprint": "3",
"Group": "client",
"Question": "How many preparation stations, and which items go where?",
"Who answers": "Client admin",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Two: drinks bar (To drink) and food counter (To eat, with soups). Sections: To eat, To drink, Our beans (D-14, D-38)"
},
{
"ID": "Q-17",
"Sprint": "3",
"Group": "team",
"Question": "What happens when a till cannot reach the branch server?",
"Who answers": "Tech lead + PO",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "Recommended in ADR-002: it cannot complete a sale; it shows the state and retries"
},
{
"ID": "Q-18",
"Sprint": "3",
"Group": "client",
"Question": "A wallet payment when the internet drops: what does the cashier do?",
"Who answers": "Client owner",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "As recommended: the cashier types the wallet's reference number; after a power cut the till asks \"Was this payment received?\""
},
{
"ID": "Q-19",
"Sprint": "3",
"Group": "client",
"Question": "Refund rules",
"Who answers": "Client owner",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Cash refund with the manager's PIN and a reason, in the same currency the customer paid (D-05). Card and wallet: see Q-26"
},
{
"ID": "Q-20",
"Sprint": "3",
"Group": "client",
"Question": "How long may a branch run offline?",
"Who answers": "Client admin",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Warn after 4 hours; keep selling up to 7 days. The whole branch works together offline; head office too if possible (D-12, D-39)"
},
{
"ID": "Q-21",
"Sprint": "3",
"Group": "management",
"Question": "Who builds the cashier app?",
"Who answers": "Management",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Quantara builds it; the till is an iPad (D-37). See Q-25 for the person"
},
{
"ID": "Q-22",
"Sprint": "3",
"Group": "team",
"Question": "Module 2 handoff and cashier fixes ready by 8 Oct?",
"Who answers": "PO",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "Recommended order: fix the prototype's logic errors, write the handoff, accept assumptions in writing (POSD-105)"
},
{
"ID": "Q-23",
"Sprint": "3",
"Group": "client",
"Question": "What must work on opening day?",
"Who answers": "Client owner",
"Needed by": "2026-10-08",
"Status": "answered",
"Answer": "Everything on the launch list (D-21). The proposed cut becomes the build order — see Q-29"
},
{
"ID": "Q-24",
"Sprint": "2",
"Group": "client",
"Question": "Which iPad model, and how many per branch?",
"Who answers": "Client + PO",
"Needed by": "2026-10-06",
"Status": "open",
"Answer": "Needed for screen sizes and the hardware order. We design for 1180 × 820 until answered"
},
{
"ID": "Q-25",
"Sprint": "2",
"Group": "management",
"Question": "Who is the front-end developer for the iPad till, and when do they start?",
"Who answers": "Management",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "The backend for Sale starts on 11 Oct; the till app must start no later"
},
{
"ID": "Q-26",
"Sprint": "3",
"Group": "client",
"Question": "How is a card or wallet payment refunded?",
"Who answers": "Client owner",
"Needed by": "2026-10-15",
"Status": "open",
"Answer": "Kept open by the client (D-40). Until answered: not from the drawer; recorded as \"to return through the provider\""
},
{
"ID": "Q-27",
"Sprint": "3",
"Group": "client",
"Question": "\"Our beans\": sold in fixed packs with no preparation ticket?",
"Who answers": "Client admin",
"Needed by": "2026-10-08",
"Status": "assumed",
"Answer": "Yes: fixed packs, a price per pack, no ticket; the cashier hands them over"
},
{
"ID": "Q-28",
"Sprint": "2",
"Group": "team",
"Question": "Does the tech lead accept ADR-002: the till as a web app on iPad, HTTPS in the branch, head office offline in two steps?",
"Who answers": "Tech lead",
"Needed by": "2026-10-06",
"Status": "open",
"Answer": "Recommended: web app now, native shell later; head office: branch view now, offline queue after go-live"
},
{
"ID": "Q-29",
"Sprint": "3",
"Group": "client",
"Question": "Everything must work on opening day: in which order do we build, so the least important slips if time runs out?",
"Who answers": "PO + client owner",
"Needed by": "2026-10-08",
"Status": "open",
"Answer": "Recommended: the earlier cut as the order — 66 items first, 14 in a simple form next, 23 last"
},
{
"ID": "Q-30",
"Sprint": "3",
"Group": "accountant",
"Question": "Which notes are in daily use (is there a 5 or a 1)?",
"Who answers": "Accountant",
"Needed by": "2026-10-15",
"Status": "assumed",
"Answer": "Step 5 works with the 10 and 25 notes. Head office can change the step"
},
{
"ID": "Q-31",
"Sprint": "3",
"Group": "client",
"Question": "How many hours must the branch run through a power cut?",
"Who answers": "Client admin",
"Needed by": "2026-10-15",
"Status": "open",
"Answer": "Sizes the UPS for the branch server, network and printers"
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
"decided": 19,
"open": 16,
"proposed": 5
},
"screens": {
"html-draft": 45,
"figma-wip": 10,
"todo": 1
}
}
};
