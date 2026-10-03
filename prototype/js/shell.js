/*
 * The shell: sidebar · top bar · scope switch · language toggle · scope bar.
 * Identical on every page. A page only supplies its content; the route
 * supplies the scope, and the shell is what makes the scope unmistakable.
 *
 * Four scopes on three layers:
 *   layer quantara → scope "all" (every tenant) and "tenant" (one tenant, our staff looking in)
 *   layer hq       → scope "hq"     the café's head office          (navy)
 *   layer branch   → scope "branch" one branch of that café          (plum)
 * Each layer has its own colour, sidebar block, scope bar, signed-in person
 * and product name, and the layer trail in the top bar names all three with
 * the current one filled — so you can never be unsure which side you are on.
 */
(function () {
  var h = UI.h, icon = UI.icon, t = function (k, v) { return I18n.t(k, v); };

  var LAYER = { all: "quantara", tenant: "quantara", hq: "hq", branch: "branch" };

  var NAV = {
    all: [
      { group: "nav.group.tenants", items: [
        { id: "tenants",    icon: "list",  href: "#/tenants" },
        { id: "onboarding", icon: "flag",  href: "#/onboarding" }
      ] },
      { group: "nav.group.service", items: [
        { id: "support",           icon: "life",  href: "#/support" },
        { id: "operations",        icon: "pulse", href: "#/operations" },
        { id: "billing",           icon: "card",  href: "#/billing" },
        { id: "platform_settings", icon: "gear",  href: "#/settings" }
      ] }
    ],
    tenant: [
      { group: "nav.group.tenant", items: [
        { id: "overview",       icon: "home",     href: "" },
        { id: "branches",       icon: "pin",      href: "/branches" },
        { id: "registers",      icon: "register", href: "/registers" },
        { id: "people",         icon: "users",    href: "/people" },
        { id: "subscription",   icon: "card",     href: "/subscription" },
        { id: "tenant_support", icon: "ticket",   href: "/support" },
        { id: "settings",       icon: "gear",     href: "/settings" }
      ] }
    ],
    hq: [
      { group: "nav.group.hq_day", items: [
        { id: "hq_home",      icon: "home",  href: "" }
      ] },
      { group: "nav.group.hq_sell", items: [
        { id: "hq_catalogue", icon: "tag",     href: "/catalogue" },
        { id: "hq_menu",      icon: "layers",  href: "/menu" },
        { id: "hq_prices",    icon: "percent", href: "/prices" },
        { id: "hq_promotions",icon: "ticket",  href: "/promotions" },
        { id: "hq_exchange",  icon: "coin",    href: "/exchange-rate" },
        { id: "hq_inventory", icon: "box",     href: "/inventory" }
      ] },
      { group: "nav.group.hq_business", items: [
        { id: "hq_branches",  icon: "pin",   href: "/branches" },
        { id: "hq_people",    icon: "users", href: "/people" },
        { id: "hq_reports",   icon: "chart", href: "/reports" },
        { id: "hq_payments",  icon: "coin",  href: "/payments" },
        { id: "hq_till",      icon: "cash",  href: "/till" },
        { id: "hq_devices",   icon: "register", href: "/devices" },
        { id: "hq_settings",  icon: "gear",  href: "/settings" }
      ] },
      { group: "nav.group.hq_account", items: [
        { id: "hq_subscription", icon: "puzzle", href: "/subscription" },
        { id: "hq_support",      icon: "shield", href: "/support-access", count: function (tn) { return Store.supportPending(tn).length; } }
      ] }
    ],
    branch: [
      { group: "nav.group.branch", items: [
        { id: "br_today",     icon: "home",    href: "" },
        { id: "br_items",     icon: "tag",     href: "/items" },
        { id: "br_discounts", icon: "percent", href: "/discounts" },
        { id: "br_cash",      icon: "cash",    href: "/cash" },
        { id: "br_shifts",    icon: "clock",   href: "/shifts" },
        { id: "br_stock",     icon: "box",     href: "/stock" },
        { id: "br_reports",   icon: "chart",   href: "/reports" }
      ] }
    ]
  };

  function initials(name) {
    return name.replace(/\(.*?\)|\[|\]/g, "").trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }
  function Avatar(tn, size) {
    return h("span", { class: "avatar" + (size ? " avatar--" + size : "") + (tn.is_sample ? " avatar--sample" : ""), "aria-hidden": "true" }, initials(tn.name_en));
  }
  function base(route) {
    if (route.scope === "tenant") return "#/t/" + route.tenant.id;
    if (route.scope === "hq") return "#/hq/" + route.tenant.id;
    if (route.scope === "branch") return "#/hq/" + route.tenant.id + "/b/" + route.branch.id;
    return "";
  }

  /* ---------- Sidebar ---------- */
  function ScopeBlock(route) {
    var tn = route.tenant;
    if (route.scope === "tenant") return h("div", { class: "side-scope side-scope--tenant" },
      h("a", { class: "side-scope__back", href: "#/tenants" }, icon("arrowBack"), h("span", null, t("scope.back"))),
      h("div", { class: "side-scope__id" }, Avatar(tn),
        h("div", { class: "side-scope__text" },
          h("span", { class: "side-scope__kicker" }, t("scope.tenant")),
          h("span", { class: "side-scope__name" }, I18n.pick(tn, "name")))));
    if (route.scope === "hq") return h("div", { class: "side-scope side-scope--hq" },
      h("div", { class: "side-scope__id" }, h("span", { class: "avatar avatar--hq", "aria-hidden": "true" }, icon("building")),
        h("div", { class: "side-scope__text" },
          h("span", { class: "side-scope__kicker" }, t("layer.hq")),
          h("span", { class: "side-scope__name" }, I18n.pick(tn, "name")))));
    if (route.scope === "branch") return h("div", { class: "side-scope side-scope--branch" },
      h("div", { class: "side-scope__id" }, h("span", { class: "avatar avatar--branch", "aria-hidden": "true" }, icon("pin")),
        h("div", { class: "side-scope__text" },
          h("span", { class: "side-scope__kicker" }, t("layer.branch")),
          h("span", { class: "side-scope__name" }, I18n.pick(route.branch, "name")),
          h("span", { class: "side-scope__sub" }, I18n.pick(tn, "name")))));
    return h("div", { class: "side-scope side-scope--all" },
      h("div", { class: "side-scope__id" }, h("span", { class: "avatar avatar--all", "aria-hidden": "true" }, icon("globe")),
        h("div", { class: "side-scope__text" },
          h("span", { class: "side-scope__kicker" }, t("app.console")),
          h("span", { class: "side-scope__name" }, t("scope.all")))));
  }

  function Sidebar(route) {
    var b = base(route), layer = LAYER[route.scope];
    var nav = h("nav", { class: "side-nav", "aria-label": t("main_nav") }, NAV[route.scope].map(function (g) {
      return h("div", { class: "side-nav__group" },
        h("h2", { class: "side-nav__label" }, t(g.group)),
        h("ul", null, g.items.map(function (it) {
          var current = route.nav === it.id, n = it.count ? it.count(route.tenant) : 0;
          return h("li", null, h("a", { class: "side-nav__item" + (current ? " is-current" : ""), href: (b || "") + it.href,
            "aria-current": current ? "page" : null }, icon(it.icon), h("span", null, t("nav." + it.id)),
            n ? h("span", { class: "side-nav__count", "aria-label": t("nav.count_pending", { n: n }) }, I18n.number(n)) : null));
        })));
    }));
    return h("aside", { class: "sidebar" },
      h("div", { class: "brand" }, h("span", { class: "brand__mark", "aria-hidden": "true" }, "Q"),
        h("span", { class: "brand__text" }, h("span", { class: "brand__name" }, t("app.name")), h("span", { class: "brand__product" }, t("product." + layer)))),
      ScopeBlock(route), nav, ViewAs(route));
  }

  /* ---------- Scope pickers ---------- */
  function openQuantaraPicker() {
    var query = "";
    var list = h("ul", { class: "picker" });
    function draw() {
      var q = query.trim().toLowerCase();
      var items = Store.tenants().filter(function (tn) {
        return !q || (tn.name_en + " " + tn.name_ar).toLowerCase().indexOf(q) > -1;
      });
      list.replaceChildren(
        h("li", null, h("a", { class: "picker__item", href: "#/tenants", onClick: function () { dlg.close(); } },
          h("span", { class: "avatar avatar--all", "aria-hidden": "true" }, icon("globe")),
          h("span", { class: "picker__name" }, t("scope.pick_all")))),
        items.map(function (tn) {
          return h("li", null, h("a", { class: "picker__item", href: "#/t/" + tn.id, onClick: function () { dlg.close(); } },
            Avatar(tn),
            h("span", { class: "picker__name" }, I18n.pick(tn, "name"), h("small", null, I18n.pickOther(tn, "name"))),
            tn.is_sample ? UI.SampleBadge() : null, UI.StatusBadge(tn.status)));
        }));
    }
    var search = UI.Input({ id: "scope-search", placeholder: t("scope.pick_search"), onInput: function (v) { query = v; draw(); } });
    draw();
    var dlg = UI.Dialog({ title: t("scope.pick_title"), body: [UI.FormRow({ id: "scope-search", label: t("scope.pick_search"), control: search }), list] });
    search.focus();
  }

  /** Inside a tenant: HQ, or one of its branches. Never another tenant — that is not the tenant's to see. */
  function openTenantPicker(route) {
    var tn = route.tenant, dlg;
    var close = function () { dlg.close(); };
    var list = h("ul", { class: "picker" },
      h("li", null, h("a", { class: "picker__item", href: "#/hq/" + tn.id, onClick: close, "aria-current": route.scope === "hq" ? "true" : null },
        h("span", { class: "avatar avatar--hq", "aria-hidden": "true" }, icon("building")),
        h("span", { class: "picker__name" }, t("layer.hq"), h("small", null, t("scope.hq_all_branches"))))),
      tn.branches.map(function (b) {
        var cur = route.branch && route.branch.id === b.id;
        return h("li", null, h("a", { class: "picker__item", href: "#/hq/" + tn.id + "/b/" + b.id, onClick: close, "aria-current": cur ? "true" : null },
          h("span", { class: "avatar avatar--branch", "aria-hidden": "true" }, icon("pin")),
          h("span", { class: "picker__name" }, I18n.pick(b, "name"), h("small", null, I18n.pick(b, "city"))), UI.StatusBadge(b.status)));
      }));
    dlg = UI.Dialog({ title: t("scope.pick_place"), body: [list] });
  }

  /* ---------- Top bar ---------- */
  /** The three layers, in order, the current one filled. Read by screen readers as a list with the current item marked. */
  function LayerTrail(route) {
    var cur = LAYER[route.scope];
    return h("ol", { class: "layer-trail", "aria-label": t("layer.trail") }, ["quantara", "hq", "branch"].map(function (l) {
      return h("li", { class: "layer-trail__step layer-trail__step--" + l + (l === cur ? " is-current" : ""), "aria-current": l === cur ? "true" : null },
        t("layer." + l));
    }));
  }

  /** Prototype only — moves between layers so the three can be walked through. Not part of any real product. */
  function ViewAs(route) {
    var cur = location.hash.indexOf("#/hq/") === 0 ? base(route) : (route.scope === "all" ? "#/tenants" : "#/tenants");
    var opts = [h("option", { value: "#/tenants", selected: LAYER[route.scope] === "quantara" ? "selected" : null }, t("viewas.quantara"))];
    Store.tenants().forEach(function (tn) {
      var g = h("optgroup", { label: I18n.pick(tn, "name") },
        h("option", { value: "#/hq/" + tn.id, selected: cur === "#/hq/" + tn.id ? "selected" : null }, t("viewas.hq", { name: I18n.pick(tn, "name") })),
        tn.branches.map(function (b) {
          var v = "#/hq/" + tn.id + "/b/" + b.id;
          return h("option", { value: v, selected: cur === v ? "selected" : null }, t("viewas.branch", { branch: I18n.pick(b, "name") }));
        }));
      opts.push(g);
    });
    return h("div", { class: "viewas" },
      h("label", { class: "viewas__label", for: "viewas" }, t("viewas.label")),
      h("select", { class: "select select--sm", id: "viewas", onChange: function (e) { location.hash = e.target.value.replace(/^#/, ""); } }, opts));
  }

  function Me(route) {
    var tn = route.tenant, person, role;
    if (route.scope === "hq") { person = Store.hqMe(tn); role = person ? t("role." + person.role) : ""; }
    else if (route.scope === "branch") { person = Store.branchMe(tn, route.branch); role = person ? t("role." + person.role) : ""; }
    else { person = Store.me(); role = t("team." + person.team); }
    var name = person ? I18n.pick(person, "name") : t("role.unknown");
    return h("span", { class: "me me--" + LAYER[route.scope], title: t("signed_in_as", { name: name, team: role }) },
      h("span", { class: "me__avatar", "aria-hidden": "true" }, name.replace(/[\[\]]/g, "").charAt(0)),
      h("span", { class: "me__text" }, h("span", null, name), h("small", null, role)));
  }

  function TopBar(route) {
    var tn = route.tenant, layer = LAYER[route.scope], label, kicker, av;
    if (route.scope === "tenant") { label = I18n.pick(tn, "name"); kicker = t("scope.tenant"); av = Avatar(tn, "sm"); }
    else if (route.scope === "hq") { label = t("layer.hq"); kicker = I18n.pick(tn, "name"); av = h("span", { class: "avatar avatar--hq avatar--sm", "aria-hidden": "true" }, icon("building")); }
    else if (route.scope === "branch") { label = I18n.pick(route.branch, "name"); kicker = I18n.pick(tn, "name"); av = h("span", { class: "avatar avatar--branch avatar--sm", "aria-hidden": "true" }, icon("pin")); }
    else { label = t("scope.all"); kicker = t("scope.switch"); av = h("span", { class: "avatar avatar--all avatar--sm", "aria-hidden": "true" }, icon("globe")); }
    return h("div", { class: "topbar" },
      h("button", { class: "scope-switch", type: "button", "aria-haspopup": "dialog",
        onClick: function () { layer === "quantara" ? openQuantaraPicker() : openTenantPicker(route); } },
        av,
        h("span", { class: "scope-switch__text" }, h("span", { class: "scope-switch__kicker" }, kicker), h("span", { class: "scope-switch__name" }, label)),
        icon("swap", "scope-switch__icon")),
      LayerTrail(route),
      h("div", { class: "topbar__spacer" }),
      UI.Button({ label: t("key.open"), icon: "layers", variant: "ghost", size: "sm", onClick: openOwnershipKey }),
      h("button", { class: "lang-toggle", type: "button", lang: I18n.lang === "ar" ? "en" : "ar", "aria-label": t("lang.switch_label"),
        onClick: function () { I18n.setLang(I18n.lang === "ar" ? "en" : "ar"); App.render(); } }, t("lang.switch")),
      Me(route));
  }

  /* ---------- Scope bars: the band under the top bar that names the place ---------- */
  function ScopeBar(tn) {
    return h("div", { class: "scope-bar", role: "region", "aria-label": t("scope.tenant_hint") },
      h("span", { class: "scope-bar__kicker" }, t("scope.tenant")),
      h("strong", { class: "scope-bar__name" }, I18n.pick(tn, "name")),
      h("span", { class: "scope-bar__other", lang: I18n.lang === "ar" ? "en" : "ar" }, I18n.pickOther(tn, "name")),
      tn.is_sample ? UI.SampleBadge() : null,
      UI.StatusBadge(tn.status),
      h("span", { class: "scope-bar__spacer" }),
      h("a", { class: "scope-bar__exit", href: "#/tenants" }, icon("x"), h("span", null, t("scope.back"))));
  }
  function HqBar(tn) {
    return h("div", { class: "scope-bar scope-bar--hq", role: "region", "aria-label": t("scope.hq_hint") },
      h("span", { class: "scope-bar__kicker" }, t("layer.hq")),
      h("strong", { class: "scope-bar__name" }, I18n.pick(tn, "name")),
      h("span", { class: "scope-bar__other", lang: I18n.lang === "ar" ? "en" : "ar" }, I18n.pickOther(tn, "name")),
      tn.is_sample ? UI.SampleBadge() : null,
      h("span", { class: "scope-bar__spacer" }),
      h("span", { class: "scope-bar__note" }, t("scope.hq_note", { n: I18n.number(tn.branches.length) })));
  }
  function BranchBar(tn, b) {
    return h("div", { class: "scope-bar scope-bar--branch", role: "region", "aria-label": t("scope.branch_hint") },
      h("span", { class: "scope-bar__kicker" }, t("layer.branch")),
      h("strong", { class: "scope-bar__name" }, I18n.pick(b, "name")),
      h("span", { class: "scope-bar__other" }, "· " + I18n.pick(tn, "name")),
      tn.is_sample ? UI.SampleBadge() : null,
      UI.StatusBadge(b.status),
      h("span", { class: "scope-bar__spacer" }),
      h("a", { class: "scope-bar__exit", href: "#/hq/" + tn.id }, icon("building"), h("span", null, t("scope.to_hq"))));
  }

  /** Shown on every HQ page (and on Quantara's view of the tenant) while support access is open. */
  function InsideBar(route) {
    if (route.scope !== "hq" && route.scope !== "tenant") return null;
    var tn = route.tenant, s = Store.supportInside(tn);
    if (!s) return null;
    var who = Store.staff(s.staff_id), tz = tn.time_zone;
    var o = { name: I18n.pick(who, "name") + " (" + t("team." + who.team) + ")", since: I18n.time(s.started_at, tz), until: I18n.time(s.expires_at, tz), scope: t("access.scope." + s.scope) };
    if (route.scope === "hq") {
      o.href = "#/hq/" + tn.id + "/support-access";
      o.onEnd = function () {
        UI.Dialog({ title: t("inside.end_title"), body: [h("p", null, t("inside.end_body", { name: I18n.pick(who, "name") }))],
          actions: [{ label: t("dialog.cancel"), variant: "ghost" },
            { label: t("inside.end"), variant: "danger", onClick: function (close) { var me = Store.hqMe(tn); Store.endSupport(tn, s.id, me ? me.id : "hq"); close(); App.render(); UI.toast(t("inside.ended")); } }] });
      };
    } else {
      o.name = I18n.pick(who, "name");
    }
    return UI.SupportInsideBar(o);
  }

  /* ---------- The ownership key: the decided boundary, one click away on every screen ---------- */
  function openOwnershipKey() {
    var rows = ["plan", "branches", "modules", "catalogue", "settings", "sales", "support", "guarantees"];
    var cell = function (k) { var v = t(k); return v === "—" ? h("span", { class: "muted" }, "—") : v; };
    UI.Dialog({ title: t("key.title"), wide: true, body: [
      h("p", null, t("key.intro")),
      h("div", { class: "table-wrap" }, h("table", { class: "table table--wrap" },
        h("thead", null, h("tr", null, h("th", { scope: "col" }, t("key.topic")),
          h("th", { scope: "col" }, UI.OwnerTag({ owner: "quantara", here: "quantara", label: t("layer.quantara") })),
          h("th", { scope: "col" }, UI.OwnerTag({ owner: "hq", here: "hq", label: t("layer.hq") })),
          h("th", { scope: "col" }, UI.OwnerTag({ owner: "branch", here: "branch", label: t("layer.branch") })))),
        h("tbody", null, rows.map(function (r) {
          return h("tr", null, h("th", { scope: "row" }, t("key." + r)), h("td", null, cell("key." + r + ".q")), h("td", null, cell("key." + r + ".hq")), h("td", null, cell("key." + r + ".br")));
        })))),
      h("h3", { class: "key__h" }, t("key.states")),
      h("ul", { class: "key__states" },
        h("li", null, UI.OwnerTag({ owner: "quantara", here: "hq" }), h("span", null, t("key.s.quantara"))),
        h("li", null, UI.OwnerTag({ owner: "hq", here: "branch" }), h("span", null, t("key.s.hq"))),
        h("li", null, UI.OverrideTag({}), h("span", null, t("key.s.override"))),
        h("li", null, h("span", { class: "owner-tag owner-tag--warn" }, icon("alert"), h("span", null, t("meter.full"))), h("span", null, t("key.s.limit"))),
        h("li", null, UI.SyncNote({ kind: "changed", who: t("layer.hq"), time: "10:42" }), h("span", null, t("key.s.sync"))),
        h("li", null, h("span", { class: "owner-tag owner-tag--inside" }, icon("eye"), h("span", null, t("key.s.inside_tag"))), h("span", null, t("key.s.inside")))),
      h("p", { class: "muted" }, t("key.sync_rule"))
    ] });
  }

  window.Shell = {
    Avatar: Avatar,
    LAYER: LAYER,
    openOwnershipKey: openOwnershipKey,
    render: function (route, page) {
      var bar = route.scope === "tenant" ? ScopeBar(route.tenant) : route.scope === "hq" ? HqBar(route.tenant)
        : route.scope === "branch" ? BranchBar(route.tenant, route.branch) : null;
      return h("div", { class: "shell", "data-scope": route.scope, "data-layer": LAYER[route.scope] },
        Sidebar(route),
        h("div", { class: "shell__main" },
          TopBar(route),
          bar,
          InsideBar(route),
          h("main", { class: "page page--" + (route.kind || "list"), id: "main", tabindex: "-1" }, page)));
    }
  };
})();
