---
title: Designer questions — "For the PO" notes in Figma
status: living
owner: PO
last_updated: 2026-10-03
related: figma-map.md, ../05-architecture/module-01-platform-core.md, ../05-architecture/adr/ADR-001-offline-first-multi-tenant.md, ../06-decisions/decision-log.md, ../08-delivery/day-14.md
---

# Designer questions and answers

60 questions the designer left in Figma ("For the PO" notes, file POS Product).

- **Module 1 (26)** — **answered on 3 Oct** (D-36). The answers are in the HTML, in the [Module 1 handoff v2](../05-architecture/module-01-platform-core.md) and beside each note in Figma ("PO answers" frames). Design changes they cause are [Day 14](../08-delivery/day-14.md).
- **Cashier (34)** — Module 2. Each has a **proposed** answer from the flows; the ones marked *client* wait for a decision. They are closed with the Module 2 handoff (POSD-105).

Status: `answered` · `proposed` · `client` (needs a client decision first).
Source of the answers: the flows and ownership rules first, then the stack ([ADR-001](../05-architecture/adr/ADR-001-offline-first-multi-tenant.md): till → branch server → cloud).

## Branches and registers — note `114:1888` (Module 1)
| # | Question (short) | Answer | In HTML | Status |
|---|---|---|---|---|
| B1 | Which sample data is the seed? | **One seed set:** Electro Café = 1 branch (`MAIN`), 2 registers, 7 people, 15 items — [seed](../../clients/electro-cafe/seed.md). Figma may keep its 3-branch demo, labelled "sample". | ✓ panel and till share it | answered |
| B2 | No branch record: edit, pause, close? | **Edit** name, city, code · **Pause / resume** (no new shifts; open shifts can close; nothing deleted). No close or delete in Module 1. | ✓ | answered |
| B3 | Branch code: generated or chosen? | **HQ chooses** (2–4 letters or digits, unique in the tenant). **Locked after the first invoice.** | ✓ | answered |
| B4 | Registers: rename, move, retire? | **Rename** and **retire** (history kept, frees a plan slot, refused while a shift is open). **No move.** | ✓ | answered |
| B5 | Active/Paused or Open/Offline? | Two things. **Branch status** (HQ sets): Active / Paused. **Branch server link** (derived): Online / Offline / Not set up. Never merged. | ✓ | answered |
| B6 | "12 sales waiting to sync" — can the backend know? | The count belongs to the **branch server**, not a register, and is "as of the last sync". Show it on the branch server block. | ✓ | answered |
| B7 | At the plan limit: disabled or hidden? | **Disabled**, with the reason and "Request upgrade". | ✓ | answered |
| B8 | *(new, from the stack)* Invoice series per register? | **No — one series per branch:** `EC-MAIN-000001`. The branch server gives every number. `EC-MAZ-R1` in Figma becomes `EC-MAZ-000001`. | ✓ | answered · D-27 revised |
| B9 | *(new, from the stack)* Where is the branch server? | A block per branch: link status, last sync, waiting to sync, version, **setup code** (once, 24 h). | ✓ | answered |

## People and roles — note `114:1898` (Module 1)
| # | Question (short) | Answer | In HTML | Status |
|---|---|---|---|---|
| P1 | Which name? | **"People and roles"** — one page, two tabs: *People*, *Permissions*. One sidebar entry. | ✓ | answered |
| P2 | HQ manager and accountant can't sign in | **Back-office access:** email or phone + a password set from an invite link (7 days). Owner, HQ manager, accountant always; branch manager optional; cashier and barista never. | ✓ | answered |
| P3 | Status, editing, leaving | **Invited / Active / Disabled.** Everyone can be edited. Leaving = **disable**, never delete. The owner can't be disabled. | ✓ | answered |
| P4 | How does a new person get a PIN? | HQ saves the person → a **temporary 4-digit PIN is shown once** → the person must change it at the first till sign-in. "Reset PIN" does the same. | ✓ | answered |
| P5 | Card format | The **printed 8-digit number**, scanned (HW-04) or typed. Shown as `4002 1877`. NFC later. | ✓ | answered · client confirms the card stock |
| P6 | Requirement IDs in labels | Removed from labels; they stay as small grey reference tags. | ✓ | answered |
| P7 | Matrix defaults look odd | Keep the client-spec defaults until the owner confirms (Owner can't sell; HQ manager can't manage people). | unchanged | client |
| P8 | "Changed by … on …" above the matrix | **Keep** — it is the audit trail. | ✓ | answered |
| P9 | Arabic role name mismatch | **"مدير الإدارة المركزية"** everywhere. | ✓ | answered |
| P10 | *(new, from the stack)* When does a change reach the till? | At the branch's **next sync**. The People tab says so and shows each branch's last sync. | ✓ | answered |

