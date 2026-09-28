/*
 * Day 10 — the operations screens: reports, shift cash counts, inventory and
 * purchasing, menu setup, offers and price history, payment methods, till rules,
 * devices, roles and permissions, and Quantara's operations health.
 * Each screen is a configuration of one of the four page kinds in pages.js.
 * Data: QuantaraData.ops (data-ops.js). Strings: i18n-ops.js.
 * Requirement IDs are written next to what they cover so the coverage page can link here.
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = Pages, D = window.QuantaraData;

  /* ---------------- helpers ---------------- */
  function ops(tn) { return D.ops[tn.id] || null; }
  function money(tn, n) { return h("span", { class: "money" }, I18n.money(Math.round(n * 100) / 100, tn.currency)); }
  function hqCrumbs(tn, label) { return [{ label: t("layer.hq") + " · " + I18n.pick(tn, "name"), href: "#/hq/" + tn.id }, { label: label }]; }
  function brCrumbs(tn, b, label) { return [{ label: I18n.pick(b, "name"), href: "#/hq/" + tn.id + "/b/" + b.id }, { label: label }]; }
  function who(tn, id) { var a = Store.actor(tn, id); return t("layer." + a.layer) + (a.person ? " · " + I18n.pick(a.person, "name") : ""); }
  function person(tn, id) { var a = Store.actor(tn, id); return a.person ? I18n.pick(a.person, "name") : "—"; }
  function hqMeId(tn) { var m = Store.hqMe(tn); return m ? m.id : null; }
  function brMeId(tn, b) { var m = Store.branchMe(tn, b); return m ? m.id : hqMeId(tn); }
  function req(ids) { return h("span", { class: "req-ref", title: t("ops.req_hint") }, ids); }
  /** A value that waits for a client decision: amber tag with the decision number. */
  function Decision(id) { return h("span", { class: "decision-tag", title: t("ops.decision_hint") }, UI.icon("alert"), h("span", null, t("ops.decision", { id: id }))); }
  function Phase2() { return UI.Badge(t("ops.phase2"), "neutral", t("ops.phase2_hint")); }
  function banners(tn) {
    var out = [];
    if (tn.placeholder_fields) out.push(UI.Banner({ tone: "warning", body: t("placeholder.hq") }));
    if (tn.status === "suspended") out.push(UI.Banner({ tone: "critical", title: t("hq.suspended_title"), body: t("hq.suspended_body", { reason: I18n.pick(tn, "suspension_reason") || "—" }) }));
    return out;
  }
  function noData(tn, label) {
    return [UI.PageHeader({ title: label }), UI.EmptyState({ icon: "chart", title: t("ops.nodata_title"), body: t("ops.nodata_body", { name: I18n.pick(tn, "name") }) })];
  }
  function state(key, init) { if (!App.state[key]) App.state[key] = init; return App.state[key]; }
  function itemName(tn, id) { var it = Store.item(tn, id); return it ? I18n.pick(it, "name") : id; }
  function branchName(tn, id) { var b = Store.branch(tn, id); return b ? I18n.pick(b, "name") : id; }
  function regLabel(tn, id) { var r = Store.registers(tn).filter(function (x) { return x.id === id; })[0]; return r ? r.label : id; }
  function methodLabel(id) { return t("ops.method." + id); }
  function sum(arr, f) { return arr.reduce(function (a, x) { return a + f(x); }, 0); }
  function tile(label, value, sub) { return h("div", { class: "tile" }, h("span", { class: "tile__label" }, label), h("span", { class: "tile__value" }, value), sub ? h("span", { class: "tile__sub" }, sub) : null); }
  function simpleTable(caption, columns, rows) { return UI.Table({ caption: caption, columns: columns, rows: rows, sort: {}, onSort: function () {} }); }

  /** CSV download (RPT-09). Opens in Excel; works from the file system. */
  function exportCsv(name, columns, rows) {
    var esc = function (v) { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var csv = "﻿" + [columns.map(function (c) { return esc(c.label); }).join(",")].concat(rows.map(function (r) { return columns.map(function (c) { return esc(c.csv ? c.csv(r) : r[c.key]); }).join(","); })).join("\n");
    var a = h("a", { href: URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })), download: name + ".csv" });
    document.body.appendChild(a); a.click(); a.remove(); UI.toast(t("ops.exported", { name: name + ".csv" }));
  }

  /* ---------------- sales maths (derived, never stored) ---------------- */
  function period(tn) { return state("ops-period:" + tn.id, { days: 7 }); }
  function salesIn(tn, branchId, days) {
    var o = ops(tn), end = Store.today(), start = new Date(Date.parse(end) - days * 864e5).toISOString().slice(0, 10);
    return o.sales.filter(function (s) { var d = s.at.slice(0, 10); return d >= start && d < end && (!branchId || s.branch_id === branchId); });
  }
  function paidOf(list) { return list.filter(function (s) { return s.status === "paid"; }); }
  function periodPicker(tn, onChange) {
    var p = period(tn);
    return h("div", { class: "filter" }, h("label", { class: "filter__label", for: "ops-period" }, t("ops.period")),
      UI.Select({ id: "ops-period", value: p.days, onChange: function (v) { p.days = Number(v); App.render(); },
        options: [{ value: 1, label: t("ops.period.yesterday") }, { value: 7, label: t("ops.period.7") }, { value: 14, label: t("ops.period.14") }] }));
  }
  function Bars(rows, fmt) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    return h("div", { class: "bars", role: "img", "aria-label": t("ops.chart_label") }, rows.map(function (r) {
      return h("div", { class: "bars__col", title: r.label + " · " + fmt(r.value) },
        h("span", { class: "bars__val" }, r.value ? fmt(r.value) : ""),
        h("span", { class: "bars__bar", style: "block-size:" + Math.max(2, Math.round(r.value / max * 100)) + "%" }),
        h("span", { class: "bars__lbl" }, r.label));
    }));
  }

  /* =====================================================================
   * REPORTS — HQ and branch (Record). RPT-01…09, PAY-05, RPT-04.
   * ===================================================================== */
  function Reports(tn, b) {
    var here = b ? "branch" : "hq", o = ops(tn), label = t(b ? "nav.br_reports" : "nav.hq_reports");
    if (!o) return noData(tn, label);
    var p = period(tn), all = salesIn(tn, b && b.id, p.days), paid = paidOf(all), voids = all.filter(function (s) { return s.status !== "paid"; });
    var cur = tn.currency, today = Store.todayFigures(tn, b && b.id);
    var revenue = sum(paid, function (s) { return s.total; });
    var fmtM = function (n) { return I18n.money(Math.round(n), cur); };
    var exportRows = { cols: [], rows: [] };

    // RPT-02 items
    var byItem = {}; paid.forEach(function (s) { s.lines.forEach(function (l) { var x = byItem[l.item_id] || (byItem[l.item_id] = { item_id: l.item_id, qty: 0, revenue: 0 }); x.qty += l.qty; x.revenue += l.qty * l.price; }); });
    var items = Object.keys(byItem).map(function (k) { return byItem[k]; }).sort(function (a, b2) { return b2.revenue - a.revenue; });
    var itemTotal = sum(items, function (x) { return x.revenue; }) || 1;
    // RPT-03 shifts and staff
    var shifts = o.shifts_hist.filter(function (s) { return (!b || s.branch_id === b.id) && s.opened_at.slice(0, 10) >= new Date(Date.parse(Store.today()) - p.days * 864e5).toISOString().slice(0, 10); });
    var byStaff = {}; paid.forEach(function (s) { var x = byStaff[s.cashier_id] || (byStaff[s.cashier_id] = { id: s.cashier_id, orders: 0, revenue: 0 }); x.orders++; x.revenue += s.total; });
    // RPT-07 by hour (local time)
    var tzOff = tn.time_zone === "Asia/Riyadh" ? 3 : tn.time_zone === "Asia/Dubai" ? 4 : 3;
    var hours = []; for (var hr = 7; hr <= 23; hr++) hours.push({ label: String(hr).padStart(2, "0"), value: 0 });
    paid.forEach(function (s) { var lh = (Number(s.at.slice(11, 13)) + tzOff) % 24; var slot = hours.filter(function (x) { return Number(x.label) === lh; })[0]; if (slot) slot.value += s.total; });
    // RPT-05 discounts & voids
    var discounted = paid.filter(function (s) { return s.discount; });
    // PAY-05 methods & exchange differences
    var byMethod = {}; paid.forEach(function (s) { s.tenders.forEach(function (tt) { var x = byMethod[tt.method] || (byMethod[tt.method] = { id: tt.method, currency: tt.currency, amount: 0, base: 0, count: 0 }); x.amount += tt.amount; x.base += tt.amount * tt.rate; x.count++; }); });
    var fx = paid.filter(function (s) { return s.tenders.some(function (tt) { return tt.currency === "USD"; }); }).map(function (s) {
      var usd = sum(s.tenders.filter(function (tt) { return tt.currency === "USD"; }), function (tt) { return tt.amount; });
      var rateAt = s.tenders.filter(function (tt) { return tt.currency === "USD"; })[0].rate, close = o.rates[s.at.slice(0, 10)] || rateAt;
      return { s: s, usd: usd, rateAt: rateAt, close: close, diff: usd * (close - rateAt) };
    });

    function setExport(cols, rows) { exportRows.cols = cols; exportRows.rows = rows; }
    var tabs = [
      { id: "summary", label: t("ops.rep.summary"), render: function () {
        var cols = [{ key: "k", label: t("ops.col.measure") }, { key: "v", label: t("ops.col.value") }];
        var rows = [{ k: t("today.sales"), v: revenue }, { k: t("today.orders"), v: paid.length }, { k: t("today.average"), v: paid.length ? Math.round(revenue / paid.length) : 0 }, { k: t("ops.rep.voids"), v: voids.length }];
        setExport(cols, rows);
        var daily = []; for (var d = p.days; d >= 1; d--) { var ds = new Date(Date.parse(Store.today()) - d * 864e5).toISOString().slice(0, 10);
          daily.push({ label: I18n.date(ds + "T12:00:00Z").replace(/\s?\d{4}$/, ""), value: sum(paid.filter(function (s) { return s.at.slice(0, 10) === ds; }), function (s) { return s.total; }) }); }
        return h("div", { class: "stack" },
          h("p", { class: "muted" }, t("ops.rep.summary_note"), " ", req("RPT-01 · RPT-08")),
          h("div", { class: "tiles" }, tile(t("today.sales"), fmtM(revenue)), tile(t("today.orders"), I18n.number(paid.length)),
            tile(t("today.average"), fmtM(paid.length ? revenue / paid.length : 0)), tile(t("ops.rep.voids"), I18n.number(voids.length))),
          UI.Section({ title: t("ops.rep.daily"), body: Bars(daily, fmtM) }),
          UI.Section({ title: t("ops.rep.today_live"), actions: UI.Badge(t("ops.live"), "positive"), body: [
            h("div", { class: "tiles" }, tile(t("today.sales"), fmtM(today.sales)), tile(t("today.orders"), I18n.number(today.orders)), tile(t("today.refunds"), I18n.number(today.refunds))),
            h("p", { class: "muted" }, t("ops.rep.today_note"))] }));
      } },
      { id: "items", label: t("ops.rep.items"), count: items.length, render: function () {
        var cols = [
          { key: "rank", label: "#", render: function (x) { return I18n.number(items.indexOf(x) + 1); }, csv: function (x) { return items.indexOf(x) + 1; } },
          { key: "item", label: t("col.item"), render: function (x) { return itemName(tn, x.item_id); }, csv: function (x) { return itemName(tn, x.item_id); } },
          { key: "qty", label: t("ops.col.qty"), align: "end", render: function (x) { return I18n.number(x.qty); }, csv: function (x) { return x.qty; } },
          { key: "revenue", label: t("ops.col.revenue"), align: "end", render: function (x) { return fmtM(x.revenue); }, csv: function (x) { return x.revenue; } },
          { key: "share", label: t("ops.col.share"), align: "end", render: function (x) { return h("span", { class: "sharebar" }, h("span", { class: "sharebar__fill", style: "inline-size:" + Math.round(x.revenue / itemTotal * 100) + "%" }), I18n.number(Math.round(x.revenue / itemTotal * 100)) + "%"); }, csv: function (x) { return Math.round(x.revenue / itemTotal * 100) + "%"; } }
        ];
        setExport(cols, items);
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.items_note"), " ", req("RPT-02")), simpleTable(t("ops.rep.items"), cols, items));
      } },
      { id: "staff", label: t("ops.rep.staff"), render: function () {
        var staffRows = Object.keys(byStaff).map(function (k) { return byStaff[k]; });
        var cols = [
          { key: "person", label: t("col.person"), render: function (x) { return person(tn, x.id); }, csv: function (x) { return person(tn, x.id); } },
          { key: "orders", label: t("today.orders"), align: "end", render: function (x) { return I18n.number(x.orders); }, csv: function (x) { return x.orders; } },
          { key: "revenue", label: t("ops.col.revenue"), align: "end", render: function (x) { return fmtM(x.revenue); }, csv: function (x) { return x.revenue; } }
        ];
        setExport(cols, staffRows);
        var shiftRows = shifts.slice().reverse().slice(0, 30);
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.staff_note"), " ", req("RPT-03")),
          UI.Section({ title: t("ops.rep.by_staff"), flush: true, body: simpleTable(t("ops.rep.by_staff"), cols, staffRows) }),
          UI.Section({ title: t("ops.rep.by_shift"), flush: true, body: simpleTable(t("ops.rep.by_shift"), [
            { key: "when", label: t("col.opened"), render: function (s) { return I18n.dateTime(s.opened_at, tn.time_zone); } },
            { key: "reg", label: t("col.register"), render: function (s) { return (b ? "" : branchName(tn, s.branch_id) + " · ") + regLabel(tn, s.register_id); } },
            { key: "cashier", label: t("col.cashier"), render: function (s) { return person(tn, s.cashier_id); } },
            { key: "orders", label: t("today.orders"), align: "end", render: function (s) { return I18n.number(paid.filter(function (x) { return x.shift_id === s.id; }).length); } },
            { key: "sales", label: t("today.sales"), align: "end", render: function (s) { return fmtM(sum(paid.filter(function (x) { return x.shift_id === s.id; }), function (x) { return x.total; })); } }
          ], shiftRows) }));
      } },
      { id: "cash", label: t("ops.rep.cash"), render: function () { var c = cashColumns(tn, !b); setExport(c, shifts); return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.cash_note"), " ", req("RPT-04 · CSH-03 · CSH-04")), simpleTable(t("ops.rep.cash"), c, shifts.slice().reverse())); } },
      { id: "discounts", label: t("ops.rep.discounts"), count: discounted.length + voids.length, render: function () {
        var rows = discounted.map(function (s) { return { s: s, kind: s.discount.kind === "segment" ? "segment" : "discount" }; }).concat(voids.map(function (s) { return { s: s, kind: "void" }; }))
          .sort(function (a, c) { return a.s.at < c.s.at ? 1 : -1; });
        var cols = [
          { key: "when", label: t("ops.col.when"), render: function (r) { return I18n.dateTime(r.s.at, tn.time_zone); }, csv: function (r) { return r.s.at; } },
          { key: "kind", label: t("ops.col.kind"), render: function (r) { return UI.Badge(t("ops.rep.kind." + r.kind), r.kind === "void" ? "critical" : "info"); }, csv: function (r) { return r.kind; } },
          { key: "inv", label: t("ops.col.invoice"), render: function (r) { return h("code", { dir: "ltr" }, r.s.invoice_no); }, csv: function (r) { return r.s.invoice_no; } },
          { key: "amount", label: t("ops.col.amount"), align: "end", render: function (r) { return fmtM(r.kind === "void" ? r.s.total : r.s.discount_amount); }, csv: function (r) { return r.kind === "void" ? r.s.total : r.s.discount_amount; } },
          { key: "by", label: t("ops.col.by"), render: function (r) { return who(tn, r.kind === "void" ? r.s.void.by : r.s.discount.by); }, csv: function (r) { return person(tn, r.kind === "void" ? r.s.void.by : r.s.discount.by); } },
          { key: "reason", label: t("ops.col.reason"), render: function (r) { return I18n.pick(r.kind === "void" ? r.s.void : r.s.discount, "reason"); }, csv: function (r) { return I18n.pick(r.kind === "void" ? r.s.void : r.s.discount, "reason"); } }
        ];
        setExport(cols, rows);
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.discounts_note"), " ", req("RPT-05 · USR-04")), simpleTable(t("ops.rep.discounts"), cols, rows));
      } },
      b ? null : { id: "branches", label: t("ops.rep.branches"), count: tn.branches.length, render: function () {
        var rows = tn.branches.map(function (br) { var bp = paid.filter(function (s) { return s.branch_id === br.id; }); return { b: br, orders: bp.length, revenue: sum(bp, function (s) { return s.total; }), voids: all.filter(function (s) { return s.branch_id === br.id && s.status !== "paid"; }).length }; });
        var cols = [
          { key: "b", label: t("col.branch"), render: function (r) { return I18n.pick(r.b, "name"); }, csv: function (r) { return I18n.pick(r.b, "name"); } },
          { key: "orders", label: t("today.orders"), align: "end", render: function (r) { return I18n.number(r.orders); }, csv: function (r) { return r.orders; } },
          { key: "revenue", label: t("ops.col.revenue"), align: "end", render: function (r) { return fmtM(r.revenue); }, csv: function (r) { return r.revenue; } },
          { key: "avg", label: t("today.average"), align: "end", render: function (r) { return fmtM(r.orders ? r.revenue / r.orders : 0); }, csv: function (r) { return r.orders ? Math.round(r.revenue / r.orders) : 0; } },
          { key: "voids", label: t("ops.rep.voids"), align: "end", render: function (r) { return I18n.number(r.voids); }, csv: function (r) { return r.voids; } }
        ];
        setExport(cols, rows);
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.branches_note"), " ", req("RPT-06")),
          tn.branches.length < 2 ? UI.Banner({ tone: "info", body: t("ops.rep.one_branch") }) : null,
          Bars(rows.map(function (r) { return { label: I18n.pick(r.b, "name"), value: r.revenue }; }), fmtM),
          simpleTable(t("ops.rep.branches"), cols, rows));
      } },
      { id: "hours", label: t("ops.rep.hours"), render: function () {
        setExport([{ key: "label", label: t("ops.col.hour") }, { key: "value", label: t("ops.col.revenue") }], hours);
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.hours_note"), " ", req("RPT-07")), Bars(hours, fmtM));
      } },
      { id: "payments", label: t("ops.rep.payments"), render: function () {
        var mrows = Object.keys(byMethod).map(function (k) { return byMethod[k]; });
        var mcols = [
          { key: "m", label: t("ops.col.method"), render: function (x) { return methodLabel(x.id); }, csv: function (x) { return methodLabel(x.id); } },
          { key: "count", label: t("ops.col.count"), align: "end", render: function (x) { return I18n.number(x.count); }, csv: function (x) { return x.count; } },
          { key: "amount", label: t("ops.col.amount"), align: "end", render: function (x) { return I18n.money(Math.round(x.amount * 100) / 100, x.currency); }, csv: function (x) { return x.amount + " " + x.currency; } },
          { key: "base", label: t("ops.col.in_base", { cur: cur }), align: "end", render: function (x) { return fmtM(x.base); }, csv: function (x) { return Math.round(x.base); } }
        ];
        setExport(mcols, mrows);
        var fxTotal = sum(fx, function (x) { return x.diff; });
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.rep.payments_note"), " ", req("PAY-01…08 · PAY-05")),
          simpleTable(t("ops.rep.payments"), mcols, mrows),
          fx.length ? UI.Section({ title: t("ops.rep.fx"), actions: h("strong", { class: fxTotal < 0 ? "neg" : "pos" }, fmtM(fxTotal)), body: [
            h("p", { class: "muted" }, t("ops.rep.fx_note")),
            simpleTable(t("ops.rep.fx"), [
              { key: "inv", label: t("ops.col.invoice"), render: function (x) { return h("code", { dir: "ltr" }, x.s.invoice_no); } },
              { key: "usd", label: "USD", align: "end", render: function (x) { return I18n.number(x.usd); } },
              { key: "at", label: t("ops.col.rate_at_sale"), align: "end", render: function (x) { return I18n.number(x.rateAt); } },
              { key: "close", label: t("ops.col.rate_close"), align: "end", render: function (x) { return I18n.number(x.close); } },
              { key: "diff", label: t("ops.col.difference"), align: "end", render: function (x) { return h("span", { class: x.diff < 0 ? "neg" : "pos" }, fmtM(x.diff)); } }
            ], fx.slice(-12).reverse())] }) : h("p", { class: "muted" }, t("ops.rep.fx_none")));
      } }
    ].filter(Boolean);

    return P.RecordPage({
      stateKey: "ops-reports:" + (b ? b.id : tn.id),
      header: { breadcrumbs: b ? brCrumbs(tn, b, label) : hqCrumbs(tn, label), title: label, subtitle: t(b ? "ops.rep.subtitle_branch" : "ops.rep.subtitle"),
        badges: UI.OwnerTag({ owner: b ? "branch" : "hq", here: here }),
        actions: [periodPicker(tn), UI.Button({ label: t("ops.export"), icon: "arrowNext", onClick: function () { exportCsv("quantara-" + (b ? b.code : tn.invoice_prefix) + "-report", exportRows.cols, exportRows.rows); } })] },
      banners: banners(tn),
      tabs: tabs,
      sideLabel: t("ops.rep.side"),
      side: [
        UI.Section({ title: t("ops.rep.where"), body: [h("p", { class: "muted" }, t("ops.rep.where_body")), req("RPT-08 · RPT-09")] }),
        UI.Section({ title: t("ops.rep.offline"), body: [h("p", { class: "muted" }, t("ops.rep.offline_body")), req("OFF-04")] })
      ]
    });
  }

  function cashColumns(tn, withBranch) {
    function cur(s) { return Object.keys(s.expected); }
    function fmt(s, key) { return h("span", { class: "stack--tight" }, cur(s).map(function (c) { return h("span", { class: "cell-line" }, I18n.money(s[key][c], c)); })); }
    return [
      { key: "closed", label: t("col.closed"), render: function (s) { return s.closed_at ? I18n.dateTime(s.closed_at, tn.time_zone) : "—"; }, csv: function (s) { return s.closed_at; } },
      { key: "reg", label: t("col.register"), render: function (s) { return (withBranch ? branchName(tn, s.branch_id) + " · " : "") + regLabel(tn, s.register_id); }, csv: function (s) { return regLabel(tn, s.register_id); } },
      { key: "cashier", label: t("col.cashier"), render: function (s) { return person(tn, s.cashier_id); }, csv: function (s) { return person(tn, s.cashier_id); } },
      { key: "expected", label: t("ops.col.expected"), align: "end", render: function (s) { return fmt(s, "expected"); }, csv: function (s) { return JSON.stringify(s.expected); } },
      { key: "counted", label: t("ops.col.counted"), align: "end", render: function (s) { return fmt(s, "counted"); }, csv: function (s) { return JSON.stringify(s.counted); } },
      { key: "variance", label: t("ops.col.variance"), align: "end", render: function (s) {
        var any = cur(s).some(function (c) { return s.variance[c]; });
        return any ? h("span", { class: "stack--tight" }, cur(s).filter(function (c) { return s.variance[c]; }).map(function (c) { return h("span", { class: "cell-line " + (s.variance[c] < 0 ? "neg" : "pos") }, (s.variance[c] > 0 ? "+" : "") + I18n.money(s.variance[c], c)); })) : UI.Badge(t("ops.balanced"), "positive"); },
        csv: function (s) { return JSON.stringify(s.variance); } },
      { key: "approved", label: t("ops.col.approved"), render: function (s) { return s.approved_by ? h("span", null, person(tn, s.approved_by), h("span", { class: "cell-sub" }, I18n.pick(s, "reason"))) : h("span", { class: "muted" }, "—"); }, csv: function (s) { return s.approved_by ? person(tn, s.approved_by) + ": " + I18n.pick(s, "reason") : ""; } }
    ];
  }

  /* =====================================================================
   * BRANCH · Shift reports & cash count (List). CSH-01…07, OFF-03.
   * ===================================================================== */
  function ShiftReports(tn, b) {
    var o = ops(tn), label = t("nav.br_shifts");
    if (!o) return noData(tn, label);
    var rules = o.till_rules, me = brMeId(tn, b);
    var open = Store.hq(tn).shifts.filter(function (s) { return s.status === "open" && b.registers.some(function (r) { return r.id === s.register_id; }); });
    var cols = cashColumns(tn, false);
    return P.ListPage({
      stateKey: "ops-shifts:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, label), title: label, subtitle: t("ops.shifts.subtitle"), badges: UI.OwnerTag({ owner: "branch", here: "branch" }) },
      before: banners(tn).concat([
        UI.Section({ title: t("ops.shifts.rules"), actions: UI.OwnerTag({ owner: "hq", here: "branch" }), body: UI.DescList([
          { label: t("ops.till.float"), value: h("span", null, Object.keys(rules.opening_float).map(function (c) { return I18n.money(rules.opening_float[c], c); }).join(" · "), " ", Decision(rules.opening_float_decision)) },
          { label: t("ops.till.variance_limit"), value: h("span", null, I18n.money(rules.variance_limit, tn.currency), " ", Decision(rules.variance_decision)) },
          { label: t("ops.till.no_withdrawals"), value: rules.no_cash_withdrawals ? t("settings.on") : t("settings.off") },
          { label: t("ops.till.drawer_reason"), value: rules.drawer_needs_reason ? t("settings.on") : t("settings.off") }
        ]) }),
        open.length ? UI.Banner({ tone: "info", title: t("ops.shifts.open_title", { n: I18n.number(open.length) }), body: t("ops.shifts.open_body"),
          actions: open.map(function (s) { return UI.Button({ label: t("ops.shifts.count", { reg: regLabel(tn, s.register_id) }), size: "sm", variant: "primary", onClick: function () { countDialog(tn, b, s, me); } }); }) }) : null
      ].filter(Boolean)),
      rows: function () { return o.shifts_hist.filter(function (s) { return s.branch_id === b.id; }); },
      defaultSort: { key: "closed", dir: "desc" },
      filters: [
        { id: "var", type: "select", label: t("ops.col.variance"), options: function () { return [{ value: "any", label: t("ops.shifts.with_variance") }, { value: "approved", label: t("ops.shifts.approved") }]; },
          match: function (s, v) { var any = Object.keys(s.variance).some(function (c) { return s.variance[c]; }); return !v || (v === "any" ? any : !!s.approved_by); } }
      ],
      columns: cols.map(function (c) { return c.key === "closed" ? Object.assign({}, c, { sortable: true, sortValue: function (s) { return s.closed_at; } }) : c; }).concat([
        { key: "open", label: "", render: function (s) { return UI.Button({ label: t("ops.shifts.report"), size: "sm", variant: "ghost", onClick: function () { shiftReport(tn, s); } }); } }]),
      empty: { title: t("ops.shifts.empty_title"), body: t("ops.shifts.empty_body") }
    });
  }
  /** CSH-02/03/04: the branch manager counts each currency; above the limit needs a reason. */
  function countDialog(tn, b, s, me) {
    var o = ops(tn), rules = o.till_rules, curs = Object.keys(rules.opening_float), rate = o.rates[Store.today()] || 1;
    var paidToday = Store.feed(tn, s.register_id).filter(function (e) { return e.kind === "order" && e.at >= s.opened_at; });
    var refunds = Store.feed(tn, s.register_id).filter(function (e) { return e.kind === "refund" && e.at >= s.opened_at; });
    var expected = {}; curs.forEach(function (c) { expected[c] = rules.opening_float[c]; });
    expected[curs[0]] += sum(paidToday, function (e) { return e.amount; }) - sum(refunds, function (e) { return e.amount; });
    var counted = {}, reason = "";
    var body = h("div", { class: "stack" });
    function draw() {
      var v = {}, worst = 0; curs.forEach(function (c) { v[c] = counted[c] === "" || counted[c] == null ? null : Number(counted[c]) - expected[c]; worst += Math.abs(v[c] || 0) * (c === "USD" ? rate : 1); });
      var ready = curs.every(function (c) { return v[c] != null; }), over = worst > rules.variance_limit;
      body.replaceChildren(
        h("p", { class: "muted" }, t("ops.count.intro", { reg: regLabel(tn, s.register_id), cashier: person(tn, s.cashier_id) }), " ", req("CSH-02 · CSH-03 · CSH-04")),
        h("div", { class: "count-grid" }, curs.map(function (c) {
          return h("div", { class: "count-row" }, h("strong", null, c), h("span", { class: "muted" }, t("ops.col.expected") + ": " + I18n.money(expected[c], c)),
            UI.Input({ id: "cnt-" + c, type: "number", value: counted[c], dir: "ltr", onInput: function (x) { counted[c] = x; draw(); document.getElementById("cnt-" + c).focus(); } }),
            h("span", { class: v[c] == null ? "muted" : v[c] < 0 ? "neg" : v[c] > 0 ? "pos" : "pos" }, v[c] == null ? "—" : (v[c] > 0 ? "+" : "") + I18n.money(v[c], c)));
        })),
        ready ? UI.Banner({ tone: over ? "warning" : "positive", body: t(over ? "ops.count.over" : "ops.count.within", { n: I18n.money(rules.variance_limit, tn.currency) }) }) : null,
        ready && over ? UI.FormRow({ id: "cnt-reason", label: t("ops.col.reason"), required: true, control: UI.Input({ id: "cnt-reason", value: reason, onInput: function (x) { reason = x; } }) }) : null);
      body._ready = ready; body._over = over; body._v = v;
    }
    draw();
    UI.Dialog({ title: t("ops.shifts.count", { reg: regLabel(tn, s.register_id) }), body: body, actions: [
      { label: t("flow.cancel"), variant: "ghost" },
      { label: t("ops.count.close"), variant: "primary", onClick: function (close) {
        if (!body._ready) { UI.toast(t("ops.count.fill")); return; }
        if (body._over && !reason.trim()) { UI.toast(t("ops.count.reason")); return; }
        s.status = "closed"; s.closed_at = Store.now();
        var rec = { id: s.id, branch_id: b.id, register_id: s.register_id, cashier_id: s.cashier_id, opened_at: s.opened_at, closed_at: s.closed_at, float: rules.opening_float,
          expected: expected, counted: {}, variance: body._v, counted_by: me, status: "closed" };
        curs.forEach(function (c) { rec.counted[c] = Number(counted[c]); });
        if (body._over) { rec.approved_by = me; rec.reason_en = reason; rec.reason_ar = reason; }
        o.shifts_hist.push(rec);
        Store.log(tn, me, "action", { text_en: "Closed shift on " + regLabel(tn, s.register_id), text_ar: "أغلق وردية " + regLabel(tn, s.register_id) });
        close(); App.render(); UI.toast(t("ops.count.done")); shiftReport(tn, rec);
      } }] });
  }
  /** CSH-07: the shift report. */
  function shiftReport(tn, s) {
    var o = ops(tn), sales = paidOf(o.sales.filter(function (x) { return x.shift_id === s.id; }));
    var byM = {}; sales.forEach(function (x) { x.tenders.forEach(function (tt) { byM[tt.method] = (byM[tt.method] || 0) + tt.amount; }); });
    UI.Dialog({ title: t("ops.shifts.report_title"), body: h("div", { class: "receipt-panel" },
      UI.DescList([
        { label: t("col.register"), value: branchName(tn, s.branch_id) + " · " + regLabel(tn, s.register_id) },
        { label: t("col.cashier"), value: person(tn, s.cashier_id) },
        { label: t("col.opened"), value: I18n.dateTime(s.opened_at, tn.time_zone) },
        { label: t("col.closed"), value: s.closed_at ? I18n.dateTime(s.closed_at, tn.time_zone) : "—" },
        { label: t("today.orders"), value: I18n.number(sales.length) },
        { label: t("today.sales"), value: I18n.money(sum(sales, function (x) { return x.total; }), tn.currency) },
        { label: t("ops.col.method"), value: h("span", { class: "stack--tight" }, Object.keys(byM).map(function (m) { return h("span", { class: "cell-line" }, methodLabel(m) + ": " + I18n.number(Math.round(byM[m] * 100) / 100)); })) },
        { label: t("ops.col.expected"), value: Object.keys(s.expected).map(function (c) { return I18n.money(s.expected[c], c); }).join(" · ") },
        { label: t("ops.col.counted"), value: Object.keys(s.counted).map(function (c) { return I18n.money(s.counted[c], c); }).join(" · ") },
        { label: t("ops.col.variance"), value: Object.keys(s.variance).map(function (c) { return I18n.money(s.variance[c] || 0, c); }).join(" · ") },
        { label: t("ops.shifts.counted_by"), value: person(tn, s.counted_by) },
        s.approved_by ? { label: t("ops.col.approved"), value: person(tn, s.approved_by) + " — " + I18n.pick(s, "reason") } : null
      ].filter(Boolean)), h("p", { class: "muted" }, t("ops.shifts.report_note"), " ", req("CSH-07 · OFF-03"))),
      actions: [{ label: t("ops.print"), variant: "primary", onClick: function (close) { close(); UI.toast(t("ops.printed")); } }] });
  }

  window.OPS = window.OPS || {};
  Object.assign(window.OPS, { Reports: Reports, ShiftReports: ShiftReports,
    _h: { ops: ops, money: money, hqCrumbs: hqCrumbs, brCrumbs: brCrumbs, who: who, person: person, hqMeId: hqMeId, brMeId: brMeId, req: req, Decision: Decision, Phase2: Phase2,
      banners: banners, noData: noData, state: state, itemName: itemName, branchName: branchName, regLabel: regLabel, methodLabel: methodLabel, sum: sum, tile: tile, simpleTable: simpleTable, exportCsv: exportCsv } });
})();
