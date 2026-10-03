---
title: ADR-002 Till on iPad, whole-branch offline, and head office offline
status: proposed
owner: Tech lead + PO
last_updated: 2026-10-03
supersedes: ADR-001 decision #2 (till as Electron) and the till's "local SQLite" in #3
related: ADR-001-offline-first-multi-tenant.md, ../../06-decisions/decision-log.md (D-12, D-37, D-38, D-39)
---

# ADR-002 — Till on iPad, whole-branch offline, head office offline

**Status: proposed.** Written by the PO from the answers of 3 Oct. The tech lead accepts, changes or rejects it; until then ADR-001 stands, except that Electron is no longer possible.

## Context — what was decided on 3 Oct
- **The till is an iPad**, and Quantara builds the till app (D-37). Electron does not run on an iPad, so ADR-001 #2 cannot stand.
- **The whole branch keeps working with no internet** — every till, printer and preparation station together, not each device alone (D-12, D-39).
- **Head office should also keep working offline, if possible** (D-39).
- **Every staff member can sell everything, at the same time**, on several tills (D-38).

What does not change: three tiers, one owner per table, append-only sync, the branch server as the authority for the branch (ADR-001).

## A. Till on iPad — options
| | Option | For | Against |
|---|---|---|---|
| **A1** | **Web app** (React + TypeScript) served by the branch server over the branch network; opened from the iPad Home Screen; iPad locked to it with Guided Access | No App Store, no review wait. One code base with the back office. An update is a branch-server update. Works on any tablet or screen with a browser | Needs HTTPS on the local network (below). No direct access to USB devices — not needed, because printing and the drawer are on the branch server |
| A2 | The same web app inside a thin native shell (Capacitor), installed through TestFlight or device management | True kiosk mode, Bluetooth devices, firmer local storage | Apple developer account, signing and review; a second release pipeline |
| A3 | Native app (React Native or Swift) | Best device access | A second code base next to the back office; most work; no time before 10 Nov |

**Recommended: A1 for 10 Nov, built so it can be wrapped as A2 later** without rewriting screens.

### What A1 needs
1. **The till keeps nothing that matters.** Each order line is saved on the branch server as it is added. An iPad that reloads, runs out of battery or is swapped shows the same order again. Local storage on the iPad is only a cache (menu, images).
2. **Printing, drawer, kitchen tickets** — from the branch server (ADR-001 #7). The iPad never talks to a printer.
3. **Barcode and staff card** — a Bluetooth scanner that types like a keyboard, or the iPad camera.
4. **HTTPS inside the branch.** An installed web app needs a trusted certificate even on a local network. Two ways:
   - a) Each branch server gets its own name (for example `main.ec.branch.quantara.app`) that resolves to its local address, with a normal certificate the cloud renews for it. The branch router or the branch server answers that name locally, so it works with no internet. Renewal needs internet only once every few weeks.
   - b) A private certificate authority, installed on each iPad as a profile.
   - **Recommended: a.** No profile to install on every iPad; a replaced iPad works at once.
5. **Screen sizes** — design for iPad in landscape: 1180 × 820 (10.9" and 11") and check at 1080 × 810 (10.2"). The exact model is an open question (Q24).
6. **Customer display and kitchen screen** — any second tablet or screen pointed at the branch server.

### To prove in the first week (spike)
- An installed Home Screen web app on the chosen iPad reaches the branch server over HTTPS with the internet unplugged.
- The app survives: iPad restart, Wi-Fi drop and return, branch-server restart.
- Two iPads add lines to different orders at the same time; order and invoice numbers stay unique and gapless.

## B. The whole branch offline
**Rule: inside the branch, every device talks only to the branch server, over the local network. Nothing in the branch needs the internet to work.**

| Part | Approach |
|---|---|
| Network | One router or access point and one switch, both on the UPS. Branch server and printers on cable. iPads on Wi-Fi |
| Power cut | iPads run on battery. The UPS carries the branch server, the network and the printers. Size it for the hours the client expects (open question Q31) |
| Several tills at once | All tills write to the branch server's PostgreSQL in transactions. Stock, order numbers and invoice numbers are given in one place, so two cashiers can never get the same number or sell the last item twice |
| Branch back office | A "Branch" view served by the branch server: today's sales, open orders, shifts and cash count, stock, pause an item, branch discount. It works with no internet |
| Limits | Warn after 4 hours offline; keep selling for up to 7 days (D-12). Card and wallet payments need the internet; cash always works |
| The one weak point | The branch server. UPS, nightly local backup to a second disk, one spare box per city, and the "replace the branch server" flow (Module 1) |
| A till that can't reach the branch server | It cannot complete a sale. It shows "Not connected to the branch server" and retries. No emergency mode on the till: it would break gapless numbering |

## C. Head office offline — options
Head office is the cloud back office (menu, prices, people, reports across branches). "Offline" can mean two things: the head-office user has no internet, or one branch is cut off from the cloud.

| | Option | What works offline | Cost |
|---|---|---|---|
| **H1** | **Cloud back office + the branch view from B.** | In a branch with no internet, the owner or manager still sees today's sales, shifts and stock for that branch, and can pause items and give branch discounts. Menu, price and people changes wait for the internet | Nothing extra — B is needed anyway |
| H2 | H1, plus the head-office app **keeps the last synced data and queues changes**. A price or menu change made offline is sent when the connection returns | Head office can read yesterday's reports and prepare changes with no internet | Medium. Safe, because head office is the only owner of those values; two head-office users editing the same item offline is the only conflict, solved by "last change wins" with a notice |
| H3 | Let a branch server change menu, prices or people while offline and push them up | Everything | High, and it breaks the one-owner rule: with 5 branches, two branches could change the same price. Not recommended |

**Recommended: H1 for 10 Nov, H2 after go-live.** Reports across branches always need the cloud, because one branch's sales reach another only through it.

For Electro Café today (one branch, the owner on site), H1 already covers the daily need: the owner sees the branch's day on the branch server with no internet.

## D. Many branches into one head office
- One gapless invoice series per branch, given by the branch server (D-27). Every invoice also carries a global id, branch, register, business date, and a link to the invoice before it.
- The cloud checks each branch's series for gaps when it syncs and shows a gap as an alert.
- Each branch sends a day-close summary; head-office reports read the summaries first and the detail on demand.

## Consequences
- ADR-001 #2 becomes "web app on iPad (A1)"; the till's local SQLite becomes a browser cache. Everything else in ADR-001 stands.
- Module 2 must save order lines on the branch server as they are entered (not only at payment).
- Design: till screens at iPad sizes; touch targets at least 44 px (already the rule).
- Hardware list: iPads, Bluetooth scanner, access point, switch, UPS sized for the branch.
- New risk: installed web apps on iPad and HTTPS on a local network must be proven in the first week (R-16).

## To decide
| # | Question | Owner |
|---|---|---|
| 1 | Accept A1 (web app on iPad), with A2 as the later step | Tech lead |
| 2 | HTTPS in the branch: option a or b | Tech lead |
| 3 | Accept H1 for 10 Nov and H2 after go-live | PO + tech lead |
| 4 | iPad model and count; UPS hours | Client + PO (Q24, Q31) |