## Menu — note `114:1910` (Module 1)
| # | Question (short) | Answer | In HTML | Status |
|---|---|---|---|---|
| M1 | Item record as a full page | **OK** in Figma. The HTML keeps a wide dialog with the same fields. | same fields | answered |
| M2 | Sub-category on the form | **Yes** (two levels). | ✓ | answered |
| M3 | Sold at any set of branches? | **Yes** — "All branches" or a list; saved. | ✓ | answered |
| M4 | Image rules | Square · at least 600 × 600 · JPG or PNG · up to 2 MB. Add / Replace / Remove. No image → name on a colour tile. | ✓ | answered |
| M5 | "Paused at …" in the item list | **OK.** | Catalogue page | answered |
| M6 | Cost, reorder level, supplier, tax | **Not on the item in Module 1.** Cost, reorder and supplier come with Module 4; tax waits for D-03. | — | answered |
| M7 | Item-specific option prices | **Yes.** A group has default prices; an item can set its own per choice. Groups and choices can be added and edited. | ✓ | answered |
| M8 | Categories: rename, reorder, delete | Rename and reorder **yes**; delete **only when empty**; two levels. | ✓ | answered |
| M9 | Barcode per item or per size? | **One per item.** | ✓ | answered |
| M10 | Arabic spelling | Item **"شاي أسود"**; **"الإنجليزية"** everywhere. | ✓ | answered |

## Cashier sale and payment — note `127:2568` (Module 2)
| # | Question (short) | Proposed answer | Status |
|---|---|---|---|
| C1 | Menu data differs between till and HQ | Fixed: one seed set (B1). | answered |
| C2 | Option prices differ; no Milk group on the till | Fixed: +4,000 / +7,000 and the Milk group on both. | answered |
| C3 | "Required" with a preselected default | Keep a default (speed at the counter); "Required" means it can't be left empty. HQ sets the default per group later. | proposed |
| C4 | Order number | **Daily number per branch**, starts at 1 each business day, shown as 3 digits; given by the branch server (POS-02). The prototype's random number is a bug to fix. | proposed |
| C5 | Invoice number visible? | Format is now `EC-MAIN-000001` (D-27 revised). **On the receipt: yes** (FIS-03). On the customer display: no — the customer sees the order number. | proposed · accountant confirms the format |
| C6 | Change rounding; change in USD | Change is given in **SYP only**, on the 500 step. Which way to round is the client's call. | client (D-11, D-29) |
| C7 | Card on the till but off at HQ | The till shows only the methods HQ switched on. The prototype till must read the same setting. | proposed |
| C8 | Wallet reference state | Drawn on Day 12 (03b). | answered |
| C9 | "Set by HQ" marker on the till | **No.** The cashier can't change these values, so the marker adds nothing. Only the rate shows "today's rate · time". | proposed |
| C10 | No tax line; tax ID "—" | Hide both until D-03 is decided. | client (D-03) |
| C11 | What goes behind "More" | Keep Hold and Discount visible; Split, Staff meal, Clear behind More. | proposed · check in UAT |
| C12 | Paid screen content | Total, payments, change, order number. "Sent to preparation" only in pay-first mode. | proposed |
| C13 | Digits in Arabic | **Latin digits everywhere** (prices, numbers, dates). | proposed |
| C14 | "Waits for D-xx" wording | One wording: **"Waits for D-xx"**. These markers are for us, not for the shipped product. | proposed |

