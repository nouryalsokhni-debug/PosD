/* Quantara POS — cashier prototype · the remaining till requirements.
   Loaded before pos-app.js (which calls these at run time).
   KDS-01…06 kitchen view · HW-05 customer display · POS-05 split bill · USR-07 staff meal
   · FIS-06 company invoice · FIS-07 reprint (in pos-app) · USR-03 card login. */

/* ---------- USR-03: sign in with a staff card ---------- */
function cardLogin() {
  var u = POS_DATA.staff[0]; // the demo card belongs to the first cashier
  S.user = { id: u.id }; log("login", nm(u) + " · card", u.id); guide("F01", 0);
  toast(t("cardRead") + " · " + nm(u)); UI.view = "sale"; commit();
}

/* ---------- KDS-01…06: kitchen view (orders arrive once paid, by station, with waiting time) ---------- */
function stationOf(itemId) {
  var it = item(itemId);
  return POS_DATA.stations.filter(function (s) { return s.cats.indexOf(it.cat) > -1; })[0] || POS_DATA.stations[0];
}
function viewKitchen() {
  var st = UI.station || "all", now = Date.now(), alert = POS_DATA.settings.waitAlertMin;
  var chips = [{ id: "all", label: t("allStations") }].concat(POS_DATA.stations.map(function (s) { return { id: s.id, label: nm(s) }; }))
    .map(function (c) { return '<button class="btn' + (st === c.id ? " sel" : "") + '" data-act="station" data-arg="' + c.id + '">' + esc(c.label) + "</button>"; }).join("");
  var list = S.orders.filter(function (o) { return o.status === "preparing"; });
  var cards = list.map(function (o) {
    var lines = o.order.lines.filter(function (l) { return st === "all" || stationOf(l.itemId).id === st; });
    if (!lines.length) return "";
    var since = o.startedAt || o.createdAt || o.order.createdAt || now, mins = Math.max(0, Math.floor((now - since) / 60000)), late = mins >= alert;
    return '<div class="kcard' + (late ? " late" : "") + (o.startedAt ? "" : " new") + '"><div class="row between"><span class="n num">#' + o.no + "</span><span>" + esc(o.type === "dinein" ? t("dineIn") : t("takeaway")) + "</span></div>" +
      '<div class="tiny ' + (late ? "var-bad" : "muted") + '">' + (o.startedAt ? "" : '<span class="tag info">' + esc(t("newOrder")) + "</span> ") + esc(late ? t("overdue", { m: mins }) : t("kWaiting", { m: mins })) + "</div>" +
      "<ul>" + lines.map(function (l) { return "<li><b>" + l.qty + "×</b> " + esc(nm(item(l.itemId))) + (optText(l) ? '<div class="tiny muted">' + esc(optText(l)) + "</div>" : "") + (st === "all" ? ' <span class="tag">' + esc(nm(stationOf(l.itemId))) + "</span>" : "") + "</li>"; }).join("") + "</ul>" +
      '<div class="row">' + (o.startedAt ? "" : '<button class="btn" data-act="startPrep" data-arg="' + o.id + '">' + esc(t("start")) + "</button>") + '<button class="btn primary" data-act="ready" data-arg="' + o.id + '">' + esc(t("markReady")) + "</button></div></div>";
  }).join("");
  return '<div class="page"><div class="row between"><h2>' + esc(t("kitchen")) + ' <span class="tag">KDS-01…06</span></h2><div class="row">' + chips + "</div></div>" +
    '<p class="muted small">' + esc(POS_LANG === "ar" ? "تصل الطلبات لحظة تأكيد الدفع؛ يصبح الطلب أحمر بعد " + alert + " دقائق." : "Orders arrive the moment payment is confirmed; an order turns red after " + alert + " minutes.") + " " + assume("D-14") + "</p>" +
    '<div class="kgrid">' + (cards || '<div class="empty">—</div>') + "</div></div>";
}

/* ---------- HW-05 + KDS-06: customer display (second window, follows the till through localStorage) ---------- */
function bootDisplay() {
  document.documentElement.classList.add("display-mode");
  function draw() {
    S = load(); setLang(POS_LANG);
    var o = S.order, tt = totals(o);
    var ready = S.orders.filter(function (x) { return x.status === "ready"; }).map(function (x) { return x.no; });
    var prep = S.orders.filter(function (x) { return x.status === "preparing"; }).map(function (x) { return x.no; });
    var lines = o && o.lines.length ? o.lines.map(function (l) { return '<div class="dline"><span>' + l.qty + "× " + esc(nm(item(l.itemId))) + '</span><span class="num">' + syp(lineUnit(l) * l.qty) + "</span></div>"; }).join("") : '<div class="dwelcome">' + esc(t("displayWelcome")) + "<br><small>" + esc(nm(POS_DATA.tenant)) + "</small></div>";
    $("#app").innerHTML = '<div class="display"><section class="dorder">' + lines +
      (o && o.lines.length ? '<div class="dtotal"><span>' + esc(t("displayTotal")) + '</span><span class="num">' + syp(tt.total) + '<small class="num"> ≈ ' + usd(tt.usd) + "</small></span></div>" : "") + "</section>" +
      '<aside class="dready"><h2>' + esc(t("displayReady")) + '</h2><div class="dnums">' + ready.map(function (n) { return '<span class="num">' + n + "</span>"; }).join("") + "</div>" +
      '<h3>' + esc(t("nowPreparing")) + '</h3><div class="dnums small">' + prep.map(function (n) { return '<span class="num">' + n + "</span>"; }).join("") + "</div></aside></div>";
  }
  window.addEventListener("storage", function (e) { if (e.key === STORE_KEY || e.key === "quantara.lang") draw(); });
  setInterval(draw, 2000);
  draw();
}

