/*
 * Quantara control panel — sample data.
 *
 * The one place data lives until there is a back end. Every screen reads from
 * window.QuantaraData; nothing is typed into markup.
 *
 * Conventions (the back end can start from these):
 *   - snake_case field names, ids are lowercase slugs
 *   - bilingual text is a pair: <field>_en / <field>_ar
 *   - dates are ISO 8601 strings: dates "YYYY-MM-DD", moments in UTC "…Z"
 *   - enums are lowercase strings; their labels live in i18n.js, not here
 *   - counts are never stored when they can be derived (branch_count = branches.length)
 *   - is_sample: true marks a made-up tenant so nobody mistakes it for a customer
 *   - who owns a value is part of the data model: fields on a tenant record are
 *     Quantara-owned unless listed in HQ_OWNED_TENANT_FIELDS (bottom of file);
 *     everything under `hq.<tenant-id>` is owned by that tenant's head office;
 *     `branch_overrides` are separate records owned by one branch and never
 *     overwrite an HQ value (see README, "Who owns what")
 *
 * Electro Café is the real tenant. Its name is real; its operational figures
 * (branches, registers, dates, currency) are PLACEHOLDERS until confirmed —
 * see `placeholder_fields`.
 */
window.QuantaraData = {
  current_staff_id: "staff-rana",

  staff: [
    { id: "staff-rana",  name_en: "Rana K.",  name_ar: "رنا ك.",  team: "support" },
    { id: "staff-omar",  name_en: "Omar S.",  name_ar: "عمر س.",  team: "onboarding" },
    { id: "staff-lina",  name_en: "Lina H.",  name_ar: "لينا ح.", team: "operations" },
    { id: "staff-yazan", name_en: "Yazan M.", name_ar: "يزن م.",  team: "finance" }
  ],

  plans: [
    { id: "starter", name_en: "Starter", name_ar: "أساسية",  max_branches: 1,  max_registers: 2 },
    { id: "growth",  name_en: "Growth",  name_ar: "نمو",      max_branches: 5,  max_registers: 15 },
    { id: "chain",   name_en: "Chain",   name_ar: "سلاسل",    max_branches: 50, max_registers: 200 }
  ],

  currencies: ["SYP", "USD", "AED", "SAR"],

  time_zones: ["Asia/Damascus", "Asia/Dubai", "Asia/Riyadh", "Europe/Istanbul"],

  tenants: [
    {
      id: "electro-cafe",
      name_en: "Electro Café",
      name_ar: "إلكترو كافيه",
      is_sample: false,
      placeholder_fields: ["branches", "customer_since", "last_activity_at", "currency", "contact", "catalogue", "prices", "exchange_rate", "sales", "people"],
      status: "active",
      plan_id: "growth",
      invoice_prefix: "EC",
      modules_available: ["tips", "table_service", "loyalty"],
      currency: "SYP",
      time_zone: "Asia/Damascus",
      customer_since: "2026-06-01",
      last_activity_at: "2026-09-23T08:42:00Z",
      account_owner_id: "staff-omar",
      contact: { name: "[Owner name]", email: "[owner@email]", phone: "[phone]" },
      settings: { receipt_bilingual: true, manager_pin_for_refunds: true, tax_number: "" },
      branches: [
        {
          id: "ec-main", code: "MAIN", name_en: "Main branch", name_ar: "الفرع الرئيسي", city_en: "Damascus", city_ar: "دمشق",
          status: "active", has_invoices: true,
          server: { status: "online", enrolled_at: "2026-06-01T10:00:00Z", last_sync_at: "2026-09-23T08:42:00Z", app_version: "1.0.3", schema_version: 12, events_waiting: 0 },
          registers: [
            { id: "ec-main-1", n: 1, label: "Register 1", status: "online",  last_seen_at: "2026-09-23T08:42:00Z" },
            { id: "ec-main-2", n: 2, label: "Register 2", status: "offline", last_seen_at: "2026-09-22T21:10:00Z" }
          ]
        }
      ],
      activity: [
        { at: "2026-09-23T08:42:00Z", kind: "sale_sync",      text_en: "Register 1 synced sales",          text_ar: "زامن الجهاز 1 المبيعات" },
        { at: "2026-09-22T21:10:00Z", kind: "register_offline", text_en: "Register 2 went offline",        text_ar: "انقطع اتصال الجهاز 2" },
        { at: "2026-06-01T09:00:00Z", kind: "tenant_created", text_en: "Tenant created by onboarding",       text_ar: "أنشأ فريق التهيئة المستأجر" }
      ]
    },
    {
      id: "sample-harbor-coffee",
      name_en: "Harbor Coffee Co. (sample)",
      name_ar: "قهوة المرفأ (عينة)",
      is_sample: true,
      status: "trial",
      plan_id: "starter",
      invoice_prefix: "HC",
      modules_available: ["tips"],
      currency: "AED",
      time_zone: "Asia/Dubai",
      customer_since: "2026-09-10",
      last_activity_at: "2026-09-21T15:05:00Z",
      account_owner_id: "staff-omar",
      contact: { name: "Sample contact", email: "sample@example.com", phone: "—" },
      settings: { receipt_bilingual: false, manager_pin_for_refunds: false, tax_number: "" },
      branches: [
        {
          id: "hc-marina", code: "MAR", name_en: "Marina", name_ar: "المارينا", city_en: "Dubai", city_ar: "دبي", status: "active",
          registers: [ { id: "hc-marina-1", n: 1, label: "Register 1", status: "online", last_seen_at: "2026-09-21T15:05:00Z" } ]
        }
      ],
      activity: [
        { at: "2026-09-10T10:00:00Z", kind: "tenant_created", text_en: "Trial started", text_ar: "بدأت الفترة التجريبية" }
      ]
    },
    {
      id: "sample-cedar-grill",
      name_en: "Cedar Grill (sample)",
      name_ar: "مشاوي الأرز (عينة)",
      is_sample: true,
      status: "active",
      plan_id: "chain",
      invoice_prefix: "CG",
      modules_available: ["tips", "credit_sales", "loyalty", "table_service"],
      currency: "SAR",
      time_zone: "Asia/Riyadh",
      customer_since: "2025-11-15",
      last_activity_at: "2026-09-23T06:30:00Z",
      account_owner_id: "staff-lina",
      contact: { name: "Sample contact", email: "sample@example.com", phone: "—" },
      settings: { receipt_bilingual: true, manager_pin_for_refunds: true, tax_number: "300000000000003" },
      branches: [
        { id: "cg-olaya", code: "OLY", name_en: "Olaya", name_ar: "العليا", city_en: "Riyadh", city_ar: "الرياض", status: "active",
          registers: [
            { id: "cg-olaya-1", n: 1, label: "Register 1", status: "online", last_seen_at: "2026-09-23T06:30:00Z" },
            { id: "cg-olaya-2", n: 2, label: "Register 2", status: "online", last_seen_at: "2026-09-23T06:28:00Z" },
            { id: "cg-olaya-3", n: 3, label: "Drive-thru", status: "online", last_seen_at: "2026-09-23T06:29:00Z" }
          ] },
        { id: "cg-malqa", code: "MLQ", name_en: "Al Malqa", name_ar: "الملقا", city_en: "Riyadh", city_ar: "الرياض", status: "active",
          registers: [
            { id: "cg-malqa-1", n: 1, label: "Register 1", status: "online",  last_seen_at: "2026-09-23T06:12:00Z" },
            { id: "cg-malqa-2", n: 2, label: "Register 2", status: "offline", last_seen_at: "2026-09-20T19:44:00Z" }
          ] },
        { id: "cg-corniche", code: "CRN", name_en: "Corniche", name_ar: "الكورنيش", city_en: "Jeddah", city_ar: "جدة", status: "paused",
          registers: [ { id: "cg-corniche-1", n: 1, label: "Register 1", status: "offline", last_seen_at: "2026-08-30T22:00:00Z" } ] }
      ],
      activity: [
        { at: "2026-09-20T19:44:00Z", kind: "register_offline", text_en: "Al Malqa · Register 2 went offline", text_ar: "الملقا · انقطع اتصال الجهاز 2" },
        { at: "2026-08-30T22:00:00Z", kind: "branch_paused",    text_en: "Corniche branch paused",           text_ar: "إيقاف فرع الكورنيش مؤقتاً" }
      ]
    },
    {
      id: "sample-olive-thyme",
      name_en: "Olive & Thyme (sample)",
      name_ar: "زيتون وزعتر (عينة)",
      is_sample: true,
      status: "suspended",
      plan_id: "growth",
      invoice_prefix: "OT",
      modules_available: ["tips", "loyalty"],
      currency: "USD",
      time_zone: "Europe/Istanbul",
      customer_since: "2025-03-02",
      last_activity_at: "2026-07-14T12:00:00Z",
      account_owner_id: "staff-yazan",
      suspension_reason_en: "Invoice overdue",
      suspension_reason_ar: "فاتورة متأخرة السداد",
      contact: { name: "Sample contact", email: "sample@example.com", phone: "—" },
      settings: { receipt_bilingual: true, manager_pin_for_refunds: false, tax_number: "" },
      branches: [
        { id: "ot-kadikoy", code: "KDK", name_en: "Kadıköy", name_ar: "قاضي كوي", city_en: "Istanbul", city_ar: "إسطنبول", status: "active",
          registers: [
            { id: "ot-kadikoy-1", n: 1, label: "Register 1", status: "offline", last_seen_at: "2026-07-14T12:00:00Z" },
            { id: "ot-kadikoy-2", n: 2, label: "Register 2", status: "offline", last_seen_at: "2026-07-14T11:58:00Z" }
          ] }
      ],
      activity: [
        { at: "2026-07-15T08:00:00Z", kind: "tenant_suspended", text_en: "Suspended by finance: invoice overdue", text_ar: "علّقه فريق المالية: فاتورة متأخرة" }
      ]
    }
  ]
};

