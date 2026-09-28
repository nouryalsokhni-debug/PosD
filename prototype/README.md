# Quantara — HTML prototype

Three entry points, all opened straight from the file system (no build, no server):

| File | What it is | Built |
|---|---|---|
| `index.html` | Control panel: **Quantara · Tenant HQ · Branch** (three layers) | Day 4–5 (POSD-83, POSD-85) + Day 10 operations + Day 11 Quantara screens |
| `pos.html` | **Cashier app** — FLOW-01 → FLOW-05 clickable, kitchen view, customer display (`pos.html#display`) | 28 Sep |
| `requirements.html` | **All 111 requirements** → where each one is visible, and what still waits | 28 Sep |

The panel's own guide follows. Day 10, Day 11, the cashier app and the coverage page are at the end.

---

## Control panel + tenant back office (Day 4 + Day 5)

Open `index.html` directly from the file system. No build, no framework, no server.

One HTML build, three layers:

| Layer | Who uses it | Colour | Product name |
|---|---|---|---|
| **Quantara** | Our staff: onboarding, support, operations, finance | teal | Control panel |
| **Tenant HQ** | The café's head office. The client specs call this *"central"* (الإدارة المركزية). Read "central" as tenant HQ, never as us. | navy | Back office |
| **Branch** | The branch manager (and later the cashier) | plum | Branch office |

## Files
| File | What it is |
|---|---|
| `js/data.js` | The sample data. The only place data lives. Field conventions and **who owns which fields** are at the top and at the Day 5 block. |
| `js/store.js` | Read/write access to the data. Pages ask the store; swap it for API calls later. |
| `js/i18n.js` | Every visible string (EN + AR), direction, number/date/money formatting. Dates can take a tenant time zone. |
| `js/ui.js` | Shared components, each built once: table, badge, banner, dialog, form row, tabs, empty state, page header, section, toast, **plus the boundary states** (below). |
| `js/shell.js` | Sidebar · top bar · scope switch · layer trail · language toggle · scope bars · "Quantara staff is inside" bar · "Who owns what" key · prototype view-as switch. |
| `js/pages.js` | The four page kinds (`ListPage`, `RecordPage`, `SettingsPage`, `FlowPage`) and the Quantara screens. |
| `js/pages-hq.js` | The tenant HQ and branch screens, each a configuration of one of the four kinds. |
| `js/app.js` | Router. The URL is the only thing that sets scope and layer. |
| `css/panel.css` | One stylesheet, logical properties only, so RTL mirrors without overrides. |

## Scope = URL
| URL | Layer · scope |
|---|---|
| `#/tenants`, `#/onboarding`, `#/support` … | Quantara · all tenants |
| `#/t/<tenant>`, `#/t/<tenant>/branches` … | Quantara · one tenant (amber scope bar) |
| `#/hq/<tenant>`, `#/hq/<tenant>/catalogue` … | Tenant HQ (navy scope bar) |
| `#/hq/<tenant>/b/<branch>`, `…/b/<branch>/items` … | Branch (plum scope bar) |

You can't lose track of the layer. Each one has its own colour, sidebar block, scope bar, signed-in person and product name. The **layer trail** in the top bar always lists *Quantara · Tenant HQ · Branch* and fills in the one you're in. The scope switch only lists places that layer is allowed to reach: Quantara staff get tenants; HQ gets HQ and its own branches, never another tenant.

The dashed purple **"Prototype · view as"** box at the bottom of the sidebar isn't part of the product. It only moves you between layers so the three can be walked through.

## Who owns what
The PO decided this boundary. Don't reopen it here. If something is unclear, add it to the questions below.

| Topic | Quantara | Tenant HQ | Branch |
|---|---|---|---|
| Plan, limits, billing, suspension | Owns | Sees; asks to upgrade | — |
| Branches and registers | Sets the limits | Adds them itself, within the plan | — |
| Modules (tips, credit sales, loyalty, table service) | Decides if **available** | Decides if **on**, and at which branches | — |
| Catalogue, prices, offers, exchange rate | — | Owns | Pauses an item (CAT-06); time-limited item discount (PRC-10); manual discount under HQ's cap (PRC-08) |
| Business settings (§5 of the specs) | Read-only | Owns | — |
| Sales and item data | Only during support access | Owns everything | Its own branch |
| Support access | Requests it | Owner approves or refuses; can end it at any time | — |
| Invoice numbering, audit log, e-invoicing, approved hardware | Guarantees; nobody edits | Sees | — |

