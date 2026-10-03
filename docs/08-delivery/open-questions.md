---
title: Open questions — Sprints 1 to 3
status: living
owner: PO
last_updated: 2026-10-03
related: project-picture.md, ../06-decisions/decision-log.md, ../05-architecture/adr/ADR-002-ipad-till-and-offline-branch.md
---

# Open questions — Sprints 1 to 3

Every question that can block the first three sprints, who answers it, and where it stands. Update it when an answer arrives, then run `python prototype/tools/build-coverage.py` — the dashboard `prototype/requirements.html` (section *Open questions*) reads the table. Keep the columns as they are.

Status: `open` · `answered` · `assumed` (no answer yet; we work on the assumption in the Answer column).
Group: `management` · `client` · `accountant` · `team` (PO, tech lead, designer).

## Questions
| ID | Sprint | Group | Question | Who answers | Needed by | Status | Answer |
|---|---|---|---|---|---|---|---|
| Q-01 | 1 | management | Who is the backend developer? | Management | 2026-10-04 | answered | Chosen and invited (3 Oct). Left: record the name, assign POSD-97…100 and 108, and the developer reads the handoff (POSD-104) |
| Q-02 | 1 | team | Does the PO confirm the calls of 3 Oct: stack accepted, invoice series per branch, the 26 Module 1 answers? | PO | 2026-10-04 | assumed | Treated as confirmed: the PO worked on from them and pushed them. Say so if any should change |
| Q-03 | 1 | team | When will Sale and Payment be drawn at the till sizes? | Designer | 2026-10-08 | open | Changed by D-37: the till is an iPad. Draw at 1180 × 820 and check at 1080 × 810, once the model is known (Q-24) |
| Q-04 | 1 | management | Who owns the product? | Management | 2026-10-08 | answered | Quantara (Sankari) owns the SaaS software. Electro Café is the first café using it (D-22) |
| Q-05 | 2 | team | Where does the code live? | Tech lead + PO | 2026-10-04 | answered | Not in PosD — PosD is the specifications only (PO, 3 Oct). The tech lead names the code repository |
| Q-06 | 2 | team | Which hosting provider is reachable and allowed from Syria? | Tech lead | 2026-10-06 | open | Recommended: shortlist two, test from the café's line; staging on any single server meanwhile |
| Q-07 | 2 | team | How are invites sent (email service, SMS in Syria)? | Tech lead | 2026-10-06 | open | Recommended: email; otherwise show the invite link once for head office to pass on. SMS after go-live |
| Q-08 | 2 | team | Sprint 2 is one day over capacity. What spills? | PO | 2026-10-06 | open | Recommended: finish the catalogue; from the sync skeleton do enrolment and heartbeat; drop the audit log |
| Q-09 | 2 | client | Should the Owner sell at the till, and the head-office manager add and disable staff? | Client owner | 2026-10-08 | assumed | The client said every staff member can sell everything (D-38), so all till roles sell. Owner and head-office manager stay as in the spec until confirmed |
| Q-10 | 2 | client | Which staff card? | Client admin | 2026-10-08 | answered | A printed 8-digit number, scanned or typed |
| Q-11 | 2 | accountant | Which invoice number format for a business with 5 branches and one head office? | PO (research) | 2026-10-08 | answered | One gapless series per branch, `EC-MAIN-000001`, given by the branch server; head office checks each series for gaps (D-27) |
| Q-12 | 3 | client | Can one bill be paid with several methods or currencies? | Client owner | 2026-10-08 | answered | Yes (D-10) |
| Q-13 | 3 | accountant | How is the final amount rounded? | Accountant | 2026-10-08 | answered | In the new Syrian pound (1 new = 100 old, since 1 Jan 2026). Round to the nearest step; the step is a head-office setting, 5 by default (D-11) |
| Q-14 | 3 | accountant | Is sales tax applied, and at what rate? | Accountant | 2026-10-08 | answered | Each business sets its own tax at head office: on or off, the rate, included in prices or added. Quantara fixes no rate (D-03) |
| Q-15 | 3 | team | Is card payment available at launch, and how does the terminal connect? | PO + tech lead | 2026-10-08 | open | Recommended: card as a recorded method only; no link to the bank terminal for 10 Nov |
| Q-16 | 3 | client | How many preparation stations, and which items go where? | Client admin | 2026-10-08 | answered | Two: drinks bar (To drink) and food counter (To eat, with soups). Sections: To eat, To drink, Our beans (D-14, D-38) |
| Q-17 | 3 | team | What happens when a till cannot reach the branch server? | Tech lead + PO | 2026-10-08 | open | Recommended in ADR-002: it cannot complete a sale; it shows the state and retries |
| Q-18 | 3 | client | A wallet payment when the internet drops: what does the cashier do? | Client owner | 2026-10-08 | answered | As recommended: the cashier types the wallet's reference number; after a power cut the till asks "Was this payment received?" |
| Q-19 | 3 | client | Refund rules | Client owner | 2026-10-08 | answered | Cash refund with the manager's PIN and a reason, in the same currency the customer paid (D-05). Card and wallet: see Q-26 |
| Q-20 | 3 | client | How long may a branch run offline? | Client admin | 2026-10-08 | answered | Warn after 4 hours; keep selling up to 7 days. The whole branch works together offline; head office too if possible (D-12, D-39) |
| Q-21 | 3 | management | Who builds the cashier app? | Management | 2026-10-08 | answered | Quantara builds it; the till is an iPad (D-37). See Q-25 for the person |
| Q-22 | 3 | team | Module 2 handoff and cashier fixes ready by 8 Oct? | PO | 2026-10-08 | open | Recommended order: fix the prototype's logic errors, write the handoff, accept assumptions in writing (POSD-105) |
| Q-23 | 3 | client | What must work on opening day? | Client owner | 2026-10-08 | answered | Everything on the launch list (D-21). The proposed cut becomes the build order — see Q-29 |
| Q-24 | 2 | client | Which iPad model, and how many per branch? | Client + PO | 2026-10-06 | open | Needed for screen sizes and the hardware order. We design for 1180 × 820 until answered |
| Q-25 | 2 | management | Who is the front-end developer for the iPad till, and when do they start? | Management | 2026-10-08 | open | The backend for Sale starts on 11 Oct; the till app must start no later |
| Q-26 | 3 | client | How is a card or wallet payment refunded? | Client owner | 2026-10-15 | open | Kept open by the client (D-40). Until answered: not from the drawer; recorded as "to return through the provider" |
| Q-27 | 3 | client | "Our beans": sold in fixed packs with no preparation ticket? | Client admin | 2026-10-08 | assumed | Yes: fixed packs, a price per pack, no ticket; the cashier hands them over |
| Q-28 | 2 | team | Does the tech lead accept ADR-002: the till as a web app on iPad, HTTPS in the branch, head office offline in two steps? | Tech lead | 2026-10-06 | open | Recommended: web app now, native shell later; head office: branch view now, offline queue after go-live |
| Q-29 | 3 | client | Everything must work on opening day: in which order do we build, so the least important slips if time runs out? | PO + client owner | 2026-10-08 | open | Recommended: the earlier cut as the order — 66 items first, 14 in a simple form next, 23 last |
| Q-30 | 3 | accountant | Which notes are in daily use (is there a 5 or a 1)? | Accountant | 2026-10-15 | assumed | Step 5 works with the 10 and 25 notes. Head office can change the step |
| Q-31 | 3 | client | How many hours must the branch run through a power cut? | Client admin | 2026-10-15 | open | Sizes the UPS for the branch server, network and printers |
