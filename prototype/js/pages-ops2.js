/*
 * Day 10 (part 2) — inventory and purchasing, menu setup, offers and price
 * history, payment methods, till and invoice rules, devices, roles and
 * permissions, and Quantara's operations health. Helpers come from pages-ops.js.
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = Pages, D = window.QuantaraData, X = OPS._h;
  var ops = X.ops, req = X.req, Decision = X.Decision, Phase2 = X.Phase2, banners = X.banners, person = X.person, who = X.who, itemName = X.itemName, branchName = X.branchName;

  function stockState(qty, reorder) { return qty <= 0 ? "out" : qty <= reorder ? "low" : "ok"; }
  function stockBadge(s) { return UI.Badge(t("ops.stock." + s), { ok: "positive", low: "warning", out: "critical" }[s]); }
  function options(list) { return list.map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; }); }

  /* =====================================================================
   * INVENTORY — HQ (Record) and branch stock (List). STK-01…10.
   * ===================================================================== */
  function Inventory(tn, b) {
    var o = ops(tn), label = t(b ? "nav.br_stock" : "nav.hq_inventory"), here = b ? "branch" : "hq";
    if (!o) return X.noData(tn, label);
    var hq = Store.hq(tn), me = b ? X.brMeId(tn, b) : X.hqMeId(tn), branches = b ? [b] : tn.branches;
    function rowsStock() {
      var out = []; hq.items.forEach(function (it) { branches.forEach(function (br) { var s = o.stock[br.id][it.id]; out.push({ it: it, b: br, qty: s.qty, reorder: o.item_meta[it.id].reorder_at, counted_at: s.counted_at }); }); });
      return out;
    }
    var low = rowsStock().filter(function (r) { return r.qty <= r.reorder; });
    var tabs = [
      { id: "stock", label: t("ops.inv.stock"), count: hq.items.length, render: function () {
        return h("div", { class: "stack" },
          h("p", { class: "muted" }, t("ops.inv.stock_note"), " ", req("STK-01 · STK-03 · STK-07")),
          low.length ? UI.Banner({ tone: "warning", title: t("ops.inv.low_title", { n: I18n.number(low.length) }), body: low.map(function (r) { return I18n.pick(r.it, "name") + (b ? "" : " (" + I18n.pick(r.b, "name") + ")"); }).join(" · "), actions: b ? null : UI.Button({ label: t("ops.inv.new_po"), size: "sm", variant: "primary", onClick: function () { newPo(tn, low); } }) }) : null,
          X.simpleTable(t("ops.inv.stock"), [
            { key: "item", label: t("col.item"), render: function (r) { return h("span", null, I18n.pick(r.it, "name"), h("span", { class: "cell-sub" }, I18n.pick(Store.category(tn, r.it.category_id), "name"))); } },
            b ? null : { key: "branch", label: t("col.branch"), render: function (r) { return I18n.pick(r.b, "name"); } },
            { key: "qty", label: t("ops.col.on_hand"), align: "end", render: function (r) { return I18n.number(r.qty); } },
            { key: "reorder", label: t("ops.col.reorder_at"), align: "end", render: function (r) { return I18n.number(r.reorder); } },
            { key: "state", label: t("col.status"), render: function (r) { return stockBadge(stockState(r.qty, r.reorder)); } },
            { key: "counted", label: t("ops.col.last_count"), render: function (r) { return I18n.dateTime(r.counted_at, tn.time_zone); } }
          ].filter(Boolean), rowsStock()));
      } },
      { id: "moves", label: t("ops.inv.moves"), count: o.movements.filter(function (m) { return !b || m.branch_id === b.id; }).length, render: function () {
        var rows = o.movements.filter(function (m) { return !b || m.branch_id === b.id; }).slice().sort(function (a, c) { return a.at < c.at ? 1 : -1; });
        return h("div", { class: "stack" },
          h("p", { class: "muted" }, t("ops.inv.moves_note"), " ", req("STK-04 · STK-05 · STK-06")),
          X.simpleTable(t("ops.inv.moves"), [
            { key: "at", label: t("ops.col.when"), render: function (m) { return I18n.dateTime(m.at, tn.time_zone); } },
            { key: "kind", label: t("ops.col.kind"), render: function (m) { return UI.Badge(t("ops.move." + m.kind), { received: "positive", waste: "critical", count: "info" }[m.kind]); } },
            { key: "item", label: t("col.item"), render: function (m) { return itemName(tn, m.item_id); } },
            b ? null : { key: "branch", label: t("col.branch"), render: function (m) { return branchName(tn, m.branch_id); } },
            { key: "qty", label: t("ops.col.qty"), align: "end", render: function (m) { return h("span", { class: m.kind === "received" ? "pos" : "neg" }, (m.kind === "received" ? "+" : m.qty < 0 ? "" : "−") + I18n.number(m.qty)); } },
            { key: "reason", label: t("ops.col.reason"), render: function (m) { return m.reason ? t("ops.reason." + m.reason) : m.supplier_id ? I18n.pick(o.suppliers.filter(function (s) { return s.id === m.supplier_id; })[0], "name") : "—"; } },
            { key: "by", label: t("ops.col.by"), render: function (m) { return who(tn, m.by); } }
          ].filter(Boolean), rows));
      } },
      b ? null : { id: "po", label: t("ops.inv.po"), count: o.purchase_orders.length, render: function () {
        return h("div", { class: "stack" },
          h("p", { class: "muted" }, t("ops.inv.po_note"), " ", req("STK-09 · STK-04")),
          X.simpleTable(t("ops.inv.po"), [
            { key: "id", label: t("ops.col.po"), render: function (p) { return h("code", { dir: "ltr" }, p.id.toUpperCase()); } },
            { key: "sup", label: t("ops.col.supplier"), render: function (p) { return I18n.pick(o.suppliers.filter(function (s) { return s.id === p.supplier_id; })[0], "name"); } },
            { key: "br", label: t("col.branch"), render: function (p) { return branchName(tn, p.branch_id); } },
            { key: "lines", label: t("ops.col.lines"), render: function (p) { return p.lines.map(function (l) { return l.qty + "× " + itemName(tn, l.item_id); }).join(", "); } },
            { key: "st", label: t("col.status"), render: function (p) { return UI.Badge(t("ops.po." + p.status), p.status === "received" ? "positive" : "info"); } },
            { key: "act", label: "", render: function (p) { return p.status === "sent" ? UI.Button({ label: t("ops.inv.receive"), size: "sm", variant: "primary", onClick: function () { receivePo(tn, p); } }) : h("span", { class: "muted" }, I18n.date(p.received_at || p.at)); } }
          ], o.purchase_orders.slice().reverse()),
          UI.Section({ title: t("ops.inv.suppliers"), flush: true, body: X.simpleTable(t("ops.inv.suppliers"), [
            { key: "n", label: t("ops.col.supplier"), render: function (s) { return I18n.pick(s, "name"); } },
            { key: "items", label: t("ops.col.items"), render: function (s) { return hq.items.filter(function (it) { return o.item_meta[it.id].supplier_id === s.id; }).map(function (it) { return I18n.pick(it, "name"); }).join(", "); } }
          ], o.suppliers) }));
      } },
      b ? null : { id: "warehouse", label: t("ops.inv.warehouse"), render: function () {
        return UI.EmptyState({ icon: "box", title: t("ops.inv.warehouse_title"), body: [t("ops.inv.warehouse_body"), " "].join(""), action: h("span", { class: "stack--tight" }, Phase2(), Decision("D-24"), req("STK-08")) });
      } },
      b ? null : { id: "margin", label: t("ops.inv.margin"), render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.inv.margin_note"), " ", req("STK-10")), h("div", null, Phase2()),
          X.simpleTable(t("ops.inv.margin"), [
            { key: "i", label: t("col.item"), render: function (it) { return I18n.pick(it, "name"); } },
            { key: "p", label: t("col.price"), align: "end", render: function (it) { return X.money(tn, it.price); } },
            { key: "c", label: t("ops.col.cost"), align: "end", render: function (it) { return X.money(tn, o.item_meta[it.id].cost); } },
            { key: "m", label: t("ops.col.margin"), align: "end", render: function (it) { return I18n.number(Math.round((1 - o.item_meta[it.id].cost / it.price) * 100)) + "%"; } }
          ], hq.items));
      } }
    ].filter(Boolean);
    return P.RecordPage({
      stateKey: "ops-inventory:" + (b ? b.id : tn.id),
      header: { breadcrumbs: b ? X.brCrumbs(tn, b, label) : X.hqCrumbs(tn, label), title: label, subtitle: t(b ? "ops.inv.subtitle_branch" : "ops.inv.subtitle"),
        badges: UI.OwnerTag({ owner: b ? "branch" : "hq", here: here }),
        actions: [UI.Button({ label: t("ops.inv.waste"), icon: "alert", onClick: function () { wasteDialog(tn, b || tn.branches[0], me, !b); } }),
          UI.Button({ label: t("ops.inv.count"), icon: "list", onClick: function () { countStock(tn, b || tn.branches[0], me, !b); } }),
          b ? null : UI.Button({ label: t("ops.inv.new_po"), icon: "plus", variant: "primary", onClick: function () { newPo(tn, []); } })].filter(Boolean) },
      banners: banners(tn).concat([UI.Banner({ tone: "warning", title: t("ops.inv.level_title"), body: [t("ops.inv.level_body"), " "].join(""), actions: h("span", { class: "stack--tight" }, Decision(o.deduction_decision), req("STK-02")) })]),
      tabs: tabs,
      sideLabel: t("ops.inv.side"),
      side: [UI.Section({ title: t("ops.inv.who"), body: [h("p", { class: "muted" }, t("ops.inv.who_body")), UI.OwnerTag({ owner: "hq", here: here }), " ", UI.OwnerTag({ owner: "branch", here: here })] })]
    });
  }
  function branchPicker(tn, id, value, onChange) { return UI.Select({ id: id, value: value, options: tn.branches.map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; }), onChange: onChange }); }
  /** STK-05: waste with a reason from an approved list (reasons wait for D-07). */
  function wasteDialog(tn, b, me, pickBranch) {
    var o = ops(tn), hq = Store.hq(tn), d = { branch: b.id, item: hq.items[0].id, qty: 1, reason: "expired" };
    UI.Dialog({ title: t("ops.inv.waste"), body: h("div", { class: "stack" },
      h("p", { class: "muted" }, t("ops.inv.waste_note"), " ", Decision("D-07"), " ", req("STK-05")),
      pickBranch ? UI.FormRow({ id: "w-b", label: t("col.branch"), control: branchPicker(tn, "w-b", d.branch, function (v) { d.branch = v; }) }) : null,
      UI.FormRow({ id: "w-i", label: t("col.item"), control: UI.Select({ id: "w-i", value: d.item, options: options(hq.items), onChange: function (v) { d.item = v; } }) }),
      UI.FormRow({ id: "w-q", label: t("ops.col.qty"), control: UI.Input({ id: "w-q", type: "number", value: 1, min: 1, dir: "ltr", onInput: function (v) { d.qty = Number(v); } }) }),
      UI.FormRow({ id: "w-r", label: t("ops.col.reason"), required: true, control: UI.Select({ id: "w-r", value: d.reason, options: ["expired", "damaged", "spilled", "staff_error"].map(function (r) { return { value: r, label: t("ops.reason." + r) }; }), onChange: function (v) { d.reason = v; } }) })),
      actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
        if (!(d.qty > 0)) { UI.toast(t("ops.qty_required")); return; }
        o.movements.push({ id: "mv-" + Date.now(), kind: "waste", branch_id: d.branch, item_id: d.item, qty: d.qty, reason: d.reason, by: me, at: Store.now() });
        o.stock[d.branch][d.item].qty = Math.max(0, o.stock[d.branch][d.item].qty - d.qty);
        close(); App.render(); UI.toast(t("ops.inv.waste_done"));
      } }] });
  }
  /** STK-06: stocktake — count, see the difference, post it. */
  function countStock(tn, b, me, pickBranch) {
    var o = ops(tn), hq = Store.hq(tn), br = b.id, counts = {};
    var body = h("div", { class: "stack" });
    function draw() {
      body.replaceChildren(h("p", { class: "muted" }, t("ops.inv.count_note"), " ", req("STK-06")),
        pickBranch ? UI.FormRow({ id: "c-b", label: t("col.branch"), control: branchPicker(tn, "c-b", br, function (v) { br = v; counts = {}; draw(); }) }) : null,
        X.simpleTable(t("ops.inv.count"), [
          { key: "i", label: t("col.item"), render: function (it) { return I18n.pick(it, "name"); } },
          { key: "e", label: t("ops.col.expected"), align: "end", render: function (it) { return I18n.number(o.stock[br][it.id].qty); } },
          { key: "c", label: t("ops.col.counted"), render: function (it) { return UI.Input({ id: "sc-" + it.id, type: "number", dir: "ltr", value: counts[it.id], onInput: function (v) { counts[it.id] = v; } }); } }
        ], hq.items));
    }
    draw();
    UI.Dialog({ title: t("ops.inv.count"), wide: true, body: body, actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.inv.post_count"), variant: "primary", onClick: function (close) {
      var n = 0; Object.keys(counts).forEach(function (id) { if (counts[id] === "" || counts[id] == null) return; var c = Number(counts[id]), s = o.stock[br][id], diff = c - s.qty;
        if (diff) { o.movements.push({ id: "mv-" + Date.now() + id, kind: "count", branch_id: br, item_id: id, qty: diff, expected: s.qty, counted: c, reason: "count_variance", by: me, at: Store.now() }); n++; }
        s.qty = c; s.counted_at = Store.now(); });
      close(); App.render(); UI.toast(t("ops.inv.count_done", { n: I18n.number(n) }));
    } }] });
  }
  /** STK-09: purchase order to a supplier. */
  function newPo(tn, low) {
    var o = ops(tn), hq = Store.hq(tn), d = { supplier: o.suppliers[0].id, branch: tn.branches[0].id, qty: {} };
    low.forEach(function (r) { d.qty[r.it.id] = 30; });
    UI.Dialog({ title: t("ops.inv.new_po"), wide: true, body: h("div", { class: "stack" },
      h("p", { class: "muted" }, t("ops.inv.po_new_note"), " ", req("STK-09")),
      h("div", { class: "grid-2" },
        UI.FormRow({ id: "po-s", label: t("ops.col.supplier"), control: UI.Select({ id: "po-s", value: d.supplier, options: options(o.suppliers), onChange: function (v) { d.supplier = v; } }) }),
        UI.FormRow({ id: "po-b", label: t("ops.inv.deliver_to"), control: branchPicker(tn, "po-b", d.branch, function (v) { d.branch = v; }) })),
      X.simpleTable(t("ops.col.lines"), [
        { key: "i", label: t("col.item"), render: function (it) { return I18n.pick(it, "name"); } },
        { key: "q", label: t("ops.col.qty"), render: function (it) { return UI.Input({ id: "po-" + it.id, type: "number", dir: "ltr", value: d.qty[it.id], onInput: function (v) { d.qty[it.id] = Number(v); } }); } }
      ], hq.items)),
      actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.inv.send_po"), variant: "primary", onClick: function (close) {
        var lines = Object.keys(d.qty).filter(function (k) { return d.qty[k] > 0; }).map(function (k) { return { item_id: k, qty: d.qty[k], cost: o.item_meta[k].cost }; });
        if (!lines.length) { UI.toast(t("ops.qty_required")); return; }
        o.purchase_orders.push({ id: "po-" + (o.purchase_orders.length + 1), supplier_id: d.supplier, branch_id: d.branch, status: "sent", lines: lines, by: X.hqMeId(tn), at: Store.now() });
        close(); App.state["ops-inventory:" + tn.id] = { tab: "po" }; App.render(); UI.toast(t("ops.inv.po_sent"));
      } }] });
  }
  function receivePo(tn, p) {
    var o = ops(tn), me = X.hqMeId(tn);
    p.lines.forEach(function (l) { o.stock[p.branch_id][l.item_id].qty += l.qty; o.movements.push({ id: "mv-" + Date.now() + l.item_id, kind: "received", branch_id: p.branch_id, item_id: l.item_id, qty: l.qty, supplier_id: p.supplier_id, po_id: p.id, by: me, at: Store.now() }); });
    p.status = "received"; p.received_at = Store.now(); App.render(); UI.toast(t("ops.inv.received"));
  }

  /* =====================================================================
   * MENU SETUP — categories (tree), options, item details, Excel import (Record).
   * CAT-01…05, CAT-07, POS-09, FIS-04.
   * ===================================================================== */
  function MenuSetup(tn) {
    var o = ops(tn), label = t("nav.hq_menu");
    if (!o) return X.noData(tn, label);
    var hq = Store.hq(tn);
    var tabs = [
      { id: "items", label: t("ops.menu.items"), count: hq.items.length, render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.menu.items_note"), " ", req("CAT-01 · CAT-02 · CAT-04 · CAT-05 · POS-09 · FIS-04")),
          X.simpleTable(t("ops.menu.items"), [
            { key: "img", label: t("ops.col.image"), render: function (it) { return o.item_meta[it.id].has_image ? h("span", { class: "thumb", "aria-label": t("ops.menu.has_image") }, I18n.pick(it, "name").charAt(0)) : h("span", { class: "thumb thumb--none", title: t("ops.menu.no_image") }, "—"); } },
            { key: "n", label: t("col.item"), render: function (it) { return h("span", null, h("span", { lang: "en", dir: "ltr" }, it.name_en), h("span", { class: "cell-sub", lang: "ar", dir: "rtl" }, it.name_ar)); } },
            { key: "c", label: t("col.category"), render: function (it) { var sub = o.subcategories.filter(function (s) { return s.id === o.item_meta[it.id].subcategory_id; })[0]; return I18n.pick(Store.category(tn, it.category_id), "name") + (sub ? " › " + I18n.pick(sub, "name") : ""); } },
            { key: "o", label: t("ops.col.options"), render: function (it) { var ids = o.item_meta[it.id].options; return ids.length ? ids.map(function (g) { return I18n.pick(o.option_groups.filter(function (x) { return x.id === g; })[0], "name"); }).join(", ") : h("span", { class: "muted" }, "—"); } },
            { key: "bc", label: t("ops.col.barcode"), render: function (it) { return o.item_meta[it.id].barcode ? h("code", { dir: "ltr" }, o.item_meta[it.id].barcode) : h("span", { class: "muted" }, "—"); } },
            { key: "tax", label: t("ops.col.tax"), render: function () { return Decision("D-03"); } },
            { key: "p", label: t("col.price"), align: "end", render: function (it) { return X.money(tn, it.price); } },
            { key: "e", label: "", render: function (it) { return UI.Button({ label: t("ops.edit"), size: "sm", variant: "ghost", onClick: function () { itemDialog(tn, it); } }); } }
          ], hq.items));
      } },
      { id: "cats", label: t("ops.menu.cats"), count: hq.categories.length + o.subcategories.length, render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.menu.cats_note"), " ", req("CAT-03")),
          h("ul", { class: "tree" }, hq.categories.map(function (c) {
            var subs = o.subcategories.filter(function (s) { return s.parent_id === c.id; });
            return h("li", null, h("span", { class: "tree__node" }, UI.icon("layers"), I18n.pick(c, "name"), h("span", { class: "cell-sub" }, I18n.pickOther(c, "name")), h("span", { class: "muted" }, " · " + t("ops.menu.n_items", { n: I18n.number(hq.items.filter(function (it) { return it.category_id === c.id; }).length) }))),
              subs.length ? h("ul", null, subs.map(function (s) { return h("li", null, h("span", { class: "tree__node" }, I18n.pick(s, "name"), h("span", { class: "cell-sub" }, I18n.pickOther(s, "name")))); })) : null);
          })),
          UI.Button({ label: t("ops.menu.add_cat"), icon: "plus", onClick: function () { catDialog(tn); } }));
      } },
      { id: "opts", label: t("ops.menu.options"), count: o.option_groups.length, render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.menu.options_note"), " ", req("CAT-04")),
          o.option_groups.map(function (g) {
            return UI.Section({ title: I18n.pick(g, "name"), actions: UI.Badge(t(g.price_effect ? "ops.menu.changes_price" : "ops.menu.no_price"), g.price_effect ? "info" : "neutral"),
              body: h("div", { class: "chips" }, g.choices.map(function (c) { return h("span", { class: "chip" }, I18n.pick(c, "name"), c.delta ? h("small", { dir: "ltr" }, " +" + I18n.number(c.delta)) : null); })) });
          }));
      } },
      { id: "import", label: t("ops.menu.import"), render: function () { return importPanel(tn); } }
    ];
    return P.RecordPage({
      stateKey: "ops-menu:" + tn.id,
      header: { breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.menu.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "hq" }),
        actions: [UI.Button({ label: t("ops.menu.add_item"), icon: "plus", variant: "primary", onClick: function () { itemDialog(tn, null); } })] },
      banners: banners(tn),
      tabs: tabs,
      sideLabel: t("ops.menu.side"),
      side: [UI.Section({ title: t("ops.menu.where"), body: [h("p", { class: "muted" }, t("ops.menu.where_body")), req("CAT-01 · CAT-06")] })]
    });
  }
  function itemDialog(tn, it) {
    var o = ops(tn), hq = Store.hq(tn), meta = it ? o.item_meta[it.id] : { options: [], has_image: false, barcode: "", subcategory_id: null, reorder_at: 15, cost: 0 };
    var d = { name_en: it ? it.name_en : "", name_ar: it ? it.name_ar : "", category_id: it ? it.category_id : hq.categories[0].id, price: it ? it.price : "", options: meta.options.slice(), has_image: meta.has_image, barcode: meta.barcode, branches: "all" };
    var err = {};
    var body = h("div", { class: "stack" });
    function draw() {
      body.replaceChildren(
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "it-en", label: t("ops.menu.name_en"), required: true, error: err.name_en, control: UI.Input({ id: "it-en", dir: "ltr", value: d.name_en, invalid: !!err.name_en, onInput: function (v) { d.name_en = v; } }) }),
          UI.FormRow({ id: "it-ar", label: t("ops.menu.name_ar"), required: true, error: err.name_ar, control: UI.Input({ id: "it-ar", dir: "rtl", value: d.name_ar, invalid: !!err.name_ar, onInput: function (v) { d.name_ar = v; } }) })),
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "it-c", label: t("col.category"), control: UI.Select({ id: "it-c", value: d.category_id, options: options(hq.categories), onChange: function (v) { d.category_id = v; } }) }),
          UI.FormRow({ id: "it-p", label: t("col.price") + " (" + tn.currency + ")", required: true, error: err.price, help: t("ops.menu.price_help"), control: UI.Input({ id: "it-p", type: "number", dir: "ltr", value: d.price, invalid: !!err.price, onInput: function (v) { d.price = v; } }) })),
        h("fieldset", { class: "fieldset" }, h("legend", null, t("ops.col.options")), h("div", { class: "checks" }, o.option_groups.map(function (g) {
          return UI.Checkbox({ id: "it-o-" + g.id, label: I18n.pick(g, "name") + (g.price_effect ? " · " + t("ops.menu.changes_price") : ""), checked: d.options.indexOf(g.id) > -1, onChange: function (v) { d.options = d.options.filter(function (x) { return x !== g.id; }); if (v) d.options.push(g.id); } });
        }))),
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "it-b", label: t("ops.col.barcode"), help: t("ops.menu.barcode_help"), control: UI.Input({ id: "it-b", dir: "ltr", value: d.barcode, onInput: function (v) { d.barcode = v; } }) }),
          UI.FormRow({ id: "it-img", label: t("ops.col.image"), help: t("ops.menu.image_help"), control: UI.Checkbox({ id: "it-img", label: t("ops.menu.has_image"), checked: d.has_image, onChange: function (v) { d.has_image = v; } }) })),
        UI.FormRow({ id: "it-br", label: t("ops.menu.sold_at"), help: t("ops.menu.sold_at_help"), control: UI.Select({ id: "it-br", value: d.branches, options: [{ value: "all", label: t("hq.catalogue.all_branches") }].concat(tn.branches.map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; })), onChange: function (v) { d.branches = v; } }) }),
        h("p", { class: "muted" }, t("ops.menu.tax_note"), " ", Decision("D-03")));
    }
    draw();
    UI.Dialog({ title: it ? t("ops.menu.edit_item") : t("ops.menu.add_item"), wide: true, body: body, actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
      err = {}; if (!d.name_en.trim()) err.name_en = t("ops.required"); if (!d.name_ar.trim()) err.name_ar = t("ops.required"); if (!(Number(d.price) > 0)) err.price = t("ops.required");
      if (Object.keys(err).length) { draw(); return; }
      var me = X.hqMeId(tn), now = Store.now();
      if (it) {
        if (Number(d.price) !== it.price) o.price_history.push({ item_id: it.id, from: it.price, to: Number(d.price), at: now, by: me });
        Object.assign(it, { name_en: d.name_en.trim(), name_ar: d.name_ar.trim(), category_id: d.category_id, price: Number(d.price), updated_by: me, updated_at: now });
      } else {
        it = { id: "item-" + Date.now(), category_id: d.category_id, name_en: d.name_en.trim(), name_ar: d.name_ar.trim(), price: Number(d.price), updated_by: me, updated_at: now };
        hq.items.push(it); tn.branches.forEach(function (b) { o.stock[b.id][it.id] = { qty: 0, counted_at: now }; });
      }
      o.item_meta[it.id] = Object.assign(o.item_meta[it.id] || { reorder_at: 15, cost: Math.round(Number(d.price) * 0.38), subcategory_id: null, tax_rate: null }, { options: d.options, has_image: d.has_image, barcode: d.barcode.trim() });
      close(); App.render(); UI.toast(t("ops.saved"));
    } }] });
  }
  function catDialog(tn) {
    var o = ops(tn), hq = Store.hq(tn), d = { en: "", ar: "", parent: "" };
    UI.Dialog({ title: t("ops.menu.add_cat"), body: h("div", { class: "stack" },
      UI.FormRow({ id: "cat-en", label: t("ops.menu.name_en"), required: true, control: UI.Input({ id: "cat-en", dir: "ltr", onInput: function (v) { d.en = v; } }) }),
      UI.FormRow({ id: "cat-ar", label: t("ops.menu.name_ar"), required: true, control: UI.Input({ id: "cat-ar", dir: "rtl", onInput: function (v) { d.ar = v; } }) }),
      UI.FormRow({ id: "cat-p", label: t("ops.menu.parent"), help: t("ops.menu.parent_help"), control: UI.Select({ id: "cat-p", value: "", options: [{ value: "", label: t("ops.menu.top_level") }].concat(options(hq.categories)), onChange: function (v) { d.parent = v; } }) })),
      actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
        if (!d.en.trim() || !d.ar.trim()) { UI.toast(t("ops.required")); return; }
        var rec = { id: "cat-" + Date.now(), name_en: d.en.trim(), name_ar: d.ar.trim() };
        if (d.parent) { rec.parent_id = d.parent; o.subcategories.push(rec); } else hq.categories.push(rec);
        close(); App.render(); UI.toast(t("ops.saved"));
      } }] });
  }
  /** CAT-07: import from Excel — choose file → check rows → import. Simulated: the file is parsed as sample rows. */
  function importPanel(tn) {
    var o = ops(tn), hq = Store.hq(tn), st = X.state("ops-import:" + tn.id, { step: 0 });
    var sample = [
      { row: 2, name_en: "Mocha", name_ar: "موكا", category: "hot", price: 26000, ok: true },
      { row: 3, name_en: "Flat white", name_ar: "فلات وايت", category: "hot", price: 24000, ok: true },
      { row: 4, name_en: "Latte", name_ar: "لاتيه", category: "hot", price: 23000, ok: true, update: true },
      { row: 5, name_en: "Cookie", name_ar: "", category: "pastry", price: 9000, ok: false, error: "ops.menu.err_ar" },
      { row: 6, name_en: "Smoothie", name_ar: "سموذي", category: "juices", price: 28000, ok: false, error: "ops.menu.err_cat" }
    ];
    var steps = [t("ops.menu.imp_s1"), t("ops.menu.imp_s2"), t("ops.menu.imp_s3")];
    var stepper = h("ol", { class: "stepper" }, steps.map(function (s, i) { return h("li", { class: "stepper__step stepper__step--" + (i < st.step ? "done" : i === st.step ? "current" : "todo") }, h("span", { class: "stepper__dot" }, i < st.step ? UI.icon("check") : I18n.number(i + 1)), h("span", { class: "stepper__label" }, s)); }));
    var content;
    if (st.step === 0) content = h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.menu.imp_intro"), " ", req("CAT-07")),
      h("div", { class: "dropzone" }, UI.icon("box"), h("p", null, t("ops.menu.imp_drop")), h("p", { class: "muted" }, t("ops.menu.imp_cols")),
        UI.Button({ label: t("ops.menu.imp_choose"), variant: "primary", onClick: function () { st.step = 1; st.file = "menu-" + Store.today() + ".xlsx"; App.render(); } })),
      UI.Button({ label: t("ops.menu.imp_template"), variant: "ghost", icon: "arrowNext", onClick: function () { X.exportCsv("quantara-menu-template", [{ key: "name_en", label: "name_en" }, { key: "name_ar", label: "name_ar" }, { key: "category", label: "category" }, { key: "price", label: "price" }, { key: "barcode", label: "barcode" }], []); } }),
      o.imports.length ? UI.Section({ title: t("ops.menu.imp_history"), flush: true, body: X.simpleTable(t("ops.menu.imp_history"), [
        { key: "f", label: t("ops.col.file"), render: function (x) { return h("code", { dir: "ltr" }, x.file); } },
        { key: "r", label: t("ops.col.result"), render: function (x) { return t("ops.menu.imp_result", { c: I18n.number(x.created), u: I18n.number(x.updated), e: I18n.number(x.errors) }); } },
        { key: "b", label: t("ops.col.by"), render: function (x) { return who(tn, x.by) + " · " + I18n.date(x.at); } }
      ], o.imports.slice().reverse()) }) : null);
    else if (st.step === 1) content = h("div", { class: "stack" }, h("p", null, t("ops.menu.imp_checked", { file: st.file, ok: I18n.number(sample.filter(function (r) { return r.ok; }).length), bad: I18n.number(sample.filter(function (r) { return !r.ok; }).length) })),
      X.simpleTable(t("ops.menu.imp_s2"), [
        { key: "row", label: t("ops.col.row"), render: function (r) { return I18n.number(r.row); } },
        { key: "n", label: t("col.item"), render: function (r) { return h("span", null, r.name_en, h("span", { class: "cell-sub" }, r.name_ar || "—")); } },
        { key: "c", label: t("col.category"), render: function (r) { return r.category; } },
        { key: "p", label: t("col.price"), align: "end", render: function (r) { return I18n.number(r.price); } },
        { key: "s", label: t("col.status"), render: function (r) { return r.ok ? UI.Badge(t(r.update ? "ops.menu.imp_update" : "ops.menu.imp_new"), "positive") : UI.Badge(t(r.error), "critical"); } }
      ], sample),
      h("div", { class: "row-actions" }, UI.Button({ label: t("flow.back"), icon: "arrowBack", onClick: function () { st.step = 0; App.render(); } }),
        UI.Button({ label: t("ops.menu.imp_go", { n: I18n.number(sample.filter(function (r) { return r.ok; }).length) }), variant: "primary", onClick: function () {
          var me = X.hqMeId(tn), now = Store.now(), c = 0, u = 0;
          sample.filter(function (r) { return r.ok; }).forEach(function (r) {
            var ex = hq.items.filter(function (x) { return x.name_en === r.name_en; })[0];
            if (ex) { o.price_history.push({ item_id: ex.id, from: ex.price, to: r.price, at: now, by: me }); ex.price = r.price; ex.updated_at = now; ex.updated_by = me; u++; }
            else { var it = { id: "item-" + r.row + "-" + Date.now(), category_id: r.category, name_en: r.name_en, name_ar: r.name_ar, price: r.price, updated_by: me, updated_at: now }; hq.items.push(it);
              o.item_meta[it.id] = { options: [], has_image: false, barcode: "", subcategory_id: null, tax_rate: null, reorder_at: 15, cost: Math.round(r.price * 0.38) }; tn.branches.forEach(function (b) { o.stock[b.id][it.id] = { qty: 0, counted_at: now }; }); c++; }
          });
          o.imports.push({ id: "imp-" + Date.now(), file: st.file, rows: sample.length, created: c, updated: u, errors: sample.filter(function (r) { return !r.ok; }).length, by: me, at: now });
          st.step = 2; st.result = { c: c, u: u }; App.render();
        } })));
    else content = h("div", { class: "stack" }, UI.Banner({ tone: "positive", title: t("ops.menu.imp_done"), body: t("ops.menu.imp_result", { c: I18n.number(st.result.c), u: I18n.number(st.result.u), e: I18n.number(2) }) }),
      UI.Button({ label: t("ops.menu.imp_again"), onClick: function () { st.step = 0; App.render(); } }));
    return h("div", { class: "stack" }, stepper, content);
  }

  /* =====================================================================
   * OFFERS & PRICE HISTORY (Record). PRC-03…09.
   * ===================================================================== */
  function Promotions(tn) {
    var o = ops(tn), label = t("nav.hq_promotions");
    if (!o) return X.noData(tn, label);
    var hq = Store.hq(tn), seg = o.till_rules.segment_discount;
    var tabs = [
      { id: "offers", label: t("ops.promo.offers"), count: hq.offers.length, render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.promo.offers_note"), " ", req("PRC-04 · PRC-05 · PRC-06")),
          X.simpleTable(t("ops.promo.offers"), [
            { key: "n", label: t("col.offer"), render: function (x) { return I18n.pick(x, "name"); } },
            { key: "k", label: t("col.kind"), render: function (x) { return UI.Badge(t("ops.promo.kind." + x.kind), "info"); } },
            { key: "v", label: t("col.value"), align: "end", render: function (x) { return x.kind === "bundle" ? X.money(tn, x.value) : I18n.number(x.value) + "%"; } },
            { key: "w", label: t("col.where"), render: function (x) { return x.branches === "all" ? t("hq.catalogue.all_branches") : x.branches.map(function (id) { return branchName(tn, id); }).join(", "); } },
            { key: "d", label: t("col.when"), render: function (x) { return I18n.date(x.starts_at) + " → " + I18n.date(x.ends_at); } }
          ], hq.offers),
          UI.Section({ title: t("ops.promo.segment"), actions: h("span", { class: "stack--tight" }, UI.OwnerTag({ owner: "hq", here: "hq" }), Decision(seg.decision)), body: UI.DescList([
            { label: t("ops.promo.segment_who"), value: I18n.pick(seg, "name") }, { label: t("ops.col.discount"), value: I18n.number(seg.percent) + "%" }, { label: t("ops.promo.proof"), value: I18n.pick(seg, "proof") }]) }),
          UI.Section({ title: t("ops.promo.loyalty"), actions: Phase2(), body: [h("p", { class: "muted" }, t("ops.promo.loyalty_body")), req("PRC-07"), " ",
            UI.Button({ label: t("nav.hq_subscription"), size: "sm", variant: "ghost", icon: "arrowNext", href: "#/hq/" + tn.id + "/subscription" })] }));
      } },
      { id: "history", label: t("ops.promo.history"), count: o.price_history.length, render: function () {
        return h("div", { class: "stack" }, h("p", { class: "muted" }, t("ops.promo.history_note"), " ", req("PRC-02 · PRC-03")),
          X.simpleTable(t("ops.promo.history"), [
            { key: "at", label: t("ops.col.when"), render: function (x) { return I18n.dateTime(x.at, tn.time_zone); } },
            { key: "i", label: t("col.item"), render: function (x) { return itemName(tn, x.item_id); } },
            { key: "f", label: t("ops.col.from"), align: "end", render: function (x) { return X.money(tn, x.from); } },
            { key: "to", label: t("ops.col.to"), align: "end", render: function (x) { return h("strong", null, X.money(tn, x.to)); } },
            { key: "by", label: t("ops.col.by"), render: function (x) { return who(tn, x.by); } }
          ], o.price_history.slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; })));
      } },
      { id: "tax", label: t("ops.promo.tax"), render: function () {
        return h("div", { class: "stack" }, UI.Banner({ tone: "info", title: t("ops.promo.tax_title"), body: t("ops.promo.tax_body") }), h("p", null, Decision("D-03"), " ", req("PRC-09 · FIS-04")));
      } }
    ];
    return P.RecordPage({
      stateKey: "ops-promo:" + tn.id,
      header: { breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.promo.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "hq" }),
        actions: [UI.Button({ label: t("ops.promo.new"), icon: "plus", variant: "primary", onClick: function () { offerDialog(tn); } })] },
      banners: banners(tn),
      tabs: tabs,
      sideLabel: t("ops.promo.side"),
      side: [UI.Section({ title: t("ops.promo.rules"), body: [h("p", { class: "muted" }, t("ops.promo.rules_body")), req("PRC-02 · PRC-08 · PRC-10")] })]
    });
  }
  function offerDialog(tn) {
    var hq = Store.hq(tn), d = { kind: "offer_of_day", name_en: "", name_ar: "", value: 20, item: hq.items[0].id, starts: Store.today(), ends: Store.today(), branches: "all" };
    var body = h("div", { class: "stack" });
    function draw() {
      body.replaceChildren(
        UI.FormRow({ id: "of-k", label: t("col.kind"), control: UI.Select({ id: "of-k", value: d.kind, options: ["bundle", "offer_of_day", "segment"].map(function (k) { return { value: k, label: t("ops.promo.kind." + k) }; }), onChange: function (v) { d.kind = v; draw(); } }) }),
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "of-en", label: t("ops.menu.name_en"), required: true, control: UI.Input({ id: "of-en", dir: "ltr", value: d.name_en, onInput: function (v) { d.name_en = v; } }) }),
          UI.FormRow({ id: "of-ar", label: t("ops.menu.name_ar"), required: true, control: UI.Input({ id: "of-ar", dir: "rtl", value: d.name_ar, onInput: function (v) { d.name_ar = v; } }) })),
        d.kind === "offer_of_day" ? UI.FormRow({ id: "of-i", label: t("col.item"), control: UI.Select({ id: "of-i", value: d.item, options: options(hq.items), onChange: function (v) { d.item = v; } }) }) : null,
        UI.FormRow({ id: "of-v", label: d.kind === "bundle" ? t("ops.promo.bundle_price") + " (" + tn.currency + ")" : t("ops.col.discount") + " %", control: UI.Input({ id: "of-v", type: "number", dir: "ltr", value: d.value, onInput: function (v) { d.value = Number(v); } }) }),
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "of-s", label: t("ops.promo.starts"), control: UI.Input({ id: "of-s", type: "date", value: d.starts, onInput: function (v) { d.starts = v; } }) }),
          UI.FormRow({ id: "of-e", label: t("ops.promo.ends"), control: UI.Input({ id: "of-e", type: "date", value: d.ends, onInput: function (v) { d.ends = v; } }) })),
        UI.FormRow({ id: "of-b", label: t("col.where"), control: UI.Select({ id: "of-b", value: d.branches, options: [{ value: "all", label: t("hq.catalogue.all_branches") }].concat(tn.branches.map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; })), onChange: function (v) { d.branches = v; } }) }),
        h("p", { class: "muted" }, t("ops.promo.central_only"), " ", req("PRC-04 · PRC-05 · PRC-06")));
    }
    draw();
    UI.Dialog({ title: t("ops.promo.new"), wide: true, body: body, actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
      if (!d.name_en.trim() || !d.name_ar.trim() || !(d.value > 0) || d.ends < d.starts) { UI.toast(t("ops.required")); return; }
      hq.offers.push({ id: "of-" + Date.now(), name_en: d.name_en.trim(), name_ar: d.name_ar.trim(), kind: d.kind, value: d.value, item_id: d.kind === "offer_of_day" ? d.item : null,
        branches: d.branches === "all" ? "all" : [d.branches], starts_at: d.starts, ends_at: d.ends, updated_by: X.hqMeId(tn), updated_at: Store.now() });
      close(); App.render(); UI.toast(t("ops.saved"));
    } }] });
  }

  /* =====================================================================
   * PAYMENT METHODS (Settings). PAY-01…11.
   * ===================================================================== */
  function Payments(tn) {
    var o = ops(tn), label = t("nav.hq_payments");
    if (!o) return X.noData(tn, label);
    var tag = UI.OwnerTag({ owner: "hq", here: "hq" }), q = UI.OwnerTag({ owner: "quantara", here: "hq" }), rules = o.till_rules;
    return P.SettingsPage({
      stateKey: "ops-pay:" + tn.id,
      header: { breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.pay.subtitle") },
      before: banners(tn).concat([UI.Banner({ tone: "info", body: t("ops.pay.note") })]),
      load: function () { var d = { mixed: rules.mixed_payment }; o.payment_methods.forEach(function (m) { d[m.id] = m.on; }); d.rate = Store.hq(tn).exchange_rate ? Store.hq(tn).exchange_rate.rate : "—"; d.tips = Store.moduleState(tn, "tips").on; d.credit = Store.moduleState(tn, "credit_sales").on; return d; },
      save: function (d) { o.payment_methods.forEach(function (m) { m.on = d[m.id]; m.updated_by = X.hqMeId(tn); m.updated_at = Store.now(); }); rules.mixed_payment = d.mixed; },
      groups: [
        { title: t("ops.pay.methods"), rows: o.payment_methods.map(function (m) {
          return { key: m.id, type: "toggle", tag: tag, label: X.methodLabel(m.id), help: t("ops.pay.help." + m.kind, { cur: m.currency }) + " (" + { cash_syp: "PAY-02", cash_usd: "PAY-03", card: "PAY-06", syriatel: "PAY-07", sham: "PAY-08", cash_sar: "PAY-02" }[m.id] + ")",
            note: m.decision ? Decision(m.decision) : null };
        }) },
        { title: t("ops.pay.rules"), rows: [
          { key: "mixed", type: "toggle", tag: tag, label: t("ops.pay.mixed"), help: t("ops.pay.mixed_help"), note: Decision(rules.mixed_decision) },
          { key: "rate", locked: true, tag: tag, label: t("nav.hq_exchange"), help: t("ops.pay.rate_help"), note: Decision(rules.rounding_decision), format: function (v) { return h("a", { href: "#/hq/" + tn.id + "/exchange-rate" }, "1 USD = " + I18n.number(v) + " " + tn.currency); } }
        ] },
        { title: t("ops.pay.modules"), rows: [
          { key: "tips", locked: true, tag: q, label: t("module.tips"), help: t("ops.pay.modules_help"), format: function (v) { return v ? t("settings.on") : t("settings.off"); } },
          { key: "credit", locked: true, tag: q, label: t("module.credit_sales"), help: t("ops.pay.modules_help"), format: function (v) { return v ? t("settings.on") : t("settings.off"); }, note: Phase2() }
        ] }
      ]
    });
  }

  /* =====================================================================
   * TILL, SHIFT & INVOICE RULES (Settings). CSH-01…08, POS-01-01, POS-02, POS-05, POS-07,
   * FIS-01…08, KDS-01…06, OFF-06, OFF-09, USR-03, USR-07.
   * ===================================================================== */
  function TillRules(tn) {
    var o = ops(tn), label = t("nav.hq_till");
    if (!o) return X.noData(tn, label);
    var r = o.till_rules, tag = UI.OwnerTag({ owner: "hq", here: "hq" }), g = UI.OwnerTag({ owner: "guaranteed", here: "hq" }), cur = Object.keys(r.opening_float);
    var yesno = function (v) { return v ? t("settings.on") : t("settings.off"); };
    return P.SettingsPage({
      stateKey: "ops-till:" + tn.id,
      header: { breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.till.subtitle") },
      before: banners(tn),
      load: function () {
        var d = { variance: r.variance_limit, no_withdrawals: r.no_cash_withdrawals, drawer_reason: r.drawer_needs_reason, pay_later: !!r.pay_later, split: !!r.split_bill, dine_in: r.dine_in !== false,
          order_no: r.order_number, inv_bilingual: r.invoice_bilingual, inv_rate: r.invoice_show_rate, inv_cashier: r.invoice_show_cashier, footer_en: r.invoice_footer_en, footer_ar: r.invoice_footer_ar,
          company: r.company_invoice, reprint: r.reprint !== false, kds: r.kds_mode, wait_alert: r.wait_alert || 8, call_numbers: r.call_numbers !== false, retention: r.retention_days, meal: r.staff_meal_daily_limit,
          login: r.login_method || "pin", registers: Store.registerCount(tn), numbering: "", record_all: "", archive: "", conflicts: "", einvoice: "" };
        cur.forEach(function (c) { d["float_" + c] = r.opening_float[c]; });
        return d;
      },
      save: function (d) {
        cur.forEach(function (c) { r.opening_float[c] = Number(d["float_" + c]); });
        Object.assign(r, { variance_limit: Number(d.variance), no_cash_withdrawals: d.no_withdrawals, drawer_needs_reason: d.drawer_reason, pay_later: d.pay_later, split_bill: d.split, dine_in: d.dine_in,
          order_number: d.order_no, invoice_bilingual: d.inv_bilingual, invoice_show_rate: d.inv_rate, invoice_show_cashier: d.inv_cashier, invoice_footer_en: d.footer_en, invoice_footer_ar: d.footer_ar,
          company_invoice: d.company, reprint: d.reprint, kds_mode: d.kds, wait_alert: Number(d.wait_alert), call_numbers: d.call_numbers, retention_days: Number(d.retention), staff_meal_daily_limit: Number(d.meal), login_method: d.login,
          updated_by: X.hqMeId(tn), updated_at: Store.now() });
      },
      groups: [
        { title: t("ops.till.g_shift"), rows: cur.map(function (c) { return { key: "float_" + c, type: "number", dir: "ltr", tag: tag, label: t("ops.till.float") + " · " + c, help: t("ops.till.float_help") + " (CSH-01)", note: Decision(r.opening_float_decision), format: function (v) { return I18n.money(v, c); } }; }).concat([
          { key: "variance", type: "number", dir: "ltr", tag: tag, label: t("ops.till.variance_limit"), help: t("ops.till.variance_help") + " (CSH-03 · CSH-04)", note: Decision(r.variance_decision), format: function (v) { return I18n.money(v, tn.currency); } },
          { key: "no_withdrawals", type: "toggle", tag: tag, label: t("ops.till.no_withdrawals"), help: t("ops.till.no_withdrawals_help") + " (CSH-05)" },
          { key: "drawer_reason", type: "toggle", tag: tag, label: t("ops.till.drawer_reason"), help: t("ops.till.drawer_reason_help") + " (CSH-06)" },
          { key: "registers", locked: true, tag: UI.OwnerTag({ owner: "quantara", here: "hq" }), label: t("ops.till.registers"), help: t("ops.till.registers_help") + " (CSH-08)", note: Decision("D-13"), format: function (v) { return h("a", { href: "#/hq/" + tn.id + "/branches" }, I18n.number(v)); } }
        ]) },
        { title: t("ops.till.g_orders"), rows: [
          { key: "order_no", type: "select", tag: tag, label: t("ops.till.order_no"), help: t("ops.till.order_no_help") + " (POS-02)", options: function () { return ["daily_sequence", "daily_random"].map(function (x) { return { value: x, label: t("ops.till.order_no." + x) }; }); }, format: function (v) { return t("ops.till.order_no." + v); } },
          { key: "dine_in", type: "toggle", tag: tag, label: t("ops.till.dine_in"), help: t("ops.till.dine_in_help") + " (POS-07)", note: Decision("D-09") },
          { key: "pay_later", type: "toggle", tag: tag, label: t("ops.till.pay_later"), help: t("ops.till.pay_later_help") + " (POS-01-01)" },
          { key: "split", type: "toggle", tag: tag, label: t("ops.till.split"), help: t("ops.till.split_help") + " (POS-05)" }
        ] },
        { title: t("ops.till.g_invoice"), rows: [
          { key: "inv_bilingual", type: "toggle", tag: tag, label: t("ops.till.inv_bilingual"), help: t("ops.till.inv_help") + " (FIS-02)" },
          { key: "inv_rate", type: "toggle", tag: tag, label: t("ops.till.inv_rate"), help: t("ops.till.inv_rate_help") + " (FIS-02 · PAY-04)" },
          { key: "inv_cashier", type: "toggle", tag: tag, label: t("ops.till.inv_cashier"), help: t("ops.till.inv_help") + " (FIS-02 · USR-04)" },
          { key: "footer_en", type: "text", dir: "ltr", tag: tag, label: t("ops.till.footer_en"), help: t("ops.till.footer_help") },
          { key: "footer_ar", type: "text", dir: "rtl", tag: tag, label: t("ops.till.footer_ar"), help: t("ops.till.footer_help") },
          { key: "company", type: "toggle", tag: tag, label: t("ops.till.company"), help: t("ops.till.company_help") + " (FIS-06)", note: Decision(r.company_decision) },
          { key: "reprint", type: "toggle", tag: tag, label: t("ops.till.reprint"), help: t("ops.till.reprint_help") + " (FIS-07)" },
          { key: "record_all", locked: true, tag: g, label: t("ops.till.record_all"), help: t("ops.till.record_all_help") + " (FIS-01)", format: function () { return t("hq.settings.always_on"); } },
          { key: "numbering", locked: true, tag: g, label: t("hq.settings.series"), help: t("ops.till.numbering_help") + " (FIS-03)", note: Decision("D-27"), format: function () { return t("ops.till.per_register"); } },
          { key: "archive", locked: true, tag: g, label: t("ops.till.archive"), help: t("ops.till.archive_help") + " (FIS-08)", format: function () { return t("hq.settings.always_on"); } },
          { key: "einvoice", locked: true, tag: g, label: t("hq.settings.einvoice"), help: t("ops.till.einvoice_help") + " (FIS-05)", format: function () { return t("ops.till.ready"); } }
        ] },
        { title: t("ops.till.g_prep"), rows: [
          { key: "kds", type: "select", tag: tag, label: t("ops.till.kds"), help: t("ops.till.kds_help") + " (KDS-01 · KDS-02)", options: function () { return ["printed_ticket", "screen", "both"].map(function (x) { return { value: x, label: t("ops.till.kds." + x) }; }); }, format: function (v) { return t("ops.till.kds." + v); } },
          { key: "wait_alert", type: "number", dir: "ltr", tag: tag, label: t("ops.till.wait_alert"), help: t("ops.till.wait_alert_help") + " (KDS-05)", format: function (v) { return t("ops.minutes", { n: I18n.number(v) }); } },
          { key: "call_numbers", type: "toggle", tag: tag, label: t("ops.till.call_numbers"), help: t("ops.till.call_numbers_help") + " (KDS-06)" },
          { key: "stations", locked: true, tag: tag, label: t("ops.till.stations"), help: t("ops.till.stations_help") + " (KDS-04)", note: Decision(r.stations_decision), format: function () { return r.prep_stations.map(function (s) { return I18n.pick(s, "name"); }).join(" · "); } }
        ] },
        { title: t("ops.till.g_offline"), rows: [
          { key: "retention", type: "number", dir: "ltr", tag: tag, label: t("ops.till.retention"), help: t("ops.till.retention_help") + " (OFF-09)", note: Decision(r.retention_decision), format: function (v) { return t("ops.days", { n: I18n.number(v) }); } },
          { key: "conflicts", locked: true, tag: g, label: t("ops.till.conflicts"), help: t("ops.till.conflicts_help") + " (OFF-06)", format: function () { return t("ops.till.owner_wins"); } }
        ] },
        { title: t("ops.till.g_staff"), rows: [
          { key: "login", type: "select", tag: tag, label: t("ops.till.login"), help: t("ops.till.login_help") + " (USR-03)", options: function () { return ["pin", "card", "card_or_pin"].map(function (x) { return { value: x, label: t("ops.till.login." + x) }; }); }, format: function (v) { return t("ops.till.login." + v); } },
          { key: "meal", type: "number", dir: "ltr", tag: tag, label: t("ops.till.meal"), help: t("ops.till.meal_help") + " (USR-07)", note: Decision(r.staff_meal_decision), format: function (v) { return I18n.money(v, tn.currency); } }
        ] }
      ]
    });
  }

  /* =====================================================================
   * DEVICES & HARDWARE (List). HW-01…07.
   * ===================================================================== */
  function Devices(tn) {
    var o = ops(tn), label = t("nav.hq_devices");
    if (!o) return X.noData(tn, label);
    var yes = function (v) { return v ? h("span", { class: "pos" }, UI.icon("check"), " ", t("ops.yes")) : h("span", { class: "muted" }, "—"); };
    return P.ListPage({
      stateKey: "ops-dev:" + tn.id,
      header: { breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.dev.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "hq" }) },
      before: banners(tn).concat([UI.Section({ title: t("ops.dev.approved"), actions: UI.OwnerTag({ owner: "guaranteed", here: "hq" }), body: [
        h("p", { class: "muted" }, t("ops.dev.approved_body"), " ", req("HW-07 · HW-01")),
        h("div", { class: "chips" }, ["touch_terminal", "tablet", "desktop", "thermal_80", "drawer_rj11", "scanner_usb", "customer_display", "card_terminal"].map(function (k) { return h("span", { class: "chip" }, t("ops.dev.kind." + k)); })),
        h("p", null, Decision("D-12"), " ", Decision("D-29"), " ", h("span", { class: "muted" }, t("ops.dev.decisions")))] })]),
      rows: function () { return o.devices; },
      filters: [{ id: "b", type: "select", label: t("col.branch"), options: function () { return tn.branches.map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; }); }, match: function (d, v) { return !v || d.branch_id === v; } }],
      columns: [
        { key: "reg", label: t("col.register"), render: function (d) { return h("span", null, branchName(tn, d.branch_id) + " · " + X.regLabel(tn, d.register_id), h("span", { class: "cell-sub", dir: "ltr" }, d.serial)); } },
        { key: "kind", label: t("ops.dev.device"), render: function (d) { return t("ops.dev.kind." + d.kind); } },
        { key: "printer", label: t("ops.dev.printer"), render: function (d) { return t("ops.dev.kind." + d.printer); } },
        { key: "drawer", label: t("ops.dev.drawer"), render: function (d) { return yes(d.drawer); } },
        { key: "scanner", label: t("ops.dev.scanner"), render: function (d) { return yes(d.scanner); } },
        { key: "display", label: t("ops.dev.display"), render: function (d) { return yes(d.customer_display); } },
        { key: "card", label: t("ops.dev.card"), render: function (d) { return d.card_terminal ? yes(true) : Decision("D-29"); } },
        { key: "ok", label: t("ops.dev.approved_col"), render: function (d) { return UI.Badge(d.approved ? t("ops.dev.is_approved") : t("ops.dev.not_approved"), d.approved ? "positive" : "critical"); } }
      ],
      empty: { title: t("ops.dev.empty"), body: "" }
    });
  }

  /* =====================================================================
   * ROLES & PERMISSIONS (List-like matrix). USR-01…07.
   * ===================================================================== */
  function Roles(tn) {
    var o = ops(tn), label = t("nav.hq_roles");
    if (!o) return X.noData(tn, label);
    var hq = Store.hq(tn), st = X.state("ops-roles:" + tn.id, { draft: JSON.parse(JSON.stringify(o.roles)) });
    var roles = Object.keys(o.roles), dirty = JSON.stringify(st.draft) !== JSON.stringify(o.roles);
    var groups = ["till", "cash", "branch", "stock", "hq"];
    var table = h("div", { class: "table-wrap" }, h("table", { class: "table matrix" },
      h("caption", { class: "sr-only" }, label),
      h("thead", null, h("tr", null, h("th", { scope: "col" }, t("ops.roles.action")), roles.map(function (r) { return h("th", { scope: "col", class: "matrix__role" }, t("role." + r)); }))),
      groups.map(function (g) {
        return h("tbody", null, h("tr", { class: "matrix__group" }, h("th", { colspan: String(roles.length + 1), scope: "rowgroup" }, t("ops.roles.g." + g))),
          o.actions.filter(function (a) { return a.group === g; }).map(function (a) {
            return h("tr", null, h("th", { scope: "row" }, t("ops.act." + a.id), a.decision ? h("span", null, " ", Decision(a.decision)) : null),
              roles.map(function (r) { var id = "perm-" + r + "-" + a.id;
                return h("td", { class: "matrix__cell" }, h("input", { type: "checkbox", id: id, "aria-label": t("role." + r) + " · " + t("ops.act." + a.id), checked: !!st.draft[r][a.id], disabled: r === "owner" && a.id === "manage_people",
                  onChange: function (e) { st.draft[r][a.id] = e.target.checked ? 1 : 0; App.render(); } })); }));
          }));
      })));
    return [
      UI.PageHeader({ breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("ops.roles.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "hq" }),
        actions: [UI.Button({ label: t("ops.roles.add_person"), icon: "plus", variant: "primary", onClick: function () { personDialog(tn); } })] }),
      h("div", { class: "stack" }, banners(tn), UI.Banner({ tone: "info", body: t("ops.roles.note") }), h("p", { class: "muted" }, req("USR-01 · USR-02 · USR-04 · USR-05")), table,
        UI.Section({ title: t("ops.roles.people"), flush: true, body: X.simpleTable(t("ops.roles.people"), [
          { key: "n", label: t("col.person"), render: function (u) { return I18n.pick(u, "name"); } },
          { key: "r", label: t("col.role"), render: function (u) { return t("role." + u.role); } },
          { key: "b", label: t("ops.roles.branches"), render: function (u) { var ex = o.staff_extra[u.id] || { branches: [] }; return ex.branches.length ? ex.branches.map(function (id) { return branchName(tn, id); }).join(", ") : t("layer.hq"); } },
          { key: "l", label: t("ops.roles.login"), render: function (u) { var ex = o.staff_extra[u.id] || {}; return t("ops.till.login." + (ex.login || "pin")) + (ex.card_id ? " · " + ex.card_id : ""); } }
        ], hq.users) }),
        h("p", { class: "muted" }, t("ops.roles.multi_note"), " ", Decision("D-15"), " ", req("USR-03 · USR-06"))),
      h("div", { class: "savebar", hidden: dirty ? null : true, role: "region", "aria-label": t("settings.unsaved") },
        h("span", { class: "savebar__text" }, UI.icon("info"), t("settings.unsaved")),
        UI.Button({ label: t("settings.discard"), variant: "ghost", onClick: function () { st.draft = JSON.parse(JSON.stringify(o.roles)); App.render(); } }),
        UI.Button({ label: t("settings.save"), variant: "primary", onClick: function () { o.roles = JSON.parse(JSON.stringify(st.draft)); o.roles_updated_by = X.hqMeId(tn); o.roles_updated_at = Store.now();
          Store.log(tn, X.hqMeId(tn), "action", { text_en: "Changed the permissions matrix", text_ar: "عدّل مصفوفة الصلاحيات" }); App.render(); UI.toast(t("settings.saved")); } }))
    ];
  }
  function personDialog(tn) {
    var o = ops(tn), hq = Store.hq(tn), d = { en: "", ar: "", role: "cashier", branches: [tn.branches[0].id], login: "pin", card: "" };
    var body = h("div", { class: "stack" });
    function draw() {
      body.replaceChildren(
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "pp-en", label: t("ops.menu.name_en"), required: true, control: UI.Input({ id: "pp-en", dir: "ltr", value: d.en, onInput: function (v) { d.en = v; } }) }),
          UI.FormRow({ id: "pp-ar", label: t("ops.menu.name_ar"), required: true, control: UI.Input({ id: "pp-ar", dir: "rtl", value: d.ar, onInput: function (v) { d.ar = v; } }) })),
        UI.FormRow({ id: "pp-r", label: t("col.role"), control: UI.Select({ id: "pp-r", value: d.role, options: Object.keys(o.roles).filter(function (r) { return r !== "owner"; }).map(function (r) { return { value: r, label: t("role." + r) }; }), onChange: function (v) { d.role = v; draw(); } }) }),
        ["hq_manager", "accountant"].indexOf(d.role) > -1 ? null : h("fieldset", { class: "fieldset" }, h("legend", null, t("ops.roles.branches") + " (USR-06)"), h("div", { class: "checks" }, tn.branches.map(function (b) {
          return UI.Checkbox({ id: "pp-b-" + b.id, label: I18n.pick(b, "name"), checked: d.branches.indexOf(b.id) > -1, onChange: function (v) { d.branches = d.branches.filter(function (x) { return x !== b.id; }); if (v) d.branches.push(b.id); } });
        }))),
        h("div", { class: "grid-2" },
          UI.FormRow({ id: "pp-l", label: t("ops.roles.login") + " (USR-03)", control: UI.Select({ id: "pp-l", value: d.login, options: ["pin", "card", "card_or_pin"].map(function (x) { return { value: x, label: t("ops.till.login." + x) }; }), onChange: function (v) { d.login = v; draw(); } }) }),
          d.login === "pin" ? h("div") : UI.FormRow({ id: "pp-c", label: t("ops.roles.card"), help: t("ops.roles.card_help"), control: UI.Input({ id: "pp-c", dir: "ltr", value: d.card, onInput: function (v) { d.card = v; } }) })));
    }
    draw();
    UI.Dialog({ title: t("ops.roles.add_person"), wide: true, body: body, actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
      if (!d.en.trim() || !d.ar.trim()) { UI.toast(t("ops.required")); return; }
      var hqRole = ["hq_manager", "accountant"].indexOf(d.role) > -1;
      var u = { id: "u-" + Date.now(), name_en: d.en.trim(), name_ar: d.ar.trim(), role: d.role, branch_id: hqRole ? null : d.branches[0] || null };
      hq.users.push(u); o.staff_extra[u.id] = { login: d.login, card_id: d.card.trim(), branches: hqRole ? [] : d.branches.slice(), meals_today: 0 };
      Store.log(tn, X.hqMeId(tn), "action", { text_en: "Added " + u.name_en + " (" + d.role + ")", text_ar: "أضاف " + u.name_ar });
      close(); App.render(); UI.toast(t("ops.saved"));
    } }] });
  }

  /* =====================================================================
   * QUANTARA · Operations health (List) — every register, every tenant. OFF-07, OFF-05.
   * ===================================================================== */
  function OperationsHealth() {
    var label = t("nav.operations"), clock = Store.now();
    function rows() { var out = []; Store.tenants().forEach(function (tn) { Store.registers(tn).forEach(function (r) { out.push({ tn: tn, r: r, hours: Math.round((Date.parse(clock) - Date.parse(r.last_seen_at)) / 36e5) }); }); }); return out; }
    function health(x) { return x.r.status === "online" && x.hours < 1 ? "ok" : x.hours < 12 ? "watch" : "stale"; }
    return P.ListPage({
      stateKey: "ops-health",
      header: { title: label, subtitle: t("ops.health.subtitle"), badges: UI.OwnerTag({ owner: "quantara", here: "quantara" }) },
      before: [UI.Banner({ tone: "info", body: t("ops.health.note") })],
      rows: rows,
      defaultSort: { key: "hours", dir: "desc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("ops.health.search"), match: function (x, q) { q = q.trim().toLowerCase(); return !q || (x.tn.name_en + " " + x.tn.name_ar + " " + x.r.label).toLowerCase().indexOf(q) > -1; } },
        { id: "h", type: "select", label: t("col.status"), options: function () { return ["ok", "watch", "stale"].map(function (s) { return { value: s, label: t("ops.health." + s) }; }); }, match: function (x, v) { return !v || health(x) === v; } }
      ],
      rowHref: function (x) { return "#/t/" + x.tn.id + "/registers"; },
      columns: [
        { key: "tn", label: t("col.tenant"), sortable: true, sortValue: function (x) { return I18n.pick(x.tn, "name"); }, render: function (x) { return h("span", null, I18n.pick(x.tn, "name"), x.tn.is_sample ? UI.SampleBadge() : null); } },
        { key: "reg", label: t("col.register"), render: function (x) { return h("span", null, I18n.pick(x.r.branch, "name") + " · " + x.r.label); } },
        { key: "status", label: t("col.status"), render: function (x) { return UI.StatusBadge(x.r.status); } },
        { key: "hours", label: t("ops.health.last_sync"), sortable: true, sortValue: function (x) { return x.hours; }, render: function (x) { return h("span", null, I18n.dateTime(x.r.last_seen_at, x.tn.time_zone), h("span", { class: "cell-sub" }, t("ops.health.ago", { n: I18n.number(x.hours) }))); } },
        { key: "health", label: t("ops.health.health"), render: function (x) { var s = health(x); return UI.Badge(t("ops.health." + s), { ok: "positive", watch: "warning", stale: "critical" }[s]); } }
      ],
      empty: { title: t("ops.health.empty"), body: "" }
    });
  }

  Object.assign(window.OPS, { Inventory: Inventory, MenuSetup: MenuSetup, Promotions: Promotions, Payments: Payments, TillRules: TillRules, Devices: Devices, Roles: Roles, OperationsHealth: OperationsHealth });
})();