- **Sync conflicts:** the owner of a value wins, and the other side is told ("Changed by HQ at 10:42"). Branch overrides are separate records (`hq.<tenant>.branch_overrides`) and never overwrite HQ values. Sales, refunds and shift closes never conflict.
- **Invoice numbering:** gapless **per register**, series `<TENANT>-<BRANCH>-R<n>` (e.g. `EC-MAIN-R1`), so registers can sell offline at the same time. *Still pending: confirmation by the accountant.* The screens show this as a badge.
- **Live screen mirroring (NH-07)** is dropped from launch. HQ Home has a live order and activity feed per register instead.

The data model follows the table:
- Fields on a tenant record belong to Quantara, except the ones in `HQ_OWNED_TENANT_FIELDS`.
- Everything under `hq.<tenant>` belongs to that tenant's HQ.
- Every changeable value carries `updated_by` and `updated_at`.

The table is also one click away on every screen, under **Who owns what** in the top bar.

### Changes to the Day 4 Quantara screens to match the boundary
- **Tenant settings** (`#/t/<id>/settings`) are now **read-only** and tagged *Set by HQ*, because business settings belong to the tenant.
- **Tenant overview:**
  - The subscription panel is tagged *Set by Quantara*.
  - Usage is shown as meters.
  - A **Support access** panel lets our staff *ask* for access and shows whether the request is pending or someone is inside.
  - It also shows any upgrade request from HQ.

## Boundary states: drawn once in `ui.js`, used on every screen
| State | Component | Where to see it with sample data |
|---|---|---|
| *Set by Quantara* (read-only) | `OwnerTag({ owner: "quantara", here })` / `owner: "guaranteed"` | HQ Settings → "Set or guaranteed by Quantara"; HQ Home → Your plan |
| *Set by HQ* (locked at branch) | `OwnerTag({ owner: "hq", here: "branch" })` | Branch → Items (every price); Branch → Discounts (cap) |
| *Overridden at this branch* | `OverrideTag({ hqValue, value })` | Branch → Items: Cake slice 20% off, Croissant paused; HQ → Catalogue, Prices |
| *Plan limit reached* | `Meter` + `LimitBanner` | Harbor Coffee (sample) HQ → Branches (1 of 1 branches) |
| *Changed elsewhere / last synced* | `SyncNote({ kind: "changed" \| "synced" \| "stale" })` | Branch → Items: Latte "Changed by Tenant HQ · [HQ manager] at 10:42"; Home → Live feed: Register 2 "Not synced since…" |
| *Quantara staff is inside* | `SupportInsideBar` (in the shell) | Cedar Grill (sample) HQ, any screen. For Electro Café, approve Rana's request in Support access. |

`OwnerTag` takes the layer you're looking from, so the same HQ value reads *Set by HQ* at HQ and *Set by HQ · locked* at a branch. Locked tags have a dashed border.

## Built on Day 5
| Route | Kind | Notes |
|---|---|---|
| `#/hq/<id>` Home | Record | Today's figures, worked out from the feed; sales by branch; live feed per register; plan meters; support-access state |
| `…/catalogue` | List | HQ price, branch pauses shown as overrides, "changed by" notes |
| `…/prices` | List | HQ offers and branch discounts side by side; manual discount cap |
| `…/exchange-rate` | Settings | Rate and rounding, "changed by" note, what offline registers do |
| `…/inventory` | — | Not built yet (in the nav) |
| `…/branches` | List | Plan meters, limit banner, upgrade request, add branch and add register (within the limit), invoice series per register |
| `…/people` | List | Users and roles (inviting and editing roles is next sprint) |
| `…/reports` | — | Not built yet (in the nav) |
| `…/settings` | Settings | §5 business settings (HQ owns) + a locked group that Quantara sets or guarantees |
| `…/subscription` | Settings kind | Plan (Quantara), modules: available (Quantara) → on + which branches (HQ) |
| `…/support-access` | Record | Approve or refuse, who is inside, end access, history, append-only audit log |
| `…/b/<branch>` Today | Record | Branch figures, register feeds, what HQ set (locked) |
| `…/b/<branch>/items` | List | Pause / resume (CAT-06); HQ price locked; live discount as override |
| `…/b/<branch>/discounts` | List | Time-limited item discount (PRC-10) with validation; HQ's manual cap (PRC-08) locked |
| `…/b/<branch>/cash` | List | Shifts (cash counts are next sprint) |
| `…/b/<branch>/reports` | — | Not built yet (in the nav) |