/* ---------- POS-05: split the bill by items ---------- */
function openSplit() {
  var o = S.order, pick = {};
  openModal(t("splitTitle"), function () {
    return '<p class="small muted" style="margin-top:0">' + esc(t("splitHint")) + ' <span class="tag">POS-05</span></p>' + o.lines.map(function (l) {
      return '<div class="tender"><span>' + l.qty + "× " + esc(nm(item(l.itemId))) + ' <span class="tiny muted">' + esc(optText(l)) + '</span></span><button class="btn' + (pick[l.id] ? " sel" : "") + '" data-mact="pick" data-arg="' + l.id + '">' + (pick[l.id] ? "✓" : "+") + "</button></div>";
    }).join("") + '<div class="err" id="splitErr"></div>';
  }, [
    { label: t("cancel"), act: closeModal },
    { label: t("split"), cls: "primary", act: function () {
      var chosen = o.lines.filter(function (l) { return pick[l.id]; });
      if (!chosen.length || chosen.length === o.lines.length) { $("#splitErr").textContent = t("splitNeed"); return; }
      var rest = { id: uid("O"), no: o.no, type: o.type, lines: o.lines.filter(function (l) { return !pick[l.id]; }), discount: null, createdAt: o.createdAt, splitFrom: o.no };
      o.lines = chosen; S.held.push(rest);
      log("split", "#" + o.no + " → " + chosen.length + " / " + rest.lines.length);
      closeModal(); toast(t("splitDone", { n: rest.no })); commit();
    } }
  ], { pick: function (id) { pick[id] = !pick[id]; } });
}

/* ---------- USR-07: staff meal at zero price, within a daily limit, approved by the manager ---------- */
function openStaffMeal() {
  var lim = POS_DATA.settings.staffMealLimitSYP, who = POS_DATA.staff[0].id;
  function usedToday(uid2) { var d = new Date().toDateString(); return S.invoices.filter(function (i) { return i.staffMeal === uid2 && new Date(i.ts).toDateString() === d; }).reduce(function (a, i) { return a + i.totals.subtotal; }, 0); }
  managerApproval({
    title: t("staffMeal"),
    intro: esc(t("mealLeft", { n: syp(Math.max(0, lim.value - usedToday(who))) })) + " " + assume(lim.decision) + ' <span class="tag">USR-07</span>',
    extra: function () { return '<div class="choices">' + POS_DATA.staff.map(function (u) { return '<button class="btn' + (who === u.id ? " sel" : "") + '" data-mact="who" data-arg="' + u.id + '">' + esc(nm(u)) + "</button>"; }).join("") + "</div>"; },
    mact: { who: function (a) { who = a; } },
    validate: function () { var tt = totals(); return usedToday(who) + tt.subtotal > lim.value ? t("mealOver") : null; },
    onOk: function (mid) {
      var o = S.order, tt = totals(o);
      o.discount = { kind: "amt", value: tt.subtotal, by: mid, reason: t("staffMeal") + " · " + userName(who) };
      var inv = completeSale(o, []); inv.staffMeal = who;
      S.orders.push({ id: uid("K"), no: o.no, type: o.type, status: "preparing", unpaid: false, invoiceId: inv.id, order: JSON.parse(JSON.stringify(o)), createdAt: Date.now() });
      S.order = null; log("staffMeal", userName(who) + " · " + fmt(tt.subtotal), mid);
      toast(t("mealDone")); commit();
    }
  });
}

/* ---------- FIS-06: invoice issued to a company ---------- */
function openCompany() {
  var c = UI.pay.company || { name: "", tax: "" };
  openModal(t("company"), function () {
    return '<div class="field"><label for="coName">' + esc(t("companyName")) + '</label><input class="input" id="coName" value="' + esc(c.name) + '"></div>' +
      '<div class="field"><label for="coTax">' + esc(t("companyTax")) + '</label><input class="input num" id="coTax" value="' + esc(c.tax) + '"></div><p class="tiny muted">FIS-06 · ' + assume(POS_DATA.settings.companyInvoice.decision) + "</p>";
  }, [
    { label: t("cancel"), act: closeModal },
    { label: t("approve"), cls: "primary", act: function () { var n = $("#coName").value.trim(); UI.pay.company = n ? { name: n, tax: $("#coTax").value.trim() } : null; closeModal(); render(); } }
  ]);
}