/* =========================================================================
 * Day 5 — the tenant's side: head office (HQ) and branch data.
 *
 * Ownership is structural, so a screen never has to guess it:
 *   QuantaraData.tenants[*]          Quantara-owned (plan, limits, status,
 *                                    modules_available, invoice series parts)
 *                                    except HQ_OWNED_TENANT_FIELDS below
 *   QuantaraData.hq[<tenant-id>]     owned by that tenant's head office
 *   hq.<id>.branch_overrides         owned by ONE branch; a separate record
 *                                    that sits on top of an HQ value and never
 *                                    overwrites it
 *   QuantaraData.support_access      shared: Quantara requests, the tenant
 *                                    owner decides, nobody edits the audit log
 *
 * Every changeable value carries `updated_by` + `updated_at` so any screen can
 * say "Changed by HQ at 10:42". Actor ids are "staff-*" (Quantara) or a tenant
 * user id.
 *
 * Electro Café: catalogue, prices, exchange rate, sales and people below are
 * PLACEHOLDERS (listed in its placeholder_fields). Nothing here is their menu.
 * ========================================================================= */

/** The prototype's clock — "today" for every Today / Home screen. */
window.QuantaraData.clock = "2026-09-23T08:45:00Z";

/** Values that sit on the tenant record for Day 4 continuity but belong to HQ. */
window.QuantaraData.HQ_OWNED_TENANT_FIELDS = ["name_en", "name_ar", "currency", "time_zone", "settings", "contact"];

