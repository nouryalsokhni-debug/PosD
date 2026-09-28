/*
 * Day 10 — operations data for the tenant side: sales history, shifts and cash
 * counts, stock, purchasing, price history, payment methods, till rules, roles,
 * devices. Loaded after data.js; everything lands in QuantaraData.ops[<tenant-id>].
 *
 * Same conventions as data.js (snake_case, _en/_ar pairs, ISO dates, derived
 * counts never stored). Ownership: everything under ops.<tenant> is HQ-owned,
 * except `branch_*` records (owned by one branch) and the guaranteed parts
 * (invoice numbers, audit, approved hardware list) which Quantara guarantees.
 *
 * Sales history is GENERATED from a fixed seed for the 14 days before the
 * prototype clock (9–22 Sept 2026), so reports have something real-looking to
 * add up. Today (23 Sept) comes from the live feed in data.js, not from here.
 * Electro Café figures are PLACEHOLDERS like the rest of its data.
 *
 * Values that wait for a client decision carry `decision: "D-xx"`.
 */
(function () {
  var D = window.QuantaraData;

  /* Small seeded random, so every reload shows the same history. */
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
  function pickW(r, list) { var tot = 0, i; for (i = 0; i < list.length; i++) tot += list[i][1]; var x = r() * tot; for (i = 0; i < list.length; i++) { x -= list[i][1]; if (x <= 0) return list[i][0]; } return list[0][0]; }
  function iso(d) { return d.toISOString().replace(".000Z", "Z"); }
  function day(n) { return new Date(Date.UTC(2026, 8, 23 - n)); } // n days before 23 Sept

  var PROFILES = {
    "electro-cafe": {
      seed: 23, orders_per_day: 58, open_utc: 5, close_utc: 20,
      methods: [
        { id: "cash_syp", kind: "cash", currency: "SYP", on: true },
        { id: "cash_usd", kind: "cash", currency: "USD", on: true },
        { id: "card",     kind: "card", currency: "SYP", on: false, decision: "D-29" },
        { id: "syriatel", kind: "wallet", currency: "SYP", on: true, needs_ref: true },
        { id: "sham",     kind: "wallet", currency: "SYP", on: true, needs_ref: true }
      ],
      mix: [["cash_syp", 62], ["cash_usd", 14], ["syriatel", 13], ["sham", 11]],
      base_rate: 13000, float: { SYP: 200000, USD: 0 }, variance_limit: 5000,
      suppliers: [
        { id: "sup-roastery", name_en: "[Coffee roastery]", name_ar: "[محمصة القهوة]", phone: "—" },
        { id: "sup-bakery",   name_en: "[Bakery]",          name_ar: "[المخبز]",       phone: "—" },
        { id: "sup-dairy",    name_en: "[Dairy]",           name_ar: "[الألبان]",      phone: "—" }
      ],
      item_supplier: { "ec-espresso": "sup-roastery", "ec-latte": "sup-dairy", "ec-tea": "sup-roastery", "ec-iced": "sup-roastery", "ec-lemonade": "sup-dairy", "ec-croissant": "sup-bakery", "ec-cake": "sup-bakery" },
      subcategories: [
        { id: "hot-coffee", parent_id: "hot", name_en: "Coffee", name_ar: "قهوة" },
        { id: "hot-tea",    parent_id: "hot", name_en: "Tea",    name_ar: "شاي" }
      ],
      item_sub: { "ec-espresso": "hot-coffee", "ec-latte": "hot-coffee", "ec-tea": "hot-tea" },
      options: { "ec-espresso": ["size", "sugar"], "ec-latte": ["size", "sugar", "milk"], "ec-tea": ["sugar"], "ec-iced": ["size", "sugar", "milk"], "ec-lemonade": ["size", "sugar"] },
      barcodes: { "ec-croissant": "6210001000014", "ec-cake": "6210001000021" }
    },
    "sample-cedar-grill": {
      seed: 7, orders_per_day: 34, open_utc: 8, close_utc: 21,
      methods: [
        { id: "cash_sar", kind: "cash", currency: "SAR", on: true },
        { id: "card",     kind: "card", currency: "SAR", on: true }
      ],
      mix: [["cash_sar", 35], ["card", 65]],
      base_rate: 3.75, float: { SAR: 500 }, variance_limit: 20,
      suppliers: [ { id: "sup-meat", name_en: "Sample butcher", name_ar: "ملحمة (عينة)", phone: "—" } ],
      item_supplier: { "cg-shish": "sup-meat", "cg-kofta": "sup-meat", "cg-hummus": "sup-meat" },
      subcategories: [], item_sub: {}, options: {}, barcodes: {}
    }
  };

  var OPTION_GROUPS = [
    { id: "size",  name_en: "Size",  name_ar: "الحجم", price_effect: true,
      choices: [ { id: "s", name_en: "Small", name_ar: "صغير", delta: 0 }, { id: "m", name_en: "Medium", name_ar: "وسط", delta: 4000 }, { id: "l", name_en: "Large", name_ar: "كبير", delta: 7000 } ] },
    { id: "sugar", name_en: "Sugar", name_ar: "السكر", price_effect: false,
      choices: [ { id: "none", name_en: "None", name_ar: "بدون", delta: 0 }, { id: "low", name_en: "Light", name_ar: "قليل", delta: 0 }, { id: "med", name_en: "Medium", name_ar: "وسط", delta: 0 }, { id: "high", name_en: "Sweet", name_ar: "زيادة", delta: 0 } ] },
    { id: "milk",  name_en: "Milk",  name_ar: "الحليب", price_effect: true,
      choices: [ { id: "full", name_en: "Full fat", name_ar: "كامل الدسم", delta: 0 }, { id: "oat", name_en: "Oat", name_ar: "شوفان", delta: 5000 } ] }
  ];

  /* The permission matrix: every sensitive action bound to roles (USR-01, USR-02). Defaults = approved split in client spec v1 §2. */
  var ACTIONS = [
    { id: "sell",            group: "till" },
    { id: "remove_line",     group: "till" },
    { id: "hold_order",      group: "till" },
    { id: "manual_discount", group: "till", decision: "D-04" },
    { id: "void_invoice",    group: "till" },
    { id: "cash_refund",     group: "till", decision: "D-05" },
    { id: "open_drawer",     group: "till" },
    { id: "close_shift",     group: "cash" },
    { id: "count_cash",      group: "cash" },
    { id: "approve_variance",group: "cash", decision: "D-06" },
    { id: "staff_meal",      group: "cash", decision: "D-16" },
    { id: "pause_item",      group: "branch" },
    { id: "branch_discount", group: "branch" },
    { id: "record_waste",    group: "stock", decision: "D-07" },
    { id: "stock_count",     group: "stock" },
    { id: "receive_goods",   group: "stock" },
    { id: "change_price",    group: "hq" },
    { id: "edit_catalogue",  group: "hq" },
    { id: "set_rate",        group: "hq" },
    { id: "view_reports",    group: "hq" },
    { id: "manage_people",   group: "hq" }
  ];
  var ROLE_DEFAULTS = {
    owner:          { sell: 0, remove_line: 0, hold_order: 0, manual_discount: 0, void_invoice: 1, cash_refund: 1, open_drawer: 1, close_shift: 0, count_cash: 1, approve_variance: 1, staff_meal: 1, pause_item: 1, branch_discount: 1, record_waste: 1, stock_count: 1, receive_goods: 1, change_price: 1, edit_catalogue: 1, set_rate: 1, view_reports: 1, manage_people: 1 },
    hq_manager:     { sell: 0, remove_line: 0, hold_order: 0, manual_discount: 0, void_invoice: 1, cash_refund: 0, open_drawer: 0, close_shift: 0, count_cash: 0, approve_variance: 1, staff_meal: 1, pause_item: 1, branch_discount: 1, record_waste: 1, stock_count: 1, receive_goods: 1, change_price: 1, edit_catalogue: 1, set_rate: 1, view_reports: 1, manage_people: 0 },
    accountant:     { sell: 0, remove_line: 0, hold_order: 0, manual_discount: 0, void_invoice: 0, cash_refund: 0, open_drawer: 0, close_shift: 0, count_cash: 0, approve_variance: 1, staff_meal: 0, pause_item: 0, branch_discount: 0, record_waste: 0, stock_count: 0, receive_goods: 0, change_price: 0, edit_catalogue: 0, set_rate: 0, view_reports: 1, manage_people: 0 },
    branch_manager: { sell: 1, remove_line: 1, hold_order: 1, manual_discount: 1, void_invoice: 1, cash_refund: 1, open_drawer: 1, close_shift: 1, count_cash: 1, approve_variance: 1, staff_meal: 1, pause_item: 1, branch_discount: 1, record_waste: 1, stock_count: 1, receive_goods: 1, change_price: 0, edit_catalogue: 0, set_rate: 0, view_reports: 1, manage_people: 0 },
    cashier:        { sell: 1, remove_line: 1, hold_order: 1, manual_discount: 0, void_invoice: 0, cash_refund: 1, open_drawer: 0, close_shift: 1, count_cash: 0, approve_variance: 0, staff_meal: 0, pause_item: 0, branch_discount: 0, record_waste: 0, stock_count: 0, receive_goods: 0, change_price: 0, edit_catalogue: 0, set_rate: 0, view_reports: 0, manage_people: 0 },
    barista:        { sell: 0, remove_line: 0, hold_order: 0, manual_discount: 0, void_invoice: 0, cash_refund: 0, open_drawer: 0, close_shift: 0, count_cash: 0, approve_variance: 0, staff_meal: 0, pause_item: 0, branch_discount: 0, record_waste: 1, stock_count: 0, receive_goods: 0, change_price: 0, edit_catalogue: 0, set_rate: 0, view_reports: 0, manage_people: 0 }
  };

  function build(tn) {
    var P = PROFILES[tn.id], hq = D.hq[tn.id], r = rng(P.seed);
    var items = hq.items, cashiers = hq.users.filter(function (u) { return u.role === "cashier"; });
    var managers = hq.users.filter(function (u) { return u.role === "branch_manager"; });
    var ops = {
      deduction_level: "item", deduction_decision: "D-01",
      option_groups: OPTION_GROUPS,
      subcategories: P.subcategories,
      item_meta: {}, price_history: [], rates: {},
      payment_methods: P.methods.map(function (m) { return Object.assign({ branches: "all", updated_by: hq.users[0].id, updated_at: "2026-09-01T09:00:00Z" }, m); }),
      till_rules: {
        opening_float: P.float, opening_float_decision: "D-23",
        variance_limit: P.variance_limit, variance_decision: "D-06",
        no_cash_withdrawals: true, drawer_needs_reason: true,
        mixed_payment: true, mixed_decision: "D-10",
        rounding_decision: "D-11", round_to: hq.exchange_rate ? hq.exchange_rate.round_to : 1,
        order_number: "daily_random", registers_share_orders: true,
        retention_days: 3, retention_decision: "D-12",
        kds_mode: "printed_ticket", prep_stations: [ { id: "bar", name_en: "Coffee bar", name_ar: "بار القهوة", categories: ["hot", "cold"] }, { id: "pastry", name_en: "Pastry counter", name_ar: "ركن المعجنات", categories: ["pastry"] } ], stations_decision: "D-14",
        invoice_bilingual: true, invoice_show_rate: true, invoice_show_cashier: true, invoice_footer_en: "Thank you", invoice_footer_ar: "شكراً لزيارتكم",
        company_invoice: false, company_decision: "D-18",
        tax_rate: null, tax_decision: "D-03", tax_included: true,
        segment_discount: { name_en: "Mall staff", name_ar: "موظفو المول", percent: 10, proof_en: "Staff card shown at the till", proof_ar: "إبراز بطاقة الموظف عند الكاشير", decision: "D-17" },
        staff_meal_daily_limit: 30000, staff_meal_decision: "D-16",
        updated_by: hq.users[0].id, updated_at: "2026-09-01T09:00:00Z"
      },
      suppliers: P.suppliers, purchase_orders: [], movements: [], stock: {},
      sales: [], shifts_hist: [],
      actions: ACTIONS, roles: JSON.parse(JSON.stringify(ROLE_DEFAULTS)), roles_updated_by: hq.users[0].id, roles_updated_at: "2026-09-01T09:00:00Z",
      staff_extra: {}, devices: [], imports: []
    };

    // Items: options, image, barcode, tax (FIS-04 waits for D-03), supplier, reorder point
    items.forEach(function (it, i) {
      ops.item_meta[it.id] = { options: P.options[it.id] || [], has_image: i % 3 !== 2, barcode: P.barcodes[it.id] || "",
        subcategory_id: P.item_sub[it.id] || null, tax_rate: null, supplier_id: P.item_supplier[it.id] || null, reorder_at: 15, cost: Math.round(it.price * 0.38) };
    });
    // Price history (PRC-03)
    items.forEach(function (it) {
      if (it.updated_at > "2026-09-01") ops.price_history.push({ item_id: it.id, from: Math.round(it.price * 0.9 / 500) * 500 || it.price - 1, to: it.price, at: it.updated_at, by: it.updated_by });
    });
    ops.price_history.push({ item_id: items[0].id, from: Math.round(items[0].price * 0.8), to: Math.round(items[0].price * 0.9 / 500) * 500 || items[0].price, at: "2026-07-01T08:00:00Z", by: hq.users[0].id });

    // Rates per day (PAY-04 history, PAY-05 differences)
    for (var d = 14; d >= 0; d--) { var dd = day(d).toISOString().slice(0, 10); ops.rates[dd] = d === 0 && hq.exchange_rate ? hq.exchange_rate.rate : P.base_rate > 100 ? Math.round(P.base_rate * (1 + (r() - 0.5) * 0.03) / 10) * 10 : Math.round(P.base_rate * (1 + (r() - 0.5) * 0.03) * 100) / 100; }

    // Staff extras: login method, branches (USR-03, USR-06), meal allowance (USR-07)
    hq.users.forEach(function (u) { ops.staff_extra[u.id] = { login: u.role === "cashier" ? "pin" : "pin", card_id: "", branches: u.branch_id ? [u.branch_id] : [], meals_today: 0 }; });

    // Stock per branch (finished-item level, D-01 assumption) + devices per register
    tn.branches.forEach(function (b, bi) {
      ops.stock[b.id] = {};
      items.forEach(function (it, i) { ops.stock[b.id][it.id] = { qty: Math.round(20 + r() * 60), counted_at: "2026-09-20T20:00:00Z" }; });
      var low = items[(bi + 2) % items.length]; ops.stock[b.id][low.id].qty = 6;
      var out = items[(bi + 5) % items.length]; ops.stock[b.id][out.id].qty = 0;
      b.registers.forEach(function (reg, ri) {
        ops.devices.push({ id: "dev-" + reg.id, branch_id: b.id, register_id: reg.id, kind: ri === 0 ? "touch_terminal" : "tablet",
          printer: "thermal_80", drawer: ri === 0, scanner: ri === 0, customer_display: ri === 0 && bi === 0, card_terminal: false, approved: true, serial: "SN-" + reg.id.toUpperCase() });
      });
    });

    // Sales, shifts and cash counts — 14 days before the clock
    var orderNo = 700, seq = {};
    tn.branches.forEach(function (b) { b.registers.forEach(function (reg) { seq[reg.id] = 1000; }); });
    for (var n = 14; n >= 1; n--) {
      var date = day(n), dstr = date.toISOString().slice(0, 10), rate = ops.rates[dstr];
      tn.branches.forEach(function (b, bi) {
        var bm = managers.filter(function (m) { return m.branch_id === b.id; })[0] || managers[0];
        var bc = cashiers.filter(function (c) { return c.branch_id === b.id; }); if (!bc.length) bc = cashiers.length ? cashiers : [bm];
        b.registers.forEach(function (reg, ri) {
          if (ri > 1) return; // at most two registers per branch in the history
          var shifts = [ { from: P.open_utc, to: P.open_utc + 7, cashier: bc[0] }, { from: P.open_utc + 7, to: P.close_utc, cashier: bc[1 % bc.length] } ];
          if (ri === 1) shifts = [shifts[1]]; // register 2 opens only for the evening rush
          shifts.forEach(function (sh, si) {
            var opened = new Date(date.getTime() + sh.from * 3600e3), closed = new Date(date.getTime() + sh.to * 3600e3);
            var shift = { id: "sh-" + reg.id + "-" + dstr + "-" + si, branch_id: b.id, register_id: reg.id, cashier_id: sh.cashier.id,
              opened_at: iso(opened), closed_at: iso(closed), float: P.float, expected: {}, counted: {}, variance: {}, counted_by: bm.id, status: "closed" };
            Object.keys(P.float).forEach(function (c) { shift.expected[c] = P.float[c]; });
            var count = Math.round(P.orders_per_day * (ri === 0 ? 0.6 : 0.4) * (0.75 + r() * 0.5) * (sh.to - sh.from) / (P.close_utc - P.open_utc) * (1 + (b.id === tn.branches[0].id ? 0.3 : 0)));
            for (var k = 0; k < count; k++) {
              var hr = sh.from + Math.min(sh.to - sh.from - 0.01, Math.pow(r(), 0.9) * (sh.to - sh.from));
              var at = new Date(Math.round((date.getTime() + hr * 3600e3) / 1000) * 1000);
              var lines = [], nl = 1 + Math.floor(r() * r() * 3.2);
              for (var l = 0; l < nl; l++) { var it = items[Math.floor(Math.pow(r(), 1.4) * items.length)]; var q = r() < 0.15 ? 2 : 1;
                var ex = lines.filter(function (x) { return x.item_id === it.id; })[0]; if (ex) ex.qty += q; else lines.push({ item_id: it.id, qty: q, price: it.price }); }
              var subtotal = lines.reduce(function (a, x) { return a + x.qty * x.price; }, 0), discount = null;
              if (r() < 0.05) discount = { kind: "manual", percent: 5 + Math.floor(r() * 2) * 5, by: bm.id, reason_en: "Regular customer", reason_ar: "زبون دائم" };
              else if (r() < 0.06 && tn.id === "electro-cafe") discount = { kind: "segment", percent: 10, by: sh.cashier.id, reason_en: "Mall staff", reason_ar: "موظفو المول" };
              var disc = discount ? Math.round(subtotal * discount.percent / 100) : 0;
              var step = ops.till_rules.round_to || 1, total = Math.round((subtotal - disc) / step) * step;
              var m = pickW(r, P.mix), meth = P.methods.filter(function (x) { return x.id === m; })[0], tenders;
              // The day's rate is entered at about 10:00 local; earlier sales still carry yesterday's rate (PAY-05 differences come from here).
              var saleRate = hr < P.open_utc + 2 ? (ops.rates[day(n + 1).toISOString().slice(0, 10)] || rate) : rate;
              if (meth.currency === "USD") { var usd = Math.ceil(total / saleRate); tenders = [{ method: m, currency: "USD", amount: usd, rate: saleRate }]; }
              else tenders = [{ method: m, currency: meth.currency, amount: total, rate: 1 }];
              if (tn.id === "electro-cafe" && r() < 0.06) { var part = Math.max(1, Math.floor(total / rate / 2)); tenders = [{ method: "cash_usd", currency: "USD", amount: part, rate: saleRate }, { method: "cash_syp", currency: "SYP", amount: total - part * saleRate, rate: 1 }]; }
              seq[reg.id]++; orderNo++;
              var sale = { id: "s-" + reg.id + "-" + seq[reg.id], invoice_no: Store_series(tn, b, reg) + "-" + String(seq[reg.id]).padStart(6, "0"), order_no: (orderNo % 900) + 100,
                branch_id: b.id, register_id: reg.id, shift_id: shift.id, cashier_id: sh.cashier.id, at: iso(at), type: r() < 0.7 ? "takeaway" : "dine_in",
                lines: lines, subtotal: subtotal, discount: discount, discount_amount: disc, total: total, tenders: tenders, status: "paid" };
              var v = r();
              if (v < 0.015) { sale.status = "void"; sale.void = { by: bm.id, reason_en: "Wrong order", reason_ar: "طلب خاطئ", at: iso(new Date(at.getTime() + 300e3)), refund: tenders[0].method.indexOf("cash") === 0 ? "cash" : "provider" }; }
              ops.sales.push(sale);
              // expected cash
              if (sale.status === "paid") tenders.forEach(function (t) { if (t.method.indexOf("cash") === 0) shift.expected[t.currency] = (shift.expected[t.currency] || 0) + t.amount; });
              if (tenders[0].currency === "USD" && tenders.length === 1) { var change = tenders[0].amount * saleRate - total; if (sale.status === "paid" && change > 0 && shift.expected.SYP != null) shift.expected.SYP -= change; }
            }
            // cash count
            Object.keys(shift.expected).forEach(function (c) {
              var off = r() < 0.18 ? (r() < 0.5 ? -1 : 1) * (c === "USD" ? Math.ceil(r() * 3) : Math.round(r() * P.variance_limit * 1.6 / (step || 1)) * (step || 1)) : 0;
              shift.counted[c] = shift.expected[c] + off; shift.variance[c] = off;
            });
            var worst = Math.abs(shift.variance.SYP || shift.variance.SAR || 0) + Math.abs((shift.variance.USD || 0) * rate);
            if (worst > P.variance_limit) { shift.approved_by = bm.id; shift.reason_en = r() < 0.5 ? "Change given twice" : "Short — to investigate"; shift.reason_ar = shift.reason_en === "Change given twice" ? "أُعطي الباقي مرتين" : "نقص — قيد التحقيق"; }
            ops.shifts_hist.push(shift);
          });
        });
      });
    }

    // Stock movements: received, waste, counts (STK-04, STK-05, STK-06)
    tn.branches.forEach(function (b) {
      var bm = managers.filter(function (m) { return m.branch_id === b.id; })[0] || managers[0];
      items.forEach(function (it, i) {
        ops.movements.push({ id: "mv-r-" + b.id + i, kind: "received", branch_id: b.id, item_id: it.id, qty: 40, supplier_id: ops.item_meta[it.id].supplier_id, by: bm.id, at: "2026-09-20T06:00:00Z", po_id: "po-1" });
        if (i % 3 === 0) ops.movements.push({ id: "mv-w-" + b.id + i, kind: "waste", branch_id: b.id, item_id: it.id, qty: 1 + (i % 3), reason: i % 2 ? "expired" : "damaged", by: bm.id, at: "2026-09-22T19:30:00Z" });
      });
      ops.movements.push({ id: "mv-c-" + b.id, kind: "count", branch_id: b.id, item_id: items[1].id, qty: -2, expected: 30, counted: 28, reason: "count_variance", by: bm.id, at: "2026-09-20T20:00:00Z" });
    });
    ops.purchase_orders = [
      { id: "po-1", supplier_id: ops.suppliers[0].id, branch_id: tn.branches[0].id, status: "received", lines: items.slice(0, 3).map(function (it) { return { item_id: it.id, qty: 40, cost: ops.item_meta[it.id].cost }; }), by: hq.users[0].id, at: "2026-09-18T09:00:00Z", received_at: "2026-09-20T06:00:00Z" },
      { id: "po-2", supplier_id: ops.suppliers[ops.suppliers.length - 1].id, branch_id: tn.branches[0].id, status: "sent", lines: items.slice(-2).map(function (it) { return { item_id: it.id, qty: 30, cost: ops.item_meta[it.id].cost }; }), by: hq.users[0].id, at: "2026-09-22T10:00:00Z" }
    ];
    ops.imports = [ { id: "imp-1", file: "electro-menu-v1.xlsx", rows: items.length, created: items.length, updated: 0, errors: 0, by: "staff-omar", at: "2026-06-01T09:30:00Z" } ];
    return ops;
  }
  function Store_series(tn, b, r) { return (tn.invoice_prefix || "T") + "-" + (b.code || "B") + "-R" + r.n; }

  D.ops = {};
  D.tenants.forEach(function (tn) { if (PROFILES[tn.id] && D.hq[tn.id] && D.hq[tn.id].items.length) D.ops[tn.id] = build(tn); });
})();