The prototype runs on a sample clock, `QuantaraData.clock` (23 Sept 2026, 11:45 Damascus). It ticks from when the page opens, so anything you do lands on the same "today" as the sample data.

## Sample data
- **Electro Café** is the real tenant. Its catalogue, prices, exchange rate, sales and people are **placeholders** (listed in `placeholder_fields`). A banner says so on every HQ and branch screen. People are shown as `[Owner]`, `[HQ manager]` and so on. None of it is their menu.
- **Harbor Coffee (sample)** is at its branch limit (Starter, 1 of 1).
- **Cedar Grill (sample)** has an approved support session open and a branch pause at Al Malqa.
- **Olive & Thyme (sample)** is suspended by Quantara, so HQ sees the suspension and adding is disabled.

## Adding a screen
1. Write a function in `pages.js` (Quantara) or `pages-hq.js` (tenant side) that returns `ListPage`, `RecordPage`, `SettingsPage` or `FlowPage`. Any value someone owns gets an `OwnerTag`, `OverrideTag` or `SyncNote`.
2. Add a route in `app.js`.
3. Add the strings to both languages in `i18n.js`.

`ListPage` takes `before` (banners, meters) and an empty `filters` list. `SettingsPage` rows take `tag` (owner), `note` (sync note) and `locked: true` (no control, owner tag instead).

Changes you make in the panel (suspend, settings, new tenant, approvals, pauses, discounts, modules) stay in memory until you reload. There's no back end yet.

## Open questions for the PO (UX Analysis page)
The table didn't settle these. Each one says what the prototype does for now.

**Layers and navigation**
1. Can HQ staff **act** in a branch view (pause an item, add a branch discount), or only look? *Now: HQ can open a branch and the branch controls work.*
2. Does a branch manager ever see a way up to HQ? *Now: the branch scope bar has a "Tenant HQ" link. Production would probably hide it for branch roles.*
3. Should branch staff see *Quantara staff is inside*? The table gives the branch no part in support access, but Quantara may be reading that branch's sales. *Now: shown at HQ only.*

**Catalogue and prices**
4. Is a branch's **time-limited item discount (PRC-10)** limited by HQ's **manual discount cap (PRC-08)**, or does the cap cover only manual discounts at the register? *Now: not capped (1–100%).*
5. What happens when a branch pauses an item that is part of a live HQ offer? (The sample has this: Croissant is paused at Main branch while the "Morning pair" bundle is live.) Is the bundle unavailable at that branch, or sold without it? *Now: not handled.*
6. HQ changes a price while a branch discount is live. Does the % apply to the new price? *Now: yes, the discount is a % of HQ's current price.*
7. HQ deletes or renames an item that a branch paused while offline. Which wins, and who is told? *Now: not handled.*
8. Exchange rate: an offline register keeps the last rate it had. Should its receipts print the rate used? Can both the owner and the HQ manager change the rate? *Now: offline keeps the old rate; any HQ user can change it.*

**Branches, registers, plan**
9. Does a new register count toward the plan limit when HQ creates it, or only once it's paired with approved hardware? *Now: at creation.*
10. Who sets a branch's code in the invoice series (`EC-**MAIN**-R1`), and can it change after invoices exist? *Now: made automatically when the branch is created and shown as guaranteed.*
11. When HQ asks to upgrade, does it pick a target plan and see a price, or just ask? *Now: a bare request; Quantara replies.*
12. Is module availability set per plan or per tenant? *Now: stored per tenant (`modules_available`).*

