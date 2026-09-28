/*
 * The tenant's own dashboard — head office (HQ) and branch — built from the same
 * four page kinds and shared components as the Quantara panel.
 *
 * Every value shows who owns it (OwnerTag), and every boundary state is drawn by
 * one component from ui.js: StateTag set_by_quantara / set_by_hq / overridden,
 * SyncTag, Meter + LimitBanner, SupportInside. The ownership follows the decided
 * table in README → "Who owns what".
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = function () { return window.Pages; };

  /* ---------- helpers ---------- */
  function hq(tn, path) { return "#/hq/" + tn.id + (path || ""); }
  function br(tn, b, path) { return "#/hq/" + tn.id + "/b/" + b.id + (path || ""); }
  function hqCrumbs(tn, label) {
    var c = [{ label: t("layer.hq"), href: hq(tn) }];
    if (label) c.push({ label: label });
    return c;
  }
  function brCrumbs(tn, b, label) {
    var c = [{ label: I18n.pick(b, "name"), href: br(tn, b) }];
    if (label) c.push({ label: label });
    return c;
  }
  function who(tn, id) { var p = Store.person(tn, id); return p ? I18n.pick(p, "name") : "—"; }
  function actorName(tn, e) {
    return e.actor === "hq" ? t("owner.hq") : e.actor === "branch" ? t("owner.branch") : e.actor === "quantara" ? t("owner.quantara") : t("owner.register");
  }
  function money(tn, n) { return I18n.money(n, tn.currency); }
  function hqUser(tn) { var o = Store.owner(tn); return o ? o.id : null; }
  function brUser(tn, b) { var m = Store.managerOf(tn, b.id); return m ? m.id : null; }
  function reqUpgrade(tn, what) {
    return function () { Store.requestUpgrade(tn, hqUser(tn), what); App.render(); UI.toast(t("limit.requested_toast")); };
  }
  function limitBlock(tn, what) {
    var l = Store.limits(tn)[what];
    return l.used >= l.limit ? UI.LimitBanner({ what: what, limit: l.limit, requested: Store.pendingUpgrade(tn), onRequest: reqUpgrade(tn, what) }) : null;
  }
  function meters(tn) {
    var l = Store.limits(tn);
    return h("div", { class: "meters" },
      UI.Meter({ label: t("br.branches"), used: l.branches.used, limit: l.branches.limit }),
      UI.Meter({ label: t("br.registers"), used: l.registers.used, limit: l.registers.limit }),
      UI.OwnerTag("quantara"));
  }
  function itemName(it) {
    return h("span", { class: "cell-name__text" }, h("span", { class: "cell-name__primary" }, I18n.pick(it, "name")),
      h("span", { class: "cell-name__other" }, I18n.pickOther(it, "name")));
  }
  function regSync(tn, r) { return UI.SyncTag({ at: r.last_synced_at, offline: r.status === "offline", tz: tn.time_zone }); }
  function feedList(tn, events) {
    if (!events.length) return h("p", { class: "muted feed__empty" }, t("home.no_events"));
    return h("ol", { class: "feed" }, events.map(function (e) {
      return h("li", { class: "feed__row feed__row--" + e.kind },
        h("time", { datetime: e.at }, I18n.time(e.at, tn.time_zone)),
        h("span", { class: "feed__kind" }, t("feed." + e.kind), e.order_no ? h("span", { class: "muted" }, " #" + e.order_no) : null),
        h("span", { class: "feed__amount" }, e.amount != null ? (e.kind === "refund" ? "−" : "") + I18n.money(e.amount, e.currency) : ""),
        h("span", { class: "feed__by muted" }, who(tn, e.by_id)));
    }));
  }
  function registerCard(tn, r) {
    var shift = r.shift && r.shift.open ? h("span", { class: "muted" }, t("home.shift_open", { time: I18n.time(r.shift.opened_at, tn.time_zone) })) : null;
    return UI.Section({ title: r.label + " · " + I18n.pick(r.branch, "name"), actions: regSync(tn, r),
      body: [shift, feedList(tn, Store.feed(tn, { register: r.id }).slice(0, 6))] });
  }
  function totalsList(tn, filter) {
    var tot = Store.totals(tn, filter), cur = Object.keys(tot.byCurrency);
    return UI.DescList(cur.length ? cur.map(function (c) { return { label: c, value: I18n.money(tot.byCurrency[c], c), owner: "hq" }; })
      .concat([{ label: t("home.orders_label"), value: I18n.number(tot.orders) }])
      : [{ label: t("home.sales"), value: "—" }]);
  }

  /* =====================================================================
   * HQ — Home (record): today's sales and a live feed per register
   * ===================================================================== */
  function HqHome(tn) {
    var regs = Store.registers(tn), rate = Store.rate(tn);
    return P().RecordPage({
      stateKey: "hq-home:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn), title: t("home.title"), subtitle: t("home.subtitle"), owner: "hq" },
      banners: [],
      tabs: [
        { id: "feed", label: t("home.tab_feed"), render: function () {
          if (!regs.length) return UI.EmptyState({ icon: "register", title: t("home.empty_title") });
          return h("div", { class: "stack" }, h("p", { class: "muted" }, t("home.feed_note")),
            h("div", { class: "card-grid" }, regs.map(function (r) { return registerCard(tn, r); })));
        } },
        { id: "branches", label: t("home.tab_branches"), render: function () {
          return UI.Table({ caption: t("home.tab_branches"), rows: tn.branches, columns: [
            { key: "name", label: t("col.branch"), render: function (b) { return h("a", { href: br(tn, b) }, I18n.pick(b, "name")); } },
            { key: "sales", label: t("home.sales"), owner: "hq", render: function (b) {
              var tot = Store.totals(tn, { branch: b.id });
              return Object.keys(tot.byCurrency).map(function (c) { return I18n.money(tot.byCurrency[c], c); }).join(" · ") || "—"; } },
            { key: "online", label: t("home.online"), align: "end", render: function (b) {
              return t("meter.of", { used: I18n.number(b.registers.filter(function (r) { return r.status === "online"; }).length), limit: I18n.number(b.registers.length) }); } }
          ] });
        } }
      ],
      sideLabel: t("home.sales"),
      side: h("div", { class: "stack" },
        UI.Section({ title: t("home.sales"), body: totalsList(tn) }),
        UI.Section({ title: t("home.rate_today"), actions: UI.OwnerTag("hq"), body: [
          h("p", { class: "stat" }, rate && rate.date === QuantaraData.today ? "1 USD = " + I18n.money(rate.usd, tn.currency) : t("home.no_rate")),
          UI.Button({ label: t("hqnav.rate"), variant: "ghost", size: "sm", icon: "arrowNext", href: hq(tn, "/exchange-rate") })] }),
        UI.Section({ title: t("home.online"), body: h("p", { class: "stat" }, t("meter.of", { used: I18n.number(Store.onlineCount(tn)), limit: I18n.number(regs.length) })) }))
    });
  }

  /* =====================================================================
   * HQ — Catalogue (list). HQ owns items and prices; branch pauses are overrides.
   * ===================================================================== */
  function branchStatus(tn, it) {
    var marks = [];
    tn.branches.forEach(function (b) {
      var p = Store.pauseOf(tn, it.id, b.id), d = Store.discountOf(tn, it.id, b.id);
      if (p) marks.push(UI.StateTag("overridden", t("cat.paused_at", { branch: I18n.pick(b, "name") })));
      if (d) marks.push(UI.StateTag("overridden", t("cat.discount_at", { p: I18n.number(d.percent), branch: I18n.pick(b, "name"), time: I18n.time(d.ends_at, tn.time_zone) })));
    });
    return marks.length ? h("span", { class: "tag-stack" }, marks) : h("span", { class: "muted" }, t("cat.normal"));
  }
  function soldAt(tn, it) {
    return it.branch_ids === "all" ? t("cat.all_branches")
      : it.branch_ids.map(function (id) { return I18n.pick(Store.branch(tn, id), "name"); }).join(I18n.lang === "ar" ? "، " : ", ");
  }
  function HqCatalogue(tn) {
    return P().ListPage({
      stateKey: "hq-cat:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("cat.title")), title: t("cat.title"), subtitle: t("cat.subtitle"), owner: "hq" },
      before: tn.id === "electro-cafe" ? UI.Banner({ tone: "warning", body: t("cat.sample_menu") }) : null,
      rows: function () { return Store.items(tn); },
      defaultSort: { key: "name", dir: "asc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.search_ph"),
          match: function (it, q) { q = q.trim().toLowerCase(); return !q || (it.name_en + " " + it.name_ar).toLowerCase().indexOf(q) > -1; } },
        { id: "cat", type: "select", label: t("filter.category"),
          options: function () { return Store.categories(tn).map(function (c) { return { value: c.id, label: I18n.pick(c, "name") }; }); },
          match: function (it, v) { return !v || it.category_id === v; } }
      ],
      columns: [
        { key: "name", label: t("col.item"), owner: "hq", sortable: true, render: itemName, sortValue: function (it) { return I18n.pick(it, "name"); } },
        { key: "category", label: t("col.category"), owner: "hq", sortable: true, render: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name"); },
          sortValue: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name"); } },
        { key: "price", label: t("col.price", { cur: tn.currency }), owner: "hq", align: "end", sortable: true, render: function (it) { return I18n.number(it.price); } },
        { key: "sold_at", label: t("col.available_at"), owner: "hq", render: function (it) { return soldAt(tn, it); } },
        { key: "branches", label: t("col.at_branches"), owner: "branch", render: function (it) { return branchStatus(tn, it); } },
        { key: "updated_at", label: t("col.last_change"), sortable: true, render: function (it) {
          return UI.SyncTag({ changedBy: t("owner." + it.updated_by), at: it.updated_at, tz: tn.time_zone }); } }
      ],
      empty: { title: t("cat.empty_title"), body: t("cat.empty_body") }
    });
  }

  /* =====================================================================
   * HQ — Prices & offers (record, tabs). Branch discounts shown as overrides.
   * ===================================================================== */
  function HqPrices(tn) {
    var s = tn.settings || {}, pend = tn.pending || {};
    var discounts = Store.overrides(tn, { kind: "discount" });
    return P().RecordPage({
      stateKey: "hq-prices:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("prices.title")), title: t("prices.title"), subtitle: t("prices.subtitle"), owner: "hq" },
      tabs: [
        { id: "offers", label: t("prices.tab_offers"), count: Store.offers(tn).length, render: function () {
          if (!Store.offers(tn).length) return UI.EmptyState({ icon: "ticket", title: t("prices.tab_offers"), body: t("cat.empty_body") });
          return UI.Table({ caption: t("prices.tab_offers"), rows: Store.offers(tn), columns: [
            { key: "name", label: t("col.offer"), owner: "hq", render: function (o) { return I18n.pick(o, "name"); } },
            { key: "kind", label: t("col.kind"), render: function (o) { return t("offer." + o.kind); } },
            { key: "value", label: t("col.value"), owner: "hq", render: function (o) { return I18n.pick(o, "value") || UI.Pending(o.pending); } },
            { key: "period", label: t("col.period"), owner: "hq", render: function (o) {
              return o.starts_at ? I18n.time(o.starts_at, tn.time_zone) + " – " + I18n.time(o.ends_at, tn.time_zone) : t("prices.always"); } },
            { key: "status", label: t("col.status"), render: function (o) { return UI.StatusBadge(o.status); } }
          ] });
        } },
        { id: "manual", label: t("prices.tab_manual"), render: function () {
          return UI.Section({ title: t("prices.tab_manual"), actions: UI.OwnerTag("hq"), body: [UI.DescList([
            { label: t("manual.who"), value: s.manual_discount_role ? t("role." + s.manual_discount_role) : UI.Pending(pend.manual_discount_cap), owner: "hq" },
            { label: t("manual.cap"), value: s.manual_discount_cap != null ? I18n.number(s.manual_discount_cap) + "%" : UI.Pending(pend.manual_discount_cap), owner: "hq" }
          ]), h("p", { class: "muted" }, t("manual.logged")),
            UI.Button({ label: t("hqnav.settings"), variant: "ghost", size: "sm", icon: "arrowNext", href: hq(tn, "/settings") })] });
        } },
        { id: "history", label: t("prices.tab_history"), render: function () {
          var rows = Store.priceHistory(tn);
          if (!rows.length) return UI.EmptyState({ icon: "pulse", title: t("record.no_activity") });
          return UI.Table({ caption: t("prices.tab_history"), rows: rows, columns: [
            { key: "at", label: t("col.when"), render: function (r) { return I18n.dateTime(r.at, tn.time_zone); } },
            { key: "item", label: t("col.item"), render: function (r) { return I18n.pick(Store.item(tn, r.item_id), "name"); } },
            { key: "from", label: t("col.from"), align: "end", render: function (r) { return I18n.number(r.from); } },
            { key: "to", label: t("col.to"), align: "end", render: function (r) { return I18n.number(r.to); } },
            { key: "by", label: t("col.by"), owner: "hq", render: function (r) { return who(tn, r.by_id); } }
          ] });
        } }
      ],
      sideLabel: t("prices.overrides"),
      side: UI.Section({ title: t("prices.overrides"), actions: UI.OwnerTag("branch"), body: [
        h("p", { class: "muted" }, t("prices.overrides_note")),
        discounts.length ? h("ul", { class: "plain-list" }, discounts.map(function (d) {
          var it = Store.item(tn, d.item_id), b = Store.branch(tn, d.branch_id);
          return h("li", null, UI.StateTag("overridden", t("cat.discount_at", { p: I18n.number(d.percent), branch: I18n.pick(b, "name"), time: I18n.time(d.ends_at, tn.time_zone) }),
            I18n.pick(it, "name") + " · " + t("state.hq_value", { v: money(tn, it.price) })));
        })) : h("p", null, t("prices.no_overrides"))] })
    });
  }

  /* =====================================================================
   * HQ — Exchange rate (settings): one rate a day, pinned at sale
   * ===================================================================== */
  function HqRate(tn) {
    if (!tn.secondary_currency) return P().NotBuilt(t("rate.title"), { owner: "hq", breadcrumbs: hqCrumbs(tn, t("rate.title")), reason: t("rate.no_secondary"), action: false });
    var rates = Store.rates(tn), today = rates[0] && rates[0].date === QuantaraData.today ? rates[0] : null;
    return P().SettingsPage({
      stateKey: "hq-rate:" + tn.id + ":" + rates.length,
      owner: "hq",
      header: { breadcrumbs: hqCrumbs(tn, t("rate.title")), title: t("rate.title"), subtitle: t("rate.subtitle"), owner: "hq" },
      before: tn.id === "electro-cafe" ? UI.Banner({ tone: "warning", body: t("rate.sample") }) : null,
      load: function () { return { usd: today ? today.usd : null }; },
      save: function (d) { if (d.usd > 0) Store.setRate(tn, d.usd, hqUser(tn)); },
      savedText: t("rate.saved"),
      groups: [{ title: t("rate.group"), rows: [
        { key: "usd", type: "number", dir: "ltr", owner: "hq", label: t("rate.usd", { cur: tn.currency }), help: t("rate.usd_help"),
          format: function (v) { return I18n.money(v, tn.currency); } }
      ] }],
      after: UI.Section({ title: t("rate.history"), flush: true, body: UI.Table({ caption: t("rate.history"), rows: rates, columns: [
        { key: "date", label: t("col.date"), render: function (r) { return I18n.date(r.date); } },
        { key: "usd", label: t("col.rate"), owner: "hq", align: "end", render: function (r) { return I18n.number(r.usd); } },
        { key: "by", label: t("col.set_by"), render: function (r) { return who(tn, r.set_by_id) + " · " + I18n.time(r.set_at, tn.time_zone); } }
      ] }) })
    });
  }

  /* ---------- HQ — Inventory & purchasing: waits on ق-٠١ ---------- */
  function HqInventory(tn) {
    return P().NotBuilt(t("hqnav.inventory"), { owner: "hq", breadcrumbs: hqCrumbs(tn, t("hqnav.inventory")), reason: t("inv.reason"),
      actionLabel: t("hqnav.home"), actionHref: hq(tn) });
  }

  /* =====================================================================
   * HQ — Branches & registers (list): adds them itself, within the plan
   * ===================================================================== */
  function addBranchDialog(tn) {
    var d = { en: "", ar: "", city_en: "", city_ar: "" };
    UI.Dialog({ title: t("br.new_branch"), body: [
      UI.FormRow({ id: "nb-en", label: t("flow.branch_en"), control: UI.Input({ id: "nb-en", dir: "ltr", onInput: function (v) { d.en = v; } }) }),
      UI.FormRow({ id: "nb-ar", label: t("flow.branch_ar"), control: UI.Input({ id: "nb-ar", dir: "rtl", onInput: function (v) { d.ar = v; } }) })],
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("br.add_branch"), variant: "primary", onClick: function (close) {
        if (!d.en.trim() || !d.ar.trim()) return;
        var id = tn.id + "-" + Store.slug(d.en), code = d.en.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "BR";
        Store.addBranch(tn, { id: id, code: code, name_en: d.en.trim(), name_ar: d.ar.trim(), city_en: "", city_ar: "", status: "active", registers: [] }, hqUser(tn));
        close(); App.render(); UI.toast(t("br.added", { name: I18n.lang === "ar" ? d.ar : d.en }));
      } }] });
  }
  function addRegisterDialog(tn) {
    var pick = tn.branches[0] && tn.branches[0].id;
    UI.Dialog({ title: t("br.add_register"), body: UI.FormRow({ id: "nr-b", label: t("br.which_branch"),
      control: UI.Select({ id: "nr-b", value: pick, options: tn.branches.map(function (b) { return { value: b.id, label: I18n.pick(b, "name") }; }), onChange: function (v) { pick = v; } }) }),
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("br.add_register"), variant: "primary", onClick: function (close) {
        Store.addRegister(tn, pick, hqUser(tn)); close(); App.render(); UI.toast(t("br.added", { name: t("br.registers") }));
      } }] });
  }
  function HqBranches(tn) {
    var l = Store.limits(tn), s = tn.settings || {};
    var atB = l.branches.used >= l.branches.limit, atR = l.registers.used >= l.registers.limit;
    return P().ListPage({
      stateKey: "hq-br:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("br.title")), title: t("br.title"), subtitle: t("br.subtitle"), owner: "hq",
        actions: [
          UI.Button({ label: t("br.add_branch"), icon: atB ? "lock" : "plus", variant: atB ? "secondary" : "primary", disabled: atB, onClick: function () { addBranchDialog(tn); } }),
          UI.Button({ label: t("br.add_register"), icon: atR ? "lock" : "plus", disabled: atR || !tn.branches.length, onClick: function () { addRegisterDialog(tn); } })] },
      before: h("div", { class: "stack" }, meters(tn), limitBlock(tn, "branches") || limitBlock(tn, "registers"),
        UI.Section({ title: t("br.branches"), flush: true, body: UI.Table({ caption: t("br.branches"), rows: tn.branches, columns: [
          { key: "name", label: t("col.branch"), owner: "hq", render: function (b) { return I18n.pick(b, "name"); } },
          { key: "city", label: t("col.city"), owner: "hq", render: function (b) { return I18n.pick(b, "city") || "—"; } },
          { key: "mode", label: t("col.sale_mode"), owner: "hq", render: function (b) { return s.sale_mode ? t("sale_mode." + s.sale_mode) : "—"; } },
          { key: "status", label: t("col.status"), render: function (b) { return UI.StatusBadge(b.status); } },
          { key: "regs", label: t("col.registers"), align: "end", render: function (b) { return I18n.number(b.registers.length); } }
        ] }) }),
        h("h2", { class: "section-title" }, t("br.registers"))),
      rows: function () { return Store.registers(tn); },
      defaultSort: { key: "branch", dir: "asc" },
      filters: [],
      columns: [
        { key: "label", label: t("col.register"), owner: "hq", sortable: true },
        { key: "branch", label: t("col.branch"), sortable: true, render: function (r) { return I18n.pick(r.branch, "name"); }, sortValue: function (r) { return I18n.pick(r.branch, "name") + r.n; } },
        { key: "series", label: t("col.series"), owner: "quantara", render: function (r) { return h("span", { class: "tag-stack" }, h("code", { dir: "ltr" }, Store.series(tn, r)), UI.StateTag("set_by_quantara")); } },
        { key: "status", label: t("col.status"), render: function (r) { return UI.StatusBadge(r.status); } },
        { key: "sync", label: t("col.sync"), render: function (r) { return regSync(tn, r); } }
      ],
      after: h("p", { class: "muted footnote" }, t("br.series_note")),
      empty: { title: t("home.empty_title"), body: "" }
    });
  }

  /* ---------- HQ — People & roles (list) ---------- */
  function HqPeople(tn) {
    return P().ListPage({
      stateKey: "hq-people:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("people.title")), title: t("people.title"), subtitle: t("people.subtitle"), owner: "hq" },
      before: tn.id === "electro-cafe" ? UI.Banner({ tone: "warning", body: t("people.names_placeholder") }) : null,
      rows: function () { return Store.people(tn); },
      defaultSort: { key: "role", dir: "asc" },
      filters: [
        { id: "role", type: "select", label: t("filter.role"), options: function () { return Store.roles().map(function (r) { return { value: r, label: t("role." + r) }; }); },
          match: function (p, v) { return !v || p.role === v; } },
        { id: "branch", type: "select", label: t("col.branch"), options: function () { return tn.branches.map(function (b) { return { value: b.id, label: I18n.pick(b, "name") }; }); },
          match: function (p, v) { return !v || p.branch_ids.indexOf(v) > -1; } }
      ],
      columns: [
        { key: "name", label: t("col.person"), owner: "hq", sortable: true, render: function (p) { return I18n.pick(p, "name"); }, sortValue: function (p) { return I18n.pick(p, "name"); } },
        { key: "role", label: t("col.role"), owner: "hq", sortable: true, render: function (p) { return t("role." + p.role); }, sortValue: function (p) { return Store.roles().indexOf(p.role); } },
        { key: "where", label: t("col.works_at"), owner: "hq", render: function (p) {
          return p.branch_ids.length ? p.branch_ids.map(function (id) { return I18n.pick(Store.branch(tn, id), "name"); }).join(" · ") : t("people.all_branches"); } }
      ],
      empty: { title: t("people.empty"), body: "" }
    });
  }

  /* ---------- Reports (list) — HQ and branch share it ---------- */
  function reportsPage(tn, b) {
    var rows = Store.reports().filter(function (r) { return !b || r.branch; });
    return P().ListPage({
      stateKey: "rpt:" + tn.id + ":" + (b ? b.id : "hq"),
      header: { breadcrumbs: b ? brCrumbs(tn, b, t("brnav.reports")) : hqCrumbs(tn, t("reports.title")),
        title: b ? t("brnav.reports") : t("reports.title"), subtitle: b ? t("reports.branch_subtitle") : t("reports.subtitle"), owner: b ? "branch" : "hq" },
      rows: function () { return rows; },
      filters: [],
      columns: [
        { key: "id", label: t("col.report"), render: function (r) { return h("span", { class: "cell-name__text" }, h("span", { class: "cell-name__primary" }, t("rpt." + r.id)), h("span", { class: "cell-name__other", dir: "ltr" }, r.id)); } },
        { key: "who", label: t("col.who_sees"), owner: "hq", render: function (r) { return r.branch ? t("reports.who_all") : t("reports.who_hq"); } },
        { key: "offline", label: t("col.offline"), render: function (r) { return r.branch ? t("common.yes") : t("common.no"); } }
      ],
      after: h("p", { class: "muted footnote" }, t("notbuilt.body")),
      empty: { title: t("notbuilt.title"), body: "" }
    });
  }
  function HqReports(tn) { return reportsPage(tn, null); }

  /* =====================================================================
   * Settings — §5 of the specs. One definition, two viewers:
   *   "hq"        → head office edits its own rows; Quantara guarantees are read-only
   *   "quantara"  → everything read-only (business settings are the tenant's)
   * ===================================================================== */
  function settingsGroups(tn) {
    var pend = tn.pending || {}, opts = function (list) { return function () { return list; }; };
    var row = function (key, type, extra) {
      return Object.assign({ key: key, type: type, owner: "hq", label: t("set." + key), help: t("set." + key + "_help"), pending: pend[key] }, extra || {});
    };
    return [
      { title: t("set.g.general"), rows: [
        row("languages", "select", { options: opts([{ value: "ar_en", label: t("lang.ar_en") }]) }),
        row("currencies", "text", { readonly: true, note: t("set.fixed_after_sale"), value: tn.currency + (tn.secondary_currency ? " / " + tn.secondary_currency : "") }),
        row("rate_source", "text", { readonly: true, note: t("set.edit_in_rate"), noteHref: hq(tn, "/exchange-rate"), value: t("set.rate_source_value") })
      ] },
      { title: t("set.g.sales"), rows: [
        row("sale_mode", "select", { options: opts([{ value: "prepaid", label: t("sale_mode.prepaid") }, { value: "postpaid", label: t("sale_mode.postpaid") }]) }),
        row("payment_methods", "text", { readonly: true, note: t("set.next_sprint"), value: ((tn.settings || {}).payment_methods || []).map(function (m) { return t("pm." + m); }).join(" · ") }),
        row("mixed_payment", "select", { options: opts([{ value: "on", label: t("settings.on") }, { value: "off", label: t("settings.off") }]) }),
        row("rounding_rule", "text")
      ] },
      { title: t("set.g.pricing"), rows: [
        row("tax_rate", "number"),
        row("manual_discount_role", "select", { options: opts(["branch_manager", "owner", "hq_admin"].map(function (r) { return { value: r, label: t("role." + r) }; })) }),
        row("manual_discount_cap", "number"),
        row("customer_class_discount", "number")
      ] },
      { title: t("set.g.cash"), rows: [
        row("opening_float_syp", "number"), row("opening_float_usd", "number"), row("variance_limit", "number"),
        row("cash_withdrawal", "select", { options: opts([{ value: "forbidden", label: t("cash.forbidden") }, { value: "allowed", label: t("cash.allowed") }]) })
      ] },
      { title: t("set.g.stock"), rows: [ row("stock_deduction", "text"), row("waste_reasons", "text") ] },
      { title: t("set.g.users"), rows: [
        row("permission_matrix", "text", { readonly: true, note: t("set.next_sprint"), value: t("set.permission_matrix_value") }),
        row("staff_meal_limit", "number")
      ] },
      { title: t("set.g.invoice"), rows: [
        row("tax_number", "text", { dir: "ltr" }), row("receipt_bilingual", "toggle"), row("local_retention_days", "number")
      ] },
      { title: t("set.g.guarantees"), owner: "quantara", rows: [
        row("numbering", "text", { owner: "quantara", readonly: true, value: t("set.numbering_value") }),
        row("e_invoicing", "text", { owner: "quantara", readonly: true, value: t("set.e_invoicing_value") }),
        row("audit_log", "text", { owner: "quantara", readonly: true, value: t("set.audit_log_value") }),
        row("hardware", "text", { owner: "quantara", readonly: true, value: t("set.hardware_value") })
      ] }
    ];
  }
  function SettingsFor(tn, viewer, o) {
    o = o || {};
    var groups = settingsGroups(tn);
    return P().SettingsPage({
      stateKey: "settings:" + viewer + ":" + tn.id,
      readOnly: viewer === "quantara",
      header: { breadcrumbs: o.breadcrumbs || hqCrumbs(tn, t("settings.title")), title: t("settings.title"),
        subtitle: viewer === "quantara" ? t("set.q_subtitle") : t("set.subtitle"), owner: "hq" },
      load: function () {
        var out = {};
        groups.forEach(function (g) { g.rows.forEach(function (r) { if (!r.readonly) out[r.key] = (tn.settings || {})[r.key] == null ? null : tn.settings[r.key]; }); });
        return out;
      },
      save: function (d, saved) {
        var patch = {};
        Object.keys(d).forEach(function (k) { if (d[k] !== saved[k]) patch[k] = d[k]; });
        Store.updateSettings(tn, patch, "hq", hqUser(tn));
      },
      groups: groups
    });
  }
  function HqSettings(tn) { return SettingsFor(tn, "hq"); }

  /* =====================================================================
   * HQ — Subscription & modules: Quantara decides availability, HQ decides on/where
   * ===================================================================== */
  function HqSubscription(tn) {
    var plan = Store.plan(tn.plan_id);
    var moduleTable = UI.Table({ caption: t("sub.modules"), rows: Store.modules(), columns: [
      { key: "name", label: t("col.module"), render: function (m) {
        return h("span", { class: "cell-name__text" }, h("span", { class: "cell-name__primary" }, t("module." + m.id)), h("span", { class: "cell-name__other", dir: "ltr" }, m.ref)); } },
      { key: "avail", label: t("col.in_plan"), owner: "quantara", render: function (m) {
        return Store.moduleAvailable(tn, m.id) ? UI.Badge(t("sub.in_plan"), "positive")
          : h("span", { class: "tag-stack" }, UI.StateTag("set_by_quantara", t("sub.not_in_plan"))); } }
    ].concat(tn.branches.map(function (b) {
      return { key: "b-" + b.id, label: I18n.pick(b, "name"), owner: "hq", render: function (m) {
        if (!Store.moduleAvailable(tn, m.id)) return h("span", { class: "muted", "aria-label": t("sub.not_in_plan") }, "—");
        var on = Store.moduleBranches(tn, m.id).indexOf(b.id) > -1, id = "mod-" + m.id + "-" + b.id;
        return h("span", { class: "toggle-cell" }, UI.Toggle({ id: id, checked: on, onChange: function (x) {
          Store.setModule(tn, m.id, b.id, x, hqUser(tn)); App.render();
          UI.toast(t(x ? "sub.module_on" : "sub.module_off", { module: t("module." + m.id), branch: I18n.pick(b, "name") })); } }),
          h("label", { for: id, class: "sr-only" }, t("module." + m.id) + " · " + I18n.pick(b, "name")));
      } };
    })) });
    return P().SettingsPage({
      stateKey: "hq-sub:" + tn.id,
      readOnly: true,
      header: { breadcrumbs: hqCrumbs(tn, t("sub.title")), title: t("sub.title"), subtitle: t("sub.subtitle"), owner: "quantara" },
      load: function () { return {}; }, save: function () {},
      before: h("div", { class: "stack" },
        UI.Section({ title: t("sub.plan"), actions: UI.OwnerTag("quantara"), body: [UI.DescList([
          { label: t("col.plan"), value: I18n.pick(plan, "name"), owner: "quantara" },
          { label: t("sub.status"), value: UI.StatusBadge(tn.status), owner: "quantara" }]), meters(tn),
          limitBlock(tn, "branches") || limitBlock(tn, "registers") ||
            UI.Button({ label: t("limit.request"), size: "sm", disabled: !!Store.pendingUpgrade(tn), onClick: reqUpgrade(tn, "plan") })] }),
        UI.Section({ title: t("sub.modules"), flush: true, body: moduleTable }),
        UI.Section({ title: t("sub.billing"), actions: UI.OwnerTag("quantara"), body: h("p", { class: "muted" }, t("sub.billing_body")) })),
      groups: []
    });
  }

  /* =====================================================================
   * HQ — Support access (record): approve / refuse, who is inside, end, audit log
   * ===================================================================== */
  function HqSupport(tn) {
    var session = Store.session(tn), me = hqUser(tn);
    function decide(r, approve) {
      var st = Store.staff(r.staff_id);
      if (!approve) { Store.decideSupport(tn, r.id, false, me); App.render(); UI.toast(t("sup.refused")); return; }
      UI.Dialog({ title: t("sup.approve_title", { name: I18n.pick(st, "name") }), body: h("p", null, t("sup.approve_body", { reason: I18n.pick(r, "reason") })),
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("sup.approve"), variant: "primary", onClick: function (close) {
          Store.decideSupport(tn, r.id, true, me); close(); App.render(); UI.toast(t("sup.approved", { name: I18n.pick(st, "name") })); } }] });
    }
    return P().RecordPage({
      stateKey: "hq-sup:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("sup.title")), title: t("sup.title"), subtitle: t("sup.subtitle"), owner: "hq" },
      tabs: [
        { id: "requests", label: t("sup.tab_requests"), count: Store.supportRequests(tn).length, render: function () {
          var rows = Store.supportRequests(tn);
          if (!rows.length) return UI.EmptyState({ icon: "eye", title: t("sup.no_requests") });
          return UI.Table({ caption: t("sup.tab_requests"), rows: rows, columns: [
            { key: "at", label: t("col.requested"), render: function (r) { return I18n.dateTime(r.requested_at, tn.time_zone); } },
            { key: "staff", label: t("col.staff"), owner: "quantara", render: function (r) { var s = Store.staff(r.staff_id); return I18n.pick(s, "name") + " · " + t("team." + s.team); } },
            { key: "reason", label: t("col.reason"), render: function (r) { return h("span", { class: "wrap" }, I18n.pick(r, "reason")); } },
            { key: "status", label: t("col.status"), owner: "hq", render: function (r) { return UI.StatusBadge(r.status); } },
            { key: "act", label: t("common.action"), render: function (r) {
              if (r.status === "pending") return h("span", { class: "btn-row" },
                UI.Button({ label: t("sup.approve"), variant: "primary", size: "sm", onClick: function () { decide(r, true); } }),
                UI.Button({ label: t("sup.refuse"), size: "sm", onClick: function () { decide(r, false); } }));
              if (r.status === "active") return UI.Button({ label: t("state.end_access"), variant: "danger-quiet", size: "sm", onClick: function () { App.endSupport(tn, me); } });
              return "—";
            } }
          ] });
        } },
        { id: "audit", label: t("sup.tab_audit"), count: Store.audit(tn).length, render: function () {
          return h("div", { class: "stack" }, h("p", { class: "muted" }, t("sup.audit_note")), UI.Table({ caption: t("sup.tab_audit"), rows: Store.audit(tn), columns: [
            { key: "at", label: t("col.when"), render: function (e) { return I18n.dateTime(e.at, tn.time_zone); } },
            { key: "actor", label: t("col.actor"), render: function (e) { return h("span", { class: "tag-stack" }, UI.OwnerTag(e.actor === "register" ? "branch" : e.actor), h("span", null, who(tn, e.by_id))); } },
            { key: "what", label: t("col.action"), render: function (e) { return h("span", { class: "wrap" }, I18n.pick(e, "text")); } }
          ] }));
        } }
      ],
      sideLabel: t("sup.inside_now"),
      side: UI.Section({ title: t("sup.inside_now"), actions: UI.OwnerTag("hq"), body: session ? [
        UI.DescList([
          { label: t("col.staff"), value: I18n.pick(Store.staff(session.staff_id), "name") },
          { label: t("col.opened"), value: I18n.dateTime(session.started_at, tn.time_zone) },
          { label: t("col.reason"), value: I18n.pick(session, "reason") }]),
        UI.Button({ label: t("state.end_access"), variant: "danger-quiet", icon: "x", onClick: function () { App.endSupport(tn, me); } })
      ] : h("p", { class: "muted" }, t("sup.nobody")) })
    });
  }

  /* =====================================================================
   * BRANCH — Today (record)
   * ===================================================================== */
  function BrToday(tn, route) {
    var b = route.branch, regs = Store.registers(tn, b.id), rate = Store.rate(tn);
    return P().RecordPage({
      stateKey: "br-today:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b), title: t("bt.title", { branch: I18n.pick(b, "name") }), subtitle: t("bt.subtitle"), owner: "branch" },
      tabs: [{ id: "feed", label: t("home.tab_feed"), render: function () {
        if (!regs.length) return UI.EmptyState({ icon: "register", title: t("home.empty_title") });
        return h("div", { class: "card-grid" }, regs.map(function (r) { return registerCard(tn, r); }));
      } }],
      sideLabel: t("home.sales"),
      side: h("div", { class: "stack" },
        UI.Section({ title: t("home.sales"), body: totalsList(tn, { branch: b.id }) }),
        UI.Section({ title: t("home.rate_today"), body: [
          h("p", { class: "stat" }, rate ? "1 USD = " + I18n.money(rate.usd, tn.currency) : t("home.no_rate")),
          UI.StateTag("set_by_hq")] }))
    });
  }

  /* ---------- BRANCH — Items: pause / resume (CAT-06) ---------- */
  function BrItems(tn, route) {
    var b = route.branch, me = brUser(tn, b);
    return P().ListPage({
      stateKey: "br-items:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("bi.title")), title: t("bi.title"), subtitle: t("bi.subtitle"), owner: "hq" },
      rows: function () { return Store.items(tn, b.id); },
      defaultSort: { key: "name", dir: "asc" },
      filters: [{ id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.search_ph"),
        match: function (it, q) { q = q.trim().toLowerCase(); return !q || (it.name_en + " " + it.name_ar).toLowerCase().indexOf(q) > -1; } }],
      columns: [
        { key: "name", label: t("col.item"), owner: "hq", sortable: true, render: itemName, sortValue: function (it) { return I18n.pick(it, "name"); } },
        { key: "price", label: t("col.price", { cur: tn.currency }), owner: "hq", render: function (it) {
          return h("span", { class: "tag-stack" }, I18n.number(it.price), UI.StateTag("set_by_hq")); } },
        { key: "changed", label: t("col.last_change"), render: function (it) { return UI.SyncTag({ changedBy: t("owner." + it.updated_by), at: it.updated_at, tz: tn.time_zone }); } },
        { key: "here", label: t("col.status_here"), owner: "branch", render: function (it) {
          var p = Store.pauseOf(tn, it.id, b.id);
          return p ? UI.StateTag("overridden", t("bi.paused") + " · " + I18n.time(p.at, tn.time_zone), t("state.hq_value", { v: t("bi.selling") })) : UI.Badge(t("bi.selling"), "positive");
        } },
        { key: "act", label: t("common.action"), render: function (it) {
          var paused = !!Store.pauseOf(tn, it.id, b.id);
          return UI.Button({ label: t(paused ? "bi.resume" : "bi.pause"), size: "sm", variant: paused ? "primary" : "secondary", onClick: function () {
            if (paused) Store.resume(tn, it.id, b.id, me); else Store.pause(tn, it.id, b.id, me);
            App.render(); UI.toast(t(paused ? "bi.resumed_toast" : "bi.paused_toast", { item: I18n.pick(it, "name") }));
          } });
        } }
      ],
      empty: { title: t("cat.empty_title"), body: "" }
    });
  }

  /* ---------- BRANCH — Branch discounts (PRC-10) + manual discount cap from HQ (PRC-08) ---------- */
  function newDiscountDialog(tn, b) {
    var items = Store.items(tn, b.id), d = { item: items[0] && items[0].id, percent: 10, hours: 4 }, err = h("p", { class: "form-row__error", hidden: true }, t("bd.error_percent"));
    UI.Dialog({ title: t("bd.new"), body: [
      UI.FormRow({ id: "nd-item", label: t("col.item"), control: UI.Select({ id: "nd-item", value: d.item, options: items.map(function (it) { return { value: it.id, label: I18n.pick(it, "name") }; }), onChange: function (v) { d.item = v; } }) }),
      UI.FormRow({ id: "nd-p", label: t("bd.percent"), control: UI.Input({ id: "nd-p", type: "number", min: 1, max: 90, value: d.percent, onInput: function (v) { d.percent = Number(v); } }) }),
      UI.FormRow({ id: "nd-h", label: t("bd.hours"), control: UI.Input({ id: "nd-h", type: "number", min: 1, max: 24, value: d.hours, onInput: function (v) { d.hours = Number(v); } }) }),
      err],
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("bd.new"), variant: "primary", onClick: function (close) {
        if (!(d.percent >= 1 && d.percent <= 90)) { err.hidden = false; return; }
        Store.addDiscount(tn, d.item, b.id, d.percent, new Date(Date.now() + (d.hours || 1) * 3600e3).toISOString(), brUser(tn, b));
        close(); App.render(); UI.toast(t("bd.added"));
      } }] });
  }
  function BrDiscounts(tn, route) {
    var b = route.branch, s = tn.settings || {}, pend = tn.pending || {};
    return P().ListPage({
      stateKey: "br-disc:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("bd.title")), title: t("bd.title"), subtitle: t("bd.subtitle"), owner: "branch",
        actions: UI.Button({ label: t("bd.new"), variant: "primary", icon: "plus", onClick: function () { newDiscountDialog(tn, b); } }) },
      before: UI.Section({ title: t("bd.cap_title"), actions: UI.StateTag("set_by_hq"), body: UI.DescList([
        { label: t("manual.who"), value: s.manual_discount_role ? t("role." + s.manual_discount_role) : "—", owner: "hq" },
        { label: t("manual.cap"), value: s.manual_discount_cap != null ? I18n.number(s.manual_discount_cap) + "%" : UI.Pending(pend.manual_discount_cap), owner: "hq" }]) }),
      rows: function () { return Store.overrides(tn, { branch: b.id, kind: "discount" }); },
      filters: [],
      columns: [
        { key: "item", label: t("col.item"), render: function (o) { return itemName(Store.item(tn, o.item_id)); } },
        { key: "hq", label: t("col.hq_price"), owner: "hq", align: "end", render: function (o) { return I18n.number(Store.item(tn, o.item_id).price); } },
        { key: "pct", label: t("col.discount"), owner: "branch", render: function (o) { return UI.StateTag("overridden", "−" + I18n.number(o.percent) + "%"); } },
        { key: "here", label: t("col.price_here"), owner: "branch", align: "end", render: function (o) { return I18n.number(Math.round(Store.item(tn, o.item_id).price * (100 - o.percent) / 100)); } },
        { key: "until", label: t("col.until"), render: function (o) { return I18n.time(o.ends_at, tn.time_zone); } },
        { key: "act", label: t("common.action"), render: function (o) {
          return UI.Button({ label: t("bd.end"), size: "sm", onClick: function () { Store.endDiscount(tn, o.id, brUser(tn, b)); App.render(); UI.toast(t("bd.ended")); } }); } }
      ],
      empty: { title: t("bd.empty"), body: t("bd.empty_body") }
    });
  }

  /* ---------- BRANCH — Cash & shifts ---------- */
  function BrCash(tn, route) {
    var b = route.branch, s = tn.settings || {}, pend = tn.pending || {};
    var val = function (k, suffix) { return s[k] != null ? I18n.number(s[k]) + (suffix || "") : UI.Pending(pend[k]); };
    return P().ListPage({
      stateKey: "br-cash:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("bc.title")), title: t("bc.title"), subtitle: t("bc.subtitle"), owner: "branch" },
      before: UI.Section({ title: t("bc.rules"), actions: UI.StateTag("set_by_hq"), body: UI.DescList([
        { label: t("set.opening_float_syp"), value: val("opening_float_syp"), owner: "hq" },
        { label: t("set.opening_float_usd"), value: val("opening_float_usd"), owner: "hq" },
        { label: t("set.variance_limit"), value: val("variance_limit"), owner: "hq" },
        { label: t("set.cash_withdrawal"), value: s.cash_withdrawal ? t("cash." + s.cash_withdrawal) : "—", owner: "hq" }]) }),
      rows: function () { return Store.registers(tn, b.id); },
      filters: [],
      columns: [
        { key: "label", label: t("col.register") },
        { key: "shift", label: t("col.shift"), owner: "branch", render: function (r) { return r.shift && r.shift.open ? UI.Badge(t("bc.open"), "positive") : UI.Badge(t("bc.closed"), "neutral"); } },
        { key: "cashier", label: t("col.cashier"), render: function (r) { return r.shift ? who(tn, r.shift.cashier_id) : "—"; } },
        { key: "opened", label: t("col.opened"), render: function (r) { return r.shift ? I18n.time(r.shift.opened_at, tn.time_zone) : "—"; } },
        { key: "sync", label: t("col.sync"), render: function (r) { return regSync(tn, r); } }
      ],
      empty: { title: t("home.empty_title"), body: "" }
    });
  }

  function BrReports(tn, route) { return reportsPage(tn, route.branch); }

  window.TenantPages = {
    HqHome: HqHome, HqCatalogue: HqCatalogue, HqPrices: HqPrices, HqRate: HqRate, HqInventory: HqInventory,
    HqBranches: HqBranches, HqPeople: HqPeople, HqReports: HqReports, HqSettings: HqSettings,
    HqSubscription: HqSubscription, HqSupport: HqSupport,
    BrToday: BrToday, BrItems: BrItems, BrDiscounts: BrDiscounts, BrCash: BrCash, BrReports: BrReports,
    SettingsFor: SettingsFor
  };
})();
