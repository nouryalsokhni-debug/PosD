/*
 * Shared components. Each is built once and every page composes them.
 * Every component returns a DOM node. No component knows which page it is on.
 */
(function () {
  var t = function (k, v) { return I18n.t(k, v); };

  /* ---------- h(): the only way markup is made ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v; // only used for trusted icon SVG strings below
      else if (k.slice(0, 2) === "on" && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "value") el.value = v;
      else if (k === "checked") el.checked = !!v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(el, c); }); return; }
    el.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
  }

  /* ---------- Icons: inline stroke SVG. `dir` icons flip in RTL. ---------- */
  var ICONS = {
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10h18M9 20v-6h6v6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    life: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    pulse: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    home: '<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
    pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    register: '<rect x="4" y="3" width="16" height="11" rx="2"/><path d="M8 14l-2 7h12l-2-7M9 8h6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    ticket: '<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M13 7v10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
    swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    building: '<path d="M4 21V5l8-3v19M12 8h8v13M4 21h16M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01"/>',
    sync: '<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    percent: '<path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    puzzle: '<path d="M10 3h4v3a2 2 0 1 0 4 0V3h3v7h-3a2 2 0 1 0 0 4h3v7h-7v-3a2 2 0 1 0-4 0v3H3v-7h3a2 2 0 1 0 0-4H3V3z"/>',
    // directional — mirrored in RTL
    back: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    arrowBack: '<path d="M20 12H5M11 5l-7 7 7 7"/>',
    arrowNext: '<path d="M4 12h15M13 5l7 7-7 7"/>',
    sortUp: '<path d="M8 14l4-4 4 4"/>',
    sortDown: '<path d="M8 10l4 4 4-4"/>',
    sortNone: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>'
  };
  var DIRECTIONAL = { back: 1, next: 1, arrowBack: 1, arrowNext: 1 };
  function icon(name, cls) {
    return h("span", {
      class: "icon" + (DIRECTIONAL[name] ? " icon--dir" : "") + (cls ? " " + cls : ""), "aria-hidden": "true",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>"
    });
  }

  /* ---------- Button (a <button>, or an <a> when it navigates) ---------- */
  function Button(o) {
    var cls = "btn btn--" + (o.variant || "secondary") + (o.size ? " btn--" + o.size : "") + (o.iconOnly ? " btn--icon" : "");
    var kids = [o.icon ? icon(o.icon) : null, o.iconOnly ? null : h("span", null, o.label)];
    if (o.href) return h("a", { class: cls, href: o.href, "aria-label": o.iconOnly ? o.label : null }, kids);
    return h("button", { class: cls, type: o.type || "button", onClick: o.onClick, disabled: o.disabled, "aria-label": o.iconOnly ? o.label : null, title: o.iconOnly ? o.label : null }, kids);
  }

  /* ---------- Badge ---------- */
  var STATUS_TONE = { active: "positive", online: "positive", trial: "info", onboarding: "info", suspended: "critical", offline: "neutral", paused: "warning" };
  function Badge(text, tone, title) { return h("span", { class: "badge badge--" + (tone || "neutral"), title: title }, text); }
  function StatusBadge(status) { return h("span", { class: "badge badge--dot badge--" + (STATUS_TONE[status] || "neutral") }, t("status." + status)); }
  function SampleBadge() { return Badge(t("sample"), "sample", t("sample.hint")); }

  /* ---------- Banner ---------- */
  var BANNER_ICON = { info: "info", warning: "alert", critical: "alert", positive: "check" };
  function Banner(o) {
    return h("div", { class: "banner banner--" + (o.tone || "info"), role: o.tone === "critical" ? "alert" : "status" },
      icon(BANNER_ICON[o.tone || "info"], "banner__icon"),
      h("div", { class: "banner__text" }, o.title ? h("strong", null, o.title) : null, o.body ? h("span", null, o.body) : null),
      o.actions ? h("div", { class: "banner__actions" }, o.actions) : null);
  }

  /* ---------- Dialog (native <dialog>: focus trap, Esc, backdrop) ---------- */
  function Dialog(o) {
    var returnFocus = document.activeElement;
    var dlg = h("dialog", { class: "dialog" + (o.wide ? " dialog--wide" : ""), "aria-labelledby": "dlg-title" });
    function close() { dlg.close(); }
    dlg.addEventListener("close", function () { dlg.remove(); if (returnFocus && returnFocus.focus) returnFocus.focus(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); }); // backdrop click
    // append() via h's helper so a missing footer is skipped (native append would print "null")
    append(dlg, [
      h("div", { class: "dialog__head" },
        h("h2", { id: "dlg-title", class: "dialog__title" }, o.title),
        Button({ label: t("dialog.close"), icon: "x", iconOnly: true, variant: "ghost", onClick: close })),
      h("div", { class: "dialog__body" }, o.body),
      o.actions ? h("div", { class: "dialog__foot" }, o.actions.map(function (a) {
        return Button({ label: a.label, variant: a.variant, onClick: function () { a.onClick ? a.onClick(close) : close(); } });
      })) : null]);
    document.body.appendChild(dlg);
    dlg.showModal();
    return { el: dlg, close: close };
  }

  /* ---------- Form controls + FormRow ---------- */
  function Input(o) {
    return h("input", { class: "input", id: o.id, type: o.type || "text", value: o.value == null ? "" : o.value,
      placeholder: o.placeholder, dir: o.dir, min: o.min, max: o.max, required: o.required,
      "aria-invalid": o.invalid ? "true" : null, autocomplete: o.autocomplete || "off",
      onInput: o.onInput ? function (e) { o.onInput(e.target.value); } : null });
  }
  function Select(o) {
    return h("select", { class: "select", id: o.id, onChange: function (e) { o.onChange && o.onChange(e.target.value); } },
      o.options.map(function (op) { return h("option", { value: op.value, selected: String(op.value) === String(o.value) ? "selected" : null }, op.label); }));
  }
  function Toggle(o) {
    var input = h("input", { type: "checkbox", role: "switch", id: o.id, checked: o.checked, class: "toggle__input", disabled: o.disabled, "aria-label": o.label,
      onChange: function (e) { o.onChange && o.onChange(e.target.checked); } });
    return h("span", { class: "toggle" }, input, h("span", { class: "toggle__track", "aria-hidden": "true" }));
  }
  function Checkbox(o) {
    return h("label", { class: "check" },
      h("input", { type: "checkbox", id: o.id, checked: o.checked, disabled: o.disabled, onChange: function (e) { o.onChange(e.target.checked); } }),
      h("span", null, o.label));
  }
  /** label · control · help · error — the one way a labelled field is laid out */
  function FormRow(o) {
    var helpId = o.id + "-help", errId = o.id + "-err";
    if (o.control && o.control.setAttribute) {
      var target = o.control.matches("input,select,textarea") ? o.control : o.control.querySelector("input,select,textarea");
      if (target) target.setAttribute("aria-describedby", [o.help ? helpId : "", o.error ? errId : ""].join(" ").trim() || null);
    }
    return h("div", { class: "form-row" + (o.error ? " form-row--error" : "") },
      h("label", { class: "form-row__label", for: o.id }, o.label, o.required ? h("span", { class: "form-row__req" }, " · " + t("flow.required")) : null),
      o.control,
      o.help ? h("p", { class: "form-row__help", id: helpId }, o.help) : null,
      o.error ? h("p", { class: "form-row__error", id: errId }, o.error) : null);
  }

  /* ---------- Tabs (arrow keys follow reading direction) ---------- */
  function Tabs(o) {
    var wrap = h("div", { class: "tabs" });
    var list = h("div", { class: "tabs__list", role: "tablist" });
    var panel = h("div", { class: "tabs__panel", role: "tabpanel", id: o.id + "-panel", tabindex: "0" });
    var active = o.active || o.tabs[0].id;
    function select(id, focus) {
      active = id;
      Array.prototype.forEach.call(list.children, function (b) {
        var on = b.dataset.tab === id;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
        if (on) { panel.setAttribute("aria-labelledby", b.id); if (focus) b.focus(); }
      });
      var tab = o.tabs.filter(function (x) { return x.id === id; })[0];
      panel.replaceChildren(tab.render());
      o.onChange && o.onChange(id);
    }
    o.tabs.forEach(function (tab, i) {
      list.appendChild(h("button", { class: "tabs__tab", role: "tab", type: "button", id: o.id + "-tab-" + tab.id, "data-tab": tab.id,
        "aria-controls": o.id + "-panel", onClick: function () { select(tab.id); },
        onKeydown: function (e) {
          var fwd = I18n.dir === "rtl" ? "ArrowLeft" : "ArrowRight", bwd = I18n.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
          var n = o.tabs.length, j = null;
          if (e.key === fwd) j = (i + 1) % n; else if (e.key === bwd) j = (i - 1 + n) % n;
          else if (e.key === "Home") j = 0; else if (e.key === "End") j = n - 1;
          if (j != null) { e.preventDefault(); select(o.tabs[j].id, true); }
        } }, tab.label, tab.count != null ? h("span", { class: "tabs__count" }, I18n.number(tab.count)) : null));
    });
    wrap.append(list, panel);
    select(active);
    return wrap;
  }

  /* ---------- Empty state ---------- */
  function EmptyState(o) {
    return h("div", { class: "empty" },
      h("div", { class: "empty__icon" }, icon(o.icon || "search")),
      h("h2", { class: "empty__title" }, o.title),
      o.body ? h("p", { class: "empty__body" }, o.body) : null,
      o.action || null);
  }

  /* ---------- Table: sortable headers, row that opens something ---------- */
  function Table(o) {
    var sort = o.sort || {};
    var rows = o.rows.slice();
    if (sort.key) {
      var col = o.columns.filter(function (c) { return c.key === sort.key; })[0];
      var val = col.sortValue || function (r) { return r[col.key]; };
      rows.sort(function (a, b) {
        var x = val(a), y = val(b);
        var c = typeof x === "number" && typeof y === "number" ? x - y : I18n.compare(x, y);
        return sort.dir === "desc" ? -c : c;
      });
    }
    var thead = h("thead", null, h("tr", null, o.columns.map(function (c) {
      var isSorted = sort.key === c.key;
      var ariaSort = isSorted ? (sort.dir === "desc" ? "descending" : "ascending") : (c.sortable ? "none" : null);
      var content = c.sortable
        ? h("button", { type: "button", class: "th-sort", "aria-label": t("list.sort_by", { col: c.label }),
            onClick: function () { o.onSort({ key: c.key, dir: isSorted && sort.dir === "asc" ? "desc" : "asc" }); } },
            h("span", null, c.label), icon(isSorted ? (sort.dir === "desc" ? "sortDown" : "sortUp") : "sortNone", "th-sort__icon"))
        : c.label;
      return h("th", { scope: "col", class: c.align === "end" ? "num" : null, "aria-sort": ariaSort }, content);
    })));
    var tbody = h("tbody", null, rows.map(function (r) {
      var href = o.rowHref ? o.rowHref(r) : null;
      var tr = h("tr", { class: href ? "row-link" : null }, o.columns.map(function (c, ci) {
        var content = c.render ? c.render(r) : r[c.key];
        // The first cell carries the real link, so the row is reachable by keyboard and screen reader.
        if (ci === 0 && href) content = h("a", { href: href, class: "row-link__a" }, content);
        return h(ci === 0 ? "th" : "td", { scope: ci === 0 ? "row" : null, class: c.align === "end" ? "num" : null }, content);
      }));
      if (href) tr.addEventListener("click", function (e) {
        if (e.target.closest("a,button,input,select,label")) return;
        if (window.getSelection && String(window.getSelection())) return; // let people select text
        location.hash = href.replace(/^#/, "");
      });
      return tr;
    }));
    return h("div", { class: "table-wrap" }, h("table", { class: "table" }, o.caption ? h("caption", { class: "sr-only" }, o.caption) : null, thead, tbody));
  }

  /* ---------- Page header ---------- */
  function PageHeader(o) {
    return h("header", { class: "page-header" },
      o.breadcrumbs ? h("nav", { class: "crumbs", "aria-label": t("breadcrumb") }, h("ol", null, o.breadcrumbs.map(function (b, i) {
        var last = i === o.breadcrumbs.length - 1;
        return h("li", null, last ? h("span", { "aria-current": "page" }, b.label) : h("a", { href: b.href }, b.label), last ? null : icon("next", "crumbs__sep"));
      }))) : null,
      h("div", { class: "page-header__row" },
        o.lead || null,
        h("div", { class: "page-header__text" },
          h("div", { class: "page-header__title-row" }, h("h1", { class: "page-header__title" }, o.title), o.badges || null),
          o.subtitle ? h("p", { class: "page-header__subtitle" }, o.subtitle) : null),
        o.actions ? h("div", { class: "page-header__actions" }, o.actions) : null));
  }

  /* ---------- Section card + description list ---------- */
  function Section(o) {
    return h("section", { class: "section" + (o.flush ? " section--flush" : "") },
      o.title ? h("div", { class: "section__head" }, h("h2", { class: "section__title" }, o.title), o.actions || null) : null,
      h("div", { class: "section__body" }, o.body));
  }
  function DescList(items) {
    return h("dl", { class: "dl" }, items.map(function (it) {
      return h("div", { class: "dl__row" }, h("dt", null, it.label), h("dd", null, it.value));
    }));
  }

  /* ---------- Toast: one polite live region for confirmations ---------- */
  function toast(msg) {
    var region = document.getElementById("toast");
    region.replaceChildren(h("div", { class: "toast" }, icon("check"), h("span", null, msg)));
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { region.replaceChildren(); }, 4000);
  }


  /* =====================================================================
   * Boundary states — who owns a value, drawn once, used on every screen.
   * Layers: "quantara" · "hq" · "branch". `here` is the layer of the screen
   * being looked at, so the same value reads "Set by HQ" at HQ and
   * "Set by HQ · locked" at a branch.
   * ===================================================================== */

  /** OwnerTag — every value that someone owns carries one.
   *  owner: quantara | hq | branch | guaranteed ; here: the current layer */
  function OwnerTag(o) {
    var owner = o.owner, here = o.here;
    var locked = owner === "guaranteed" || (owner === "quantara" && here !== "quantara") || (owner === "hq" && here === "branch");
    // A branch record seen from HQ reads "Set at the branch" (not "this branch"); HQ can still see and remove it.
    var key = owner === "guaranteed" ? "owner.guaranteed" : "owner." + owner + ((locked || (owner === "branch" && here && here !== "branch")) ? "_locked" : "");
    var layer = owner === "guaranteed" ? "quantara" : owner;
    return h("span", { class: "owner-tag owner-tag--" + layer + (locked ? " is-locked" : ""), title: t(key + "_hint") },
      icon(locked ? "lock" : layer === "quantara" ? "shield" : layer === "hq" ? "building" : "pin"), h("span", null, o.label || t(key)));
  }

  /** "Overridden at this branch": the HQ value stays, the branch record sits on top. */
  function OverrideTag(o) {
    return h("span", { class: "override" },
      h("span", { class: "owner-tag owner-tag--branch", title: t("owner.override_hint") }, icon("layers"), h("span", null, o.label || t("owner.override"))),
      o.hqValue != null ? h("span", { class: "override__hq" }, h("span", { class: "sr-only" }, t("owner.hq_value") + " "), h("s", null, o.hqValue)) : null,
      o.value != null ? h("strong", { class: "override__value" }, o.value) : null);
  }

  /** Changed elsewhere / last synced. kind: "changed" (by someone on another layer) | "synced" | "stale" */
  function SyncNote(o) {
    var text = o.kind === "changed" ? t("sync.changed", { who: o.who, time: o.time })
      : o.kind === "stale" ? t("sync.stale", { time: o.time }) : t("sync.synced", { time: o.time });
    return h("span", { class: "sync-note" + (o.kind === "stale" ? " sync-note--stale" : o.kind === "changed" ? " sync-note--changed" : "") },
      icon(o.kind === "changed" ? "clock" : "sync"), h("span", null, text));
  }

  /** Meter — usage against a Quantara-set limit. At the limit it turns into the limit state. */
  function Meter(o) {
    var pct = o.max ? Math.min(100, Math.round(o.value / o.max * 100)) : 0, full = o.value >= o.max;
    return h("div", { class: "meter" + (full ? " meter--full" : pct >= 80 ? " meter--near" : "") },
      h("div", { class: "meter__row" },
        h("span", { class: "meter__label", id: o.id + "-l" }, o.label),
        h("span", { class: "meter__value" }, t("meter.of", { n: I18n.number(o.value), max: I18n.number(o.max) }))),
      h("div", { class: "meter__track", role: "meter", "aria-valuemin": "0", "aria-valuemax": String(o.max), "aria-valuenow": String(o.value), "aria-labelledby": o.id + "-l" },
        h("span", { class: "meter__fill", style: "inline-size:" + pct + "%" })),
      full ? h("span", { class: "meter__full" }, icon("alert"), t("meter.full")) : null);
  }

  /** Plan limit reached — the banner that goes with a full Meter. */
  function LimitBanner(o) {
    return Banner({ tone: "warning", title: t("limit.title", { what: o.what }), body: o.pending ? t("limit.requested", { date: I18n.date(o.pending.at) }) : t("limit.body", { plan: o.plan }),
      actions: o.pending ? Badge(t("limit.pending"), "info") : (o.onRequest ? Button({ label: t("limit.request"), size: "sm", variant: "primary", onClick: o.onRequest }) : null) });
  }

  /** "Quantara staff is inside" — a persistent band under the scope bar while access is open. */
  function SupportInsideBar(o) {
    return h("div", { class: "inside-bar", role: "status" },
      icon("eye", "inside-bar__icon"),
      h("span", { class: "inside-bar__text" }, h("strong", null, t("inside.title", { name: o.name })), h("span", null, t("inside.body", { since: o.since, until: o.until, scope: o.scope }))),
      o.onEnd ? Button({ label: t("inside.end"), size: "sm", variant: "danger-quiet", onClick: o.onEnd }) : null,
      o.href ? h("a", { class: "inside-bar__link", href: o.href }, t("inside.log")) : null);
  }

  /** A value with its owner beside it — the one way an owned value is shown in a DescList or cell. */
  function Owned(value, tag, note) {
    return h("span", { class: "owned" }, h("span", { class: "owned__value" }, value), tag, note || null);
  }

  window.UI = { h: h, icon: icon, Button: Button, Badge: Badge, StatusBadge: StatusBadge, SampleBadge: SampleBadge,
    Banner: Banner, Dialog: Dialog, Input: Input, Select: Select, Toggle: Toggle, Checkbox: Checkbox, FormRow: FormRow,
    Tabs: Tabs, EmptyState: EmptyState, Table: Table, PageHeader: PageHeader, Section: Section, DescList: DescList, toast: toast,
    OwnerTag: OwnerTag, OverrideTag: OverrideTag, SyncNote: SyncNote, Meter: Meter, LimitBanner: LimitBanner, SupportInsideBar: SupportInsideBar, Owned: Owned };
})();
