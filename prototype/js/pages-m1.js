/*
 * Module 1 — Platform core screens (3 Oct). Replaces the Day 5 / Day 10 versions of:
 *   HQ · Branches and registers  → branch record (code, pause), branch server, registers (rename, retire), one invoice series per branch
 *   HQ · People and roles        → one page, two tabs: people (status, back-office access, till sign-in) and the permission matrix
 * Rules come from docs/05-architecture/module-01-platform-core.md (v2) and ADR-001 (three tiers: till → branch server → cloud).
 * Strings: i18n-m1.js. Loaded after pages-quantara.js, before app.js.
 */
(function () {
  var h = UI.h, t = function (k, v) { return I18n.t(k, v); };
  var P = Pages, X = OPS._h, ops = X.ops, req = X.req, Decision = X.Decision;
  var PANEL_ROLES = ["owner", "hq_manager", "accountant", "branch_manager"];   // rule 9
  var HQ_ROLES = ["owner", "hq_manager", "accountant"];
  var TILL_ROLES = ["branch_manager", "cashier", "barista"];
  var CODE_RE = /^[A-Z0-9]{2,4}$/;

  function me(tn) { return X.hqMeId(tn); }
  function log(tn, en, ar) { Store.log(tn, me(tn), "action", { text_en: en, text_ar: ar }); }
  function invalid(id) { var el = document.getElementById(id); if (el) { el.setAttribute("aria-invalid", "true"); el.focus(); } }
  function activeRegs(b) { return b.registers.filter(function (r) { return r.status !== "retired"; }); }
  function serverOf(b) { return b.server || (b.server = { status: "never" }); }
  function code6() { var s = "", a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; for (var i = 0; i < 8; i++) s += a.charAt(Math.floor(Math.random() * a.length)); return s.slice(0, 4) + "-" + s.slice(4); }
  function tempPin() { return String(1000 + Math.floor(Math.random() * 9000)); }

  /* =====================================================================
   * HQ · Branches and registers
   * ===================================================================== */
  function serverNote(tn, b) {
    var s = serverOf(b);
    if (s.status === "never") return h("span", { class: "sync-note" }, t("sync.never"));
    return UI.SyncNote({ kind: s.status === "online" ? "synced" : "stale", time: I18n.dateTime(s.last_sync_at, tn.time_zone) });
  }

  function Branches(tn) {
    var u = Store.usage(tn), pendingUp = Store.upgradeRequest(tn);
    var bFull = u.branches >= u.max_branches, rFull = u.registers >= u.max_registers, locked = tn.status === "suspended";

    function requestUpgrade(what) {
      UI.Dialog({ title: t("limit.dialog_title"), body: [h("p", null, t("limit.dialog_body", { plan: I18n.pick(u.plan, "name") }))],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("limit.request"), variant: "primary",
          onClick: function (close) { Store.requestUpgrade(tn, what, me(tn)); close(); App.render(); UI.toast(t("limit.sent")); } }] });
    }
    /* Add or edit a branch. The code is chosen once and locked after the first invoice (rule 4). */
    function branchDialog(b) {
      var d = b ? { en: b.name_en, ar: b.name_ar, city_en: b.city_en || "", city_ar: b.city_ar || "", code: b.code || "" } : { en: "", ar: "", city_en: "", city_ar: "", code: "" };
      var lockedCode = !!(b && b.has_invoices), err = {}, isNew = !b;
      var body = h("div", { class: "stack" });
      function draw() {
        var f = function (k, label, dir, required) { return UI.FormRow({ id: "nb-" + k, label: label, required: required, error: err[k], control: UI.Input({ id: "nb-" + k, dir: dir, value: d[k], invalid: !!err[k], onInput: function (v) { d[k] = v; } }) }); };
        body.replaceChildren(
          b ? null : h("p", null, t("hq.branches.add_body", { n: I18n.number(u.max_branches - u.branches) })),
          h("div", { class: "grid-2" }, f("en", t("flow.branch_en"), "ltr", true), f("ar", t("flow.branch_ar"), "rtl", true), f("city_en", t("flow.city_en"), "ltr"), f("city_ar", t("flow.city_ar"), "rtl")),
          lockedCode
            ? UI.FormRow({ id: "nb-code", label: t("m1.br.code"), help: t("m1.br.code_locked"), control: h("span", { class: "owned" }, h("code", { dir: "ltr", id: "nb-code" }, b.code), UI.OwnerTag({ owner: "guaranteed", here: "hq", label: t("owner.series") })) })
            : UI.FormRow({ id: "nb-code", label: t("m1.br.code"), required: true, help: t("m1.br.code_help"), error: err.code,
                control: UI.Input({ id: "nb-code", dir: "ltr", value: d.code, invalid: !!err.code, onInput: function (v) { d.code = v; } }) }),
          h("p", { class: "muted" }, t("m1.br.series") + ": ", h("code", { dir: "ltr" }, (tn.invoice_prefix || "T") + "-" + ((lockedCode ? b.code : d.code.trim().toUpperCase()) || "…") + "-000001"), " ", req("GEN-02 · FIS-03")));
      }
      draw();
      UI.Dialog({ title: t(b ? "m1.br.edit" : "hq.branches.add"), wide: true, body: body, actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t(b ? "ops.save" : "hq.branches.add"), variant: "primary", onClick: function (close) {
        err = {}; var code = d.code.trim().toUpperCase();
        if (!d.en.trim()) err.en = t("ops.required"); if (!d.ar.trim()) err.ar = t("ops.required");
        if (!lockedCode) {
          if (!CODE_RE.test(code)) err.code = t("m1.br.code_bad");
          else if (tn.branches.some(function (x) { return x !== b && x.code === code; })) err.code = t("m1.br.code_taken");
        }
        if (Object.keys(err).length) { draw(); return; }
        if (b) { Object.assign(b, { name_en: d.en.trim(), name_ar: d.ar.trim(), city_en: d.city_en.trim(), city_ar: d.city_ar.trim() }); if (!lockedCode) b.code = code; log(tn, "Edited branch " + b.name_en, "عدّل الفرع " + b.name_ar); }
        else { b = { id: tn.id + "-b" + (tn.branches.length + 1), code: code, name_en: d.en.trim(), name_ar: d.ar.trim(), city_en: d.city_en.trim(), city_ar: d.city_ar.trim(), status: "active", has_invoices: false, server: { status: "never" }, registers: [] };
          tn.branches.push(b); var o = ops(tn); if (o && o.stock) { o.stock[b.id] = {}; Store.hq(tn).items.forEach(function (it) { o.stock[b.id][it.id] = { qty: 0, counted_at: Store.now() }; }); }
          log(tn, "Added branch " + b.name_en + " (" + code + ")", "أضاف الفرع " + b.name_ar); }
        close(); App.render(); UI.toast(t(isNew ? "hq.branches.added" : "m1.br.saved"));
      } }] });
    }
    function pauseBranch(b) {
      if (b.status === "paused") { b.status = "active"; log(tn, "Resumed branch " + b.name_en, "استأنف الفرع " + b.name_ar); App.render(); UI.toast(t("m1.br.resumed")); return; }
      UI.Dialog({ title: t("m1.br.pause_title", { name: I18n.pick(b, "name") }), body: [h("p", null, t("m1.br.pause_body"))],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("m1.br.pause"), variant: "primary", onClick: function (close) {
          b.status = "paused"; log(tn, "Paused branch " + b.name_en, "أوقف الفرع " + b.name_ar + " مؤقتًا"); close(); App.render(); UI.toast(t("m1.br.paused")); } }] });
    }
    function enrol(b) {
      var s = serverOf(b), token = code6();
      s.enrol_token = token; s.enrol_created_at = Store.now();
      log(tn, "Created a branch-server setup code for " + b.name_en, "أنشأ رمز تجهيز خادم الفرع لـ " + b.name_ar);
      UI.Dialog({ title: t("m1.srv.enrol_title", { name: I18n.pick(b, "name") }), body: [
        h("p", null, t("m1.srv.enrol_body")), h("p", { class: "code-big", dir: "ltr", id: "enrol-code" }, token),
        s.status !== "never" ? UI.Banner({ tone: "warning", body: t("m1.srv.replace_body") }) : null],
        actions: [{ label: t("dialog.close"), variant: "primary" }] });
    }
    function addRegister(b) {
      var n = b.registers.reduce(function (m, r) { return Math.max(m, r.n || 0); }, 0) + 1, d = { label: "Register " + n };
      UI.Dialog({ title: t("hq.registers.add") + " · " + I18n.pick(b, "name"), body: [h("p", null, t("hq.registers.add_body")),
          UI.FormRow({ id: "nr-l", label: t("m1.till.label"), required: true, control: UI.Input({ id: "nr-l", dir: "ltr", value: d.label, onInput: function (v) { d.label = v; } }) })],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("hq.registers.add"), variant: "primary", onClick: function (close) {
          if (!d.label.trim()) { invalid("nr-l"); return; }
          b.registers.push({ id: b.id + "-" + n, n: n, label: d.label.trim(), status: "offline", last_seen_at: null });
          log(tn, "Added " + d.label.trim() + " at " + b.name_en, "أضاف " + d.label.trim() + " في " + b.name_ar);
          close(); App.render(); UI.toast(t("hq.registers.added", { series: Store.invoiceSeries(tn, b) })); } }] });
    }
    function renameRegister(b, r) {
      var d = { label: r.label };
      UI.Dialog({ title: t("m1.till.rename") + " · " + r.label, body: [UI.FormRow({ id: "rr-l", label: t("m1.till.label"), required: true, control: UI.Input({ id: "rr-l", dir: "ltr", value: d.label, onInput: function (v) { d.label = v; } }) })],
        actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
          if (!d.label.trim()) { invalid("rr-l"); return; }
          log(tn, "Renamed " + r.label + " to " + d.label.trim(), "أعاد تسمية " + r.label + " إلى " + d.label.trim()); r.label = d.label.trim(); close(); App.render(); UI.toast(t("m1.till.renamed")); } }] });
    }
    function retireRegister(b, r) {
      var open = Store.hq(tn).shifts.some(function (s) { return s.register_id === r.id && s.status === "open"; });
      UI.Dialog({ title: t("m1.till.retire_title", { label: r.label }), body: [h("p", null, t("m1.till.retire_body")), open ? UI.Banner({ tone: "critical", body: t("m1.till.open_shift") }) : null],
        actions: open ? [{ label: t("dialog.close"), variant: "primary" }] : [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("m1.till.retire"), variant: "primary", onClick: function (close) {
          r.status = "retired"; r.retired_at = Store.now(); log(tn, "Retired " + r.label + " at " + b.name_en, "أخرج " + r.label + " من الخدمة في " + b.name_ar); close(); App.render(); UI.toast(t("m1.till.retired")); } }] });
    }

    function branchCard(b) {
      var s = serverOf(b), series = Store.invoiceSeries(tn, b);
      var server = s.status === "never"
        ? h("div", { class: "m1-col" }, h("p", { class: "muted" }, t("m1.srv.never")), h("div", null, UI.Button({ label: t("m1.srv.enrol"), size: "sm", onClick: function () { enrol(b); }, disabled: locked })))
        : h("div", { class: "m1-col" },
            UI.DescList([
              { label: t("m1.srv.status"), value: h("span", { class: "owned" }, UI.StatusBadge(s.status), serverNote(tn, b)) },
              { label: t("m1.srv.waiting"), value: s.events_waiting ? t("m1.srv.waiting_n", { n: I18n.number(s.events_waiting) }) : t("m1.srv.waiting_0") },
              { label: t("m1.srv.version"), value: h("span", { dir: "ltr" }, s.app_version || "—") }]),
            s.status === "offline" ? UI.Banner({ tone: "warning", body: t("m1.srv.offline_note", { time: I18n.dateTime(s.last_sync_at, tn.time_zone) }) }) : null,
            h("div", null, UI.Button({ label: t("m1.srv.enrol_again"), size: "sm", variant: "ghost", onClick: function () { enrol(b); }, disabled: locked })));
      var regs = b.registers.length ? X.simpleTable(t("col.registers") + " · " + I18n.pick(b, "name"), [
        { key: "l", label: t("col.register"), render: function (r) { return h("span", { dir: "ltr" }, r.label); } },
        { key: "s", label: t("col.status"), render: function (r) { return UI.StatusBadge(r.status); } },
        { key: "seen", label: t("m1.till.seen"), render: function (r) { return r.last_seen_at ? I18n.dateTime(r.last_seen_at, tn.time_zone) : h("span", { class: "muted" }, t("sync.never")); } },
        { key: "a", label: "", render: function (r) { return r.status === "retired" ? null : h("span", { class: "row-actions" },
            UI.Button({ label: t("m1.till.rename"), size: "sm", variant: "ghost", onClick: function () { renameRegister(b, r); }, disabled: locked }),
            UI.Button({ label: t("m1.till.retire"), size: "sm", variant: "ghost", onClick: function () { retireRegister(b, r); }, disabled: locked })); } }
      ], b.registers) : h("p", { class: "muted" }, t("m1.till.none"));
      return h("div", { class: "m1-branch", id: "branch-" + b.id }, UI.Section({
        title: h("span", { class: "owned" }, I18n.pick(b, "name"), h("code", { dir: "ltr" }, b.code || "—"), UI.StatusBadge(b.status)),
        actions: h("span", { class: "row-actions wrap" },
          UI.Button({ label: t("m1.br.open"), size: "sm", variant: "ghost", onClick: function () { location.hash = "/hq/" + tn.id + "/b/" + b.id; } }),
          UI.Button({ label: t("m1.br.edit"), size: "sm", onClick: function () { branchDialog(b); }, disabled: locked }),
          UI.Button({ label: t(b.status === "paused" ? "m1.br.resume" : "m1.br.pause"), size: "sm", onClick: function () { pauseBranch(b); }, disabled: locked })),
        body: [
          b.status === "paused" ? UI.Banner({ tone: "warning", body: t("m1.br.paused_note") }) : null,
          h("div", { class: "grid-2" },
            h("div", { class: "m1-col" },
              UI.DescList([
                { label: t("flow.city_en").replace(/ \(.*/, ""), value: I18n.pick(b, "city") || "—" },
                { label: t("m1.br.code"), value: h("span", { class: "owned" }, h("code", { dir: "ltr" }, b.code || "—"), b.has_invoices ? h("span", { class: "muted" }, t("m1.br.code_locked")) : null) },
                { label: t("m1.br.series"), value: h("span", { class: "owned" }, h("code", { dir: "ltr" }, series + "-000001 …"), UI.OwnerTag({ owner: "guaranteed", here: "hq", label: t("owner.series") })) }]),
              h("p", { class: "muted" }, t("m1.br.series_next"), " ", req("FIS-03"))),
            h("div", { class: "m1-col" }, h("h3", { class: "m1-sub" }, t("m1.srv.title"), " ", req("OFF-05 · OFF-07")), h("p", { class: "muted" }, t("m1.srv.help")), server)),
          h("div", { class: "m1-regs" },
            h("div", { class: "m1-regs__head" }, h("h3", { class: "m1-sub" }, t("col.registers") + " (" + I18n.number(activeRegs(b).length) + ")"),
              UI.Button({ label: t("hq.registers.add"), icon: "plus", size: "sm", onClick: function () { addRegister(b); }, disabled: rFull || locked || b.status === "paused" })),
            regs)] }));
    }

    var before = [];
    if (tn.placeholder_fields) before.push(UI.Banner({ tone: "warning", body: t("placeholder.hq") }));
    before.push(UI.Section({ title: t("hq.plan_usage", { plan: I18n.pick(u.plan, "name") }), actions: UI.OwnerTag({ owner: "quantara", here: "hq", label: t("owner.limits") }), body: [
      h("div", { class: "grid-2" },
        UI.Meter({ id: "hb-b", label: t("col.branches"), value: u.branches, max: u.max_branches }),
        UI.Meter({ id: "hb-r", label: t("col.registers"), value: u.registers, max: u.max_registers }))] }));
    if (bFull || rFull) before.push(UI.LimitBanner({ what: t(bFull ? "limit.what_branches" : "limit.what_registers"), plan: I18n.pick(u.plan, "name"), pending: pendingUp,
      onRequest: function () { requestUpgrade(bFull ? "branches" : "registers"); } }));

    return [
      UI.PageHeader({ breadcrumbs: X.hqCrumbs(tn, t("nav.hq_branches")), title: t("nav.hq_branches"), subtitle: t("hq.branches.subtitle"),
        actions: [UI.Button({ label: t("hq.branches.add"), icon: "plus", variant: "primary", onClick: function () { branchDialog(null); }, disabled: bFull || locked })] }),
      h("div", { class: "stack" }, before, tn.branches.length ? tn.branches.map(branchCard)
        : UI.EmptyState({ title: t("branches.empty_title"), body: t("hq.branches.empty_body") }))
    ];
  }

  /* =====================================================================
   * HQ · People and roles — one page, two tabs
   * ===================================================================== */
  function extra(tn, u) { var o = ops(tn); if (!o) return { login: u.sign_in || "pin", card_id: u.card || "", branches: u.branch_id ? [u.branch_id] : [] };
    if (!o.staff_extra[u.id]) o.staff_extra[u.id] = { login: u.sign_in || "pin", card_id: u.card || "", branches: u.branch_id ? [u.branch_id] : [], meals_today: 0 }; return o.staff_extra[u.id]; }
  function contactOf(u) { return u.email || u.phone || ""; }
  function validContact(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[0-9x ]{8,}$/i.test(v); }

  function showPin(tn, u, after) {
    var pin = tempPin(); u.pin_must_change = true;
    UI.Dialog({ title: t("m1.pp.pin_title", { name: I18n.pick(u, "name") }), body: [h("p", null, t("m1.pp.pin_body")), h("p", { class: "code-big", dir: "ltr", id: "temp-pin" }, pin)],
      actions: [{ label: t("dialog.close"), variant: "primary", onClick: function (close) { close(); App.render(); if (after) after(); } }] });
  }

  function personDialog(tn, u) {
    var o = ops(tn), hq = Store.hq(tn), ex = u ? extra(tn, u) : null;
    var d = u ? { en: u.name_en, ar: u.name_ar, role: u.role, branches: ex.branches.slice(), login: ex.login || "pin", card: ex.card_id || "", panel: !!u.panel, contact: contactOf(u) }
      : { en: "", ar: "", role: "cashier", branches: tn.branches.length ? [tn.branches[0].id] : [], login: "pin", card: "", panel: false, contact: "" };
    var err = {}, body = h("div", { class: "stack" }), isOwner = u && u.role === "owner";
    function draw() {
      var hqRole = HQ_ROLES.indexOf(d.role) > -1, canPanel = PANEL_ROLES.indexOf(d.role) > -1, canTill = TILL_ROLES.indexOf(d.role) > -1;
      if (!canPanel) d.panel = false; if (hqRole) d.panel = true;
      body.replaceChildren(
        h("fieldset", { class: "fieldset" }, h("legend", null, t("m1.pp.g_who")),
          h("div", { class: "grid-2" },
            UI.FormRow({ id: "pp-en", label: t("ops.menu.name_en"), required: true, error: err.en, control: UI.Input({ id: "pp-en", dir: "ltr", value: d.en, invalid: !!err.en, onInput: function (v) { d.en = v; } }) }),
            UI.FormRow({ id: "pp-ar", label: t("ops.menu.name_ar"), required: true, error: err.ar, control: UI.Input({ id: "pp-ar", dir: "rtl", value: d.ar, invalid: !!err.ar, onInput: function (v) { d.ar = v; } }) })),
          isOwner ? UI.FormRow({ id: "pp-r", label: t("col.role"), help: t("m1.pp.owner_keep"), control: h("strong", { id: "pp-r" }, t("role.owner")) })
            : UI.FormRow({ id: "pp-r", label: t("col.role"), control: UI.Select({ id: "pp-r", value: d.role, options: Object.keys(o.roles).filter(function (r) { return r !== "owner"; }).map(function (r) { return { value: r, label: t("role." + r) }; }), onChange: function (v) { d.role = v; draw(); } }) }),
          hqRole ? null : h("fieldset", { class: "fieldset" }, h("legend", null, t("ops.roles.branches") + " ", req("USR-06")), h("div", { class: "checks" }, tn.branches.map(function (b) {
            return UI.Checkbox({ id: "pp-b-" + b.id, label: I18n.pick(b, "name"), checked: d.branches.indexOf(b.id) > -1, onChange: function (v) { d.branches = d.branches.filter(function (x) { return x !== b.id; }); if (v) d.branches.push(b.id); } });
          })), err.branches ? h("p", { class: "field-error", role: "alert" }, err.branches) : null)),
        h("fieldset", { class: "fieldset" }, h("legend", null, t("m1.pp.g_panel")),
          !canPanel ? h("p", { class: "muted" }, t("m1.pp.panel_not_role"))
            : [hqRole ? null : UI.Checkbox({ id: "pp-panel", label: t("m1.pp.panel_on"), checked: d.panel, onChange: function (v) { d.panel = v; draw(); } }),
               d.panel ? UI.FormRow({ id: "pp-contact", label: t("m1.pp.contact"), required: true, help: t("m1.pp.panel_help"), error: err.contact, control: UI.Input({ id: "pp-contact", dir: "ltr", value: d.contact, invalid: !!err.contact, onInput: function (v) { d.contact = v; } }) }) : null]),
        h("fieldset", { class: "fieldset" }, h("legend", null, t("m1.pp.g_till") + " ", req("USR-03")),
          !canTill ? h("p", { class: "muted" }, t("m1.pp.no_till"))
            : h("div", { class: "grid-2" },
                UI.FormRow({ id: "pp-l", label: t("ops.roles.login"), control: UI.Select({ id: "pp-l", value: d.login, options: ["pin", "card", "card_or_pin"].map(function (x) { return { value: x, label: t("ops.till.login." + x) }; }), onChange: function (v) { d.login = v; draw(); } }) }),
                d.login === "pin" ? h("div") : UI.FormRow({ id: "pp-c", label: t("ops.roles.card"), required: true, help: t("ops.roles.card_help"), error: err.card, control: UI.Input({ id: "pp-c", dir: "ltr", value: d.card, invalid: !!err.card, onInput: function (v) { d.card = v; } }) }))),
        u ? h("div", { class: "row-actions wrap m1-person-actions" },
          TILL_ROLES.indexOf(u.role) > -1 && u.status !== "disabled" ? UI.Button({ label: t("m1.pp.reset_pin"), size: "sm", onClick: function () { dlg.close(); log(tn, "Reset the PIN of " + u.name_en, "أعاد ضبط رمز " + u.name_ar); showPin(tn, u); } }) : null,
          u.status === "invited" ? UI.Button({ label: t("m1.pp.resend"), size: "sm", onClick: function () { UI.toast(t("m1.pp.invite_sent", { to: contactOf(u) })); } }) : null,
          isOwner ? null : UI.Button({ label: t(u.status === "disabled" ? "m1.pp.enable" : "m1.pp.disable"), size: "sm", onClick: function () { dlg.close(); toggleDisabled(tn, u); } })) : null);
    }
    draw();
    var dlg = UI.Dialog({ title: u ? t("m1.pp.edit_title", { name: I18n.pick(u, "name") }) : t("ops.roles.add_person"), wide: true, body: body, actions: [{ label: t("flow.cancel"), variant: "ghost" }, { label: t("ops.save"), variant: "primary", onClick: function (close) {
      var hqRole = HQ_ROLES.indexOf(d.role) > -1, canTill = TILL_ROLES.indexOf(d.role) > -1, contact = d.contact.trim(), card = d.card.trim();
      err = {};
      if (!d.en.trim()) err.en = t("ops.required"); if (!d.ar.trim()) err.ar = t("ops.required");
      if (!hqRole && !d.branches.length) err.branches = t("m1.pp.pick_branch");
      if (d.panel) { if (!validContact(contact)) err.contact = t("m1.pp.contact_bad");
        else if (hq.users.some(function (x) { return x !== u && contactOf(x) && contactOf(x).toLowerCase() === contact.toLowerCase(); })) err.contact = t("m1.pp.contact_taken"); }
      if (canTill && d.login !== "pin" && !/^[0-9]{8}$/.test(card)) err.card = t("m1.pp.card_bad");
      if (Object.keys(err).length) { draw(); return; }
      var isNew = !u, invite = d.panel && (isNew || !u.panel || contactOf(u) !== contact);
      if (isNew) { u = { id: "u-" + Date.now(), status: d.panel ? "invited" : "active" }; hq.users.push(u); }
      Object.assign(u, { name_en: d.en.trim(), name_ar: d.ar.trim(), role: d.role, branch_id: hqRole ? null : d.branches[0], panel: d.panel, sign_in: canTill ? d.login : null, card: canTill && d.login !== "pin" ? card : "" });
      delete u.email; delete u.phone; if (d.panel) u[contact.indexOf("@") > -1 ? "email" : "phone"] = contact;
      if (invite && u.status !== "disabled") u.status = "invited";
      o.staff_extra[u.id] = Object.assign(o.staff_extra[u.id] || { meals_today: 0 }, { login: canTill ? d.login : "pin", card_id: u.card, branches: hqRole ? [] : d.branches.slice() });
      log(tn, (isNew ? "Added " : "Edited ") + u.name_en + " (" + d.role + ")", (isNew ? "أضاف " : "عدّل ") + u.name_ar);
      close(); App.render();
      var done = function () { UI.toast(invite ? t("m1.pp.invite_sent", { to: contact }) : t("m1.pp.saved")); };
      if (isNew && canTill) showPin(tn, u, done); else done();
    } }] });
  }
  function toggleDisabled(tn, u) {
    if (u.status === "disabled") { u.status = "active"; log(tn, "Enabled " + u.name_en, "فعّل " + u.name_ar); App.render(); UI.toast(t("m1.pp.enabled")); return; }
    UI.Dialog({ title: t("m1.pp.disable_title", { name: I18n.pick(u, "name") }), body: [h("p", null, t("m1.pp.disable_body"))],
      actions: [{ label: t("dialog.cancel"), variant: "ghost" }, { label: t("m1.pp.disable"), variant: "primary", onClick: function (close) {
        u.status = "disabled"; log(tn, "Disabled " + u.name_en, "عطّل " + u.name_ar); close(); App.render(); UI.toast(t("m1.pp.disabled")); } }] });
  }

  function PeopleRoles(tn, startTab) {
    var o = ops(tn), label = t("nav.hq_people");
    if (!o) return X.noData(tn, label);
    var hq = Store.hq(tn), st = X.state("m1-people:" + tn.id, { tab: "people", status: "", draft: JSON.parse(JSON.stringify(o.roles)) });
    if (startTab && st._from !== location.hash) { st.tab = startTab; st._from = location.hash; }
    var roles = Object.keys(o.roles), dirty = JSON.stringify(st.draft) !== JSON.stringify(o.roles), locked = tn.status === "suspended";
    var order = ["owner", "hq_manager", "accountant", "branch_manager", "cashier", "barista"];

    function peopleTab() {
      var rows = hq.users.filter(function (u) { return !st.status || (u.status || "active") === st.status; }).slice().sort(function (a, b) { return order.indexOf(a.role) - order.indexOf(b.role); });
      return h("div", { class: "stack" },
        UI.Banner({ tone: "info", body: [t("m1.pp.sync_note"), " ", h("span", { class: "muted" }, tn.branches.map(function (b) {
          var s = serverOf(b); return t("m1.pp.sync_branch", { branch: I18n.pick(b, "name"), note: s.status === "never" ? t("sync.never") : t(s.status === "online" ? "sync.synced" : "sync.stale", { time: I18n.dateTime(s.last_sync_at, tn.time_zone) }) }); }).join(" · "))] }),
        h("div", { class: "m1-filter" }, h("label", { for: "pp-status" }, t("filter.status")),
          UI.Select({ id: "pp-status", value: st.status, options: [{ value: "", label: t("filter.any") }].concat(["active", "invited", "disabled"].map(function (s) { return { value: s, label: t("status." + s) }; })), onChange: function (v) { st.status = v; App.render(); } })),
        X.simpleTable(t("m1.pp.tab_people"), [
          { key: "n", label: t("col.person"), render: function (u) { return h("span", null, I18n.pick(u, "name"), h("span", { class: "cell-sub" }, I18n.pickOther(u, "name"))); } },
          { key: "r", label: t("col.role"), render: function (u) { return t("role." + u.role); } },
          { key: "b", label: t("ops.roles.branches"), render: function (u) { var ex = extra(tn, u); return ex.branches.length ? ex.branches.map(function (id) { return X.branchName(tn, id); }).join(", ") : t("layer.hq"); } },
          { key: "s", label: t("col.status"), render: function (u) { return UI.StatusBadge(u.status || "active"); } },
          { key: "p", label: t("m1.pp.panel"), render: function (u) { return u.panel ? h("span", null, h("span", { dir: "ltr" }, contactOf(u) || "—"), u.status === "invited" ? h("span", { class: "cell-sub" }, t("m1.pp.invite_pending")) : null) : h("span", { class: "muted" }, t("m1.pp.none")); } },
          { key: "l", label: t("m1.pp.till"), render: function (u) { if (TILL_ROLES.indexOf(u.role) < 0) return h("span", { class: "muted" }, "—"); var ex = extra(tn, u);
              return h("span", null, t("ops.till.login." + (ex.login || "pin")), ex.card_id ? h("span", { dir: "ltr" }, " · " + ex.card_id) : null, u.pin_must_change ? h("span", { class: "cell-sub" }, t("m1.pp.must_change")) : null); } },
          { key: "e", label: "", render: function (u) { return UI.Button({ label: t("m1.pp.edit"), size: "sm", variant: "ghost", onClick: function () { personDialog(tn, u); }, disabled: locked }); } }
        ], rows),
        h("p", { class: "muted" }, t("ops.roles.multi_note"), " ", Decision("D-15"), " ", req("USR-03 · USR-06")));
    }
    function rolesTab() {
      var groups = ["till", "cash", "branch", "stock", "hq"];
      return h("div", { class: "stack" }, UI.Banner({ tone: "info", body: t("ops.roles.note") }),
        h("p", { class: "muted" }, UI.SyncNote({ kind: "changed", who: X.who(tn, o.roles_updated_by), time: I18n.dateTime(o.roles_updated_at, tn.time_zone) }), " ", req("USR-01 · USR-02 · USR-04 · USR-05")),
        h("div", { class: "table-wrap" }, h("table", { class: "table matrix" },
          h("caption", { class: "sr-only" }, t("m1.pp.tab_roles")),
          h("thead", null, h("tr", null, h("th", { scope: "col" }, t("ops.roles.action")), roles.map(function (r) { return h("th", { scope: "col", class: "matrix__role" }, t("role." + r)); }))),
          groups.map(function (g) {
            return h("tbody", null, h("tr", { class: "matrix__group" }, h("th", { colspan: String(roles.length + 1), scope: "rowgroup" }, t("ops.roles.g." + g))),
              o.actions.filter(function (a) { return a.group === g; }).map(function (a) {
                return h("tr", null, h("th", { scope: "row" }, t("ops.act." + a.id), a.decision ? h("span", null, " ", Decision(a.decision)) : null),
                  roles.map(function (r) { var id = "perm-" + r + "-" + a.id;
                    return h("td", { class: "matrix__cell" }, h("input", { type: "checkbox", id: id, "aria-label": t("role." + r) + " · " + t("ops.act." + a.id), checked: !!st.draft[r][a.id], disabled: r === "owner" && a.id === "manage_people",
                      onChange: function (e) { st.draft[r][a.id] = e.target.checked ? 1 : 0; App.render(); } })); }));
              }));
          }))));
    }
    return [
      UI.PageHeader({ breadcrumbs: X.hqCrumbs(tn, label), title: label, subtitle: t("m1.pp.subtitle"), badges: UI.OwnerTag({ owner: "hq", here: "hq" }),
        actions: [UI.Button({ label: t("ops.roles.add_person"), icon: "plus", variant: "primary", onClick: function () { personDialog(tn, null); }, disabled: locked })] }),
      h("div", { class: "stack" }, X.banners(tn),
        UI.Tabs({ id: "m1-people", active: st.tab, onChange: function (id) { st.tab = id; }, tabs: [
          { id: "people", label: t("m1.pp.tab_people"), count: hq.users.length, render: peopleTab },
          { id: "roles", label: t("m1.pp.tab_roles"), render: rolesTab }] })),
      h("div", { class: "savebar", hidden: dirty ? null : true, role: "region", "aria-label": t("settings.unsaved") },
        h("span", { class: "savebar__text" }, UI.icon("info"), t("settings.unsaved")),
        UI.Button({ label: t("settings.discard"), variant: "ghost", onClick: function () { st.draft = JSON.parse(JSON.stringify(o.roles)); App.render(); } }),
        UI.Button({ label: t("settings.save"), variant: "primary", onClick: function () { o.roles = JSON.parse(JSON.stringify(st.draft)); o.roles_updated_by = me(tn); o.roles_updated_at = Store.now();
          log(tn, "Changed the permissions matrix", "عدّل مصفوفة الصلاحيات"); App.render(); UI.toast(t("settings.saved")); } }))
    ];
  }

  HQ.Branches = Branches;
  HQ.People = function (tn) { return PeopleRoles(tn, "people"); };
  OPS.Roles = function (tn) { return PeopleRoles(tn, "roles"); };
  window.M1 = { PANEL_ROLES: PANEL_ROLES, TILL_ROLES: TILL_ROLES, CODE_RE: CODE_RE };
})();
