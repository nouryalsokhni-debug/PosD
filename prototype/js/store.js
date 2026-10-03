/*
 * Read/write access to QuantaraData. Pages ask the store; they never reach into
 * the raw object, so swapping this for API calls later touches one file.
 */
(function () {
  var D = window.QuantaraData;

  var LOADED = Date.now();

  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  window.Store = {
    tenants: function () { return D.tenants; },
    tenant: function (id) { return byId(D.tenants, id); },
    plans: function () { return D.plans; },
    plan: function (id) { return byId(D.plans, id); },
    currencies: function () { return D.currencies; },
    timeZones: function () { return D.time_zones; },
    staff: function (id) { return byId(D.staff, id); },
    me: function () { return byId(D.staff, D.current_staff_id); },

    // Derived — never stored.
    branchCount: function (tn) { return tn.branches.length; },
    registers: function (tn) {
      var out = [];
      tn.branches.forEach(function (b) { b.registers.forEach(function (r) { out.push(Object.assign({ branch: b }, r)); }); });
      return out;
    },
    registerCount: function (tn) { return this.registers(tn).filter(function (r) { return r.status !== "retired"; }).length; }, // a retired register frees its plan slot
    onlineCount: function (tn) { return this.registers(tn).filter(function (r) { return r.status === "online"; }).length; },

    updateTenant: function (id, patch) { var tn = byId(D.tenants, id); Object.assign(tn, patch); return tn; },
    addTenant: function (tn) { D.tenants.push(tn); return tn; },
    /* ---------- Day 5: the tenant's side ---------- */
    clock: function () { return D.clock; },
    /** "Now" for anything done in the prototype: the sample clock, ticking from when the page opened. */
    now: function () { return new Date(Date.parse(D.clock) + (Date.now() - LOADED)).toISOString(); },
    today: function () { return D.clock.slice(0, 10); },
    modules: function () { return D.modules; },

    /** HQ data for a tenant. A tenant with no HQ data yet gets empty lists, never undefined. */
    hq: function (tn) {
      if (!D.hq[tn.id]) D.hq[tn.id] = { users: [], rules: { manual_discount_cap_percent: 0 }, exchange_rate: null, modules: {},
        categories: [], items: [], offers: [], branch_overrides: [], feed: {}, shifts: [] };
      return D.hq[tn.id];
    },
    branch: function (tn, id) { return byId(tn.branches, id); },
    item: function (tn, id) { return byId(this.hq(tn).items, id); },
    category: function (tn, id) { return byId(this.hq(tn).categories, id); },
    user: function (tn, id) { return byId(this.hq(tn).users, id); },
    /** Who a layer's "me" is: the owner at HQ, the branch's manager at a branch. */
    hqMe: function (tn) { return this.hq(tn).users.filter(function (u) { return u.role === "owner"; })[0] || null; },
    branchMe: function (tn, b) { return this.hq(tn).users.filter(function (u) { return u.role === "branch_manager" && u.branch_id === b.id; })[0] || null; },

    /** Who did something, resolved across layers: { layer: "quantara"|"hq"|"branch", person } */
    actor: function (tn, id) {
      var s = byId(D.staff, id); if (s) return { layer: "quantara", person: s };
      var u = this.user(tn, id); if (u) return { layer: u.branch_id ? "branch" : "hq", person: u };
      return { layer: "hq", person: null };
    },

    /** Invoice series: gapless per BRANCH, <TENANT>-<BRANCH>-000001. The branch server allocates each number (ADR-001, D-27 revised). */
    invoiceSeries: function (tn, b) { return (tn.invoice_prefix || "T") + "-" + (b.code || "B"); },

    /* Plan usage (limits are Quantara's; usage is derived). */
    usage: function (tn) {
      var plan = this.plan(tn.plan_id);
      return { plan: plan, branches: tn.branches.length, max_branches: plan.max_branches,
        registers: this.registerCount(tn), max_registers: plan.max_registers };
    },
    upgradeRequest: function (tn) { return D.upgrade_requests.filter(function (u) { return u.tenant_id === tn.id && u.status === "pending"; })[0] || null; },
    requestUpgrade: function (tn, what, by) {
      var r = { id: "up-" + (D.upgrade_requests.length + 1), tenant_id: tn.id, what: what, status: "pending", by: by, at: this.now() };
      D.upgrade_requests.push(r); return r;
    },

    /* Branch overrides: separate records on top of HQ values. */
    overrides: function (tn, branchId, kind) {
      return this.hq(tn).branch_overrides.filter(function (o) { return (!branchId || o.branch_id === branchId) && (!kind || o.kind === kind); });
    },
    isPaused: function (tn, branchId, itemId) { return this.overrides(tn, branchId, "pause").some(function (o) { return o.item_id === itemId; }); },
    pauseItem: function (tn, branchId, itemId, by) {
      var ov = { id: "ov-" + Date.now(), branch_id: branchId, kind: "pause", item_id: itemId, by: by, at: this.now() };
      this.hq(tn).branch_overrides.push(ov); return ov;
    },
    resumeItem: function (tn, branchId, itemId) {
      var h = this.hq(tn);
      h.branch_overrides = h.branch_overrides.filter(function (o) { return !(o.kind === "pause" && o.branch_id === branchId && o.item_id === itemId); });
    },
    addDiscount: function (tn, ov) { ov.id = "ov-" + Date.now(); ov.kind = "discount"; this.hq(tn).branch_overrides.push(ov); return ov; },
    removeOverride: function (tn, id) { var h = this.hq(tn); h.branch_overrides = h.branch_overrides.filter(function (o) { return o.id !== id; }); },
    /** A discount is live, upcoming or over — relative to the prototype clock. */
    discountState: function (ov) { var now = this.now(); return now < ov.starts_at ? "scheduled" : now > ov.ends_at ? "ended" : "live"; },

    /* Live feed + today's figures — derived from the feed, never stored. */
    feed: function (tn, registerId) { return (this.hq(tn).feed[registerId] || []).slice().sort(function (a, b) { return a.at < b.at ? 1 : -1; }); },
    todayFigures: function (tn, branchId) {
      var today = this.today(), sales = 0, orders = 0, refunds = 0, self = this;
      this.registers(tn).forEach(function (r) {
        if (branchId && r.branch.id !== branchId) return;
        self.feed(tn, r.id).forEach(function (e) {
          if (e.at.slice(0, 10) !== today) return;
          if (e.kind === "order") { sales += e.amount; orders++; }
          if (e.kind === "refund") { sales -= e.amount; refunds++; }
        });
      });
      return { sales: sales, orders: orders, refunds: refunds, average: orders ? Math.round(sales / orders) : 0 };
    },
    openShift: function (tn, registerId) { return this.hq(tn).shifts.filter(function (s) { return s.register_id === registerId && s.status === "open"; })[0] || null; },

    /* Modules: Quantara decides available, HQ decides on + where. */
    moduleState: function (tn, id) {
      var available = (tn.modules_available || []).indexOf(id) > -1;
      var m = this.hq(tn).modules[id] || { on: false, branches: [] };
      return { id: id, available: available, on: available && m.on, branches: m.branches || [], updated_by: m.updated_by, updated_at: m.updated_at };
    },
    setModule: function (tn, id, patch, by) {
      var mods = this.hq(tn).modules; mods[id] = Object.assign(mods[id] || { on: false, branches: [] }, patch, { updated_by: by, updated_at: this.now() });
    },

    /* Support access */
    supportRequests: function (tn) { return D.support_access.filter(function (r) { return r.tenant_id === tn.id; }).sort(function (a, b) { return a.requested_at < b.requested_at ? 1 : -1; }); },
    /** The one session currently open, if Quantara staff is inside this tenant. */
    supportInside: function (tn) { var now = this.now(); return this.supportRequests(tn).filter(function (r) { return r.status === "approved" && (!r.expires_at || r.expires_at > now); })[0] || null; },
    supportPending: function (tn) { return this.supportRequests(tn).filter(function (r) { return r.status === "pending"; }); },
    auditLog: function (tn) { return D.audit_log.filter(function (e) { return e.tenant_id === tn.id; }).sort(function (a, b) { return a.at < b.at ? 1 : -1; }); },
    log: function (tn, actor, kind, extra) { D.audit_log.push(Object.assign({ at: this.now(), tenant_id: tn.id, actor: actor, kind: kind }, extra || {})); },
    requestSupport: function (tn, staffId, reason, hours) {
      var r = { id: "sa-" + Date.now(), tenant_id: tn.id, staff_id: staffId, status: "pending", reason_en: reason, reason_ar: reason,
        scope: "read_sales", hours: hours || 4, requested_at: this.now() };
      D.support_access.push(r); this.log(tn, staffId, "requested", { request_id: r.id }); return r;
    },
    decideSupport: function (tn, id, approve, by) {
      var r = byId(D.support_access, id), now = this.now();
      r.status = approve ? "approved" : "refused"; r.decided_by = by; r.decided_at = now;
      if (approve) { r.started_at = now; r.expires_at = new Date(Date.parse(now) + r.hours * 3600e3).toISOString(); }
      this.log(tn, by, approve ? "approved" : "refused", { request_id: id });
    },
    endSupport: function (tn, id, by) {
      var r = byId(D.support_access, id); r.status = "ended"; r.ended_at = this.now(); r.ended_by = by;
      this.log(tn, by, "ended", { request_id: id });
    },

    slug: function (s) {

      var base = String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-") || "tenant";
      var id = base, n = 2;
      while (byId(D.tenants, id)) id = base + "-" + n++;
      return id;
    }
  };
})();
