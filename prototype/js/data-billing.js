/*
 * Day 11 — Quantara's own side: billing, subscriptions, support tickets, platform rules.
 * Model from research R-05 / decision D-32 (proposed): plans priced PER BRANCH with registers
 * included, modules sold as add-ons per branch, USD, monthly or yearly (yearly = 2 months free),
 * 30-day trial, no lock-in. Unpaid → grace → HQ read-only. The till never stops selling.
 * ALL PRICES ARE PLACEHOLDERS until D-32 is decided. Quantara owns everything in this file.
 */
window.QuantaraData.billing = {
  currency: "USD",
  decision: "D-32",
  rules: { trial_days: 30, grace_days: 7, yearly_free_months: 2, read_only_after_grace: true, till_never_stops: true,
    methods: ["syriatel", "sham", "bank", "cash"], updated_by: "staff-yazan", updated_at: "2026-09-20T09:00:00Z" },

  // Price per branch per month. Registers included per branch; extra registers are an add-on.
  plan_prices: {
    starter: { per_branch: 35, registers_included: 2, features: ["core", "offline", "reports_31d"] },
    growth:  { per_branch: 60, registers_included: 3, features: ["core", "offline", "reports_full", "multi_branch", "price_overrides"] },
    chain:   { per_branch: null, registers_included: null, features: ["core", "offline", "reports_full", "multi_branch", "price_overrides", "api", "priority_support"] }
  },

  // Add-ons, priced per branch per month (register: per register). `module` links to modules_available.
  addons: [
    { id: "extra_register", name_en: "Extra register", name_ar: "نقطة بيع إضافية", unit: "register", price: 10 },
    { id: "kds",            name_en: "Kitchen screen", name_ar: "شاشة المطبخ",     unit: "branch",   price: 8 },
    { id: "customer_display", name_en: "Customer display", name_ar: "شاشة الزبون", unit: "branch",   price: 5 },
    { id: "inventory_pro",  name_en: "Recipes and purchasing", name_ar: "الوصفات والمشتريات", unit: "branch", price: 15 },
    { id: "loyalty",        name_en: "Loyalty", name_ar: "الولاء",                 unit: "branch",   price: 12, module: "loyalty" },
    { id: "delivery",       name_en: "Delivery integrations", name_ar: "تكامل التوصيل", unit: "branch", price: 15 },
    { id: "table_service",  name_en: "Table service", name_ar: "خدمة الطاولات",    unit: "branch",   price: 10, module: "table_service" },
    { id: "tips",           name_en: "Tips", name_ar: "الإكرامية",                 unit: "branch",   price: 0, module: "tips" }
  ],

  // One subscription per tenant. status: trial | active | grace | read_only | suspended
  subscriptions: {
    "electro-cafe":         { plan_id: "growth",  cycle: "yearly",  status: "active", started_at: "2026-06-01", renews_at: "2027-06-01", design_partner: true, discount_pct: 50,
                              addons: [ { id: "tips", branches: ["ec-main"] } ], note_en: "Design-partner price, to be signed with the IP agreement (D-22).", note_ar: "سعر شريك التصميم، يُوقَّع مع اتفاقية الملكية الفكرية (D-22)." },
    "sample-harbor-coffee": { plan_id: "starter", cycle: "monthly", status: "trial",  started_at: "2026-09-10", trial_ends: "2026-10-10", addons: [] },
    "sample-cedar-grill":   { plan_id: "growth",  cycle: "monthly", status: "grace",  started_at: "2025-11-01", renews_at: "2026-10-01", grace_ends: "2026-09-26",
                              addons: [ { id: "kds", branches: ["cg-olaya", "cg-malqa"] }, { id: "loyalty", branches: ["cg-olaya"] }, { id: "table_service", branches: ["cg-olaya", "cg-malqa", "cg-corniche"] }, { id: "extra_register", qty: 1 } ] },
    "sample-olive-thyme":   { plan_id: "starter", cycle: "monthly", status: "suspended", started_at: "2025-03-02", addons: [] }
  },

  // Invoices. status: paid | due | overdue | void
  invoices: [
    { id: "INV-2026-0061", tenant_id: "electro-cafe", period: "2026-06-01/2027-06-01", issued_at: "2026-06-01", due_at: "2026-06-08", status: "paid", paid_at: "2026-06-03", method: "bank", ref: "BT-55120", amount: 300 },
    { id: "INV-2026-0118", tenant_id: "sample-cedar-grill", period: "2026-08-01/2026-09-01", issued_at: "2026-08-01", due_at: "2026-08-08", status: "paid", paid_at: "2026-08-06", method: "sham", ref: "SC-771204", amount: 248 },
    { id: "INV-2026-0142", tenant_id: "sample-cedar-grill", period: "2026-09-01/2026-10-01", issued_at: "2026-09-01", due_at: "2026-09-08", status: "overdue", amount: 248, reminders: 2 },
    { id: "INV-2026-0098", tenant_id: "sample-olive-thyme", period: "2026-07-01/2026-08-01", issued_at: "2026-07-01", due_at: "2026-07-08", status: "overdue", amount: 35, reminders: 3 },
    { id: "INV-2026-0151", tenant_id: "sample-harbor-coffee", period: "trial", issued_at: "2026-09-10", due_at: "2026-10-10", status: "due", amount: 0, trial: true }
  ],

  // Support tickets raised by tenants or by Quantara. status: open | waiting | solved ; priority: urgent | high | normal | low
  tickets: [
    { id: "T-1042", tenant_id: "electro-cafe", subject_en: "Register 2 has not synced since last night", subject_ar: "الجهاز 2 لم يزامن منذ الليلة الماضية",
      priority: "high", status: "open", assignee: "staff-rana", channel: "phone", created_at: "2026-09-23T07:10:00Z", access_request_id: "sa-101",
      messages: [ { by: "ec-u-bm", at: "2026-09-23T07:10:00Z", text_en: "Register 2 shows offline since yesterday evening.", text_ar: "الجهاز 2 يظهر غير متصل منذ مساء أمس." },
                  { by: "staff-rana", at: "2026-09-23T08:30:00Z", text_en: "Asked the owner for read access to its sync queue.", text_ar: "طلبنا من المالك صلاحية قراءة قائمة المزامنة." } ] },
    { id: "T-1039", tenant_id: "sample-cedar-grill", subject_en: "Al Malqa register 2 offline for three days", subject_ar: "الجهاز 2 في الملقا غير متصل منذ ثلاثة أيام",
      priority: "urgent", status: "open", assignee: "staff-lina", channel: "whatsapp", created_at: "2026-09-22T09:00:00Z", access_request_id: "sa-120",
      messages: [ { by: "cg-u-bm2", at: "2026-09-22T09:00:00Z", text_en: "The register works but nothing reaches HQ.", text_ar: "الجهاز يعمل لكن لا شيء يصل للإدارة." } ] },
    { id: "T-1035", tenant_id: "sample-cedar-grill", subject_en: "Invoice for September", subject_ar: "فاتورة أيلول", priority: "normal", status: "waiting", assignee: "staff-yazan", channel: "email", created_at: "2026-09-12T11:00:00Z",
      messages: [ { by: "staff-yazan", at: "2026-09-12T11:00:00Z", text_en: "Reminder sent; waiting for the transfer.", text_ar: "أُرسل تذكير؛ بانتظار التحويل." } ] },
    { id: "T-1021", tenant_id: "electro-cafe", subject_en: "Import the first menu", subject_ar: "استيراد أول قائمة", priority: "normal", status: "solved", assignee: "staff-omar", channel: "onboarding", created_at: "2026-06-01T07:50:00Z", solved_at: "2026-06-01T12:40:00Z", access_request_id: "sa-088",
      messages: [ { by: "staff-omar", at: "2026-06-01T12:40:00Z", text_en: "Imported 7 items. Closed.", text_ar: "استُورد 7 أصناف. أُغلقت." } ] },
    { id: "T-1044", tenant_id: "sample-harbor-coffee", subject_en: "How do I add a second register?", subject_ar: "كيف أضيف نقطة بيع ثانية؟", priority: "low", status: "open", assignee: null, channel: "chat", created_at: "2026-09-23T06:00:00Z",
      messages: [ { by: "hc-u-owner", at: "2026-09-23T06:00:00Z", text_en: "We are on the trial; can we add a register?", text_ar: "نحن في الفترة التجريبية؛ هل يمكن إضافة نقطة بيع؟" } ] }
  ],

  // Approved hardware (HW-07) — Quantara keeps this list.
  hardware: [
    { id: "hw-1", kind: "touch_terminal", model: "15.6\" Android touch terminal", status: "approved" },
    { id: "hw-2", kind: "tablet", model: "10\" Android tablet + stand", status: "approved" },
    { id: "hw-3", kind: "thermal_80", model: "80 mm thermal printer (LAN/USB)", status: "approved" },
    { id: "hw-4", kind: "drawer_rj11", model: "Cash drawer, printer-driven", status: "approved" },
    { id: "hw-5", kind: "scanner_usb", model: "USB 1D/2D scanner", status: "approved" },
    { id: "hw-6", kind: "customer_display", model: "10\" customer display", status: "approved" },
    { id: "hw-7", kind: "card_terminal", model: "Card terminal — waits for D-29", status: "pending" }
  ]
};