**Support access**
13. Only the owner approves. What if the owner can't be reached? Can they delegate? *Now: owner only.*
14. Can more than one Quantara session be open at once? *Now: one at a time.*
15. Who sets how long access lasts and what it covers (read sales vs. change catalogue)? Can the owner shorten or narrow it when approving? *Now: Quantara sets both in the request; the owner can only approve, refuse or end.*

**Suspension and settings**
16. While Quantara has suspended a tenant, can HQ still read reports and export its data? *Now: screens are readable; adding branches or registers, new discounts and module changes are disabled.*
17. §5 settings such as "Manager PIN for refunds": can a branch ever have its own value, or is it always HQ's? *Now: HQ's value, locked at the branch.*

**Not decided here (needs Electro Café):** real branches, registers, menu, prices, rate, users. They stay placeholders.

## Inputs used
- Day 5 used the decided boundary from POSD-85 and the Day 4 build.
- The `POS_Specs_Client-v1` sections, the `POS Requirments.xlsx` sheets and the Days 1–3 findings weren't in the Day 5 hand-off. Check the requirement IDs used here (CAT-06, PRC-08, PRC-10, NH-07) and the §5 settings list against them.
- The Day 4 zip used here didn't include the `OwnerTag`/`Meter` components or a "Who owns what" section. Both were written here. If a newer Day 4 build has its own versions, merge them into `ui.js` and keep one of each.


---

## Day 10 — operations screens (panel)
Built on the same four page kinds and components. Files: `js/data-ops.js` (generated sample history, stock, rules), `js/i18n-ops.js` (strings, added through `I18n.extend`), `js/pages-ops.js` + `js/pages-ops2.js` (screens), `css/ops.css`. Edits to the Day 4–5 files are small: routes in `app.js`, nav items in `shell.js`, script tags in `index.html`, one `extend` method in `i18n.js`.

| Route | Kind | Requirements |
|---|---|---|
| `#/operations` (Quantara) | List | Register health across tenants — OFF-07, OFF-05 |
| `#/hq/<id>/menu` | Record | Items with both names, sub-categories, options, barcode, image, sold-at, Excel import — CAT-01…05, CAT-07, POS-09 |
| `#/hq/<id>/promotions` | Record | Offers (combo, offer of the day, segment), price history, tax — PRC-02…09 |
| `#/hq/<id>/inventory` | Record | Stock, movements, purchasing + receive, waste, stock count, warehouse (phase 2), margin (phase 2) — STK-01…10 |
| `#/hq/<id>/roles` | Matrix | Permission matrix, add person (card login, several branches) — USR-01…07 |
| `#/hq/<id>/reports` | Record | Summary, items, staff, cash, discounts & voids, branches, hours, payments & exchange differences, export — RPT-01…09, PAY-05 |
| `#/hq/<id>/payments` | Settings | Payment methods, mixed payment, rate link, modules — PAY-01…11 |
| `#/hq/<id>/till` | Settings | Float, variance, drawer, order number, pay later, split, invoice content, company invoice, reprint, KDS, offline retention, login, staff meals — CSH, POS, FIS, KDS, OFF, USR |
| `#/hq/<id>/devices` | List | Devices per register + approved hardware — HW-01…07 |
| `…/b/<branch>/shifts` | List | Closed shifts with cash counts; count and close an open shift; shift report — CSH-02…07 |
| `…/b/<branch>/stock` | Record | Branch stock, waste, count — STK-01, STK-05, STK-06 |
| `…/b/<branch>/reports` | Record | Branch reports — RPT-01…09 |

**Sample history:** 14 days before the prototype clock (9–22 Sept) are generated from a fixed seed, so every reload shows the same figures. Today still comes from the live feed. Placeholder values that wait for a client decision carry an amber **Waits for D-xx** tag.

## Day 11 — Quantara's own screens (panel)
The control panel is complete: 13 screens plus shared screen states. Files: `js/data-billing.js` (plans, add-ons, subscriptions, invoices, tickets, approved hardware), `js/i18n-quantara.js`, `js/pages-quantara.js`. Edits elsewhere: routes in `app.js`, script tags in `index.html`, styles appended to `css/ops.css`.

