/*
 * Day 5 — the tenant's side of Quantara: head office (HQ) and branch screens.
 *
 * Every screen here is a configuration of the four Day 4 page kinds
 * (ListPage, RecordPage, SettingsPage, FlowPage) plus the boundary-state
 * components in ui.js (OwnerTag, OverrideTag, SyncNote, Meter, LimitBanner,
 * SupportInsideBar). Every value that someone owns is shown with its owner,
 * following the decided boundary (README, "Who owns what").
 *
 * `here` is the layer of the screen: "hq" or "branch".
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = Pages;

  /* ---------------- helpers ---------------- */
  function money(tn, n) { return h("span", { class: "money" }, I18n.money(n, tn.currency)); }
  function hqCrumbs(tn, label) {
    var c = [{ label: t("layer.hq") + " · " + I18n.pick(tn, "name"), href: "#/hq/" + tn.id }];
    if (label) c.push({ label: label });
    return c;
  }
  function brCrumbs(tn, b, label) {
    var c = [{ label: I18n.pick(b, "name"), href: "#/hq/" + tn.id + "/b/" + b.id }];
    if (label) c.push({ label: label });
    return c;
  }
  /** "HQ · [HQ manager]" / "Quantara · Rana K." — the name of whoever did something, with their layer. */
  function who(tn, id) {
    var a = Store.actor(tn, id);
    return t("layer." + a.layer) + (a.person ? " · " + I18n.pick(a.person, "name") : "");
  }
  /** SyncNote for a value, but only when someone OTHER than the person looking changed it today. */
  function changedNote(tn, by, at, meId) {
    if (!at || by === meId || at.slice(0, 10) !== Store.today()) return null;
    return UI.SyncNote({ kind: "changed", who: who(tn, by), time: I18n.time(at, tn.time_zone) });
  }
  function stamp(tn, iso, by) {
    if (!iso) return "—";
    return h("span", { class: "cell-stamp" }, h("span", null, I18n.dateTime(iso, tn.time_zone)), by ? h("small", null, who(tn, by)) : null);
  }
  function stateBadge(s) {
    return UI.Badge(t("state." + s), { live: "positive", scheduled: "info", ended: "neutral", pending: "info", approved: "critical",
      refused: "neutral", open: "positive", closed: "neutral" }[s] || "neutral");
  }
  /** Banners every tenant-side page starts with: placeholders, suspension. */
  function commonBanners(tn) {
    var out = [];
    if (tn.placeholder_fields) out.push(UI.Banner({ tone: "warning", body: t("placeholder.hq") }));
    if (tn.status === "suspended") out.push(UI.Banner({ tone: "critical", title: t("hq.suspended_title"),
      body: t("hq.suspended_body", { reason: I18n.pick(tn, "suspension_reason") || "—" }) }));
    return out;
  }
  function hqMeId(tn) { var m = Store.hqMe(tn); return m ? m.id : null; }
  function brMeId(tn, b) { var m = Store.branchMe(tn, b); return m ? m.id : null; }
  function currentUsage(tn) { return Store.usage(tn); }

  /* ---------------- live feed (shared by HQ Home and Branch Today) ---------------- */
  function FeedEvent(tn, e) {
    var text, amount = null;
    if (e.kind === "order") { text = t("feed.order", { no: e.no }); amount = h("span", { class: "feed__amount" }, I18n.money(e.amount, tn.currency)); }
    else if (e.kind === "refund") { text = t("feed.refund", { no: e.no, who: who(tn, e.by) }); amount = h("span", { class: "feed__amount feed__amount--neg" }, "−" + I18n.money(e.amount, tn.currency)); }
    else if (e.kind === "item_paused") { var it = Store.item(tn, e.item_id); text = t("feed.paused", { item: it ? I18n.pick(it, "name") : "—", who: who(tn, e.by) }); }
    else if (e.kind === "offline") text = t("feed.offline");
    else text = t("feed." + e.kind, { who: who(tn, e.by) });
    return h("li", { class: "feed__item" }, h("time", { class: "feed__time", datetime: e.at }, I18n.time(e.at, tn.time_zone)), h("span", null, text), amount);
  }
  function RegisterFeed(tn, r, here) {
    var events = Store.feed(tn, r.id), shift = Store.openShift(tn, r.id);
    var synced = !r.last_seen_at ? h("span", { class: "sync-note" }, t("sync.never"))
      : r.status === "online" ? UI.SyncNote({ kind: "synced", time: I18n.time(r.last_seen_at, tn.time_zone) })
      : UI.SyncNote({ kind: "stale", time: I18n.dateTime(r.last_seen_at, tn.time_zone) });
    return UI.Section({
      title: h("span", { class: "feed-head" }, h("span", { dir: "ltr" }, r.label), here === "hq" ? h("span", { class: "muted" }, "· " + I18n.pick(r.branch, "name")) : null),
      actions: UI.StatusBadge(r.status),
      body: [
        h("div", { class: "feed-head" }, synced,
          h("span", { class: "owned" }, h("code", { dir: "ltr" }, Store.invoiceSeries(tn, r.branch, r)), UI.OwnerTag({ owner: "guaranteed", here: here, label: t("owner.series") }))),
        shift ? h("p", { class: "muted" }, t("feed.shift_now", { who: who(tn, shift.cashier_id), since: I18n.time(shift.opened_at, tn.time_zone) })) : null,
        r.status === "offline" && r.last_seen_at ? UI.Banner({ tone: "warning", body: t("feed.offline_note") }) : null,
        events.length ? h("ol", { class: "feed", "aria-label": t("feed.label", { reg: r.label }) }, events.slice(0, 8).map(function (e) { return FeedEvent(tn, e); }))
          : h("p", { class: "muted" }, t("feed.empty"))
      ] });
  }
  function Tiles(tn, f) {
    var tile = function (label, value) { return h("div", { class: "tile" }, h("span", { class: "tile__label" }, label), h("span", { class: "tile__value" }, value)); };
    return h("div", { class: "tiles" },
      tile(t("today.sales"), I18n.money(f.sales, tn.currency)),
      tile(t("today.orders"), I18n.number(f.orders)),
      tile(t("today.average"), I18n.money(f.average, tn.currency)),
      tile(t("today.refunds"), I18n.number(f.refunds)));
  }

  /* =====================================================================
   * HQ · Home — today's sales and a live feed per register  (Record)
   * ===================================================================== */
  function Home(tn) {
    var f = Store.todayFigures(tn), u = currentUsage(tn), pending = Store.supportPending(tn);
    var banners = commonBanners(tn);
    if (pending.length) banners.push(UI.Banner({ tone: "info", title: t("hq.access_pending_title"), body: t("hq.access_pending_body", { name: I18n.pick(Store.staff(pending[0].staff_id), "name") }),
      actions: UI.Button({ label: t("hq.review"), size: "sm", variant: "primary", href: "#/hq/" + tn.id + "/support-access" }) }));
    if (u.branches >= u.max_branches || u.registers >= u.max_registers)
      banners.push(UI.LimitBanner({ what: t(u.branches >= u.max_branches ? "limit.what_branches" : "limit.what_registers"), plan: I18n.pick(u.plan, "name"), pending: Store.upgradeRequest(tn),
        onRequest: function () { location.hash = "/hq/" + tn.id + "/branches"; } }));

    return P.RecordPage({
      stateKey: "hq-home:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_home")), title: t("hq.home.title"),
        subtitle: t("hq.home.subtitle", { date: I18n.date(Store.clock(), tn.time_zone) }) },
      banners: banners,
      tabs: [
        { id: "today", label: t("hq.home.tab_today"), render: function () {
          return h("div", { class: "stack" },
            h("p", { class: "muted" }, t("hq.home.derived")),
            Tiles(tn, f),
            UI.Table({ caption: t("hq.home.by_branch"), rows: tn.branches, sort: {}, onSort: function () {},
              rowHref: function (b) { return "#/hq/" + tn.id + "/b/" + b.id; },
              columns: [
                { key: "name", label: t("col.branch"), render: function (b) { return I18n.pick(b, "name"); } },
                { key: "status", label: t("col.status"), render: function (b) { return UI.StatusBadge(b.status); } },
                { key: "online", label: t("hq.home.online"), align: "end", render: function (b) {
                  return t("meter.of", { n: I18n.number(b.registers.filter(function (r) { return r.status === "online"; }).length), max: I18n.number(b.registers.length) }); } },
                { key: "sales", label: t("today.sales"), align: "end", render: function (b) { return I18n.money(Store.todayFigures(tn, b.id).sales, tn.currency); } },
                { key: "orders", label: t("today.orders"), align: "end", render: function (b) { return I18n.number(Store.todayFigures(tn, b.id).orders); } }
              ] }));
        } },
        { id: "feed", label: t("hq.home.tab_feed"), count: Store.registerCount(tn), render: function () {
          return h("div", { class: "stack" },
            UI.Banner({ tone: "info", body: t("hq.home.feed_note") }),
            h("div", { class: "feed-grid" }, Store.registers(tn).map(function (r) { return RegisterFeed(tn, r, "hq"); })));
        } }
      ],
      sideLabel: t("hq.home.side"),
      side: [
        UI.Section({ title: t("hq.plan"), actions: UI.OwnerTag({ owner: "quantara", here: "hq" }), body: [
          h("p", null, h("strong", null, I18n.pick(u.plan, "name"))),
          UI.Meter({ id: "hm-b", label: t("col.branches"), value: u.branches, max: u.max_branches }),
          UI.Meter({ id: "hm-r", label: t("col.registers"), value: u.registers, max: u.max_registers }),
          UI.Button({ label: t("hq.see_subscription"), size: "sm", variant: "ghost", icon: "arrowNext", href: "#/hq/" + tn.id + "/subscription" })] }),
        UI.Section({ title: t("nav.hq_support"), body: Store.supportInside(tn)
          ? [UI.Badge(t("access.state.inside"), "critical"), h("p", { class: "muted" }, t("hq.access_inside_short"))]
          : pending.length ? [UI.Badge(t("access.state.pending"), "info")] : [h("p", { class: "muted" }, t("hq.access_none"))] })
      ]
    });
  }

  /* =====================================================================
   * HQ · Catalogue (List)
   * ===================================================================== */
  function Catalogue(tn) {
    var hq = Store.hq(tn), me = hqMeId(tn);
    function pausedAt(it) { return tn.branches.filter(function (b) { return Store.isPaused(tn, b.id, it.id); }); }
    return P.ListPage({
      stateKey: "hq-catalogue:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_catalogue")), title: t("nav.hq_catalogue"), subtitle: t("hq.catalogue.subtitle"),
        badges: UI.OwnerTag({ owner: "hq", here: "hq" }) },
      before: commonBanners(tn).concat([UI.Banner({ tone: "info", body: t("hq.catalogue.note") })]),
      rows: function () { return hq.items; },
      defaultSort: { key: "category", dir: "asc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.item_ph"),
          match: function (it, q) { q = q.trim().toLowerCase(); return !q || (it.name_en + " " + it.name_ar).toLowerCase().indexOf(q) > -1; } },
        { id: "cat", type: "select", label: t("col.category"),
          options: function () { return hq.categories.map(function (c) { return { value: c.id, label: I18n.pick(c, "name") }; }); },
          match: function (it, v) { return !v || it.category_id === v; } },
        { id: "paused", type: "checkbox", label: t("filter.paused_somewhere"), initial: false,
          match: function (it, v) { return !v || pausedAt(it).length > 0; } }
      ],
      columns: [
        { key: "name", label: t("col.item"), sortable: true, sortValue: function (it) { return I18n.pick(it, "name"); },
          render: function (it) { return h("span", null, I18n.pick(it, "name"), h("span", { class: "cell-sub" }, I18n.pickOther(it, "name"))); } },
        { key: "category", label: t("col.category"), sortable: true, sortValue: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name") + I18n.pick(it, "name"); },
          render: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name"); } },
        { key: "price", label: t("col.price"), sortable: true, align: "end", sortValue: function (it) { return it.price; },
          render: function (it) { return h("span", { class: "owned" }, money(tn, it.price), changedNote(tn, it.updated_by, it.updated_at, me)); } },
        { key: "where", label: t("col.where_selling"), render: function (it) {
          var p = pausedAt(it);
          if (!p.length) return h("span", { class: "muted" }, t("hq.catalogue.all_branches"));
          return UI.OverrideTag({ label: t("hq.catalogue.paused_at", { branches: p.map(function (b) { return I18n.pick(b, "name"); }).join(", ") }) });
        } },
        { key: "updated_at", label: t("col.last_changed"), sortable: true, render: function (it) { return stamp(tn, it.updated_at, it.updated_by); } }
      ],
      empty: { title: t("hq.catalogue.empty_title"), body: t("hq.catalogue.empty_body") }
    });
  }

  /* =====================================================================
   * HQ · Prices and offers (List) — HQ offers and branch discounts, side by side
   * ===================================================================== */
  function Prices(tn) {
    var hq = Store.hq(tn);
    function rows() {
      var offers = hq.offers.map(function (o) { return { id: o.id, owner: "hq", name: I18n.pick(o, "name"), kind: o.kind, value: o.value,
        where: o.branches === "all" ? t("hq.all_branches") : o.branches.map(function (id) { return I18n.pick(Store.branch(tn, id), "name"); }).join(", "),
        starts_at: o.starts_at, ends_at: o.ends_at, state: Store.today() < o.starts_at ? "scheduled" : Store.today() > o.ends_at ? "ended" : "live", by: o.updated_by }; });
      var disc = Store.overrides(tn, null, "discount").map(function (o) { var it = Store.item(tn, o.item_id);
        return { id: o.id, owner: "branch", name: t("hq.prices.item_discount", { item: it ? I18n.pick(it, "name") : "—" }), kind: "branch_discount", value: o.percent,
          where: I18n.pick(Store.branch(tn, o.branch_id), "name"), starts_at: o.starts_at, ends_at: o.ends_at, state: Store.discountState(o), by: o.by, item: it }; });
      return offers.concat(disc);
    }
    var cap = hq.rules.manual_discount_cap_percent;
    return P.ListPage({
      stateKey: "hq-prices:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_prices")), title: t("nav.hq_prices"), subtitle: t("hq.prices.subtitle") },
      before: commonBanners(tn).concat([
        UI.Section({ title: t("hq.prices.cap_title"), actions: UI.OwnerTag({ owner: "hq", here: "hq" }), body: [
          h("p", null, h("strong", null, t("pct", { n: I18n.number(cap) })), " — ", t("hq.prices.cap_body")),
          h("a", { href: "#/hq/" + tn.id + "/settings" }, t("hq.prices.cap_link"))] })
      ]),
      rows: rows,
      defaultSort: { key: "starts_at", dir: "desc" },
      filters: [
        { id: "owner", type: "select", label: t("filter.set_by"),
          options: function () { return [{ value: "hq", label: t("layer.hq") }, { value: "branch", label: t("layer.branch") }]; },
          match: function (r, v) { return !v || r.owner === v; } },
        { id: "state", type: "select", label: t("filter.status"),
          options: function () { return ["live", "scheduled", "ended"].map(function (s) { return { value: s, label: t("state." + s) }; }); },
          match: function (r, v) { return !v || r.state === v; } }
      ],
      columns: [
        { key: "name", label: t("col.offer"), sortable: true },
        { key: "kind", label: t("col.kind"), render: function (r) { return t("offer." + r.kind); } },
        { key: "value", label: t("col.value"), align: "end", render: function (r) {
          if (r.kind === "branch_discount" && r.item) return UI.OverrideTag({ label: t("pct_off", { n: I18n.number(r.value) }), hqValue: I18n.money(r.item.price, tn.currency), value: I18n.money(Math.round(r.item.price * (100 - r.value) / 100), tn.currency) });
          return r.kind === "bundle" ? money(tn, r.value) : t("pct_off", { n: I18n.number(r.value) }); } },
        { key: "where", label: t("col.where") },
        { key: "starts_at", label: t("col.when"), sortable: true, render: function (r) {
          var d = r.starts_at.length > 10 ? I18n.dateTime : I18n.date;
          return h("span", { class: "cell-stamp" }, h("span", null, d(r.starts_at, tn.time_zone)), h("small", null, "→ " + d(r.ends_at, tn.time_zone))); } },
        { key: "state", label: t("col.status"), render: function (r) { return stateBadge(r.state); } },
        { key: "owner", label: t("col.set_by"), render: function (r) { return h("span", { class: "owned" }, UI.OwnerTag({ owner: r.owner, here: "hq" }), h("span", { class: "cell-sub" }, who(tn, r.by))); } }
      ],
      empty: { title: t("hq.prices.empty_title"), body: t("hq.prices.empty_body") }
    });
  }

  /* =====================================================================
   * HQ · Exchange rate (Settings)
   * ===================================================================== */
  function ExchangeRate(tn) {
    var hq = Store.hq(tn), me = hqMeId(tn);
    if (!hq.exchange_rate) return P.NotBuilt(t("nav.hq_exchange"), t("hq.fx.none"));
    var fx = hq.exchange_rate, tag = UI.OwnerTag({ owner: "hq", here: "hq" });
    return P.SettingsPage({
      stateKey: "hq-fx:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_exchange")), title: t("nav.hq_exchange"), subtitle: t("hq.fx.subtitle", { base: fx.base, quote: fx.quote }) },
      before: commonBanners(tn).concat([UI.Banner({ tone: "info", body: t("hq.fx.sync_note") })]),
      load: function () { return { rate: fx.rate, round_to: fx.round_to }; },
      save: function (d) { fx.rate = d.rate; fx.round_to = d.round_to; fx.updated_by = me; fx.updated_at = Store.now(); },
      groups: [{ title: t("hq.fx.group"), rows: [
        { key: "rate", type: "number", min: 0, dir: "ltr", tag: tag, label: t("hq.fx.rate", { base: fx.base, quote: fx.quote }), help: t("hq.fx.rate_help", { base: fx.base, quote: fx.quote }),
          format: function (v) { return "1 " + fx.base + " = " + I18n.money(v, fx.quote); }, note: changedNote(tn, fx.updated_by, fx.updated_at, me) },
        { key: "round_to", type: "number", min: 0, dir: "ltr", tag: tag, label: t("hq.fx.round"), help: t("hq.fx.round_help"),
          format: function (v) { return I18n.money(v, fx.quote); } }
      ] }]
    });
  }

  /* HQ · Branches and registers, and HQ · People and roles: moved to pages-m1.js (Module 1, 3 Oct). */

  /* =====================================================================
   * HQ · Settings (Settings) — §5 of the specs, plus what Quantara guarantees
   * ===================================================================== */
  function Settings(tn) {
    var hq = Store.hq(tn), list = function (arr) { return function () { return arr.map(function (v) { return { value: v, label: v }; }); }; };
    var tag = UI.OwnerTag({ owner: "hq", here: "hq" }), q = UI.OwnerTag({ owner: "quantara", here: "hq" }), g = UI.OwnerTag({ owner: "guaranteed", here: "hq" });
    var first = tn.branches[0], firstReg = first && first.registers[0];
    return P.SettingsPage({
      stateKey: "hq-settings:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_settings")), title: t("nav.hq_settings"), subtitle: t("hq.settings.subtitle") },
      before: commonBanners(tn),
      load: function () {
        return { name_en: tn.name_en, name_ar: tn.name_ar, currency: tn.currency, time_zone: tn.time_zone,
          receipt_bilingual: tn.settings.receipt_bilingual, tax_number: tn.settings.tax_number, manager_pin_for_refunds: tn.settings.manager_pin_for_refunds,
          cap: hq.rules.manual_discount_cap_percent,
          plan: tn.plan_id, series: firstReg ? Store.invoiceSeries(tn, first, firstReg) : "—", audit: true, einvoice: "", hardware: "" };
      },
      save: function (d) {
        Store.updateTenant(tn.id, { name_en: d.name_en, name_ar: d.name_ar, currency: d.currency, time_zone: d.time_zone,
          settings: { receipt_bilingual: d.receipt_bilingual, tax_number: d.tax_number, manager_pin_for_refunds: d.manager_pin_for_refunds } });
        hq.rules.manual_discount_cap_percent = d.cap; hq.rules.updated_by = hqMeId(tn); hq.rules.updated_at = Store.now();
      },
      groups: [
        { title: t("settings.group.general"), rows: [
          { key: "name_en", type: "text", dir: "ltr", tag: tag, label: t("settings.name_en"), help: t("hq.settings.name_en_help") },
          { key: "name_ar", type: "text", dir: "rtl", tag: tag, label: t("settings.name_ar"), help: t("hq.settings.name_ar_help") },
          { key: "currency", type: "select", options: list(Store.currencies()), tag: tag, label: t("settings.currency"), help: t("settings.currency_help") },
          { key: "time_zone", type: "select", options: list(Store.timeZones()), tag: tag, label: t("settings.time_zone"), help: t("settings.time_zone_help") }
        ] },
        { title: t("settings.group.receipts"), rows: [
          { key: "receipt_bilingual", type: "toggle", tag: tag, label: t("settings.receipt_bilingual"), help: t("settings.receipt_bilingual_help") },
          { key: "tax_number", type: "text", dir: "ltr", tag: tag, label: t("settings.tax_number"), help: t("settings.tax_number_help") }
        ] },
        { title: t("hq.settings.group.branch_rules"), rows: [
          { key: "manager_pin_for_refunds", type: "toggle", tag: tag, label: t("settings.manager_pin"), help: t("settings.manager_pin_help") },
          { key: "cap", type: "number", min: 0, max: 100, dir: "ltr", tag: tag, label: t("hq.settings.cap"), help: t("hq.settings.cap_help"), format: function (v) { return t("pct", { n: I18n.number(v) }); } }
        ] },
        { title: t("hq.settings.group.quantara"), rows: [
          { key: "plan", locked: true, tag: q, label: t("col.plan"), help: t("hq.settings.plan_help"), format: function (v) { return I18n.pick(Store.plan(v), "name"); } },
          { key: "series", locked: true, tag: g, label: t("hq.settings.series"), help: t("hq.settings.series_help"), format: function (v) { return h("code", { dir: "ltr" }, v); },
            note: UI.Badge(t("hq.settings.series_pending"), "warning") },
          { key: "audit", locked: true, tag: g, label: t("hq.settings.audit"), help: t("hq.settings.audit_help"), format: function () { return t("hq.settings.always_on"); } },
          { key: "einvoice", locked: true, tag: g, label: t("hq.settings.einvoice"), help: t("hq.settings.einvoice_help"), format: function () { return t("hq.settings.by_country"); } },
          { key: "hardware", locked: true, tag: g, label: t("hq.settings.hardware"), help: t("hq.settings.hardware_help"), format: function () { return t("hq.settings.approved_list"); } }
        ] }
      ]
    });
  }

  /* =====================================================================
   * HQ · Subscription and modules (Settings kind) — Quantara decides available, HQ decides on + where
   * ===================================================================== */
  function Subscription(tn) {
    var u = currentUsage(tn), me = hqMeId(tn), pendingUp = Store.upgradeRequest(tn);
    function row(id) {
      var m = Store.moduleState(tn, id);
      return m;
    }
    var table = UI.Table({ caption: t("hq.sub.modules"), rows: Store.modules().map(row), sort: {}, onSort: function () {},
      columns: [
        { key: "id", label: t("col.module"), render: function (m) { return h("span", null, t("module." + m.id), h("span", { class: "cell-sub" }, t("module." + m.id + ".hint"))); } },
        { key: "available", label: t("col.available"), render: function (m) {
          return h("span", { class: "owned" }, m.available ? UI.Badge(t("module.available"), "positive") : UI.Badge(t("module.unavailable"), "neutral"), UI.OwnerTag({ owner: "quantara", here: "hq" })); } },
        { key: "on", label: t("col.on"), render: function (m) {
          return h("span", { class: "owned" }, UI.Toggle({ id: "mod-" + m.id, label: t("module.toggle", { m: t("module." + m.id) }), checked: m.on, disabled: !m.available || tn.status === "suspended",
            onChange: function (v) { Store.setModule(tn, m.id, { on: v, branches: v && !m.branches.length ? tn.branches.map(function (b) { return b.id; }) : m.branches }, me); App.render(); UI.toast(t(v ? "module.turned_on" : "module.turned_off", { m: t("module." + m.id) })); } }),
            m.available ? UI.OwnerTag({ owner: "hq", here: "hq" }) : null); } },
        { key: "branches", label: t("col.at_branches"), render: function (m) {
          if (!m.available) return h("span", { class: "muted" }, t("module.ask_quantara"));
          return h("div", { class: "checks" }, tn.branches.map(function (b) {
            return UI.Checkbox({ id: "mod-" + m.id + "-" + b.id, label: I18n.pick(b, "name"), checked: m.on && m.branches.indexOf(b.id) > -1, disabled: !m.on,
              onChange: function (v) { var list = m.branches.filter(function (x) { return x !== b.id; }); if (v) list.push(b.id); Store.setModule(tn, m.id, { branches: list }, me); App.render(); } });
          })); } },
        { key: "updated_at", label: t("col.last_changed"), render: function (m) { return m.available ? stamp(tn, m.updated_at, m.updated_by) : "—"; } }
      ] });
    return [
      UI.PageHeader({ breadcrumbs: hqCrumbs(tn, t("nav.hq_subscription")), title: t("nav.hq_subscription"), subtitle: t("hq.sub.subtitle") }),
      h("div", { class: "stack" },
        commonBanners(tn),
        UI.Section({ title: t("hq.plan"), actions: UI.OwnerTag({ owner: "quantara", here: "hq" }), body: [
          UI.DescList([
            { label: t("col.plan"), value: I18n.pick(u.plan, "name") },
            { label: t("col.status"), value: UI.StatusBadge(tn.status) },
            { label: t("hq.sub.billing"), value: h("span", { class: "muted" }, t("hq.sub.billing_value")) }
          ]),
          h("div", { class: "grid-2" },
            UI.Meter({ id: "hs-b", label: t("col.branches"), value: u.branches, max: u.max_branches }),
            UI.Meter({ id: "hs-r", label: t("col.registers"), value: u.registers, max: u.max_registers })),
          pendingUp ? UI.Banner({ tone: "info", body: t("limit.requested", { date: I18n.date(pendingUp.at) }) })
            : h("div", null, UI.Button({ label: t("hq.sub.ask_upgrade"), icon: "arrowNext", onClick: function () { Store.requestUpgrade(tn, "plan", me); App.render(); UI.toast(t("limit.sent")); } }))] }),
        UI.Section({ title: t("hq.sub.modules"), flush: true, body: [h("p", { class: "section__intro" }, t("hq.sub.modules_intro")), table] }))
    ];
  }

  /* =====================================================================
   * HQ · Support access (Record) — approve/refuse, who is inside, end, audit log
   * ===================================================================== */
  function SupportAccess(tn) {
    var me = hqMeId(tn), reqs = Store.supportRequests(tn), pending = reqs.filter(function (r) { return r.status === "pending"; }), inside = Store.supportInside(tn);
    function decide(r, approve) {
      var staff = Store.staff(r.staff_id);
      UI.Dialog({ title: t(approve ? "access.approve_title" : "access.refuse_title", { name: I18n.pick(staff, "name") }),
        body: [h("p", null, t(approve ? "access.approve_body" : "access.refuse_body", { hours: I18n.number(r.hours), scope: t("access.scope." + r.scope) }))],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t(approve ? "access.approve" : "access.refuse"), variant: approve ? "primary" : "danger",
          onClick: function (close) { Store.decideSupport(tn, r.id, approve, me); close(); App.render(); UI.toast(t(approve ? "access.approved" : "access.refused")); } }] });
    }
    function RequestCard(r) {
      var staff = Store.staff(r.staff_id);
      return h("div", { class: "request" },
        h("div", { class: "feed-head" }, stateBadge(r.status), h("strong", null, I18n.pick(staff, "name") + " · " + t("team." + staff.team)), UI.OwnerTag({ owner: "quantara", here: "hq", label: t("access.requested_by_q") })),
        UI.DescList([
          { label: t("access.reason"), value: I18n.pick(r, "reason") },
          { label: t("access.scope"), value: t("access.scope." + r.scope) },
          { label: t("access.length"), value: t("access.hours", { n: I18n.number(r.hours) }) },
          { label: t("access.asked_at"), value: I18n.dateTime(r.requested_at, tn.time_zone) }
        ]),
        h("div", { class: "request__actions" },
          UI.Button({ label: t("access.approve"), variant: "primary", icon: "check", onClick: function () { decide(r, true); }, disabled: !!inside }),
          UI.Button({ label: t("access.refuse"), variant: "danger-quiet", onClick: function () { decide(r, false); } }),
          inside ? h("span", { class: "muted" }, t("access.one_at_a_time")) : null));
    }
    return P.RecordPage({
      stateKey: "hq-access:" + tn.id,
      header: { breadcrumbs: hqCrumbs(tn, t("nav.hq_support")), title: t("nav.hq_support"), subtitle: t("access.subtitle") },
      banners: commonBanners(tn),
      tabs: [
        { id: "requests", label: t("access.tab_requests"), count: pending.length, render: function () {
          return h("div", { class: "stack" },
            UI.Section({ title: t("access.waiting"), body: pending.length ? pending.map(RequestCard) : h("p", { class: "muted" }, t("access.none_waiting")) }),
            UI.Section({ title: t("access.history"), flush: true, body: UI.Table({ caption: t("access.history"), rows: reqs.filter(function (r) { return r.status !== "pending"; }), sort: {}, onSort: function () {},
              columns: [
                { key: "who", label: t("col.person"), render: function (r) { return who(tn, r.staff_id); } },
                { key: "reason", label: t("access.reason"), render: function (r) { return h("span", { class: "wrap" }, I18n.pick(r, "reason")); } },
                { key: "status", label: t("col.status"), render: function (r) { return stateBadge(r.status === "approved" ? "approved" : r.status); } },
                { key: "decided", label: t("access.decided"), render: function (r) { return stamp(tn, r.decided_at, r.decided_by); } },
                { key: "ended", label: t("access.ended_col"), render: function (r) { return r.ended_at ? stamp(tn, r.ended_at, r.ended_by) : r.status === "approved" ? t("access.until", { time: I18n.time(r.expires_at, tn.time_zone) }) : "—"; } }
              ] }) }));
        } },
        { id: "audit", label: t("access.tab_audit"), count: Store.auditLog(tn).length, render: function () {
          var items = Store.auditLog(tn);
          return h("div", { class: "stack" },
            h("p", { class: "owned" }, UI.OwnerTag({ owner: "guaranteed", here: "hq", label: t("owner.audit") }), h("span", { class: "muted" }, t("access.audit_note"))),
            h("ol", { class: "timeline" }, items.map(function (e) {
              var text = e.kind === "action" ? I18n.pick(e, "text") : t("audit." + e.kind);
              return h("li", { class: "timeline__item" }, h("time", { datetime: e.at }, I18n.dateTime(e.at, tn.time_zone)), h("span", null, h("strong", null, who(tn, e.actor)), " — ", text));
            })));
        } }
      ],
      sideLabel: t("access.now"),
      side: [
        UI.Section({ title: t("access.now"), body: inside
          ? [UI.Badge(t("access.state.inside"), "critical"),
             UI.DescList([
               { label: t("col.person"), value: who(tn, inside.staff_id) },
               { label: t("access.scope"), value: t("access.scope." + inside.scope) },
               { label: t("access.since"), value: I18n.time(inside.started_at, tn.time_zone) },
               { label: t("access.until_label"), value: I18n.time(inside.expires_at, tn.time_zone) }]),
             UI.Button({ label: t("inside.end"), variant: "danger", onClick: function () { Store.endSupport(tn, inside.id, me); App.render(); UI.toast(t("inside.ended")); } })]
          : [UI.Badge(t("access.state.closed"), "neutral"), h("p", { class: "muted" }, t("access.closed_body"))] }),
        UI.Section({ title: t("access.rules"), body: UI.DescList([
          { label: t("access.rule_who"), value: t("role.owner") },
          { label: t("access.rule_see"), value: t("access.rule_see_v") },
          { label: t("access.rule_end"), value: t("access.rule_end_v") }]) })
      ]
    });
  }

  /* =====================================================================
   * BRANCH · Today (Record)
   * ===================================================================== */
  function BranchToday(tn, b) {
    var f = Store.todayFigures(tn, b.id), hq = Store.hq(tn), me = brMeId(tn, b);
    var regs = Store.registers(tn).filter(function (r) { return r.branch.id === b.id; });
    var paused = Store.overrides(tn, b.id, "pause"), live = Store.overrides(tn, b.id, "discount").filter(function (o) { return Store.discountState(o) !== "ended"; });
    var banners = commonBanners(tn);
    if (paused.length || live.length) banners.push(UI.Banner({ tone: "info", title: t("br.overrides_title"),
      body: t("br.overrides_body", { p: I18n.number(paused.length), d: I18n.number(live.length) }),
      actions: UI.Button({ label: t("nav.br_items"), size: "sm", href: "#/hq/" + tn.id + "/b/" + b.id + "/items" }) }));
    var fx = hq.exchange_rate, hqTag = UI.OwnerTag({ owner: "hq", here: "branch" });
    var mods = Store.modules().map(function (id) { return Store.moduleState(tn, id); }).filter(function (m) { return m.on && m.branches.indexOf(b.id) > -1; });
    return P.RecordPage({
      stateKey: "br-today:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("nav.br_today")), title: t("br.today.title"), subtitle: t("br.today.subtitle", { date: I18n.date(Store.clock(), tn.time_zone), branch: I18n.pick(b, "name") }) },
      banners: banners,
      tabs: [
        { id: "today", label: t("hq.home.tab_today"), render: function () {
          return h("div", { class: "stack" }, h("p", { class: "muted" }, t("hq.home.derived")), Tiles(tn, f),
            h("div", { class: "feed-grid" }, regs.map(function (r) { return RegisterFeed(tn, r, "branch"); })));
        } }
      ],
      sideLabel: t("br.today.side"),
      side: [
        UI.Section({ title: t("br.today.from_hq"), actions: hqTag, body: UI.DescList([
          { label: t("nav.hq_exchange"), value: fx ? h("span", { class: "owned" }, "1 " + fx.base + " = " + I18n.money(fx.rate, fx.quote), changedNote(tn, fx.updated_by, fx.updated_at, me)) : "—" },
          { label: t("hq.settings.cap"), value: t("pct", { n: I18n.number(hq.rules.manual_discount_cap_percent) }) },
          { label: t("br.today.modules"), value: mods.length ? mods.map(function (m) { return t("module." + m.id); }).join(" · ") : h("span", { class: "muted" }, t("br.today.no_modules")) },
          { label: t("settings.manager_pin"), value: tn.settings.manager_pin_for_refunds ? t("settings.on") : t("settings.off") }
        ]) })
      ]
    });
  }

  /* =====================================================================
   * BRANCH · Items: pause and resume (CAT-06) (List)
   * ===================================================================== */
  function BranchItems(tn, b) {
    var hq = Store.hq(tn), me = brMeId(tn, b);
    function liveDiscount(it) { return Store.overrides(tn, b.id, "discount").filter(function (o) { return o.item_id === it.id && Store.discountState(o) === "live"; })[0]; }
    return P.ListPage({
      stateKey: "br-items:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("nav.br_items")), title: t("nav.br_items"), subtitle: t("br.items.subtitle") },
      before: commonBanners(tn).concat([UI.Banner({ tone: "info", body: t("br.items.note") })]),
      rows: function () { return hq.items; },
      defaultSort: { key: "category", dir: "asc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.item_ph"),
          match: function (it, q) { q = q.trim().toLowerCase(); return !q || (it.name_en + " " + it.name_ar).toLowerCase().indexOf(q) > -1; } },
        { id: "state", type: "select", label: t("filter.status"),
          options: function () { return [{ value: "selling", label: t("br.items.selling") }, { value: "paused", label: t("br.items.paused") }]; },
          match: function (it, v) { var p = Store.isPaused(tn, b.id, it.id); return !v || (v === "paused" ? p : !p); } }
      ],
      columns: [
        { key: "name", label: t("col.item"), sortable: true, sortValue: function (it) { return I18n.pick(it, "name"); },
          render: function (it) { return h("span", null, I18n.pick(it, "name"), h("span", { class: "cell-sub" }, I18n.pickOther(it, "name"))); } },
        { key: "category", label: t("col.category"), sortable: true, sortValue: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name") + I18n.pick(it, "name"); },
          render: function (it) { return I18n.pick(Store.category(tn, it.category_id), "name"); } },
        { key: "price", label: t("col.price"), render: function (it) {
          var d = liveDiscount(it);
          return h("span", { class: "owned" },
            d ? UI.OverrideTag({ label: t("pct_off", { n: I18n.number(d.percent) }), hqValue: I18n.money(it.price, tn.currency), value: I18n.money(Math.round(it.price * (100 - d.percent) / 100), tn.currency) }) : money(tn, it.price),
            UI.OwnerTag({ owner: "hq", here: "branch" }), changedNote(tn, it.updated_by, it.updated_at, me)); } },
        { key: "state", label: t("col.status"), render: function (it) {
          var ov = Store.overrides(tn, b.id, "pause").filter(function (o) { return o.item_id === it.id; })[0];
          return ov ? h("span", { class: "owned" }, UI.OverrideTag({ label: t("br.items.paused_here") }), h("span", { class: "cell-sub" }, t("br.items.paused_by", { who: who(tn, ov.by), time: I18n.time(ov.at, tn.time_zone) })))
            : UI.Badge(t("br.items.selling"), "positive"); } },
        { key: "act", label: h("span", { class: "sr-only" }, t("col.actions")), render: function (it) {
          var p = Store.isPaused(tn, b.id, it.id), name = I18n.pick(it, "name");
          return h("div", { class: "row-actions" }, UI.Button({ size: "sm", icon: p ? "play" : "pause", label: t(p ? "br.items.resume" : "br.items.pause"), variant: p ? "primary" : "secondary",
            onClick: function () { if (p) Store.resumeItem(tn, b.id, it.id); else Store.pauseItem(tn, b.id, it.id, me); App.render(); UI.toast(t(p ? "br.items.resumed" : "br.items.paused_toast", { item: name })); } })); } }
      ],
      empty: { title: t("hq.catalogue.empty_title"), body: t("br.items.empty_body") }
    });
  }

  /* =====================================================================
   * BRANCH · Discounts: time-limited item discount (PRC-10) under HQ's manual cap (PRC-08) (List)
   * ===================================================================== */
  function BranchDiscounts(tn, b) {
    var hq = Store.hq(tn), me = brMeId(tn, b), cap = hq.rules.manual_discount_cap_percent;
    function add() {
      var d = { item_id: hq.items[0] && hq.items[0].id, percent: 10, starts_at: "", ends_at: "" }, errs = {};
      var body = h("div", { class: "stack" });
      function draw() {
        body.replaceChildren(
          h("p", null, t("br.disc.add_body")),
          UI.FormRow({ id: "nd-item", label: t("col.item"), control: UI.Select({ id: "nd-item", value: d.item_id, onChange: function (v) { d.item_id = v; },
            options: hq.items.map(function (it) { return { value: it.id, label: I18n.pick(it, "name") + " · " + I18n.money(it.price, tn.currency) }; }) }) }),
          UI.FormRow({ id: "nd-pct", label: t("br.disc.percent"), error: errs.percent, control: UI.Input({ id: "nd-pct", type: "number", min: 1, max: 100, value: d.percent, dir: "ltr", invalid: !!errs.percent, onInput: function (v) { d.percent = Number(v); } }) }),
          h("div", { class: "grid-2" },
            UI.FormRow({ id: "nd-from", label: t("br.disc.from"), error: errs.starts_at, control: UI.Input({ id: "nd-from", type: "datetime-local", value: d.starts_at, invalid: !!errs.starts_at, onInput: function (v) { d.starts_at = v; } }) }),
            UI.FormRow({ id: "nd-to", label: t("br.disc.to"), error: errs.ends_at, control: UI.Input({ id: "nd-to", type: "datetime-local", value: d.ends_at, invalid: !!errs.ends_at, onInput: function (v) { d.ends_at = v; } }) })));
      }
      draw();
      UI.Dialog({ title: t("br.disc.add"), body: body, actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("br.disc.add"), variant: "primary", onClick: function (close) {
        errs = {};
        if (!(d.percent >= 1 && d.percent <= 100)) errs.percent = t("br.disc.err_pct");
        if (!d.starts_at) errs.starts_at = t("flow.required");
        if (!d.ends_at) errs.ends_at = t("flow.required");
        else if (d.starts_at && d.ends_at <= d.starts_at) errs.ends_at = t("br.disc.err_order");
        if (Object.keys(errs).length) { draw(); var bad = body.querySelector("[aria-invalid=true]"); if (bad) bad.focus(); return; }
        Store.addDiscount(tn, { branch_id: b.id, item_id: d.item_id, percent: d.percent, starts_at: new Date(d.starts_at).toISOString(), ends_at: new Date(d.ends_at).toISOString(), by: me, at: Store.now() });
        close(); App.render(); UI.toast(t("br.disc.added")); } }] });
    }
    return P.ListPage({
      stateKey: "br-disc:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("nav.br_discounts")), title: t("nav.br_discounts"), subtitle: t("br.disc.subtitle"),
        actions: UI.Button({ label: t("br.disc.add"), icon: "plus", variant: "primary", onClick: add, disabled: tn.status === "suspended" }) },
      before: commonBanners(tn).concat([
        UI.Section({ title: t("br.disc.cap_title"), actions: UI.OwnerTag({ owner: "hq", here: "branch" }), body: [
          h("p", null, h("strong", null, t("pct", { n: I18n.number(cap) })), " — ", t("br.disc.cap_body"))] })
      ]),
      rows: function () { return Store.overrides(tn, b.id, "discount"); },
      defaultSort: { key: "starts_at", dir: "desc" },
      filters: [
        { id: "state", type: "select", label: t("filter.status"),
          options: function () { return ["live", "scheduled", "ended"].map(function (s) { return { value: s, label: t("state." + s) }; }); },
          match: function (o, v) { return !v || Store.discountState(o) === v; } }
      ],
      columns: [
        { key: "item", label: t("col.item"), render: function (o) { var it = Store.item(tn, o.item_id); return it ? I18n.pick(it, "name") : "—"; } },
        { key: "value", label: t("col.price"), render: function (o) { var it = Store.item(tn, o.item_id);
          return it ? UI.OverrideTag({ label: t("pct_off", { n: I18n.number(o.percent) }), hqValue: I18n.money(it.price, tn.currency), value: I18n.money(Math.round(it.price * (100 - o.percent) / 100), tn.currency) }) : "—"; } },
        { key: "starts_at", label: t("col.when"), sortable: true, render: function (o) {
          return h("span", { class: "cell-stamp" }, h("span", null, I18n.dateTime(o.starts_at, tn.time_zone)), h("small", null, "→ " + I18n.dateTime(o.ends_at, tn.time_zone))); } },
        { key: "state", label: t("col.status"), render: function (o) { return stateBadge(Store.discountState(o)); } },
        { key: "by", label: t("col.set_by"), render: function (o) { return h("span", { class: "owned" }, UI.OwnerTag({ owner: "branch", here: "branch" }), h("span", { class: "cell-sub" }, who(tn, o.by))); } },
        { key: "act", label: h("span", { class: "sr-only" }, t("col.actions")), render: function (o) {
          if (Store.discountState(o) === "ended") return null;
          return h("div", { class: "row-actions" }, UI.Button({ size: "sm", variant: "danger-quiet", label: t("br.disc.remove"),
            onClick: function () { Store.removeOverride(tn, o.id); App.render(); UI.toast(t("br.disc.removed")); } })); } }
      ],
      empty: { title: t("br.disc.empty_title"), body: t("br.disc.empty_body") }
    });
  }

  /* =====================================================================
   * BRANCH · Cash and shifts (List) — sessions only; counts next sprint
   * ===================================================================== */
  function BranchCash(tn, b) {
    var ids = b.registers.map(function (r) { return r.id; });
    return P.ListPage({
      stateKey: "br-cash:" + b.id,
      header: { breadcrumbs: brCrumbs(tn, b, t("nav.br_cash")), title: t("nav.br_cash"), subtitle: t("br.cash.subtitle") },
      before: commonBanners(tn).concat([UI.Banner({ tone: "info", body: t("br.cash.note") })]),
      rows: function () { return Store.hq(tn).shifts.filter(function (s) { return ids.indexOf(s.register_id) > -1; }); },
      defaultSort: { key: "opened_at", dir: "desc" },
      filters: [
        { id: "state", type: "select", label: t("filter.status"),
          options: function () { return ["open", "closed"].map(function (s) { return { value: s, label: t("state." + s) }; }); },
          match: function (s, v) { return !v || s.status === v; } }
      ],
      columns: [
        { key: "register", label: t("col.register"), render: function (s) { var r = b.registers.filter(function (x) { return x.id === s.register_id; })[0];
          return h("span", { class: "owned" }, h("span", { dir: "ltr" }, r.label), h("code", { dir: "ltr" }, Store.invoiceSeries(tn, b, r))); } },
        { key: "cashier", label: t("col.cashier"), render: function (s) { var u = Store.user(tn, s.cashier_id); return u ? I18n.pick(u, "name") : "—"; } },
        { key: "opened_at", label: t("col.opened"), sortable: true, render: function (s) { return I18n.dateTime(s.opened_at, tn.time_zone); } },
        { key: "closed_at", label: t("col.closed"), render: function (s) { return s.closed_at ? I18n.dateTime(s.closed_at, tn.time_zone) : "—"; } },
        { key: "status", label: t("col.status"), render: function (s) { return stateBadge(s.status); } }
      ],
      empty: { title: t("br.cash.empty_title"), body: t("br.cash.empty_body") }
    });
  }

  window.HQ = { Home: Home, Catalogue: Catalogue, Prices: Prices, ExchangeRate: ExchangeRate, 
    Settings: Settings, Subscription: Subscription, SupportAccess: SupportAccess,
    BranchToday: BranchToday, BranchItems: BranchItems, BranchDiscounts: BranchDiscounts, BranchCash: BranchCash };
})();
