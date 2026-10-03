---
title: FLOW-07 Platform setup — tenant, branch, branch server, people, menu
status: draft
owner: PO
last_updated: 2026-10-03
related: ../05-architecture/module-01-platform-core.md, ../05-architecture/adr/ADR-001-offline-first-multi-tenant.md, ../01-product/ownership-boundaries.md
---

# FLOW-07 — Platform setup (Module 1)

How a café goes from "signed" to "can open a shift". Three tiers (ADR-001): **till → branch server → Quantara cloud**. Clickable in `prototype/index.html`.

## A · Quantara onboards the tenant (`#/onboarding`) — GEN-01, GEN-03
1. Quantara staff enter the business name (EN, AR), the **tenant code** (2–4 letters, unique, never changes) and the **owner's name and email**.
2. Choose plan, currency, time zone.
3. First branch: name (EN, AR), city, **branch code** (2–4 letters), number of registers (within the plan).
4. Review — shows the first invoice number, e.g. `EC-MAIN-000001`.
5. Create → tenant is *Onboarding*; the owner is *Invited* and gets a link to set a password. The branch server is *Not set up*.

- Quantara never sees a password or a PIN.
- More registers than the plan allows → refused with the plan's limit.

## B · HQ sets up a branch (`#/hq/<tenant>/branches`) — GEN-02, CSH-08
1. **Add branch** → names, city, code. The code must be unique in the tenant.
2. **Create setup code** → a one-time code (24 h). The installer enters it on the branch server; the box enrols and starts syncing.
3. **Add register** → name. It works once the till connects to the branch server.
4. Later: **edit** the branch · **pause / resume** · **rename** or **retire** a register · **replace the branch server** (new setup code).

| Rule | What happens |
|---|---|
| Plan limit reached | "Add" is disabled; the banner offers "Request upgrade" |
| Branch has invoices | The code is locked |
| Branch paused | Tills can't open a new shift; open shifts can close |
| Retire a register with an open shift | Refused — close the shift first |
| Retired register | Keeps its history, frees a plan slot, can't come back |
| Branch server offline | The branch keeps selling; the panel shows "Not synced since …" and how much is waiting |

## C · HQ adds people (`#/hq/<tenant>/people`) — USR-01…06
1. **Add a person** → name (EN, AR), role, branches.
2. **Back-office access** (owner, HQ manager, accountant; optional for a branch manager) → email or phone → invite link (7 days) → the person sets a password → *Active*.
3. **Till sign-in** (branch manager, cashier, barista) → PIN, card (8 digits), or both.
4. Save → a **temporary PIN is shown once**. The person changes it at the first till sign-in.
5. Later: edit · **Reset PIN** · send the invite again · **Disable / Enable**.

- Nobody is deleted. The owner can't be disabled.
- A change reaches a branch at its **next sync**; until then the till uses the last list it received (offline sign-in).
- **Permissions** tab: tick what each role may do → Save. The owner always keeps "manage people". Every change is logged.

## D · HQ builds the menu (`#/hq/<tenant>/menu`) — CAT-01…05, POS-09
1. **Categories** (two levels): add, rename, reorder; delete only when empty.
2. **Option groups**: add or edit a group and its choices, each with the price it adds.
3. **Add an item**: names (EN, AR), category and sub-category, price, barcode (one per item), options (with this item's own option prices if they differ), image, **sold at** (all branches or a list).
4. Or import from Excel (CAT-07).
5. The menu reaches each branch at its next sync. A branch can only pause an item or add a timed discount (FLOW-06).

## Ready to sell when
Tenant active · branch active · branch server enrolled and synced once · at least one register · at least one person with till sign-in · at least one item sold at the branch.

## Edge cases
- Wrong setup code or expired → refused; create a new one.
- Two people with the same email or phone → refused.
- Item sold at no branch → refused ("choose at least one branch").
- HQ disables a cashier while the branch is offline → the cashier can still sign in until the branch syncs. Accepted risk; the audit log shows it.

## Open
- Matrix defaults for Owner and HQ manager (designer question P7) — client.
- Staff card stock and number format — client.