| Route | Kind | What it does |
|---|---|---|
| `#/billing` | List | Revenue tiles, every invoice, filter by status/tenant, record payment (method + reference), send reminder. Paying the last overdue invoice ends grace/read-only |
| `#/support` | List | Every ticket; click a subject to assign, set priority, reply, wait on tenant, solve/reopen, ask for support access (owner approves) |
| `#/settings` | Settings | Plan prices per branch, add-on prices, approved hardware (HW-07), billing rules (trial, grace, yearly discount, read-only after grace). "The till never stops" is fixed |
| `#/states` | Gallery | The five states every screen uses: `UI.StateView({ kind: "empty" \| "loading" \| "error" \| "offline" \| "forbidden" })` |
| `#/t/<id>/subscription` | Record | Plan, cycle, price breakdown (`QPages.quote`), add-ons per branch, invoices, lifecycle trial → active → grace → read-only → suspended |
| `#/t/<id>/people` | List | Names and roles across branches; Quantara never sees PINs; shows who approves support access |
| `#/t/<id>/support` | List | This tenant's tickets, new ticket, link to support access |

**Pricing model (R-05, D-32 proposed):** per branch per month — Starter $35 (2 registers), Growth $60 (3 registers), Chain on quote; add-ons per branch; USD; yearly = 2 months free; 30-day trial; 7-day grace, then HQ read-only. Every price carries **Waits for D-32**.

## Cashier app (`pos.html`)
Scripts: `js/pos-data.js · pos-i18n.js · pos-store.js · pos-more.js · pos-print.js · pos-offline.js · pos-app.js`; styles `css/pos.css`. Same language key as the panel. Demo logins: Rana 1111 · Omar 2222 (cashiers) · Lina 9999 (branch manager) · or **Tap staff card**.

| Flow | Try it |
|---|---|
| FLOW-01 Counter sale | Items → options → dine-in/takeaway → Hold/Held → Manual discount (manager) → Pay (USD + SYP, wallets need a reference, **Invoice to a company**) → receipt + prep ticket → Kitchen → Orders: Ready → Hand over |
| FLOW-02 Pay later | Status pill → Demo → Sale mode *Pay later* → Confirm order → Orders: Ready → Take payment |
| FLOW-03 Cancel & refund | Invoices → Cancel (manager + reason) → Refund cash → **Reprint** → Menu → Audit log |
| FLOW-04 Shift & drawer | Opening float → Menu → Open drawer → Close shift (manager counts per currency) → report |
| FLOW-05 Offline | Demo → Go offline → sell → Simulate power cut → Go online |
| Printing (HW-02, FIS-01/02/07) | Pay → **Print receipt** (only when the customer asks) · **Preview** → **Print (80 mm)** prints real receipt width from the browser · kitchen ticket per station prints by itself · Invoices → Reprint = COPY · refund slip · shift slip |
| Printer problems | Status pill → Demo → **Receipt printer: Out of paper / Printer off**, **Kitchen printer: off** → sell: the sale is saved, a warning shows, the job waits in Menu → **To print** (top bar shows 🖨). Turning the printer back on prints nothing by itself (no duplicate tickets); use Retry / Retry all. A kitchen ticket printed late says so |
| Long outage & power cut (OFF-01…09) | Status pill → Demo → Go offline → **+2 hours offline** (twice: red warning) → **Next day** (last known USD rate, marked on the receipt) → **HQ changes the menu meanwhile** → Go online → **Sync report** (sent + HQ changes applied). Online: start a payment with Syriatel Cash → Demo → **Power cut during payment** → the payment comes back and the till asks *Was this payment received?* |
| Also | **Split bill** (POS-05), **Staff meal** (USR-07), **Kitchen** by station with waiting time (KDS-01…06), **Customer display** in a second window (Menu → Open customer display, HW-05) |

The ✓ button opens the **flow guide**; steps tick themselves.

## Requirements coverage (`requirements.html`)
Every requirement with its *10 Nov* scope and where to see it. Regenerate after changing a screen or the requirements list: `python prototype/tools/build-coverage.py` (edit its map when a screen moves).
