/*
 * Router + render loop. The URL decides the scope — and so the layer:
 *   #/…                         → Quantara · all tenants
 *   #/t/<id>/…                  → Quantara · one tenant (our staff looking in)
 *   #/hq/<id>/…                 → Tenant HQ (the café's head office)
 *   #/hq/<id>/b/<branch-id>/…   → Branch
 * Nothing else can put you in a scope, so the screen and the address always agree.
 */
(function () {
  var t = function (k) { return I18n.t(k); };

  var ALL_ROUTES = {
    "tenants":    { nav: "tenants",    kind: "list", page: function () { return Pages.TenantsList(); } },
    "onboarding": { nav: "onboarding", kind: "flow", page: function () { return Pages.OnboardingFlow(); } },
    "support":    { nav: "support",    kind: "list", page: function () { return QPages.SupportQueue(); } },
    "operations": { nav: "operations", kind: "list", page: function () { return OPS.OperationsHealth(); } },
    "billing":    { nav: "billing",    kind: "list", page: function () { return QPages.Billing(); } },
    "states":     { nav: "platform_settings", kind: "list", page: function () { return QPages.StatesGallery(); } },
    "settings":   { nav: "platform_settings", kind: "settings", page: function () { return QPages.PlatformSettings(); } }
  };
  var TENANT_ROUTES = {
    "":             { nav: "overview",       kind: "record",   page: function (tn) { return Pages.TenantRecord(tn); } },
    "branches":     { nav: "branches",       kind: "list",     page: function (tn) { return Pages.BranchesList(tn); } },
    "registers":    { nav: "registers",      kind: "list",     page: function (tn) { return Pages.RegistersList(tn); } },
    "settings":     { nav: "settings",       kind: "settings", page: function (tn) { return Pages.TenantSettings(tn); } },
    "people":       { nav: "people",         kind: "list",     page: function (tn) { return QPages.TenantPeople(tn); } },
    "subscription": { nav: "subscription",   kind: "record",   page: function (tn) { return QPages.TenantSubscription(tn); } },
    "support":      { nav: "tenant_support", kind: "list",     page: function (tn) { return QPages.TenantSupport(tn); } }
  };

  var NB = function (key) { return function () { return Pages.NotBuilt(t("nav." + key), t("notbuilt.body_tenant")); }; };
  var HQ_ROUTES = {
    "":              { nav: "hq_home",         kind: "record",   page: function (tn) { return HQ.Home(tn); } },
    "catalogue":     { nav: "hq_catalogue",    kind: "list",     page: function (tn) { return HQ.Catalogue(tn); } },
    "prices":        { nav: "hq_prices",       kind: "list",     page: function (tn) { return HQ.Prices(tn); } },
    "exchange-rate": { nav: "hq_exchange",     kind: "settings", page: function (tn) { return HQ.ExchangeRate(tn); } },
    "menu":          { nav: "hq_menu",         kind: "record",   page: function (tn) { return OPS.MenuSetup(tn); } },
    "promotions":    { nav: "hq_promotions",   kind: "record",   page: function (tn) { return OPS.Promotions(tn); } },
    "inventory":     { nav: "hq_inventory",    kind: "record",   page: function (tn) { return OPS.Inventory(tn); } },
    "branches":      { nav: "hq_branches",     kind: "list",     page: function (tn) { return HQ.Branches(tn); } },
    "people":        { nav: "hq_people",       kind: "list",     page: function (tn) { return HQ.People(tn); } },
    "reports":       { nav: "hq_reports",      kind: "record",   page: function (tn) { return OPS.Reports(tn); } },
    "payments":      { nav: "hq_payments",     kind: "settings", page: function (tn) { return OPS.Payments(tn); } },
    "till":          { nav: "hq_till",         kind: "settings", page: function (tn) { return OPS.TillRules(tn); } },
    "devices":       { nav: "hq_devices",      kind: "list",     page: function (tn) { return OPS.Devices(tn); } },
    "roles":         { nav: "hq_people",       kind: "list",     page: function (tn) { return OPS.Roles(tn); } },
    "settings":      { nav: "hq_settings",     kind: "settings", page: function (tn) { return HQ.Settings(tn); } },
    "subscription":  { nav: "hq_subscription", kind: "settings", page: function (tn) { return HQ.Subscription(tn); } },
    "support-access":{ nav: "hq_support",      kind: "record",   page: function (tn) { return HQ.SupportAccess(tn); } }
  };
  var BRANCH_ROUTES = {
    "":          { nav: "br_today",     kind: "record", page: function (tn, b) { return HQ.BranchToday(tn, b); } },
    "items":     { nav: "br_items",     kind: "list",   page: function (tn, b) { return HQ.BranchItems(tn, b); } },
    "discounts": { nav: "br_discounts", kind: "list",   page: function (tn, b) { return HQ.BranchDiscounts(tn, b); } },
    "cash":      { nav: "br_cash",      kind: "list",   page: function (tn, b) { return HQ.BranchCash(tn, b); } },
    "shifts":    { nav: "br_shifts",    kind: "list",   page: function (tn, b) { return OPS.ShiftReports(tn, b); } },
    "stock":     { nav: "br_stock",     kind: "record", page: function (tn, b) { return OPS.Inventory(tn, b); } },
    "reports":   { nav: "br_reports",   kind: "record", page: function (tn, b) { return OPS.Reports(tn, b); } }
  };

  function resolve() {
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] === "hq") {
      var ht = Store.tenant(parts[1]);
      if (!ht) return { scope: "all", nav: "tenants", kind: "list", page: Pages.NotFound, key: location.hash };
      if (parts[2] === "b") {
        var br = Store.branch(ht, parts[3]);
        if (!br) return { scope: "hq", tenant: ht, nav: "hq_branches", kind: "list", page: Pages.NotFound, key: location.hash };
        var brr = BRANCH_ROUTES[parts[4] || ""];
        if (!brr) return { scope: "branch", tenant: ht, branch: br, nav: "br_today", kind: "list", page: Pages.NotFound, key: location.hash };
        return { scope: "branch", tenant: ht, branch: br, nav: brr.nav, kind: brr.kind, page: brr.page, key: location.hash };
      }
      var hr = HQ_ROUTES[parts[2] || ""];
      if (!hr) return { scope: "hq", tenant: ht, nav: "hq_home", kind: "list", page: Pages.NotFound, key: location.hash };
      return { scope: "hq", tenant: ht, nav: hr.nav, kind: hr.kind, page: hr.page, key: location.hash };
    }
    if (parts[0] === "t") {
      var tn = Store.tenant(parts[1]);
      if (!tn) return { scope: "all", nav: "tenants", kind: "list", page: Pages.NotFound, key: location.hash };
      var r = TENANT_ROUTES[parts[2] || ""];
      if (!r) return { scope: "tenant", tenant: tn, nav: "overview", kind: "list", page: Pages.NotFound, key: location.hash };
      return { scope: "tenant", tenant: tn, nav: r.nav, kind: r.kind, page: r.page, key: location.hash };
    }
    var a = ALL_ROUTES[parts[0] || "tenants"];
    if (!a) return { scope: "all", nav: "tenants", kind: "list", page: Pages.NotFound, key: location.hash };
    return { scope: "all", nav: a.nav, kind: a.kind, page: a.page, key: location.hash };
  }

  var lastKey = null;

  window.App = {
    state: {},
    render: function () {
      var root = document.getElementById("app");
      var focusedId = document.activeElement && document.activeElement.id;
      var route = resolve();
      var navigated = route.key !== lastKey;
      lastKey = route.key;

      document.documentElement.lang = I18n.lang;
      document.documentElement.dir = I18n.dir;
      document.documentElement.setAttribute("data-layer", Shell.LAYER[route.scope]);
      document.querySelector(".skip-link").textContent = t("skip");
      var scopeName = route.scope === "all" ? t("scope.all")
        : route.scope === "branch" ? I18n.pick(route.branch, "name") + " · " + I18n.pick(route.tenant, "name")
        : route.scope === "hq" ? t("layer.hq") + " · " + I18n.pick(route.tenant, "name") : I18n.pick(route.tenant, "name");
      root.replaceChildren(Shell.render(route, route.page(route.tenant, route.branch)));
      var h1 = root.querySelector("h1");
      document.title = (h1 ? h1.textContent + " · " : "") + scopeName + " · " + t("app.name");

      if (navigated) { window.scrollTo(0, 0); var main = document.getElementById("main"); if (main) main.focus({ preventScroll: true }); }
      else if (focusedId) { var el = document.getElementById(focusedId); if (el) el.focus({ preventScroll: true }); }
    }
  };

  window.addEventListener("hashchange", App.render);
  document.addEventListener("DOMContentLoaded", function () {
    if (!location.hash) history.replaceState(null, "", "#/tenants");
    App.render();
  });
})();