/** The optional modules Quantara can make available (labels in i18n.js). */
window.QuantaraData.modules = ["tips", "credit_sales", "loyalty", "table_service"];

window.QuantaraData.hq = {
  "electro-cafe": {
    users: [
      { id: "ec-u-owner", name_en: "Jad",          name_ar: "جاد",          role: "owner",          branch_id: null,      status: "active",  email: "owner@electro.example",    panel: true,  sign_in: "pin" },
      { id: "ec-u-hq",    name_en: "[HQ manager]", name_ar: "[مدير الإدارة]", role: "hq_manager",     branch_id: null,      status: "active",  email: "hq@electro.example",       panel: true,  sign_in: "pin" },
      { id: "ec-u-acc",   name_en: "[Accountant]", name_ar: "[المحاسب]",     role: "accountant",     branch_id: null,      status: "invited", email: "accounts@electro.example", panel: true,  sign_in: "pin" },
      { id: "ec-u-bm",    name_en: "Maya",         name_ar: "مايا",         role: "branch_manager", branch_id: "ec-main", status: "active",  phone: "+963 9xx xxx 001",         panel: true,  sign_in: "card_or_pin", card: "40021877" },
      { id: "ec-u-c1",    name_en: "Hala",         name_ar: "هلا",          role: "cashier",        branch_id: "ec-main", status: "active",  panel: false, sign_in: "pin" },
      { id: "ec-u-c2",    name_en: "Samer",        name_ar: "سامر",         role: "cashier",        branch_id: "ec-main", status: "active",  panel: false, sign_in: "pin", pin_must_change: true },
      { id: "ec-u-bar",   name_en: "[Barista]",    name_ar: "[الباريستا]",  role: "barista",        branch_id: "ec-main", status: "disabled", panel: false, sign_in: "pin" }
    ],
    // Business rules HQ owns (§5 of the specs) that were not on the Day 4 tenant record.
    rules: { manual_discount_cap_percent: 10, updated_by: "ec-u-owner", updated_at: "2026-09-01T09:00:00Z" },
    exchange_rate: { base: "USD", quote: "SYP", rate: 13000, round_to: 500, updated_by: "ec-u-hq", updated_at: "2026-09-23T07:42:00Z" },
    modules: {
      tips:          { on: true,  branches: ["ec-main"], updated_by: "ec-u-owner", updated_at: "2026-09-02T10:00:00Z" },
      table_service: { on: false, branches: [],          updated_by: "ec-u-owner", updated_at: "2026-09-02T10:00:00Z" },
      loyalty:       { on: false, branches: [],          updated_by: "ec-u-owner", updated_at: "2026-09-02T10:00:00Z" }
    },
    categories: [
      { id: "hot",   name_en: "Hot drinks",  name_ar: "مشروبات ساخنة" },
      { id: "cold",  name_en: "Cold drinks", name_ar: "مشروبات باردة" },
      { id: "sweet", name_en: "Sweets",      name_ar: "حلويات" },
      { id: "snack", name_en: "Snacks",      name_ar: "سناكات" }
    ],
    items: [
      { id: "ec-espresso", category_id: "hot", name_en: "Espresso", name_ar: "إسبريسو", price: 15000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-cappuccino", category_id: "hot", name_en: "Cappuccino", name_ar: "كابتشينو", price: 20000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-latte", category_id: "hot", name_en: "Latte", name_ar: "لاتيه", price: 22000, updated_by: "ec-u-hq", updated_at: "2026-09-23T07:42:00Z" },
      { id: "ec-turkish", category_id: "hot", name_en: "Turkish coffee", name_ar: "قهوة تركية", price: 12000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-tea", category_id: "hot", name_en: "Black tea", name_ar: "شاي أسود", price: 8000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-iced", category_id: "cold", name_en: "Iced coffee", name_ar: "قهوة مثلجة", price: 25000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-lemonade", category_id: "cold", name_en: "Lemon mint", name_ar: "ليمون ونعناع", price: 18000, updated_by: "ec-u-owner", updated_at: "2026-09-05T08:00:00Z" },
      { id: "ec-water", category_id: "cold", name_en: "Water", name_ar: "مياه", price: 5000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-frappe", category_id: "cold", name_en: "Frappé", name_ar: "فرابيه", price: 28000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-brownie", category_id: "sweet", name_en: "Brownie", name_ar: "براوني", price: 16000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-cheesecake", category_id: "sweet", name_en: "Cheesecake", name_ar: "تشيز كيك", price: 30000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-croissant", category_id: "sweet", name_en: "Croissant", name_ar: "كرواسان", price: 14000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-cake", category_id: "sweet", name_en: "Cake slice", name_ar: "قطعة كيك", price: 20000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-club", category_id: "snack", name_en: "Club sandwich", name_ar: "كلوب ساندويش", price: 40000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" },
      { id: "ec-chips", category_id: "snack", name_en: "Chips", name_ar: "شيبس", price: 8000, updated_by: "ec-u-hq", updated_at: "2026-09-10T08:00:00Z" }
    ],
    // HQ offers: HQ-owned, apply to the branches listed ("all" = every branch).
    offers: [
      { id: "ec-of-1", name_en: "Morning pair: coffee + croissant", name_ar: "ثنائي الصباح: قهوة + كرواسان", kind: "bundle", value: 30000,
        branches: "all", starts_at: "2026-09-15", ends_at: "2026-10-15", updated_by: "ec-u-owner", updated_at: "2026-09-14T12:00:00Z" }
    ],
    // Branch-owned records. PRC-10 (time-limited item discount) and CAT-06 (pause).
    branch_overrides: [
      { id: "ec-ov-1", branch_id: "ec-main", kind: "discount", item_id: "ec-cake", percent: 20,
        starts_at: "2026-09-23T08:00:00Z", ends_at: "2026-09-23T12:00:00Z", by: "ec-u-bm", at: "2026-09-23T06:10:00Z" },
      { id: "ec-ov-2", branch_id: "ec-main", kind: "pause", item_id: "ec-croissant", by: "ec-u-bm", at: "2026-09-23T07:55:00Z" }
    ],
    // Live order and activity feed, per register (replaces live screen mirroring, NH-07).
    feed: {
      "ec-main-1": [
        { at: "2026-09-23T05:02:00Z", kind: "shift_open",  by: "ec-u-c1" },
        { at: "2026-09-23T05:20:00Z", kind: "order", no: 1041, amount: 37000 },
        { at: "2026-09-23T05:48:00Z", kind: "order", no: 1042, amount: 22000 },
        { at: "2026-09-23T06:31:00Z", kind: "order", no: 1043, amount: 58000 },
        { at: "2026-09-23T07:12:00Z", kind: "refund", no: 1042, amount: 22000, by: "ec-u-bm" },
        { at: "2026-09-23T07:55:00Z", kind: "item_paused", item_id: "ec-croissant", by: "ec-u-bm" },
        { at: "2026-09-23T08:20:00Z", kind: "order", no: 1044, amount: 43000 },
        { at: "2026-09-23T08:42:00Z", kind: "order", no: 1045, amount: 30000 }
      ],
      "ec-main-2": [
        { at: "2026-09-22T15:00:00Z", kind: "shift_open",  by: "ec-u-c2" },
        { at: "2026-09-22T20:40:00Z", kind: "order", no: 877, amount: 40000 },
        { at: "2026-09-22T21:05:00Z", kind: "shift_close", by: "ec-u-c2" },
        { at: "2026-09-22T21:10:00Z", kind: "offline" }
      ]
    },
    shifts: [
      { id: "ec-sh-3", register_id: "ec-main-1", cashier_id: "ec-u-c1", opened_at: "2026-09-23T05:02:00Z", closed_at: null, status: "open" },
      { id: "ec-sh-2", register_id: "ec-main-2", cashier_id: "ec-u-c2", opened_at: "2026-09-22T15:00:00Z", closed_at: "2026-09-22T21:05:00Z", status: "closed" },
      { id: "ec-sh-1", register_id: "ec-main-1", cashier_id: "ec-u-c1", opened_at: "2026-09-22T05:00:00Z", closed_at: "2026-09-22T14:58:00Z", status: "closed" }
    ]
  },

  "sample-harbor-coffee": {
    users: [ { id: "hc-u-owner", name_en: "Sample owner", name_ar: "مالك (عينة)", role: "owner", branch_id: null },
             { id: "hc-u-bm", name_en: "Sample manager", name_ar: "مدير (عينة)", role: "branch_manager", branch_id: "hc-marina" } ],
    rules: { manual_discount_cap_percent: 5, updated_by: "hc-u-owner", updated_at: "2026-09-10T10:00:00Z" },
    exchange_rate: null, modules: {}, categories: [], items: [], offers: [], branch_overrides: [], feed: {}, shifts: []
  },

  "sample-olive-thyme": {
    users: [ { id: "ot-u-owner", name_en: "Sample owner", name_ar: "مالك (عينة)", role: "owner", branch_id: null },
             { id: "ot-u-bm", name_en: "Sample manager", name_ar: "مدير (عينة)", role: "branch_manager", branch_id: "ot-kadikoy" } ],
    rules: { manual_discount_cap_percent: 10, updated_by: "ot-u-owner", updated_at: "2025-03-02T10:00:00Z" },
    exchange_rate: null, modules: {}, categories: [], items: [], offers: [], branch_overrides: [], feed: {}, shifts: []
  },

  "sample-cedar-grill": {
    users: [
      { id: "cg-u-owner", name_en: "Sample owner",    name_ar: "مالك (عينة)",      role: "owner",          branch_id: null },
      { id: "cg-u-bm1",   name_en: "Sample manager A", name_ar: "مدير أ (عينة)",   role: "branch_manager", branch_id: "cg-olaya" },
      { id: "cg-u-bm2",   name_en: "Sample manager B", name_ar: "مدير ب (عينة)",   role: "branch_manager", branch_id: "cg-malqa" },
      { id: "cg-u-c1",    name_en: "Sample cashier",   name_ar: "كاشير (عينة)",    role: "cashier",        branch_id: "cg-olaya" }
    ],
    rules: { manual_discount_cap_percent: 15, updated_by: "cg-u-owner", updated_at: "2026-02-01T09:00:00Z" },
    exchange_rate: { base: "USD", quote: "SAR", rate: 3.75, round_to: 0.25, updated_by: "cg-u-owner", updated_at: "2026-01-10T09:00:00Z" },
    modules: {
      tips:          { on: true,  branches: ["cg-olaya", "cg-malqa"], updated_by: "cg-u-owner", updated_at: "2026-01-10T09:00:00Z" },
      credit_sales:  { on: false, branches: [], updated_by: "cg-u-owner", updated_at: "2026-01-10T09:00:00Z" },
      loyalty:       { on: true,  branches: ["cg-olaya"], updated_by: "cg-u-owner", updated_at: "2026-05-02T09:00:00Z" },
      table_service: { on: true,  branches: ["cg-olaya", "cg-malqa", "cg-corniche"], updated_by: "cg-u-owner", updated_at: "2026-01-10T09:00:00Z" }
    },
    categories: [ { id: "grill", name_en: "Grill", name_ar: "مشاوي" }, { id: "sides", name_en: "Sides", name_ar: "مقبلات" } ],
    items: [
      { id: "cg-shish",  category_id: "grill", name_en: "Shish tawook", name_ar: "شيش طاووق", price: 32, updated_by: "cg-u-owner", updated_at: "2026-09-23T07:42:00Z" },
      { id: "cg-kofta",  category_id: "grill", name_en: "Kofta",        name_ar: "كفتة",      price: 34, updated_by: "cg-u-owner", updated_at: "2026-08-01T09:00:00Z" },
      { id: "cg-hummus", category_id: "sides", name_en: "Hummus",       name_ar: "حمص",       price: 14, updated_by: "cg-u-owner", updated_at: "2026-08-01T09:00:00Z" }
    ],
    offers: [],
    branch_overrides: [
      { id: "cg-ov-1", branch_id: "cg-malqa", kind: "pause", item_id: "cg-kofta", by: "cg-u-bm2", at: "2026-09-23T06:00:00Z" }
    ],
    feed: {
      "cg-olaya-1": [ { at: "2026-09-23T06:05:00Z", kind: "shift_open", by: "cg-u-c1" }, { at: "2026-09-23T06:30:00Z", kind: "order", no: 5521, amount: 96 } ]
    },
    shifts: []
  }
};

/*
 * Support access: Quantara asks, the tenant OWNER approves or refuses and can
 * end it at any time. The audit log is append-only; nobody edits it.
 * status: pending → approved (someone is inside) → ended | refused | expired
 */
window.QuantaraData.support_access = [
  { id: "sa-101", tenant_id: "electro-cafe", staff_id: "staff-rana", status: "pending",
    reason_en: "Register 2 has not synced since last night; we need to read its sync queue.",
    reason_ar: "لم يزامن الجهاز 2 منذ الليلة الماضية؛ نحتاج إلى قراءة قائمة المزامنة لديه.",
    scope: "read_sales", hours: 4, requested_at: "2026-09-23T08:30:00Z" },
  { id: "sa-088", tenant_id: "electro-cafe", staff_id: "staff-omar", status: "ended",
    reason_en: "Import the first catalogue during onboarding.", reason_ar: "استيراد أول قائمة أصناف أثناء التهيئة.",
    scope: "read_write", hours: 8, requested_at: "2026-06-01T08:00:00Z", decided_by: "ec-u-owner", decided_at: "2026-06-01T08:05:00Z",
    started_at: "2026-06-01T08:05:00Z", ended_at: "2026-06-01T12:40:00Z", ended_by: "staff-omar" },
  { id: "sa-120", tenant_id: "sample-cedar-grill", staff_id: "staff-lina", status: "approved",
    reason_en: "Al Malqa register 2 offline for three days.", reason_ar: "الجهاز 2 في الملقا غير متصل منذ ثلاثة أيام.",
    scope: "read_sales", hours: 4, requested_at: "2026-09-23T06:00:00Z", decided_by: "cg-u-owner", decided_at: "2026-09-23T06:12:00Z",
    started_at: "2026-09-23T06:12:00Z", expires_at: "2026-09-23T10:12:00Z" }
];

/** Append-only. Written by the system for every support-access event and every action taken inside. */
window.QuantaraData.audit_log = [
  { at: "2026-06-01T08:00:00Z", tenant_id: "electro-cafe", actor: "staff-omar", kind: "requested", request_id: "sa-088" },
  { at: "2026-06-01T08:05:00Z", tenant_id: "electro-cafe", actor: "ec-u-owner", kind: "approved", request_id: "sa-088" },
  { at: "2026-06-01T09:30:00Z", tenant_id: "electro-cafe", actor: "staff-omar", kind: "action", text_en: "Imported 15 catalogue items", text_ar: "استورد 15 صنفًا إلى القائمة" },
  { at: "2026-06-01T12:40:00Z", tenant_id: "electro-cafe", actor: "staff-omar", kind: "ended", request_id: "sa-088" },
  { at: "2026-09-23T08:30:00Z", tenant_id: "electro-cafe", actor: "staff-rana", kind: "requested", request_id: "sa-101" },
  { at: "2026-09-23T06:00:00Z", tenant_id: "sample-cedar-grill", actor: "staff-lina", kind: "requested", request_id: "sa-120" },
  { at: "2026-09-23T06:12:00Z", tenant_id: "sample-cedar-grill", actor: "cg-u-owner", kind: "approved", request_id: "sa-120" },
  { at: "2026-09-23T06:20:00Z", tenant_id: "sample-cedar-grill", actor: "staff-lina", kind: "action", text_en: "Opened Al Malqa · Register 2 sync queue", text_ar: "فتح قائمة المزامنة للجهاز 2 في الملقا" }
];

/** Plan upgrade requests raised by HQ at a limit. Quantara answers them. */
window.QuantaraData.upgrade_requests = [];
