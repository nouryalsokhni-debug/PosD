/*
 * Day 11 — the rest of Quantara's own panel: Billing, Support queue, Platform settings,
 * and inside one tenant: Subscription, People, Support tickets. Plus the shared screen
 * states (empty · loading · error · offline · no permission) as one component, with a
 * gallery at #/states. Data: QuantaraData.billing (data-billing.js). Model: R-05 / D-32.
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = Pages, D = window.QuantaraData, BL = D.billing;

  /* ---------------- helpers ---------------- */
  function usd(n) { return h("span", { class: "money" }, I18n.money(Math.round(n * 100) / 100, BL.currency)); }
  function usdText(n) { return I18n.money(Math.round(n * 100) / 100, BL.currency); }
  function sub(tn) { return BL.subscriptions[tn.id] || (BL.subscriptions[tn.id] = { plan_id: tn.plan_id, cycle: "monthly", status: tn.status === "trial" ? "trial" : "active", started_at: Store.today(), addons: [] }); }
  function addon(id) { return BL.addons.filter(function (a) { return a.id === id; })[0]; }
  function staffName(id) { var s = Store.staff(id); return s ? I18n.pick(s, "name") : t("q.unassigned"); }
  function actorName(tn, id) { var a = Store.actor(tn, id); return (a.person ? I18n.pick(a.person, "name") : "—") + " · " + t("layer." + a.layer); }
  function allCrumbs(label) { return [{ label: t("scope.all"), href: "#/tenants" }, { label: label }]; }
  function tnCrumbs(tn, label) { return [{ label: t("scope.all"), href: "#/tenants" }, { label: I18n.pick(tn, "name"), href: "#/t/" + tn.id }, { label: label }]; }
  function Decision(id) { return OPS._h.Decision(id); }
  function req(x) { return OPS._h.req(x); }
  function tenantCell(tn) { return h("span", null, I18n.pick(tn, "name"), tn.is_sample ? [" ", UI.SampleBadge()] : null); }
  function me() { return D.current_staff_id; }

  var SUB_TONE = { trial: "info", active: "positive", grace: "warning", read_only: "critical", suspended: "critical" };
  var INV_TONE = { paid: "positive", due: "info", overdue: "critical", void: "neutral" };
  var TK_TONE = { open: "info", waiting: "warning", solved: "positive" };
  var PR_TONE = { urgent: "critical", high: "warning", normal: "neutral", low: "neutral" };
  function subBadge(s) { return UI.Badge(t("q.sub." + s), SUB_TONE[s]); }
  function invBadge(s) { return UI.Badge(t("q.inv." + s), INV_TONE[s]); }

  /** Price of one month for a tenant (derived, never stored). Plans are per branch; extra registers and add-ons on top. */
  function quote(tn, s) {
    s = s || sub(tn);
    var pp = BL.plan_prices[s.plan_id], lines = [], branches = tn.branches.length;
    if (!pp || pp.per_branch == null) return { custom: true, lines: [], month: null, cycle: null };
    lines.push({ label: t("q.line.plan", { plan: I18n.pick(Store.plan(s.plan_id), "name"), n: I18n.number(branches) }), amount: pp.per_branch * branches });
    var includedRegs = pp.registers_included * branches, regs = Store.registerCount(tn), extra = Math.max(0, regs - includedRegs);
    s.addons.forEach(function (a) {
      var ad = addon(a.id); if (!ad) return;
      if (ad.unit === "register") extra += a.qty || 0;
      else if (ad.price) lines.push({ label: I18n.pick(ad, "name") + " × " + I18n.number(a.branches.length), amount: ad.price * a.branches.length });
    });
    if (extra) lines.push({ label: t("q.line.registers", { n: I18n.number(extra) }), amount: addon("extra_register").price * extra });
    var month = lines.reduce(function (x, l) { return x + l.amount; }, 0);
    var disc = s.discount_pct ? month * s.discount_pct / 100 : 0;
    if (disc) lines.push({ label: t("q.line.discount", { n: I18n.number(s.discount_pct) }), amount: -disc });
    month -= disc;
    var cycle = s.cycle === "yearly" ? month * (12 - BL.rules.yearly_free_months) : month;
    return { custom: false, lines: lines, month: month, cycle: cycle, includedRegs: includedRegs, regs: regs };
  }
  function mrr() { var tot = 0; Store.tenants().forEach(function (tn) { var s = sub(tn); if (["active", "grace", "read_only"].indexOf(s.status) < 0) return; var q = quote(tn, s); if (!q.custom) tot += s.cycle === "yearly" ? q.cycle / 12 : q.month; }); return tot; }

  /* =====================================================================
   * Shared screen states — one component, used everywhere.
   * kind: empty | loading | error | offline | forbidden
   * ===================================================================== */
  var STATE_ICON = { empty: "search", loading: "sync", error: "alert", offline: "pulse", forbidden: "lock" };
  function StateView(o) {
    var kind = o.kind || "empty";
    if (kind === "loading") return h("div", { class: "state state--loading", role: "status", "aria-live": "polite" },
      h("span", { class: "sr-only" }, t("q.state.loading")), [1, 2, 3, 4].map(function () { return h("span", { class: "skeleton" }); }));
    return h("div", { class: "state state--" + kind, role: kind === "error" ? "alert" : "status" },
      h("div", { class: "empty__icon" }, UI.icon(STATE_ICON[kind])),
      h("h2", { class: "empty__title" }, o.title || t("q.state." + kind)),
      h("p", { class: "empty__body" }, o.body || t("q.state." + kind + "_body")),
      o.action || (kind === "error" ? UI.Button({ label: t("q.state.retry"), icon: "sync", onClick: o.onRetry || function () { App.render(); } }) : null));
  }
  function StatesGallery() {
    return [UI.PageHeader({ breadcrumbs: allCrumbs(t("q.states.title")), title: t("q.states.title"), subtitle: t("q.states.subtitle"), badges: UI.Badge(t("q.prototype_only"), "sample") }),
      h("div", { class: "states-grid" }, ["empty", "loading", "error", "offline", "forbidden"].map(function (k) {
        return UI.Section({ title: t("q.state." + k), actions: h("code", null, "StateView({ kind: \"" + k + "\" })"), body: StateView({ kind: k }) });
      }))];
  }

  /* =====================================================================
   * QUANTARA · Billing (List) — every invoice, every tenant.
   * ===================================================================== */
  function Billing() {
    var label = t("nav.billing"), inv = BL.invoices;
    var overdue = inv.filter(function (i) { return i.status === "overdue"; }), due = inv.filter(function (i) { return i.status === "due"; });
    var grace = Store.tenants().filter(function (tn) { return ["grace", "read_only"].indexOf(sub(tn).status) > -1; });
    var sum = function (l) { return l.reduce(function (a, i) { return a + i.amount; }, 0); };
    return P.ListPage({
      stateKey: "q-billing",
      header: { breadcrumbs: allCrumbs(label), title: label, subtitle: t("q.bill.subtitle"), badges: [UI.OwnerTag({ owner: "quantara", here: "quantara" }), " ", Decision(BL.decision)] },
      before: [
        h("div", { class: "tiles" },
          tileOf(t("q.bill.mrr"), usdText(mrr())), tileOf(t("q.bill.overdue"), usdText(sum(overdue)), I18n.number(overdue.length) + " " + t("q.bill.invoices")),
          tileOf(t("q.bill.due"), usdText(sum(due)), I18n.number(due.length) + " " + t("q.bill.invoices")),
          tileOf(t("q.bill.trials"), I18n.number(Store.tenants().filter(function (tn) { return sub(tn).status === "trial"; }).length))),
        grace.length ? UI.Banner({ tone: "warning", title: t("q.bill.grace_title", { n: I18n.number(grace.length) }), body: grace.map(function (tn) { return I18n.pick(tn, "name") + " — " + t("q.sub." + sub(tn).status); }).join(" · ") + ". " + t("q.bill.till_note"),
          actions: grace.map(function (tn) { return UI.Button({ label: I18n.pick(tn, "name"), size: "sm", href: "#/t/" + tn.id + "/subscription" }); }) }) : null
      ].filter(Boolean),
      rows: function () { return BL.invoices; },
      defaultSort: { key: "due", dir: "desc" },
      filters: [
        { id: "st", type: "select", label: t("col.status"), options: function () { return ["due", "overdue", "paid", "void"].map(function (s) { return { value: s, label: t("q.inv." + s) }; }); }, match: function (i, v) { return !v || i.status === v; } },
        { id: "tn", type: "select", label: t("col.tenant"), options: function () { return Store.tenants().map(function (tn) { return { value: tn.id, label: I18n.pick(tn, "name") }; }); }, match: function (i, v) { return !v || i.tenant_id === v; } }
      ],
      columns: [
        { key: "id", label: t("q.col.invoice"), sortable: true, render: function (i) { return h("code", { dir: "ltr" }, i.id); } },
        { key: "tn", label: t("col.tenant"), render: function (i) { return tenantCell(Store.tenant(i.tenant_id)); } },
        { key: "period", label: t("q.col.period"), render: function (i) { return i.trial ? t("q.bill.trial") : i.period.split("/").map(function (d) { return I18n.date(d + "T12:00:00Z"); }).join(" → "); } },
        { key: "due", label: t("q.col.due"), sortable: true, sortValue: function (i) { return i.due_at; }, render: function (i) { return I18n.date(i.due_at + "T12:00:00Z"); } },
        { key: "amount", label: t("q.col.amount"), align: "end", sortable: true, sortValue: function (i) { return i.amount; }, render: function (i) { return usd(i.amount); } },
        { key: "status", label: t("col.status"), render: function (i) { return h("span", null, invBadge(i.status), i.reminders ? h("span", { class: "cell-sub" }, t("q.bill.reminders", { n: I18n.number(i.reminders) })) : null); } },
        { key: "paid", label: t("q.col.paid"), render: function (i) { return i.paid_at ? h("span", null, I18n.date(i.paid_at + "T12:00:00Z"), h("span", { class: "cell-sub" }, t("q.method." + i.method) + " · " + i.ref)) : "—"; } },
        { key: "act", label: "", render: function (i) { return ["due", "overdue"].indexOf(i.status) > -1 && i.amount > 0 ? h("span", { class: "row-actions" },
            UI.Button({ label: t("q.bill.record"), size: "sm", variant: "primary", onClick: function () { recordPayment(i); } }),
            UI.Button({ label: t("q.bill.remind"), size: "sm", variant: "ghost", onClick: function () { i.reminders = (i.reminders || 0) + 1; App.render(); UI.toast(t("q.bill.reminded")); } })) : null; } }
      ],
      empty: { title: t("q.bill.empty"), body: "" }
    });
  }
  function tileOf(label, value, sub2) { return h("div", { class: "tile" }, h("span", { class: "tile__label" }, label), h("span", { class: "tile__value" }, value), sub2 ? h("span", { class: "tile__sub" }, sub2) : null); }
  /** Record a payment received by wallet, bank transfer or cash. Paying ends grace/read-only. */
  function recordPayment(i) {
    var d = { method: "syriatel", ref: "" }, tn = Store.tenant(i.tenant_id);
    UI.Dialog({ title: t("q.bill.record") + " · " + i.id, body: h("div", { class: "stack" },
      UI.DescList([{ label: t("col.tenant"), value: I18n.pick(tn, "name") }, { label: t("q.col.amount"), value: usd(i.amount) }]),
      UI.FormRow({ id: "pm-m", label: t("q.col.method"), control: UI.Select({ id: "pm-m", value: d.method, options: BL.rules.methods.map(function (m) { return { value: m, label: t("q.method." + m) }; }), onChange: function (v) { d.method = v; } }) }),
      UI.FormRow({ id: "pm-r", label: t("q.col.reference"), required: true, help: t("q.bill.ref_help"), control: UI.Input({ id: "pm-r", dir: "ltr", onInput: function (v) { d.ref = v; } }) })),
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("q.bill.record"), variant: "primary", onClick: function (close) {
        if (!d.ref.trim()) { var el = document.getElementById("pm-r"); el.setAttribute("aria-invalid", "true"); el.focus(); return; }
        i.status = "paid"; i.paid_at = Store.today(); i.method = d.method; i.ref = d.ref.trim();
        var s = sub(tn); if (["grace", "read_only"].indexOf(s.status) > -1 && !BL.invoices.some(function (x) { return x.tenant_id === tn.id && x.status === "overdue"; })) { s.status = "active"; delete s.grace_ends; }
        Store.log(tn, me(), "action", { text_en: "Payment recorded for " + i.id, text_ar: "سُجّل دفع " + i.id });
        close(); App.render(); UI.toast(t("q.bill.recorded"));
      } }] });
  }

  /* =====================================================================
   * QUANTARA · one tenant · Subscription (Record).
   * ===================================================================== */
  function TenantSubscription(tn) {
    var s = sub(tn), q = quote(tn, s), u = Store.usage(tn), up = Store.upgradeRequest(tn), label = t("nav.subscription");
    var invs = BL.invoices.filter(function (i) { return i.tenant_id === tn.id; });
    function setStatus(st, extra) { s.status = st; Object.assign(s, extra || {}); if (st === "suspended") tn.status = "suspended"; else if (tn.status === "suspended") tn.status = "active";
      if (st === "trial") tn.status = "trial"; else if (tn.status === "trial") tn.status = "active";
      Store.log(tn, me(), "action", { text_en: "Subscription set to " + st, text_ar: "حالة الاشتراك: " + st }); App.render(); UI.toast(t("q.sub.changed", { s: t("q.sub." + st) })); }
    var banners = [];
    if (s.status === "trial") banners.push(UI.Banner({ tone: "info", title: t("q.sub.trial_title", { date: I18n.date(s.trial_ends + "T12:00:00Z") }), body: t("q.sub.trial_body") }));
    if (s.status === "grace") banners.push(UI.Banner({ tone: "warning", title: t("q.sub.grace_title", { date: I18n.date(s.grace_ends + "T12:00:00Z") }), body: t("q.sub.grace_body") }));
    if (s.status === "read_only") banners.push(UI.Banner({ tone: "critical", title: t("q.sub.ro_title"), body: t("q.sub.ro_body") }));
    if (s.status === "suspended") banners.push(UI.Banner({ tone: "critical", title: t("q.sub.susp_title"), body: t("q.sub.susp_body") }));
    if (up) banners.push(UI.Banner({ tone: "info", title: t("q.sub.upgrade_title"), body: t("q.sub.upgrade_body", { what: up.what, date: I18n.date(up.at) }),
      actions: UI.Button({ label: t("q.sub.change_plan"), size: "sm", variant: "primary", onClick: function () { planDialog(tn, s, up); } }) }));
    if (s.design_partner) banners.push(UI.Banner({ tone: "info", title: t("q.sub.partner"), body: I18n.pick(s, "note") }));

    var planTab = function () {
      return h("div", { class: "stack" },
        h("div", { class: "tiles" }, tileOf(t("col.plan"), I18n.pick(Store.plan(s.plan_id), "name")), tileOf(t("q.sub.cycle"), t("q.cycle." + s.cycle)),
          tileOf(t("q.sub.per_month"), q.custom ? t("q.sub.custom") : usdText(q.month)), tileOf(t("q.sub.per_cycle"), q.custom ? t("q.sub.custom") : usdText(q.cycle), s.cycle === "yearly" ? t("q.sub.yearly_note", { n: I18n.number(BL.rules.yearly_free_months) }) : null)),
        UI.Meter({ id: "qs-b", label: t("col.branches"), value: u.branches, max: u.max_branches }),
        UI.Meter({ id: "qs-r", label: t("col.registers"), value: u.registers, max: u.max_registers }),
        UI.Section({ title: t("q.sub.bill_lines"), flush: true, body: q.custom ? h("p", { class: "muted", style: "padding:16px" }, t("q.sub.custom_body")) :
          OPS._h.simpleTable(t("q.sub.bill_lines"), [
            { key: "l", label: t("q.col.line"), render: function (l) { return l.label; } },
            { key: "a", label: t("q.col.amount"), align: "end", render: function (l) { return usd(l.amount); } }
          ], q.lines.concat([{ label: h("strong", null, t("q.sub.per_month")), amount: q.month }])) }),
        h("p", { class: "muted" }, t("q.sub.included", { n: I18n.number(q.includedRegs || 0), used: I18n.number(q.regs || 0) }), " ", req("D-32 · R-05")));
    };
    var addonsTab = function () {
      return h("div", { class: "stack" }, h("p", { class: "muted" }, t("q.sub.addons_note")),
        OPS._h.simpleTable(t("q.sub.addons"), [
          { key: "n", label: t("q.col.addon"), render: function (a) { return h("span", null, I18n.pick(a, "name"), a.module ? h("span", { class: "cell-sub" }, t("q.sub.is_module")) : null); } },
          { key: "p", label: t("q.col.price"), align: "end", render: function (a) { return a.price ? h("span", null, usd(a.price), h("span", { class: "cell-sub" }, t("q.unit." + a.unit))) : t("q.free"); } },
          { key: "on", label: t("q.col.where_on"), render: function (a) { var x = s.addons.filter(function (y) { return y.id === a.id; })[0];
            if (a.unit === "register") return x && x.qty ? t("q.sub.n_registers", { n: I18n.number(x.qty) }) : h("span", { class: "muted" }, "—");
            return x && x.branches.length ? x.branches.map(function (id) { var b = Store.branch(tn, id); return b ? I18n.pick(b, "name") : id; }).join(", ") : h("span", { class: "muted" }, "—"); } },
          { key: "act", label: "", render: function (a) { return UI.Button({ label: t("q.sub.edit_addon"), size: "sm", variant: "ghost", onClick: function () { addonDialog(tn, s, a); } }); } }
        ], BL.addons));
    };
    var invTab = function () {
      return invs.length ? OPS._h.simpleTable(t("q.bill.invoices_title"), [
        { key: "id", label: t("q.col.invoice"), render: function (i) { return h("code", { dir: "ltr" }, i.id); } },
        { key: "due", label: t("q.col.due"), render: function (i) { return I18n.date(i.due_at + "T12:00:00Z"); } },
        { key: "a", label: t("q.col.amount"), align: "end", render: function (i) { return usd(i.amount); } },
        { key: "s", label: t("col.status"), render: function (i) { return invBadge(i.status); } },
        { key: "act", label: "", render: function (i) { return ["due", "overdue"].indexOf(i.status) > -1 && i.amount > 0 ? UI.Button({ label: t("q.bill.record"), size: "sm", variant: "primary", onClick: function () { recordPayment(i); } }) : null; } }
      ], invs) : StateView({ kind: "empty", title: t("q.bill.no_invoices"), body: t("q.bill.no_invoices_body") });
    };
    return P.RecordPage({
      stateKey: "q-sub:" + tn.id,
      header: { breadcrumbs: tnCrumbs(tn, label), title: label, subtitle: t("q.sub.subtitle"), badges: [subBadge(s.status), " ", UI.OwnerTag({ owner: "quantara", here: "quantara" })],
        actions: [UI.Button({ label: t("q.sub.change_plan"), icon: "swap", onClick: function () { planDialog(tn, s, null); } }),
          UI.Button({ label: t("q.sub.issue"), icon: "plus", variant: "primary", onClick: function () { issueInvoice(tn, s); } })] },
      banners: banners,
      tabs: [{ id: "plan", label: t("q.sub.tab_plan"), render: planTab }, { id: "addons", label: t("q.sub.addons"), count: s.addons.length, render: addonsTab }, { id: "invoices", label: t("q.bill.invoices_title"), count: invs.length, render: invTab }],
      sideLabel: t("q.sub.lifecycle"),
      side: [
        UI.Section({ title: t("q.sub.lifecycle"), body: [
          h("ol", { class: "lifecycle" }, ["trial", "active", "grace", "read_only", "suspended"].map(function (st) { return h("li", { class: st === s.status ? "is-current" : null }, subBadge(st), h("span", { class: "muted" }, t("q.sub.life." + st))); })),
          h("div", { class: "row-actions wrap" },
            s.status !== "active" ? UI.Button({ label: t("q.sub.set_active"), size: "sm", variant: "primary", onClick: function () { setStatus("active"); } }) : null,
            s.status === "trial" ? UI.Button({ label: t("q.sub.extend_trial"), size: "sm", onClick: function () { s.trial_ends = new Date(Date.parse(s.trial_ends) + 14 * 864e5).toISOString().slice(0, 10); App.render(); UI.toast(t("q.sub.extended")); } }) : null,
            s.status === "active" ? UI.Button({ label: t("q.sub.start_grace"), size: "sm", onClick: function () { setStatus("grace", { grace_ends: new Date(Date.parse(Store.today()) + BL.rules.grace_days * 864e5).toISOString().slice(0, 10) }); } }) : null,
            s.status === "grace" ? UI.Button({ label: t("q.sub.set_ro"), size: "sm", variant: "danger-quiet", onClick: function () { setStatus("read_only"); } }) : null,
            s.status !== "suspended" ? UI.Button({ label: t("record.suspend"), size: "sm", variant: "danger-quiet", onClick: function () { setStatus("suspended"); } }) : null)] }),
        UI.Section({ title: t("q.sub.till_title"), body: [h("p", { class: "muted" }, t("q.sub.till_body")), Decision(BL.decision)] })
      ]
    });
  }
  function planDialog(tn, s, up) {
    var d = { plan: s.plan_id, cycle: s.cycle };
    var body = h("div", { class: "stack" });
    function draw() {
      var preview = quote(tn, Object.assign({}, s, { plan_id: d.plan, cycle: d.cycle }));
      body.replaceChildren(
        up ? UI.Banner({ tone: "info", body: t("q.sub.upgrade_body", { what: up.what, date: I18n.date(up.at) }) }) : null,
        UI.FormRow({ id: "pl-p", label: t("col.plan"), control: UI.Select({ id: "pl-p", value: d.plan, options: Store.plans().map(function (p) { var pp = BL.plan_prices[p.id];
          return { value: p.id, label: I18n.pick(p, "name") + " · " + (pp.per_branch != null ? usdText(pp.per_branch) + " " + t("q.unit.branch") : t("q.sub.custom")) + " · " + t(p.max_branches === 1 ? "q.sub.limits_one" : "q.sub.limits", { b: I18n.number(p.max_branches), r: I18n.number(p.max_registers) }) }; }), onChange: function (v) { d.plan = v; draw(); } }) }),
        UI.FormRow({ id: "pl-c", label: t("q.sub.cycle"), control: UI.Select({ id: "pl-c", value: d.cycle, options: ["monthly", "yearly"].map(function (c) { return { value: c, label: t("q.cycle." + c) }; }), onChange: function (v) { d.cycle = v; draw(); } }) }),
        UI.DescList([{ label: t("q.sub.per_month"), value: preview.custom ? t("q.sub.custom") : usd(preview.month) }, { label: t("q.sub.per_cycle"), value: preview.custom ? t("q.sub.custom") : usd(preview.cycle) }]),
        h("p", { class: "muted" }, t("q.sub.no_lockin")));
    }
    draw();
    UI.Dialog({ title: t("q.sub.change_plan"), body: body, actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("settings.save"), variant: "primary", onClick: function (close) {
      s.plan_id = d.plan; s.cycle = d.cycle; tn.plan_id = d.plan;
      if (up) up.status = "approved";
      Store.log(tn, me(), "action", { text_en: "Plan changed to " + d.plan + " (" + d.cycle + ")", text_ar: "تغيّرت الخطة إلى " + d.plan });
      close(); App.render(); UI.toast(t("q.sub.plan_saved"));
    } }] });
  }
  function addonDialog(tn, s, a) {
    var x = s.addons.filter(function (y) { return y.id === a.id; })[0] || { id: a.id, branches: [], qty: 0 };
    var d = { branches: (x.branches || []).slice(), qty: x.qty || 0 };
    UI.Dialog({ title: I18n.pick(a, "name"), body: h("div", { class: "stack" },
      h("p", { class: "muted" }, a.price ? t("q.sub.addon_price", { p: usdText(a.price), u: t("q.unit." + a.unit) }) : t("q.free")),
      a.module ? h("p", { class: "muted" }, t("q.sub.module_note")) : null,
      a.unit === "register" ? UI.FormRow({ id: "ad-q", label: t("q.sub.extra_regs"), control: UI.Input({ id: "ad-q", type: "number", min: 0, dir: "ltr", value: d.qty, onInput: function (v) { d.qty = Math.max(0, Number(v) || 0); } }) })
        : h("div", { class: "checks" }, tn.branches.map(function (b) { return UI.Checkbox({ id: "ad-b-" + b.id, label: I18n.pick(b, "name"), checked: d.branches.indexOf(b.id) > -1, onChange: function (v) { d.branches = d.branches.filter(function (y) { return y !== b.id; }); if (v) d.branches.push(b.id); } }); }))),
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("settings.save"), variant: "primary", onClick: function (close) {
        s.addons = s.addons.filter(function (y) { return y.id !== a.id; });
        if ((a.unit === "register" && d.qty) || (a.unit !== "register" && d.branches.length)) s.addons.push(a.unit === "register" ? { id: a.id, qty: d.qty } : { id: a.id, branches: d.branches });
        if (a.module) { tn.modules_available = (tn.modules_available || []).filter(function (m) { return m !== a.module; }); if (d.branches.length) tn.modules_available.push(a.module); }
        close(); App.render(); UI.toast(t("q.sub.addon_saved"));
      } }] });
  }
  function issueInvoice(tn, s) {
    var q = quote(tn, s);
    if (q.custom) { UI.toast(t("q.sub.custom_body")); return; }
    var n = BL.invoices.length + 150, today = Store.today(), end = new Date(Date.parse(today) + (s.cycle === "yearly" ? 365 : 30) * 864e5).toISOString().slice(0, 10);
    BL.invoices.push({ id: "INV-2026-0" + n, tenant_id: tn.id, period: today + "/" + end, issued_at: today, due_at: new Date(Date.parse(today) + 7 * 864e5).toISOString().slice(0, 10), status: "due", amount: Math.round(q.cycle * 100) / 100 });
    App.state["q-sub:" + tn.id] = { tab: "invoices" }; App.render(); UI.toast(t("q.sub.issued"));
  }

  /* =====================================================================
   * QUANTARA · Support queue (List) and one tenant's tickets (List).
   * ===================================================================== */
  function ticketColumns(withTenant) {
    return [
      { key: "id", label: "#", render: function (k) { return h("code", { dir: "ltr" }, k.id); } },
      withTenant ? { key: "tn", label: t("col.tenant"), render: function (k) { return tenantCell(Store.tenant(k.tenant_id)); } } : null,
      { key: "subj", label: t("q.col.subject"), render: function (k) { return h("span", null, h("button", { type: "button", class: "link-btn", onClick: function () { ticketDialog(k); } }, I18n.pick(k, "subject")), h("span", { class: "cell-sub" }, t("q.channel." + k.channel) + " · " + I18n.dateTime(k.created_at))); } },
      { key: "pr", label: t("q.col.priority"), sortable: true, sortValue: function (k) { return ["urgent", "high", "normal", "low"].indexOf(k.priority); }, render: function (k) { return UI.Badge(t("q.pr." + k.priority), PR_TONE[k.priority]); } },
      { key: "st", label: t("col.status"), render: function (k) { var r = k.access_request_id ? D.support_access.filter(function (x) { return x.id === k.access_request_id; })[0] : null;
        return h("span", null, UI.Badge(t("q.tk." + k.status), TK_TONE[k.status]), r ? h("span", { class: "cell-sub" }, t("access.title") + ": " + t("q.access." + r.status)) : null); } },
      { key: "who", label: t("q.col.assignee"), render: function (k) { return k.assignee ? staffName(k.assignee) : h("span", { class: "muted" }, t("q.unassigned")); } },
    ].filter(Boolean);
  }
  function ticketFilters(key) {
    return [
      { id: "st", type: "select", label: t("col.status"), initial: "", options: function () { return ["open", "waiting", "solved"].map(function (s) { return { value: s, label: t("q.tk." + s) }; }); }, match: function (k, v) { return !v || k.status === v; } },
      { id: "mine", type: "checkbox", label: t("q.tk.mine"), initial: false, match: function (k, v) { return !v || k.assignee === me(); } }
    ];
  }
  function SupportQueue() {
    var label = t("nav.support"), open = BL.tickets.filter(function (k) { return k.status !== "solved"; });
    return P.ListPage({
      stateKey: "q-support",
      header: { breadcrumbs: allCrumbs(label), title: label, subtitle: t("q.tk.subtitle"), badges: UI.OwnerTag({ owner: "quantara", here: "quantara" }),
        actions: [UI.Button({ label: t("q.tk.new"), icon: "plus", variant: "primary", onClick: function () { newTicket(null); } })] },
      before: [h("div", { class: "tiles" }, tileOf(t("q.tk.open"), I18n.number(open.length)), tileOf(t("q.pr.urgent"), I18n.number(open.filter(function (k) { return k.priority === "urgent"; }).length)),
        tileOf(t("q.unassigned"), I18n.number(open.filter(function (k) { return !k.assignee; }).length)), tileOf(t("q.tk.inside"), I18n.number(D.support_access.filter(function (r) { return r.status === "approved"; }).length))),
        UI.Banner({ tone: "info", body: t("q.tk.access_note") })],
      rows: function () { return BL.tickets; },
      defaultSort: { key: "pr", dir: "asc" },
      filters: [{ id: "q", type: "search", label: t("filter.search"), placeholder: t("q.tk.search"), match: function (k, q) { q = q.trim().toLowerCase(); var tn = Store.tenant(k.tenant_id); return !q || (k.id + " " + k.subject_en + " " + k.subject_ar + " " + tn.name_en + " " + tn.name_ar).toLowerCase().indexOf(q) > -1; } }].concat(ticketFilters()),
      columns: ticketColumns(true),
      empty: { title: t("q.tk.empty"), body: t("q.tk.empty_body") }
    });
  }
  function TenantSupport(tn) {
    var label = t("nav.tenant_support");
    return P.ListPage({
      stateKey: "q-tsupport:" + tn.id,
      header: { breadcrumbs: tnCrumbs(tn, label), title: label, subtitle: t("q.tk.subtitle_tenant"),
        actions: [UI.Button({ label: t("q.tk.new"), icon: "plus", variant: "primary", onClick: function () { newTicket(tn); } }), UI.Button({ label: t("access.title"), icon: "shield", href: "#/t/" + tn.id })] },
      before: Store.supportInside(tn) ? [UI.Banner({ tone: "critical", title: t("access.state.inside"), body: t("q.tk.inside_body") })] : [],
      rows: function () { return BL.tickets.filter(function (k) { return k.tenant_id === tn.id; }); },
      defaultSort: { key: "pr", dir: "asc" },
      filters: ticketFilters(),
      columns: ticketColumns(false),
      empty: { title: t("q.tk.empty"), body: t("q.tk.empty_body") }
    });
  }
  function ticketDialog(k) {
    var tn = Store.tenant(k.tenant_id), reply = "";
    var access = k.access_request_id ? D.support_access.filter(function (x) { return x.id === k.access_request_id; })[0] : null;
    UI.Dialog({ title: k.id + " · " + I18n.pick(k, "subject"), wide: true, body: h("div", { class: "stack" },
      UI.DescList([
        { label: t("col.tenant"), value: h("a", { href: "#/t/" + tn.id }, I18n.pick(tn, "name")) },
        { label: t("q.col.priority"), value: UI.Select({ id: "tk-p", value: k.priority, options: ["urgent", "high", "normal", "low"].map(function (p) { return { value: p, label: t("q.pr." + p) }; }), onChange: function (v) { k.priority = v; } }) },
        { label: t("q.col.assignee"), value: UI.Select({ id: "tk-a", value: k.assignee || "", options: [{ value: "", label: t("q.unassigned") }].concat(D.staff.map(function (s) { return { value: s.id, label: I18n.pick(s, "name") + " · " + t("team." + s.team) }; })), onChange: function (v) { k.assignee = v || null; } }) },
        { label: t("access.title"), value: access ? UI.Badge(t("q.access." + access.status), access.status === "approved" ? "critical" : "info") : UI.Button({ label: t("access.ask"), size: "sm", icon: "shield", onClick: function () {
          var r = Store.requestSupport(tn, me(), I18n.pick(k, "subject"), 4); k.access_request_id = r.id; UI.toast(t("q.tk.access_asked")); App.render(); } }) }
      ]),
      h("ol", { class: "thread" }, k.messages.map(function (m) { var quantara = /^staff-/.test(m.by);
        return h("li", { class: "thread__msg" + (quantara ? " thread__msg--us" : "") }, h("span", { class: "thread__who" }, actorName(tn, m.by) + " · " + I18n.dateTime(m.at, tn.time_zone)), h("p", null, I18n.pick(m, "text"))); })),
      UI.FormRow({ id: "tk-r", label: t("q.tk.reply"), control: h("textarea", { class: "input textarea", id: "tk-r", rows: "3", onInput: function (e) { reply = e.target.value; } }) })),
      actions: [
        { label: t("dialog.close"), variant: "ghost", onClick: function (close) { close(); App.render(); } },
        { label: t("q.tk.wait"), onClick: function (close) { send(); k.status = "waiting"; close(); App.render(); } },
        { label: k.status === "solved" ? t("q.tk.reopen") : t("q.tk.solve"), variant: "primary", onClick: function (close) { send(); k.status = k.status === "solved" ? "open" : "solved"; if (k.status === "solved") k.solved_at = Store.now(); close(); App.render(); UI.toast(t("q.tk.saved")); } }
      ] });
    function send() { if (reply.trim()) k.messages.push({ by: me(), at: Store.now(), text_en: reply.trim(), text_ar: reply.trim() }); }
  }
  function newTicket(tn) {
    var d = { tenant: tn ? tn.id : Store.tenants()[0].id, subject: "", priority: "normal", channel: "phone" };
    UI.Dialog({ title: t("q.tk.new"), body: h("div", { class: "stack" },
      tn ? null : UI.FormRow({ id: "nt-t", label: t("col.tenant"), control: UI.Select({ id: "nt-t", value: d.tenant, options: Store.tenants().map(function (x) { return { value: x.id, label: I18n.pick(x, "name") }; }), onChange: function (v) { d.tenant = v; } }) }),
      UI.FormRow({ id: "nt-s", label: t("q.col.subject"), required: true, control: UI.Input({ id: "nt-s", onInput: function (v) { d.subject = v; } }) }),
      h("div", { class: "grid-2" },
        UI.FormRow({ id: "nt-p", label: t("q.col.priority"), control: UI.Select({ id: "nt-p", value: d.priority, options: ["urgent", "high", "normal", "low"].map(function (p) { return { value: p, label: t("q.pr." + p) }; }), onChange: function (v) { d.priority = v; } }) }),
        UI.FormRow({ id: "nt-c", label: t("q.col.channel"), control: UI.Select({ id: "nt-c", value: d.channel, options: ["phone", "whatsapp", "email", "chat", "onboarding"].map(function (c) { return { value: c, label: t("q.channel." + c) }; }), onChange: function (v) { d.channel = v; } }) }))),
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("q.tk.create"), variant: "primary", onClick: function (close) {
        if (!d.subject.trim()) { var el = document.getElementById("nt-s"); el.setAttribute("aria-invalid", "true"); el.focus(); return; }
        BL.tickets.push({ id: "T-" + (1045 + BL.tickets.length), tenant_id: d.tenant, subject_en: d.subject.trim(), subject_ar: d.subject.trim(), priority: d.priority, status: "open", assignee: me(), channel: d.channel, created_at: Store.now(), messages: [] });
        close(); App.render(); UI.toast(t("q.tk.created"));
      } }] });
  }

  /* =====================================================================
   * QUANTARA · one tenant · People (List, read-only). Quantara sees names and roles, never PINs.
   * ===================================================================== */
  function TenantPeople(tn) {
    var label = t("nav.people"), hq = Store.hq(tn), extra = (D.ops[tn.id] || {}).staff_extra || {};
    return P.ListPage({
      stateKey: "q-people:" + tn.id,
      header: { breadcrumbs: tnCrumbs(tn, label), title: label, subtitle: t("q.people.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "quantara" }) },
      before: [UI.Banner({ tone: "info", body: t("q.people.note") })],
      rows: function () { return hq.users; },
      filters: [{ id: "role", type: "select", label: t("col.role"), options: function () { return ["owner", "hq_manager", "accountant", "branch_manager", "cashier", "barista"].map(function (r) { return { value: r, label: t("role." + r) }; }); }, match: function (u, v) { return !v || u.role === v; } }],
      columns: [
        { key: "n", label: t("col.person"), render: function (u) { return I18n.pick(u, "name"); } },
        { key: "r", label: t("col.role"), render: function (u) { return t("role." + u.role); } },
        { key: "w", label: t("col.works_at"), render: function (u) { var ex = extra[u.id]; var ids = ex && ex.branches.length ? ex.branches : u.branch_id ? [u.branch_id] : []; return ids.length ? ids.map(function (id) { var b = Store.branch(tn, id); return b ? I18n.pick(b, "name") : id; }).join(", ") : t("layer.hq"); } },
        { key: "l", label: t("ops.roles.login"), render: function (u) { var ex = extra[u.id]; return t("ops.till.login." + ((ex && ex.login) || "pin")); } },
        { key: "o", label: t("q.people.owner_col"), render: function (u) { return u.role === "owner" ? UI.Badge(t("q.people.approves_access"), "info") : "—"; } }
      ],
      empty: { title: t("hq.people.empty_title"), body: t("hq.people.empty_body") }
    });
  }

  /* =====================================================================
   * QUANTARA · Platform settings (Settings) — trial, grace, yearly discount, plans, add-ons, hardware.
   * ===================================================================== */
  function PlatformSettings() {
    var label = t("nav.platform_settings"), r = BL.rules, tag = UI.OwnerTag({ owner: "quantara", here: "quantara" });
    var planTable = OPS._h.simpleTable(t("q.ps.plans"), [
      { key: "n", label: t("col.plan"), render: function (p) { return I18n.pick(p, "name"); } },
      { key: "p", label: t("q.ps.per_branch"), align: "end", render: function (p) { var pp = BL.plan_prices[p.id]; return pp.per_branch != null ? usd(pp.per_branch) : t("q.sub.custom"); } },
      { key: "r", label: t("q.ps.regs_incl"), align: "end", render: function (p) { var pp = BL.plan_prices[p.id]; return pp.registers_included != null ? I18n.number(pp.registers_included) : "—"; } },
      { key: "l", label: t("q.ps.limits"), render: function (p) { return t(p.max_branches === 1 ? "q.sub.limits_one" : "q.sub.limits", { b: I18n.number(p.max_branches), r: I18n.number(p.max_registers) }); } },
      { key: "f", label: t("q.ps.features"), render: function (p) { return h("span", { class: "cell-wrap" }, BL.plan_prices[p.id].features.map(function (f) { return t("q.feat." + f); }).join(" · ")); } },
      { key: "t", label: t("q.ps.tenants"), align: "end", render: function (p) { return I18n.number(Store.tenants().filter(function (tn) { return sub(tn).plan_id === p.id; }).length); } },
      { key: "e", label: "", render: function (p) { return BL.plan_prices[p.id].per_branch != null ? UI.Button({ label: t("ops.edit"), size: "sm", variant: "ghost", onClick: function () { priceDialog(t("q.ps.per_branch") + " · " + I18n.pick(p, "name"), BL.plan_prices[p.id], "per_branch"); } }) : null; } }
    ], Store.plans());
    var addonTable = OPS._h.simpleTable(t("q.sub.addons"), [
      { key: "n", label: t("q.col.addon"), render: function (a) { return I18n.pick(a, "name"); } },
      { key: "p", label: t("q.col.price"), align: "end", render: function (a) { return a.price ? h("span", null, usd(a.price), h("span", { class: "cell-sub" }, t("q.unit." + a.unit))) : t("q.free"); } },
      { key: "m", label: t("q.ps.module"), render: function (a) { return a.module ? t("module." + a.module) : "—"; } },
      { key: "e", label: "", render: function (a) { return UI.Button({ label: t("ops.edit"), size: "sm", variant: "ghost", onClick: function () { priceDialog(I18n.pick(a, "name"), a, "price"); } }); } }
    ], BL.addons);
    var hwTable = OPS._h.simpleTable(t("ops.dev.approved"), [
      { key: "k", label: t("ops.dev.device"), render: function (x) { return t("ops.dev.kind." + x.kind); } },
      { key: "m", label: t("q.ps.model"), render: function (x) { return x.model; } },
      { key: "s", label: t("col.status"), render: function (x) { return x.status === "approved" ? UI.Badge(t("ops.dev.is_approved"), "positive") : h("span", null, UI.Badge(t("q.ps.pending"), "warning"), " ", Decision("D-29")); } }
    ], BL.hardware);
    return P.SettingsPage({
      stateKey: "q-platform",
      header: { breadcrumbs: allCrumbs(label), title: label, subtitle: t("q.ps.subtitle"), badges: [tag, " ", Decision(BL.decision)] },
      before: [UI.Banner({ tone: "warning", body: t("q.ps.placeholder") }),
        UI.Section({ title: t("q.ps.plans"), flush: true, body: planTable }), UI.Section({ title: t("q.sub.addons"), flush: true, body: addonTable }), UI.Section({ title: t("ops.dev.approved"), flush: true, body: hwTable })],
      load: function () { return { trial: r.trial_days, grace: r.grace_days, free: r.yearly_free_months, ro: r.read_only_after_grace, till: "on", currency: BL.currency }; },
      save: function (d) { r.trial_days = Number(d.trial); r.grace_days = Number(d.grace); r.yearly_free_months = Number(d.free); r.read_only_after_grace = d.ro; r.updated_by = me(); r.updated_at = Store.now(); },
      groups: [{ title: t("q.ps.billing_rules"), rows: [
        { key: "trial", type: "number", dir: "ltr", tag: tag, label: t("q.ps.trial"), help: t("q.ps.trial_help"), format: function (v) { return t("ops.days", { n: I18n.number(v) }); } },
        { key: "grace", type: "number", dir: "ltr", tag: tag, label: t("q.ps.grace"), help: t("q.ps.grace_help"), format: function (v) { return t("ops.days", { n: I18n.number(v) }); } },
        { key: "free", type: "number", dir: "ltr", tag: tag, label: t("q.ps.free_months"), help: t("q.ps.free_months_help"), format: function (v) { return t("q.ps.months", { n: I18n.number(v) }); } },
        { key: "ro", type: "toggle", tag: tag, label: t("q.ps.ro"), help: t("q.ps.ro_help") },
        { key: "till", locked: true, tag: UI.OwnerTag({ owner: "guaranteed", here: "quantara" }), label: t("q.sub.till_title"), help: t("q.sub.till_body"), format: function () { return t("hq.settings.always_on"); } },
        { key: "currency", locked: true, tag: tag, label: t("q.ps.currency"), help: t("q.ps.currency_help"), format: function (v) { return v; } }
      ] }]
    });
  }
  function priceDialog(title, obj, key) {
    var v = obj[key];
    UI.Dialog({ title: title, body: UI.FormRow({ id: "pr-v", label: t("q.col.price") + " (" + BL.currency + ")", help: t("q.ps.placeholder"), control: UI.Input({ id: "pr-v", type: "number", min: 0, dir: "ltr", value: v, onInput: function (x) { v = Number(x); } }) }),
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("settings.save"), variant: "primary", onClick: function (close) { if (!(v >= 0)) return; obj[key] = v; close(); App.render(); UI.toast(t("settings.saved")); } }] });
  }

  window.QPages = { Billing: Billing, SupportQueue: SupportQueue, PlatformSettings: PlatformSettings, TenantSubscription: TenantSubscription, TenantPeople: TenantPeople, TenantSupport: TenantSupport, StatesGallery: StatesGallery, StateView: StateView, quote: quote };
  UI.StateView = StateView;
})();
