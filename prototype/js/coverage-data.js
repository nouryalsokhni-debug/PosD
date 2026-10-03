/* Generated from docs/02-requirements/requirements.md + the prototype map. Regenerate when either changes. */
window.COVERAGE = [
{
"id": "GEN-01",
"module": "M1",
"domain": "General & Platform",
"title": "Multi-tenant system",
"detail": "Each client's data is fully isolated from every other client's, and more than one client can run on the same instance",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"All tenants",
"index.html#/tenants"
],
[
"Tenant HQ",
"index.html#/hq/electro-cafe"
]
],
"decision": ""
},
{
"id": "GEN-02",
"module": "M1",
"domain": "General & Platform",
"title": "Support for multiple branches under a single client",
"detail": "Adding a new branch is an administrative action requiring no code change",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Branches and registers",
"index.html#/hq/electro-cafe/branches"
]
],
"decision": ""
},
{
"id": "GEN-03",
"module": "M1",
"domain": "General & Platform",
"title": "Bilingual interface with switching",
"detail": "Arabic and English, switched from inside the interface without restarting",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier app",
"pos.html"
],
[
"Panel (AR/EN toggle)",
"index.html#/hq/electro-cafe"
]
],
"decision": ""
},
{
"id": "GEN-05",
"module": "M1",
"domain": "General & Platform",
"title": "Measurable ease of use",
"detail": "A typical sale completed in three taps maximum, and a new employee trained within thirty minutes",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · sale in 3 taps",
"pos.html"
]
],
"decision": ""
},
{
"id": "POS-01",
"module": "M2",
"domain": "Sales",
"title": "Order-at-counter sale, pay first",
"detail": "The order is paid for before preparation",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · FLOW-01",
"pos.html"
]
],
"decision": ""
},
{
"id": "POS-01-01",
"module": "M2",
"domain": "Sales",
"title": "Order-at-counter sale, pay later",
"detail": "The order is paid for after preparation",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Demo → Pay later",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "POS-02",
"module": "M2",
"domain": "Sales",
"title": "Daily random order number",
"detail": "Four digits",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · order #",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "POS-02",
"module": "M2",
"domain": "Sales",
"title": "Sequential invoice number",
"detail": "JV:20260800001 — not shown when printing; hidden from the customer",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · invoice no.",
"pos.html"
],
[
"Settings · series",
"index.html#/hq/electro-cafe/settings"
]
],
"decision": ""
},
{
"id": "POS-03",
"module": "M2",
"domain": "Sales",
"title": "Edit the order cart before payment",
"detail": "Add, remove and change quantity",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier app",
"pos.html"
]
],
"decision": ""
},
{
"id": "POS-04",
"module": "M2",
"domain": "Sales",
"title": "Select item options at the point of sale",
"detail": "Size and sugar level, with size affecting the price",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · options sheet",
"pos.html"
]
],
"decision": ""
},
{
"id": "POS-05",
"module": "M2",
"domain": "Sales",
"title": "Split the bill between more than one customer",
"detail": "Split by amount or by item",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Split bill",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "POS-06",
"module": "M2",
"domain": "Sales",
"title": "Park an order and resume it",
"detail": "To serve another customer without cancelling the first order",
"priority": "Should",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Hold / Held",
"pos.html"
]
],
"decision": ""
},
{
"id": "POS-07",
"module": "M2",
"domain": "Sales",
"title": "Flag the order: dine-in or takeaway",
"detail": "Appears on the preparation screen and in the reports",
"priority": "Should",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier app",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "POS-08",
"module": "M2",
"domain": "Sales",
"title": "Table service and opening a tab on a table",
"detail": "Pay-after-consumption model",
"priority": "Could",
"phase": "Phase 2",
"nov10": "LATER",
"state": "phase2",
"links": [
[
"Subscription · table service",
"index.html#/hq/electro-cafe/subscription"
]
],
"decision": ""
},
{
"id": "POS-09",
"module": "M2",
"domain": "Sales",
"title": "Find an item by name or barcode",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · search / barcode",
"pos.html"
],
[
"Menu setup · barcode",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "POS-10",
"module": "M2",
"domain": "Sales",
"title": "Void an invoice after payment, with a mandatory reason",
"detail": "The operation is permission-restricted and logged; two methods together — via QR and via a free-form random return",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Invoices → Cancel",
"pos.html"
]
],
"decision": ""
},
{
"id": "CAT-01",
"module": "M1",
"domain": "Items & Menu",
"title": "Central catalogue reflected across all branches or selected branches, presenting only specific items per client",
"detail": "Editing is done by central administration only",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Catalogue",
"index.html#/hq/electro-cafe/catalogue"
],
[
"Menu setup",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "CAT-02",
"module": "M1",
"domain": "Items & Menu",
"title": "Item name in two languages",
"detail": "On screen and on the invoice",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Menu setup · item",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "CAT-03",
"module": "M1",
"domain": "Items & Menu",
"title": "Categorise items into categories (more than one level)",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Menu setup · categories",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "CAT-04",
"module": "M1",
"domain": "Items & Menu",
"title": "Item options/attributes with or without a price effect",
"detail": "Size changes the price; sugar level does not",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Menu setup · options",
"index.html#/hq/electro-cafe/menu"
],
[
"Cashier · options",
"pos.html"
]
],
"decision": ""
},
{
"id": "CAT-05",
"module": "M1",
"domain": "Items & Menu",
"title": "Item images on the cashier screen (multiple images per variant)",
"detail": "Serves the ease-of-use requirement for a low-experience employee",
"priority": "Should",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · item grid",
"pos.html"
],
[
"Menu setup · image",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "CAT-06",
"module": "M1",
"domain": "Items & Menu",
"title": "Temporarily suspend an item at branch level",
"detail": "When an ingredient runs out",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Branch · Items",
"index.html#/hq/electro-cafe/b/ec-main/items"
]
],
"decision": ""
},
{
"id": "CAT-07",
"module": "M1",
"domain": "Items & Menu",
"title": "Ability to import the catalogue via Excel",
"detail": "",
"priority": "",
"phase": "",
"nov10": "LATER",
"state": "works",
"links": [
[
"Menu setup · import",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": ""
},
{
"id": "PRC-01",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "One price across all branches, with a structure that allows a price per branch",
"detail": "The current value is uniform; the structure supports variation in future",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Catalogue",
"index.html#/hq/electro-cafe/catalogue"
]
],
"decision": ""
},
{
"id": "PRC-02",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Price changes restricted to central administration",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Price history",
"index.html#/hq/electro-cafe/promotions"
],
[
"Prices",
"index.html#/hq/electro-cafe/prices"
]
],
"decision": ""
},
{
"id": "PRC-03",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Historical log of price changes",
"detail": "Who changed it, when, and the previous value",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Price history",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": ""
},
{
"id": "PRC-04",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Combo offers — centrally only",
"detail": "A group of items at a single price",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · combo",
"pos.html"
],
[
"Offers",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": ""
},
{
"id": "PRC-05",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Offer of the day — centrally only",
"detail": "A discount on an item or a category within a time window",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · offer of the day",
"pos.html"
],
[
"Offers",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": ""
},
{
"id": "PRC-06",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Discount for a defined customer segment — centrally only",
"detail": "Mall-staff discount at a configurable percentage, tied to proof of identity",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Offers · mall staff",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": "D-17"
},
{
"id": "PRC-07",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Points-based loyalty programme — centrally only",
"detail": "Accumulating and redeeming points",
"priority": "Should",
"phase": "Phase 2",
"nov10": "LATER",
"state": "phase2",
"links": [
[
"Offers · loyalty",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": ""
},
{
"id": "PRC-08",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Manual discount and its limits, configured centrally only",
"detail": "Who holds the permission, and the discount ceiling",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · manual discount",
"pos.html"
],
[
"Settings · cap",
"index.html#/hq/electro-cafe/settings"
]
],
"decision": "D-04"
},
{
"id": "PRC-09",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "Displayed prices are tax-inclusive",
"detail": "Tax is extracted for reporting, not added at payment",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "decision",
"links": [
[
"Offers · tax",
"index.html#/hq/electro-cafe/promotions"
]
],
"decision": "D-03"
},
{
"id": "PRC-10",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "The branch can set a custom price (discount) on a specific item in the cart, with a time window",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Branch · discounts",
"index.html#/hq/electro-cafe/b/ec-main/discounts"
]
],
"decision": ""
},
{
"id": "PRC-11",
"module": "M4",
"domain": "Pricing & Promotions",
"title": "(Empty row in the source — requirement text missing)",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "open",
"links": [],
"decision": ""
},
{
"id": "PAY-01",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Multiple payment methods, enableable per branch",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Payment methods",
"index.html#/hq/electro-cafe/payments"
],
[
"Cashier app",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-02",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Cash in Syrian pounds",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · cash SYP",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-03",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Cash in US dollars as a second currency",
"detail": "Automatic conversion and display of the amount in both currencies",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · cash USD",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-04",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Central daily exchange rate",
"detail": "Entered centrally, applies to all branches, and is fixed onto the invoice at the time of sale",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Exchange rate",
"index.html#/hq/electro-cafe/exchange-rate"
],
[
"Cashier · pinned rate",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-05",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Exchange-difference report",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Reports · Payments",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "PAY-06",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Card payment via the payment terminal",
"detail": "Linking the terminal to the system to avoid entering the amount manually twice",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Payment methods · card",
"index.html#/hq/electro-cafe/payments"
],
[
"Cashier · card",
"pos.html"
]
],
"decision": "D-29"
},
{
"id": "PAY-07",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Syriatel Cash",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Syriatel Cash",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-08",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Sham Cash",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Sham Cash",
"pos.html"
]
],
"decision": ""
},
{
"id": "PAY-09",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Mixed payment on a single invoice",
"detail": "More than one payment method for the same invoice",
"priority": "Should",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · mixed payment",
"pos.html"
]
],
"decision": "D-10"
},
{
"id": "PAY-10",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Rounding rule for the final amount",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · rounding",
"pos.html"
]
],
"decision": "D-11"
},
{
"id": "PAY-11",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Tips and deferred/credit sales disabled",
"detail": "The structure exists but both features are switched off",
"priority": "Could",
"phase": "Phase 2",
"nov10": "LATER",
"state": "phase2",
"links": [
[
"Payment methods · modules",
"index.html#/hq/electro-cafe/payments"
]
],
"decision": ""
},
{
"id": "PAY-12",
"module": "M2",
"domain": "Payment & Currencies",
"title": "Cash refund to the customer with a mandatory reason",
"detail": "Logged under the employee's name",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Refund cash",
"pos.html"
]
],
"decision": "D-05"
},
{
"id": "CSH-01",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Open a shift with an opening float",
"detail": "Per currency separately",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · open shift",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-23"
},
{
"id": "CSH-02",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Close a shift with a physical cash count",
"detail": "Entering the actual amount for each currency",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · close shift",
"pos.html"
],
[
"Branch · shift reports",
"index.html#/hq/electro-cafe/b/ec-main/shifts"
]
],
"decision": ""
},
{
"id": "CSH-03",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Calculate the variance between expected and actual",
"detail": "Displayed and recorded",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · close shift",
"pos.html"
],
[
"Branch · shift reports",
"index.html#/hq/electro-cafe/b/ec-main/shifts"
]
],
"decision": ""
},
{
"id": "CSH-04",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Variance-handling procedure",
"detail": "Permitted threshold, approving authority, and the consequence of exceeding it",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · variance reason",
"pos.html"
],
[
"Branch · count",
"index.html#/hq/electro-cafe/b/ec-main/shifts"
]
],
"decision": "D-06"
},
{
"id": "CSH-05",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Prevent cash withdrawals during the day",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "CSH-06",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Open the cash drawer without a sale",
"detail": "Permission-restricted and logged with the reason",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Menu → Open drawer",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "CSH-07",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Shift report at close",
"detail": "Displayed and printable",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · shift report",
"pos.html"
],
[
"Branch · report",
"index.html#/hq/electro-cafe/b/ec-main/shifts"
]
],
"decision": ""
},
{
"id": "CSH-08",
"module": "M3",
"domain": "Cash Drawer & Shifts",
"title": "Number of POS terminals in the branch",
"detail": "Running more than one cashier against the same stock and the same orders",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Branches and registers",
"index.html#/hq/electro-cafe/branches"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-13"
},
{
"id": "KDS-01",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "Order display screen in the preparation area",
"detail": "Replaces paper and calling out orders verbally",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Kitchen",
"pos.html"
]
],
"decision": ""
},
{
"id": "KDS-02",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "The order arrives as soon as payment is confirmed",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Kitchen",
"pos.html"
]
],
"decision": ""
},
{
"id": "KDS-03",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "Order states: new, in preparation, ready",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Kitchen / Orders",
"pos.html"
]
],
"decision": ""
},
{
"id": "KDS-04",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "Route items to different preparation stations",
"detail": "Coffee, kitchen, juices",
"priority": "Should",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Cashier · Kitchen stations",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-14"
},
{
"id": "KDS-05",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "Order waiting-time indicator",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Kitchen timer",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "KDS-06",
"module": "M2",
"domain": "Kitchen Display (KDS)",
"title": "Announce the number of the ready order",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Orders → Ready / display",
"pos.html"
]
],
"decision": ""
},
{
"id": "USR-01",
"module": "M1",
"domain": "Users & Permissions",
"title": "Predefined roles",
"detail": "Cashier, barista, branch manager, accountant, owner",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Roles and permissions",
"index.html#/hq/electro-cafe/roles"
]
],
"decision": ""
},
{
"id": "USR-02",
"module": "M1",
"domain": "Users & Permissions",
"title": "Editable permissions matrix",
"detail": "Every sensitive operation is tied to a role",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Roles and permissions",
"index.html#/hq/electro-cafe/roles"
]
],
"decision": ""
},
{
"id": "USR-03",
"module": "M1",
"domain": "Users & Permissions",
"title": "Employee login by card",
"detail": "An alternative to a password, to speed up work",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · Tap staff card",
"pos.html"
],
[
"Roles · add person",
"index.html#/hq/electro-cafe/roles"
]
],
"decision": ""
},
{
"id": "USR-04",
"module": "M1",
"domain": "Users & Permissions",
"title": "Record the employee's name on every sensitive operation",
"detail": "Voids, discounts, refunds and drawer openings",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Audit log",
"pos.html"
],
[
"Reports · Discounts",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "USR-05",
"module": "M1",
"domain": "Users & Permissions",
"title": "Tamper-proof audit log",
"detail": "No entry can be deleted or modified after it is created",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Audit log",
"pos.html"
],
[
"Support access · audit log",
"index.html#/hq/electro-cafe/support-access"
]
],
"decision": ""
},
{
"id": "USR-06",
"module": "M1",
"domain": "Users & Permissions",
"title": "Assign an employee to more than one branch",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Roles · add person",
"index.html#/hq/electro-cafe/roles"
]
],
"decision": "D-15"
},
{
"id": "USR-07",
"module": "M1",
"domain": "Users & Permissions",
"title": "Employee consumption and hospitality",
"detail": "Recorded at zero price within a daily limit",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Staff meal",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-16"
},
{
"id": "FIS-01",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Record every sale regardless of printing",
"detail": "Printing on request only, but the accounting entry is always created",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · every sale · To print",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "FIS-02",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Invoice content",
"detail": "Name and logo, tax ID, address and phone, sequential number, date and time, cashier name, order number",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · 80 mm receipt",
"pos.html"
],
[
"Till rules · invoice",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "FIS-03",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Gapless sequential numbering per branch",
"detail": "A gap in the sequence is an indicator of tampering",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · invoice no.",
"pos.html"
],
[
"Settings · series",
"index.html#/hq/electro-cafe/settings"
]
],
"decision": "D-27"
},
{
"id": "FIS-04",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Configurable tax rate at the individual product level",
"detail": "At item and category level",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Menu setup · tax",
"index.html#/hq/electro-cafe/menu"
]
],
"decision": "D-03"
},
{
"id": "FIS-05",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Readiness for e-invoicing",
"detail": "Every invoice stored in a transmittable structure, with a sequence and signature that prevent retroactive modification",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "shown",
"links": [
[
"Till rules · e-invoicing",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "FIS-06",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Invoice issued to an organisation or company",
"detail": "The organisation's details and tax ID",
"priority": "Should",
"phase": "Launch",
"nov10": "TBD",
"state": "works",
"links": [
[
"Cashier · Invoice to a company",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-18"
},
{
"id": "FIS-07",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Reprint a previous invoice",
"detail": "Marked as a copy",
"priority": "Should",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Invoices → Reprint",
"pos.html"
]
],
"decision": ""
},
{
"id": "FIS-08",
"module": "M2",
"domain": "Invoicing & Compliance",
"title": "Archive and retrieve invoices",
"detail": "By number, date or amount",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Invoices",
"pos.html"
],
[
"Till rules",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "STK-01",
"module": "M4",
"domain": "Inventory",
"title": "Stock tracking from first launch",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Inventory",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-02",
"module": "M4",
"domain": "Inventory",
"title": "Define the stock-deduction level",
"detail": "By finished item, or by ingredients according to a recipe per item",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Inventory · level",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": "D-01"
},
{
"id": "STK-03",
"module": "M4",
"domain": "Inventory",
"title": "Deduct stock automatically at the point of sale",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · stock count on tiles",
"pos.html"
],
[
"Inventory",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-04",
"module": "M4",
"domain": "Inventory",
"title": "Record goods received from central",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Inventory · Purchasing → Receive",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-05",
"module": "M4",
"domain": "Inventory",
"title": "Record spoilage and waste with a reason",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Branch · Record waste",
"index.html#/hq/electro-cafe/b/ec-main/stock"
]
],
"decision": "D-07"
},
{
"id": "STK-06",
"module": "M4",
"domain": "Inventory",
"title": "Periodic stocktake and variance reconciliation",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Inventory · Stock count",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-07",
"module": "M4",
"domain": "Inventory",
"title": "Alert on reaching the reorder threshold, at central level",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Inventory · low stock",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-08",
"module": "M4",
"domain": "Inventory",
"title": "Central warehouse, inter-branch transfers and minimum-level alerts",
"detail": "",
"priority": "Could",
"phase": "Phase 2",
"nov10": "LATER",
"state": "phase2",
"links": [
[
"Inventory · Warehouse",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": "D-24"
},
{
"id": "STK-09",
"module": "M4",
"domain": "Inventory",
"title": "Purchasing from suppliers, centrally (within procurement)",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Inventory · Purchasing",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "STK-10",
"module": "M4",
"domain": "Inventory",
"title": "Item cost and profit margin",
"detail": "",
"priority": "Should",
"phase": "Phase 2",
"nov10": "LATER",
"state": "phase2",
"links": [
[
"Inventory · Margin",
"index.html#/hq/electro-cafe/inventory"
]
],
"decision": ""
},
{
"id": "RPT-01",
"module": "M4",
"domain": "Reports",
"title": "Today's sales in total",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports · Summary",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "RPT-02",
"module": "M4",
"domain": "Reports",
"title": "Sales by item and best sellers",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports · Items",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "RPT-03",
"module": "M4",
"domain": "Reports",
"title": "Sales by shift and by employee",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports · Staff",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "RPT-04",
"module": "M4",
"domain": "Reports",
"title": "Cash movement and cash-drawer variances",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports · Cash",
"index.html#/hq/electro-cafe/reports"
],
[
"Branch · shift reports",
"index.html#/hq/electro-cafe/b/ec-main/shifts"
]
],
"decision": ""
},
{
"id": "RPT-05",
"module": "M4",
"domain": "Reports",
"title": "Discounts and voids with the name of the person who performed them",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports · Discounts",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "RPT-06",
"module": "M4",
"domain": "Reports",
"title": "Comparison between branches",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Reports · Branches",
"index.html#/hq/electro-cafe/reports"
],
[
"Cedar Grill (3 branches)",
"index.html#/hq/sample-cedar-grill/reports"
]
],
"decision": ""
},
{
"id": "RPT-07",
"module": "M4",
"domain": "Reports",
"title": "Sales by hour of day",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Reports · Hours",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "RPT-08",
"module": "M4",
"domain": "Reports",
"title": "View reports inside the system",
"detail": "For the owner and the accountant",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Reports",
"index.html#/hq/electro-cafe/reports"
],
[
"Branch reports",
"index.html#/hq/electro-cafe/b/ec-main/reports"
]
],
"decision": ""
},
{
"id": "RPT-09",
"module": "M4",
"domain": "Reports",
"title": "Export reports to Excel",
"detail": "",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Reports · Export to Excel",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "OFF-01",
"module": "M2",
"domain": "Offline Operation",
"title": "Sell and print the invoice offline",
"detail": "With no dependency on the network",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Demo → Go offline, +2 hours, next day",
"pos.html"
]
],
"decision": ""
},
{
"id": "OFF-02",
"module": "M2",
"domain": "Offline Operation",
"title": "Send the order to preparation offline",
"detail": "Over the local network",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · offline prep ticket",
"pos.html"
]
],
"decision": ""
},
{
"id": "OFF-03",
"module": "M2",
"domain": "Offline Operation",
"title": "Close the shift and count the cash drawer offline",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · close shift offline",
"pos.html"
]
],
"decision": ""
},
{
"id": "OFF-04",
"module": "M2",
"domain": "Offline Operation",
"title": "Branch reports available offline",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Cashier · shift report",
"pos.html"
],
[
"Reports · note",
"index.html#/hq/electro-cafe/reports"
]
],
"decision": ""
},
{
"id": "OFF-05",
"module": "M2",
"domain": "Offline Operation",
"title": "Automatic sync when the connection returns",
"detail": "Without any action from the employee",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · Go online → sync report",
"pos.html"
]
],
"decision": ""
},
{
"id": "OFF-06",
"module": "M2",
"domain": "Offline Operation",
"title": "Sync conflict-resolution rules",
"detail": "When the same data is modified from two sources",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · sync report · HQ changes win",
"pos.html"
],
[
"Till rules · conflicts",
"index.html#/hq/electro-cafe/till"
]
],
"decision": ""
},
{
"id": "OFF-07",
"module": "M2",
"domain": "Offline Operation",
"title": "Connection status and last-sync indicator",
"detail": "Visible to the employee",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · status pill",
"pos.html"
],
[
"Operations health",
"index.html#/operations"
]
],
"decision": ""
},
{
"id": "OFF-08",
"module": "M2",
"domain": "Offline Operation",
"title": "Safe resume after a power cut",
"detail": "Without losing the order in progress",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · power cut, also during payment",
"pos.html"
]
],
"decision": ""
},
{
"id": "OFF-09",
"module": "M2",
"domain": "Offline Operation",
"title": "Local data retention period",
"detail": "Sufficient for the longest expected outage",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · retention warning",
"pos.html"
],
[
"Till rules · retention",
"index.html#/hq/electro-cafe/till"
]
],
"decision": "D-12"
},
{
"id": "HW-01",
"module": "M3",
"domain": "Hardware",
"title": "Runs on tablet, desktop computer and touch screen",
"detail": "The same interface adapts to the size",
"priority": "Must",
"phase": "Launch",
"nov10": "MIN",
"state": "works",
"links": [
[
"Devices",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": ""
},
{
"id": "HW-02",
"module": "M3",
"domain": "Hardware",
"title": "Thermal receipt printer",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · 80 mm print + printer problems",
"pos.html"
],
[
"Devices",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": ""
},
{
"id": "HW-03",
"module": "M3",
"domain": "Hardware",
"title": "Cash drawer opened from the system",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · drawer opens",
"pos.html"
],
[
"Devices",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": ""
},
{
"id": "HW-04",
"module": "M3",
"domain": "Hardware",
"title": "Barcode reader",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Cashier · barcode",
"pos.html"
],
[
"Devices",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": ""
},
{
"id": "HW-05",
"module": "M3",
"domain": "Hardware",
"title": "Customer-facing display",
"detail": "Shows the items and the amount",
"priority": "Should",
"phase": "Launch",
"nov10": "LATER",
"state": "works",
"links": [
[
"Cashier · Menu → Customer display",
"pos.html"
],
[
"Devices",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": ""
},
{
"id": "HW-06",
"module": "M3",
"domain": "Hardware",
"title": "Support for the card payment terminal",
"detail": "",
"priority": "Must",
"phase": "Launch",
"nov10": "TBD",
"state": "decision",
"links": [
[
"Devices · card terminal",
"index.html#/hq/electro-cafe/devices"
]
],
"decision": "D-29"
},
{
"id": "HW-07",
"module": "M3",
"domain": "Hardware",
"title": "Approved hardware list",
"detail": "The client buys the hardware himself from a list we approve",
"priority": "Must",
"phase": "Launch",
"nov10": "IN",
"state": "works",
"links": [
[
"Devices · approved list",
"index.html#/hq/electro-cafe/devices"
],
[
"Platform settings · approved hardware",
"index.html#/settings"
]
],
"decision": ""
},
{
"id": "NH-07",
"module": "—",
"domain": "Nice to Have",
"title": "Central administration can watch every POS terminal live and trace everything happening on it (screen mirroring)",
"detail": "Live view and activity tracing per terminal",
"priority": "Must",
"phase": "Launch",
"nov10": "LATER",
"state": "dropped",
"links": [
[
"Home · live feed instead",
"index.html#/hq/electro-cafe"
]
],
"decision": "D-28"
}
];