## Cashier part 2 — note `181:8174` (Module 2, Day 13)
| # | Question (short) | Proposed answer | Status |
|---|---|---|---|
| K1 | FLOW-02, 03, 05 "not in the repo" | They are in the repo: `docs/03-flows/FLOW-02-pay-later.md`, `FLOW-03-cancel-refund.md`, `FLOW-05-offline.md` (GitHub `PosD`). Links are now in the Figma answer. | answered |
| K2 | Order card: time and total | **Yes** — minutes since confirmed, and the total when unpaid. | proposed |
| K3 | Cancel an unpaid order; walk-away | **Cancel order** with a reason (manager PIN once preparation has started). A walk-away is a cancel with reason "Customer left"; made items go to waste. | proposed · D-07 for the waste part |
| K4 | Ready + unpaid: no Hand over | **Confirmed** — pay before hand-over (FLOW-02). | proposed |
| K5 | "Reprint ticket" on the order card | **Yes**, when the ticket failed to print. | proposed |
| K6 | Order number rule | Same as C4. | proposed |
| K7 | When does the kitchen timer start? | When the ticket reaches the kitchen: at **payment** (pay first) or at **confirm** (pay later). The 8 minutes is a branch setting. | proposed · D-14 |
| K8 | Done / Recall; Unpaid on the kitchen card | "Ready" ends the kitchen's part; add **Recall** for 2 minutes. The kitchen card shows **Unpaid** like the paper. Fix the hint for pay later. | proposed |
| K9 | Is Kitchen its own device? | Paper tickets are the kitchen at go-live (KDS by printer). The Kitchen screen stays under Menu on the till. | proposed · D-14 |
| K10 | Invoices: search, filter, paging | Current shift + **search by invoice or order number**. No paging at go-live. | proposed |
| K11 | Key facts beside the paper | **OK.** | proposed |
| K12 | Cancel reasons; which manager | A short **reasons list** + "Other"; **any manager's PIN** (the name is recorded). Arabic "رجوع" for dismiss. | proposed |
| K13 | Refund rules; over-refund bug | Refund the **net amount paid** (payments minus change), in SYP cash unless the payment was USD with no change. Card and wallet payments are refunded through the provider, recorded with a reference — never from the drawer. Confirm before refunding. The slip shows the amount refunded. The prototype's over-refund is a bug to fix. | client (D-05) |
| K14 | "Awaiting refund" status | **Yes.** | proposed |
| K15 | First print marked COPY | The **first** print is the original; every later one is COPY. | proposed |
| K16 | "Tax ID: —" | Hide the line until there is a tax ID. Company tax number: "الرقم الضريبي للشركة". | client (D-03) |
| K17 | Sync pills | With the branch server there are two facts: **till ↔ branch server** (Connected / Not connected) and **branch ↔ Quantara** (Online / Offline, "n sales waiting"). Count **sales only**. | proposed |
| K18 | Retention 2 days; rate after sync | Warn when fewer than 2 days of the 7 are left. The sync report shows the **new rate** when it changed. | proposed · D-12 |
| K19 | No ✕ on "Was this payment received?" | **Confirmed** — the cashier must answer. "No" returns to payment with the order intact; the customer is asked to pay. | proposed |
| K20 | Discard failed print jobs; "Out of paper" | A manager can **discard** a failed job (logged). Add **Out of paper** to the printer states. Latin digits and correct plurals: yes. | proposed |

## What the answers changed
- HTML: see the "In HTML" columns — Module 1 is done. Cashier fixes (C4, C7, K13 and the others marked "bug") are on the Module 2 list (POSD-105).
- Backend: [Module 1 handoff v2](../05-architecture/module-01-platform-core.md).
- Design: [Day 14](../08-delivery/day-14.md).
