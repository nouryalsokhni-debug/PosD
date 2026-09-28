/*
 * The four kinds of page — list, record, settings, flow — as generic builders,
 * followed by today's screens, each of which is just a configuration of one kind.
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };

  /* Page state survives re-renders (language switch, scope switch) — keyed per screen. */
  function pageState(key, init) {
    var s = App.state;
    if (!s[key]) s[key] = typeof init === "function" ? init() : init;
    return s[key];
  }

  /* =====================================================================
   * KIND 1 — LIST: header · filter bar · sortable table · empty state
   * ===================================================================== */
  function ListPage(cfg) {
    var st = pageState(cfg.stateKey, function () {
      var f = {}; cfg.filters.forEach(function (x) { f[x.id] = x.initial != null ? x.initial : ""; });
      return { filters: f, sort: cfg.defaultSort || {} };
    });
    var results = h("div", { class: "list__results" });
    var count = h("p", { class: "list__count", "aria-live": "polite" });

    function visibleRows() {
      return cfg.rows().filter(function (r) {
        return cfg.filters.every(function (f) { return f.match(r, st.filters[f.id]); });
      });
    }
    function isFiltered() {
      return cfg.filters.some(function (f) { return st.filters[f.id] !== (f.initial != null ? f.initial : ""); });
    }
    function clear() {
      cfg.filters.forEach(function (f) { st.filters[f.id] = f.initial != null ? f.initial : ""; });
      App.render();
    }
    function draw() {
      var all = cfg.rows(), rows = visibleRows();
      count.textContent = t("list.count", { n: I18n.number(rows.length), total: I18n.number(all.length) });
      clearBtn.hidden = !isFiltered();
      results.replaceChildren(rows.length
        ? UI.Table({ columns: cfg.columns, rows: rows, sort: st.sort, rowHref: cfg.rowHref, caption: cfg.header.title,
            onSort: function (s) { st.sort = s; draw(); } })
        : UI.EmptyState({ icon: "search", title: cfg.empty.title, body: cfg.empty.body,
            action: isFiltered() ? UI.Button({ label: t("filter.clear"), onClick: clear }) : cfg.empty.action }));
    }

    var clearBtn = UI.Button({ label: t("filter.clear"), variant: "ghost", icon: "x", onClick: clear });
    var bar = h("div", { class: "filter-bar", role: "search" }, cfg.filters.map(function (f) {
      var id = cfg.stateKey + "-" + f.id, set = function (v) { st.filters[f.id] = v; draw(); };
      if (f.type === "search") return h("div", { class: "filter filter--search" },
        h("label", { class: "sr-only", for: id }, f.label), UI.icon("search", "filter__icon"),
        UI.Input({ id: id, type: "search", value: st.filters[f.id], placeholder: f.placeholder, onInput: set }));
      if (f.type === "select") return h("div", { class: "filter" },
        h("label", { class: "filter__label", for: id }, f.label),
        UI.Select({ id: id, value: st.filters[f.id], onChange: set,
          options: [{ value: "", label: t("filter.any") }].concat(f.options()) }));
      if (f.type === "checkbox") return h("div", { class: "filter" }, UI.Checkbox({ id: id, label: f.label, checked: st.filters[f.id], onChange: set }));
    }), h("div", { class: "filter-bar__end" }, count, clearBtn));

    draw();
    // before: banners, meters or boundary notes between the header and the filters. Optional.
    return [UI.PageHeader(cfg.header), cfg.before && cfg.before.length ? h("div", { class: "stack" }, cfg.before) : null,
      cfg.filters.length ? bar : h("div", { class: "filter-bar__end list__count-only" }, count), results, cfg.after || null];
  }

  /* =====================================================================
   * KIND 2 — RECORD: identity header · banners · tabs · side panel
   * ===================================================================== */
  function RecordPage(cfg) {
    var st = pageState(cfg.stateKey, { tab: cfg.tabs[0].id });
    return [
      UI.PageHeader(cfg.header),
      cfg.banners && cfg.banners.length ? h("div", { class: "stack" }, cfg.banners) : null,
      h("div", { class: "record" },
        h("div", { class: "record__main" },
          UI.Tabs({ id: cfg.stateKey, tabs: cfg.tabs, active: st.tab, onChange: function (id) { st.tab = id; } })),
        h("aside", { class: "record__side", "aria-label": cfg.sideLabel }, cfg.side))
    ];
  }

  /* =====================================================================
   * KIND 3 — SETTINGS: grouped rows of label · value · control · explanation
   * ===================================================================== */
  function SettingsPage(cfg) {
    var st = pageState(cfg.stateKey, function () { return { draft: cfg.load() }; });
    var saved = cfg.load();
    var dirtyKeys = Object.keys(st.draft).filter(function (k) { return st.draft[k] !== saved[k]; });

    function set(key, v) { st.draft[key] = v; App.render(); }
    function display(row, v) {
      if (row.type === "toggle") return v ? t("settings.on") : t("settings.off");
      if (row.format) return row.format(v);
      return v === "" || v == null ? t("settings.not_set") : v;
    }

    var groups = cfg.groups.map(function (g) {
      return UI.Section({ title: g.title, flush: true, body: h("div", { class: "settings" }, g.rows.map(function (row) {
        var id = cfg.stateKey + "-" + row.key, v = st.draft[row.key];
        // A locked row is owned by another layer: no control, the owner tag stands in its place.
        if (row.locked) return h("div", { class: "setting setting--locked" },
          h("div", { class: "setting__label" }, h("span", { class: "setting__name", id: id }, row.label),
            h("p", { class: "setting__help" }, row.help), row.note || null),
          h("div", { class: "setting__value", "aria-labelledby": id }, display(row, saved[row.key])),
          h("div", { class: "setting__control" }, row.tag || null));
        var control = row.type === "toggle" ? UI.Toggle({ id: id, checked: v, onChange: function (x) { set(row.key, x); } })
          : row.type === "select" ? UI.Select({ id: id, value: v, options: row.options(), onChange: function (x) { set(row.key, x); } })
          : UI.Input({ id: id, value: v, dir: row.dir, type: row.type === "number" ? "number" : null, min: row.min, max: row.max,
              onInput: function (x) { st.draft[row.key] = row.type === "number" ? Number(x) : x; markDirty(); } });
        if (control.querySelector) { var inner = control.matches("input,select") ? control : control.querySelector("input"); inner.setAttribute("aria-describedby", id + "-help"); }
        var changed = st.draft[row.key] !== saved[row.key];
        return h("div", { class: "setting" + (changed ? " setting--changed" : "") },
          h("div", { class: "setting__label" },
            h("label", { for: id }, row.label),
            h("p", { class: "setting__help", id: id + "-help" }, row.help), row.note || null),
          h("div", { class: "setting__value" }, display(row, saved[row.key])),
          h("div", { class: "setting__control" }, row.tag ? h("span", { class: "setting__owned" }, control, row.tag) : control));
      })) });
    });

    // Text inputs update without a full re-render (keeps focus); the bar is toggled directly.
    var bar = h("div", { class: "savebar", hidden: dirtyKeys.length ? null : true, role: "region", "aria-label": t("settings.unsaved") },
      h("span", { class: "savebar__text" }, UI.icon("info"), t("settings.unsaved")),
      UI.Button({ label: t("settings.discard"), variant: "ghost", onClick: function () { st.draft = cfg.load(); App.render(); } }),
      UI.Button({ label: t("settings.save"), variant: "primary", onClick: function () { cfg.save(st.draft); st.draft = cfg.load(); App.render(); UI.toast(t("settings.saved")); } }));
    function markDirty() { bar.hidden = !Object.keys(st.draft).some(function (k) { return st.draft[k] !== saved[k]; }); }

    return [UI.PageHeader(cfg.header), h("div", { class: "stack" }, cfg.before || null, groups), bar];
  }

  /* =====================================================================
   * KIND 4 — FLOW: steps · back and forward · summary · final action
   * ===================================================================== */
  function FlowPage(cfg) {
    var st = pageState(cfg.stateKey, function () { return { step: 0, draft: cfg.init(), errors: {} }; });
    var steps = cfg.steps, n = steps.length, step = steps[st.step], last = st.step === n - 1;

    function go(i) { st.step = i; st.errors = {}; App.render(); focusStep(); }
    function next() {
      var errs = step.validate ? step.validate(st.draft) : {};
      st.errors = errs;
      if (Object.keys(errs).length) { App.render(); var bad = document.querySelector("[aria-invalid=true]"); if (bad) bad.focus(); return; }
      go(st.step + 1);
    }
    function focusStep() { var el = document.getElementById("flow-step-title"); if (el) el.focus(); }
    function field(key, value) { st.draft[key] = value; if (st.errors[key]) { delete st.errors[key]; } refreshSummary(); }

    var stepper = h("ol", { class: "stepper" }, steps.map(function (s, i) {
      var state = i < st.step ? "done" : i === st.step ? "current" : "todo";
      return h("li", { class: "stepper__step stepper__step--" + state, "aria-current": state === "current" ? "step" : null },
        h("span", { class: "stepper__dot", "aria-hidden": "true" }, state === "done" ? UI.icon("check") : I18n.number(i + 1)),
        i < st.step ? h("button", { type: "button", class: "stepper__label stepper__label--link", onClick: function () { go(i); } }, s.label)
                    : h("span", { class: "stepper__label" }, s.label));
    }));

    var summaryBody = h("div");
    function refreshSummary() { summaryBody.replaceChildren(cfg.summary(st.draft)); }
    refreshSummary();

    var errCount = Object.keys(st.errors).length;
    var card = h("section", { class: "flow__card", "aria-labelledby": "flow-step-title" },
      h("p", { class: "flow__kicker" }, t("flow.step", { n: I18n.number(st.step + 1), total: I18n.number(n) })),
      h("h2", { class: "flow__title", id: "flow-step-title", tabindex: "-1" }, step.label),
      errCount ? UI.Banner({ tone: "critical", body: st.errors._form || t("flow.error_required") }) : null,
      h("div", { class: "flow__fields" }, step.render(st.draft, st.errors, field)),
      h("div", { class: "flow__nav" },
        st.step > 0 ? UI.Button({ label: t("flow.back"), icon: "arrowBack", onClick: function () { go(st.step - 1); } })
                    : UI.Button({ label: t("flow.cancel"), variant: "ghost", href: cfg.cancelHref }),
        h("span", { class: "flow__spacer" }),
        last ? UI.Button({ label: cfg.finalLabel, variant: "primary", icon: "check", onClick: function () { var r = cfg.finish(st.draft); delete App.state[cfg.stateKey]; r(); } })
             : UI.Button({ label: t("flow.next"), variant: "primary", onClick: next })));

    return [UI.PageHeader(cfg.header), stepper,
      h("div", { class: "flow" }, card, h("aside", { class: "flow__summary", "aria-label": t("flow.summary") },
        h("h2", { class: "flow__summary-title" }, t("flow.summary")), summaryBody))];
  }

  /* =====================================================================
   * Shared bits for today's screens
   * ===================================================================== */
  function tenantName(tn) {
    return h("span", { class: "cell-name" },
      Shell.Avatar(tn, "sm"),
      h("span", { class: "cell-name__text" },
        h("span", { class: "cell-name__primary" }, I18n.pick(tn, "name")),
        h("span", { class: "cell-name__other" },
          h("span", { lang: I18n.lang === "ar" ? "en" : "ar" }, I18n.pickOther(tn, "name")),
          tn.is_sample ? UI.SampleBadge() : null)));
  }
  function stamp(iso) {
    if (!iso) return "—";
    return h("span", { class: "cell-stamp" }, h("span", null, I18n.date(iso)), h("small", null, I18n.time(iso)));
  }
  function planOptions() { return Store.plans().map(function (p) { return { value: p.id, label: I18n.pick(p, "name") }; }); }
  function tenantCrumbs(tn, label) {
    var c = [{ label: t("scope.all"), href: "#/tenants" }, { label: I18n.pick(tn, "name"), href: "#/t/" + tn.id }];
    if (label) c.push({ label: label }); else c[1] = { label: I18n.pick(tn, "name") };
    return c;
  }

  /* ---------- Screen: Tenants (all tenants · list) ---------- */
  function TenantsList() {
    return ListPage({
      stateKey: "tenants",
      header: {
        breadcrumbs: [{ label: t("scope.all"), href: "#/tenants" }, { label: t("tenants.title") }],
        title: t("tenants.title"), subtitle: t("tenants.subtitle"),
        actions: UI.Button({ label: t("tenants.new"), variant: "primary", icon: "plus", href: "#/onboarding" })
      },
      rows: Store.tenants,
      rowHref: function (tn) { return "#/t/" + tn.id; },
      defaultSort: { key: "name", dir: "asc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.search_ph"),
          match: function (tn, q) { q = q.trim().toLowerCase(); return !q || (tn.name_en + " " + tn.name_ar + " " + tn.id).toLowerCase().indexOf(q) > -1; } },
        { id: "status", type: "select", label: t("filter.status"),
          options: function () { return ["active", "trial", "onboarding", "suspended"].map(function (s) { return { value: s, label: t("status." + s) }; }); },
          match: function (tn, v) { return !v || tn.status === v; } },
        { id: "plan", type: "select", label: t("filter.plan"), options: planOptions,
          match: function (tn, v) { return !v || tn.plan_id === v; } },
        { id: "samples", type: "checkbox", label: t("filter.samples"), initial: true,
          match: function (tn, v) { return v || !tn.is_sample; } }
      ],
      columns: [
        { key: "name", label: t("col.name"), sortable: true, render: tenantName, sortValue: function (tn) { return I18n.pick(tn, "name"); } },
        { key: "status", label: t("col.status"), sortable: true, render: function (tn) { return UI.StatusBadge(tn.status); }, sortValue: function (tn) { return t("status." + tn.status); } },
        { key: "plan", label: t("col.plan"), sortable: true, render: function (tn) { return I18n.pick(Store.plan(tn.plan_id), "name"); }, sortValue: function (tn) { return I18n.pick(Store.plan(tn.plan_id), "name"); } },
        { key: "branches", label: t("col.branches"), sortable: true, align: "end", render: function (tn) { return I18n.number(Store.branchCount(tn)); }, sortValue: function (tn) { return Store.branchCount(tn); } },
        { key: "registers", label: t("col.registers"), sortable: true, align: "end", render: function (tn) { return I18n.number(Store.registerCount(tn)); }, sortValue: function (tn) { return Store.registerCount(tn); } },
        { key: "currency", label: t("col.currency"), sortable: true },
        { key: "customer_since", label: t("col.customer_since"), sortable: true, render: function (tn) { return I18n.date(tn.customer_since); } },
        { key: "last_activity_at", label: t("col.last_activity"), sortable: true, render: function (tn) { return stamp(tn.last_activity_at); } }
      ],
      empty: { title: t("tenants.empty_title"), body: t("tenants.empty_body") }
    });
  }

  /* ---------- Screen: Branches (one tenant · list) ---------- */
  function BranchesList(tn) {
    return ListPage({
      stateKey: "branches:" + tn.id,
      header: { breadcrumbs: tenantCrumbs(tn, t("branches.title")), title: t("branches.title"), subtitle: t("branches.subtitle") },
      rows: function () { return tn.branches; },
      defaultSort: { key: "name", dir: "asc" },
      filters: [
        { id: "q", type: "search", label: t("filter.search"), placeholder: t("filter.search_ph"),
          match: function (b, q) { q = q.trim().toLowerCase(); return !q || (b.name_en + " " + b.name_ar + " " + b.city_en + " " + b.city_ar).toLowerCase().indexOf(q) > -1; } }
      ],
      columns: [
        { key: "name", label: t("col.branch"), sortable: true, render: function (b) { return I18n.pick(b, "name"); }, sortValue: function (b) { return I18n.pick(b, "name"); } },
        { key: "city", label: t("col.city"), sortable: true, render: function (b) { return I18n.pick(b, "city"); }, sortValue: function (b) { return I18n.pick(b, "city"); } },
        { key: "status", label: t("col.status"), render: function (b) { return UI.StatusBadge(b.status); } },
        { key: "registers", label: t("col.registers"), sortable: true, align: "end", render: function (b) { return I18n.number(b.registers.length); }, sortValue: function (b) { return b.registers.length; } }
      ],
      empty: { title: t("branches.empty_title"), body: t("branches.empty_body") }
    });
  }

  /* ---------- Screen: Registers (one tenant · list) ---------- */
  function RegistersList(tn) {
    return ListPage({
      stateKey: "registers:" + tn.id,
      header: { breadcrumbs: tenantCrumbs(tn, t("registers.title")), title: t("registers.title"), subtitle: t("registers.subtitle") },
      rows: function () { return Store.registers(tn); },
      defaultSort: { key: "branch", dir: "asc" },
      filters: [
        { id: "status", type: "select", label: t("filter.status"),
          options: function () { return ["online", "offline"].map(function (s) { return { value: s, label: t("status." + s) }; }); },
          match: function (r, v) { return !v || r.status === v; } },
        { id: "branch", type: "select", label: t("col.branch"),
          options: function () { return tn.branches.map(function (b) { return { value: b.id, label: I18n.pick(b, "name") }; }); },
          match: function (r, v) { return !v || r.branch.id === v; } }
      ],
      columns: [
        { key: "label", label: t("col.register"), sortable: true, render: function (r) { return h("span", { dir: "ltr" }, r.label); } },
        { key: "branch", label: t("col.branch"), sortable: true, render: function (r) { return I18n.pick(r.branch, "name"); }, sortValue: function (r) { return I18n.pick(r.branch, "name") + " " + r.label; } },
        { key: "status", label: t("col.status"), sortable: true, render: function (r) { return UI.StatusBadge(r.status); } },
        { key: "last_seen_at", label: t("col.last_seen"), sortable: true, render: function (r) { return stamp(r.last_seen_at); } }
      ],
      empty: { title: t("registers.empty_title"), body: t("registers.empty_body") }
    });
  }

  /* ---------- Screen: Tenant overview (one tenant · record) ---------- */
  function TenantRecord(tn) {
    var plan = Store.plan(tn.plan_id), owner = Store.staff(tn.account_owner_id);
    var suspended = tn.status === "suspended", upgrade = Store.upgradeRequest(tn);
    var inside = Store.supportInside(tn), pending = Store.supportPending(tn);

    // Support access, from our side: we can only ask. The tenant's owner decides.
    function askAccess() {
      var reason = "";
      UI.Dialog({ title: t("access.ask_title", { name: I18n.pick(tn, "name") }),
        body: [h("p", null, t("access.ask_body")),
          UI.FormRow({ id: "access-reason", label: t("access.reason"), help: t("access.reason_help"),
            control: UI.Input({ id: "access-reason", onInput: function (v) { reason = v; } }) })],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" },
          { label: t("access.ask"), variant: "primary", onClick: function (close) {
            if (!reason.trim()) { var el = document.getElementById("access-reason"); el.setAttribute("aria-invalid", "true"); el.focus(); return; }
            Store.requestSupport(tn, Store.me().id, reason.trim(), 4); close(); App.render(); UI.toast(t("access.asked")); } }] });
    }
    var accessSection = UI.Section({ title: t("access.title"), body: inside
      ? [UI.Badge(t("access.state.inside"), "critical"), h("p", null, t("access.inside_q", { name: I18n.pick(Store.staff(inside.staff_id), "name"), until: I18n.time(inside.expires_at, tn.time_zone) }))]
      : pending.length
        ? [UI.Badge(t("access.state.pending"), "info"), h("p", { class: "muted" }, t("access.pending_q", { date: I18n.dateTime(pending[0].requested_at, tn.time_zone) }))]
        : [h("p", { class: "muted" }, t("access.none_q")), UI.Button({ label: t("access.ask"), icon: "shield", size: "sm", onClick: askAccess })] });

    function confirmStatus() {
      var reason = "";
      UI.Dialog({
        title: t(suspended ? "dialog.reactivate_title" : "dialog.suspend_title", { name: I18n.pick(tn, "name") }),
        body: [h("p", null, t(suspended ? "dialog.reactivate_body" : "dialog.suspend_body")),
          suspended ? null : UI.FormRow({ id: "suspend-reason", label: t("suspend.reason"),
            control: UI.Input({ id: "suspend-reason", placeholder: t("suspend.reason_ph"), onInput: function (v) { reason = v; } }) })],
        actions: [
          { label: t("dialog.cancel"), variant: "ghost" },
          { label: t(suspended ? "dialog.confirm_reactivate" : "dialog.confirm_suspend"), variant: suspended ? "primary" : "danger",
            onClick: function (close) {
              Store.updateTenant(tn.id, suspended ? { status: "active", suspension_reason_en: null, suspension_reason_ar: null }
                : { status: "suspended", suspension_reason_en: reason, suspension_reason_ar: reason });
              close(); App.render();
            } }
        ]
      });
    }

    var banners = [];
    if (tn.placeholder_fields) banners.push(UI.Banner({ tone: "warning", body: t("placeholder.hint", { fields: tn.placeholder_fields.join(", ") }) }));
    if (suspended) banners.push(UI.Banner({ tone: "critical", title: t("record.suspended_title"), body: t("record.suspended_body", { reason: I18n.pick(tn, "suspension_reason") || "—" }) }));
    if (tn.status === "trial") banners.push(UI.Banner({ tone: "info", title: t("record.trial_title"), body: t("record.trial_body") }));

    return RecordPage({
      stateKey: "record:" + tn.id,
      header: {
        breadcrumbs: tenantCrumbs(tn),
        lead: Shell.Avatar(tn, "lg"),
        title: I18n.pick(tn, "name"),
        subtitle: I18n.pickOther(tn, "name"),
        badges: [UI.StatusBadge(tn.status), tn.is_sample ? UI.SampleBadge() : null],
        actions: [
          UI.Button({ label: t("record.open_settings"), icon: "gear", href: "#/t/" + tn.id + "/settings" }),
          UI.Button({ label: t(suspended ? "record.reactivate" : "record.suspend"), variant: suspended ? "primary" : "danger-quiet", onClick: confirmStatus })
        ]
      },
      banners: banners,
      tabs: [
        { id: "summary", label: t("record.tab.summary"), render: function () {
          return h("div", { class: "stack" },
            UI.Section({ title: t("record.subscription"), actions: UI.OwnerTag({ owner: "quantara", here: "quantara" }), body: UI.DescList([
              { label: t("col.plan"), value: I18n.pick(plan, "name") },
              { label: t("col.status"), value: UI.StatusBadge(tn.status) },
              { label: t("col.customer_since"), value: I18n.date(tn.customer_since) },
              { label: "", value: h("span", { class: "muted" }, t("record.plan_limits", { b: I18n.number(plan.max_branches), r: I18n.number(plan.max_registers) })) }
            ]) }),
            UI.Section({ title: t("record.locations"),
              actions: UI.Button({ label: t("nav.branches"), variant: "ghost", size: "sm", icon: "arrowNext", href: "#/t/" + tn.id + "/branches" }),
              body: [
                h("div", { class: "grid-2" },
                  UI.Meter({ id: "q-m-b", label: t("col.branches"), value: Store.branchCount(tn), max: plan.max_branches }),
                  UI.Meter({ id: "q-m-r", label: t("col.registers"), value: Store.registerCount(tn), max: plan.max_registers })),
                h("p", { class: "muted" }, t("record.online", { n: I18n.number(Store.onlineCount(tn)), total: I18n.number(Store.registerCount(tn)) })),
                h("p", { class: "muted" }, t("record.branches_added_by_hq"))
              ] }),
            upgrade ? UI.Banner({ tone: "info", title: t("record.upgrade_title"), body: t("record.upgrade_body", { date: I18n.date(upgrade.at) }) }) : null);
        } },
        { id: "activity", label: t("record.tab.activity"), count: (tn.activity || []).length, render: function () {
          var items = (tn.activity || []).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; });
          if (!items.length) return UI.EmptyState({ icon: "pulse", title: t("record.no_activity") });
          return h("ol", { class: "timeline" }, items.map(function (a) {
            return h("li", { class: "timeline__item" }, h("time", { datetime: a.at }, I18n.dateTime(a.at)), h("span", null, I18n.pick(a, "text")));
          }));
        } },
        { id: "contact", label: t("record.tab.contact"), render: function () {
          return UI.Section({ body: UI.DescList([
            { label: t("record.contact_name"), value: tn.contact.name },
            { label: t("record.contact_email"), value: h("span", { dir: "ltr" }, tn.contact.email) },
            { label: t("record.contact_phone"), value: h("span", { dir: "ltr" }, tn.contact.phone) }
          ]) });
        } }
      ],
      sideLabel: t("record.details"),
      side: [accessSection, UI.Section({ title: t("record.details"), body: UI.DescList([
        { label: t("record.tenant_id"), value: h("code", { dir: "ltr" }, tn.id) },
        { label: t("col.currency"), value: tn.currency },
        { label: t("record.time_zone"), value: h("span", { dir: "ltr" }, tn.time_zone) },
        { label: t("col.last_activity"), value: I18n.dateTime(tn.last_activity_at) },
        { label: t("record.owner"), value: owner ? I18n.pick(owner, "name") + " · " + t("team." + owner.team) : "—" }
      ]) })]
    });
  }

  /* ---------- Screen: Tenant settings (one tenant · settings) ---------- */
  function TenantSettings(tn) {
    var list = function (arr) { return function () { return arr.map(function (v) { return { value: v, label: v }; }); }; };
    var hqTag = UI.OwnerTag({ owner: "hq", here: "quantara" });
    return SettingsPage({
      stateKey: "settings:" + tn.id,
      header: { breadcrumbs: tenantCrumbs(tn, t("settings.title")), title: t("settings.title"), subtitle: t("settings.subtitle_readonly") },
      before: UI.Banner({ tone: "info", title: t("settings.readonly_title"), body: t("settings.readonly_body") }),
      load: function () {
        return { name_en: tn.name_en, name_ar: tn.name_ar, currency: tn.currency, time_zone: tn.time_zone,
          receipt_bilingual: tn.settings.receipt_bilingual, tax_number: tn.settings.tax_number, manager_pin_for_refunds: tn.settings.manager_pin_for_refunds };
      },
      save: function (d) {
        Store.updateTenant(tn.id, { name_en: d.name_en, name_ar: d.name_ar, currency: d.currency, time_zone: d.time_zone,
          settings: { receipt_bilingual: d.receipt_bilingual, tax_number: d.tax_number, manager_pin_for_refunds: d.manager_pin_for_refunds } });
      },
      groups: [
        { title: t("settings.group.general"), rows: [
          { key: "name_en", type: "text", dir: "ltr", locked: true, tag: hqTag, label: t("settings.name_en"), help: t("settings.name_en_help") },
          { key: "name_ar", type: "text", dir: "rtl", locked: true, tag: hqTag, label: t("settings.name_ar"), help: t("settings.name_ar_help") },
          { key: "currency", type: "select", options: list(Store.currencies()), locked: true, tag: hqTag, label: t("settings.currency"), help: t("settings.currency_help") },
          { key: "time_zone", type: "select", options: list(Store.timeZones()), locked: true, tag: hqTag, label: t("settings.time_zone"), help: t("settings.time_zone_help") }
        ] },
        { title: t("settings.group.receipts"), rows: [
          { key: "receipt_bilingual", type: "toggle", locked: true, tag: hqTag, label: t("settings.receipt_bilingual"), help: t("settings.receipt_bilingual_help") },
          { key: "tax_number", type: "text", dir: "ltr", locked: true, tag: hqTag, label: t("settings.tax_number"), help: t("settings.tax_number_help") }
        ] },
        { title: t("settings.group.access"), rows: [
          { key: "manager_pin_for_refunds", type: "toggle", locked: true, tag: hqTag, label: t("settings.manager_pin"), help: t("settings.manager_pin_help") }
        ] }
      ]
    });
  }

  /* ---------- Screen: Onboard a tenant (all tenants · flow) ---------- */
  function OnboardingFlow() {
    var list = function (arr) { return arr.map(function (v) { return { value: v, label: v }; }); };
    function row(d, errs, field, key, labelKey, opts) {
      opts = opts || {};
      var id = "flow-" + key;
      var control = opts.select
        ? UI.Select({ id: id, value: d[key], options: opts.select, onChange: function (v) { field(key, v); } })
        : UI.Input({ id: id, value: d[key], type: opts.type, dir: opts.dir, min: opts.min, max: opts.max, invalid: !!errs[key],
            onInput: function (v) { field(key, opts.type === "number" ? Number(v) : v); } });
      return UI.FormRow({ id: id, label: t(labelKey), required: opts.required, help: opts.help, error: errs[key], control: control });
    }
    function required(d, keys) {
      var e = {}; keys.forEach(function (k) { if (!String(d[k] == null ? "" : d[k]).trim()) e[k] = t("flow.required"); }); return e;
    }

    return FlowPage({
      stateKey: "onboarding",
      header: { breadcrumbs: [{ label: t("scope.all"), href: "#/tenants" }, { label: t("flow.title") }], title: t("flow.title"), subtitle: t("flow.subtitle") },
      cancelHref: "#/tenants",
      init: function () { return { name_en: "", name_ar: "", email: "", plan_id: "starter", currency: "SYP", time_zone: "Asia/Damascus", branch_en: "", branch_ar: "", city_en: "", city_ar: "", registers: 1 }; },
      steps: [
        { id: "business", label: t("flow.s1"),
          render: function (d, e, f) { return [
            row(d, e, f, "name_en", "flow.name_en", { required: true, dir: "ltr" }),
            row(d, e, f, "name_ar", "flow.name_ar", { required: true, dir: "rtl" }),
            row(d, e, f, "email", "flow.email", { required: true, type: "email", dir: "ltr", help: t("flow.email_help") })]; },
          validate: function (d) {
            var e = required(d, ["name_en", "name_ar", "email"]);
            if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { e.email = t("flow.error_email"); e._form = t("flow.error_email"); }
            return e;
          } },
        { id: "plan", label: t("flow.s2"),
          render: function (d, e, f) { return [
            row(d, e, f, "plan_id", "flow.plan", { select: planOptions() }),
            row(d, e, f, "currency", "flow.currency", { select: list(Store.currencies()) }),
            row(d, e, f, "time_zone", "flow.time_zone", { select: list(Store.timeZones()) })]; } },
        { id: "branch", label: t("flow.s3"),
          render: function (d, e, f) { return [
            h("div", { class: "grid-2" },
              row(d, e, f, "branch_en", "flow.branch_en", { required: true, dir: "ltr" }),
              row(d, e, f, "branch_ar", "flow.branch_ar", { required: true, dir: "rtl" }),
              row(d, e, f, "city_en", "flow.city_en", { dir: "ltr" }),
              row(d, e, f, "city_ar", "flow.city_ar", { dir: "rtl" })),
            row(d, e, f, "registers", "flow.registers", { type: "number", min: 1, max: 50, help: t("flow.registers_help") })]; },
          validate: function (d) {
            var e = required(d, ["branch_en", "branch_ar"]), plan = Store.plan(d.plan_id);
            if (!(d.registers >= 1)) e.registers = t("flow.required");
            else if (d.registers > plan.max_registers) { e.registers = t("flow.error_plan_limit", { plan: I18n.pick(plan, "name"), max: I18n.number(plan.max_registers) }); e._form = e.registers; }
            return e;
          } },
        { id: "review", label: t("flow.s4"),
          render: function (d) { return [UI.Banner({ tone: "info", body: t("flow.review_note") }), summaryList(d)]; } }
      ],
      summary: summaryList,
      finalLabel: t("flow.create"),
      finish: function (d) {
        var id = Store.slug(d.name_en), now = new Date().toISOString();
        var regs = []; for (var i = 1; i <= d.registers; i++) regs.push({ id: id + "-1-" + i, label: "Register " + i, status: "offline", last_seen_at: null });
        var tn = Store.addTenant({
          id: id, name_en: d.name_en.trim(), name_ar: d.name_ar.trim(), is_sample: false, status: "onboarding",
          plan_id: d.plan_id, currency: d.currency, time_zone: d.time_zone,
          customer_since: now.slice(0, 10), last_activity_at: now, account_owner_id: Store.me().id,
          contact: { name: "—", email: d.email.trim(), phone: "—" },
          settings: { receipt_bilingual: true, manager_pin_for_refunds: true, tax_number: "" },
          branches: [{ id: id + "-1", name_en: d.branch_en.trim(), name_ar: d.branch_ar.trim(), city_en: d.city_en.trim(), city_ar: d.city_ar.trim(), status: "active", registers: regs }],
          activity: [{ at: now, kind: "tenant_created", text_en: "Tenant created by onboarding", text_ar: "أنشأ فريق التهيئة المستأجر" }]
        });
        return function () { location.hash = "/t/" + tn.id; UI.toast(t("flow.created", { name: I18n.pick(tn, "name") })); };
      }
    });

    function summaryList(d) {
      var plan = Store.plan(d.plan_id), dash = function (v) { return v ? v : h("span", { class: "muted" }, "—"); };
      return UI.DescList([
        { label: t("flow.name_en"), value: dash(d.name_en) },
        { label: t("flow.name_ar"), value: dash(d.name_ar) },
        { label: t("flow.email"), value: d.email ? h("span", { dir: "ltr" }, d.email) : dash("") },
        { label: t("flow.plan"), value: I18n.pick(plan, "name") },
        { label: t("flow.currency"), value: d.currency },
        { label: t("flow.time_zone"), value: h("span", { dir: "ltr" }, d.time_zone) },
        { label: t("col.branch"), value: dash(I18n.lang === "ar" ? d.branch_ar : d.branch_en) },
        { label: t("col.registers"), value: I18n.number(d.registers || 0) }
      ]);
    }
  }

  /* ---------- Placeholder for the screens not built yet ---------- */
  function NotBuilt(label, body) {
    return [UI.PageHeader({ title: label }),
      UI.EmptyState({ icon: "flag", title: t("notbuilt.title"), body: body || t("notbuilt.body"),
        action: body ? null : UI.Button({ label: t("notbuilt.action"), href: "#/tenants" }) })];
  }
  function NotFound() {
    return UI.EmptyState({ icon: "search", title: t("notfound.title"), body: t("notfound.body"), action: UI.Button({ label: t("scope.back"), href: "#/tenants", icon: "arrowBack" }) });
  }

  window.Pages = { ListPage: ListPage, RecordPage: RecordPage, SettingsPage: SettingsPage, FlowPage: FlowPage,
    TenantsList: TenantsList, BranchesList: BranchesList, RegistersList: RegistersList, TenantRecord: TenantRecord,
    TenantSettings: TenantSettings, OnboardingFlow: OnboardingFlow, NotBuilt: NotBuilt, NotFound: NotFound };
})();
