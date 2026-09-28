/* Quantara POS — cashier prototype · views and flows.
   Flows implemented (docs/03-flows): FLOW-01 counter sale · FLOW-02 pay later · FLOW-03 cancel & refund
   · FLOW-04 shift & cash drawer · FLOW-05 offline. FLOW-06 lives in the HQ panel (POSD-85). */

var UI = { view: "sale", cat: "fav", q: "", pay: null, lastInvoice: null, closing: null, side: null, flash: null, syncing: false };

/* ---------- small utils ---------- */
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
function $(sel, root) { return (root || document).querySelector(sel); }
function toast(msg) {
  var el = document.createElement("div"); el.className = "toast"; el.textContent = msg;
  var r = $("#toast"); r.appendChild(el); while (r.children.length > 3) r.removeChild(r.firstChild);
  setTimeout(function () { el.remove(); }, 2600);
}
function neg(n) { return '<bdi dir="ltr">−' + syp(Math.abs(n)) + "</bdi>"; }
function syp(n) { return fmt(n) + (POS_LANG === "ar" ? " ل.س" : " SYP"); }
function usd(n) { return "$" + fmtUSD(n); }
function assume(d) { return '<span class="tag assume" title="' + esc(t("assumption")) + '">' + esc(t("assumption")) + " · " + esc(d) + "</span>"; }
function userName(id) { var u = staff(id); return u ? nm(u) : "—"; }
function commit() { save(); render(); }

/* ---------- flow guide definition ---------- */
var FLOWS = [
  { id: "F01", ref: "FLOW-01", en: "Counter sale — pay first", ar: "البيع — الدفع المسبق",
    steps: [["Log in", "الدخول"], ["Build the order (grid, options, dine-in/takeaway)", "بناء الطلب"], ["Offers apply / manual discount (manager)", "العروض / الخصم اليدوي"],
      ["Hold and resume an order", "تعليق الطلب واستئنافه"], ["Pay — one or more methods, USD at pinned rate", "الدفع — وسيلة أو أكثر"], ["Invoice recorded, stock deducted", "القيد والفاتورة"], ["Prep ticket, call number, hand over", "التحضير والتسليم"]] },
  { id: "F02", ref: "FLOW-02", en: "Sale — pay later", ar: "البيع — الدفع اللاحق",
    steps: [["Confirm order → prep ticket prints", "تأكيد الطلب"], ["Prepare and call the number", "التحضير والمناداة"], ["Pay on hand-over → invoice", "الدفع عند التسليم"]] },
  { id: "F03", ref: "FLOW-03", en: "Cancel & refund after payment", ar: "الإلغاء والإرجاع بعد الدفع",
    steps: [["Cancel: manager + reason, stock returned", "الإلغاء بصلاحية المدير"], ["Cash refund by cashier, drawer opens", "إرجاع النقود"], ["Control: see it in the audit log", "الرقابة"]] },
  { id: "F04", ref: "FLOW-04", en: "Shift & cash drawer", ar: "الوردية والصندوق",
    steps: [["Open shift with float per currency", "فتح الوردية"], ["Open drawer without sale: manager + reason", "فتح الدرج دون عملية"], ["Close: manager counts cash per currency", "الإغلاق والجرد"], ["Variance within limit or approved with reason", "معالجة الفرق"], ["Shift report", "تقرير الوردية"]] },
  { id: "F05", ref: "FLOW-05", en: "Offline operation", ar: "العمل دون اتصال",
    steps: [["Sell while offline", "البيع أثناء الانقطاع"], ["Connection status + last sync visible", "شفافية الحالة"], ["Automatic sync when back online", "المزامنة التلقائية"], ["Power cut: open order restored", "انقطاع الكهرباء"], ["Local data kept (≥ 1 business day)", "الاحتفاظ بالبيانات"]] },
  { id: "F07", ref: "HW-02 · FIS-01", en: "Printing and printer problems", ar: "الطباعة ومشكلات الطابعة",
    steps: [["Print the receipt when the customer asks", "طباعة الإيصال عند الطلب"], ["Kitchen ticket prints per station", "قسيمة المطبخ لكل محطة"], ["Printer out of paper / off: sale still saved", "نفد الورق / الطابعة مطفأة: البيع محفوظ"], ["Retry from To print (no automatic replay)", "إعادة من «بانتظار الطباعة»"], ["Refund slip and shift slip", "إيصال الإرجاع وتقرير الوردية"]] },
  { id: "F08", ref: "OFF-01…09 · OFF-08", en: "Long outage and power cut mid-payment", ar: "انقطاع طويل وانقطاع الكهرباء أثناء الدفع",
    steps: [["Sell after hours offline (stronger warning)", "البيع بعد ساعات دون اتصال"], ["Next day offline: last known USD rate used", "يوم جديد دون اتصال: آخر سعر معروف"], ["Back online: sync report shows HQ changes", "عند العودة: تقرير المزامنة يعرض تغييرات الإدارة"], ["Power cut during payment: payment restored", "انقطاع أثناء الدفع: استعادة الدفع"], ["Non-cash payment confirmed after restart", "تأكيد الدفع غير النقدي بعد التشغيل"]] },
  { id: "F06", ref: "FLOW-06", en: "Back office operations", ar: "عمليات لوحة التحكم المركزية", steps: [], notBuilt: true }
];

/* ---------- render ---------- */
function render() {
  snapshotPay(); // D · keep the open payment through a power cut (pos-offline.js)
  var app = $("#app");
  var focusId = document.activeElement && document.activeElement.id, caret = focusId && document.activeElement.selectionStart;
  var view;
  if (!S.user) view = viewLogin();
  else if (!S.shift && UI.view !== "report") view = viewShiftOpen();
  else view = ({ sale: viewSale, payment: viewPayment, done: viewDone, orders: viewOrders, invoices: viewInvoices, close: viewClose, report: viewReport, audit: viewAudit, kitchen: viewKitchen, printq: viewPrintQueue }[UI.view] || viewSale)();
  app.innerHTML = '<div class="shell">' + topbar() + '<div style="display:flex;flex-direction:column;min-height:0">' + banner() + '<div style="flex:1;min-height:0;display:grid">' + view + "</div></div></div>" + sidePanel();
  if (focusId) { var el = document.getElementById(focusId); if (el) { el.focus(); try { el.setSelectionRange(caret, caret); } catch (e) {} } }
  if (S.online && !UI.syncing && S.queue.length && !UI.syncTimer) UI.syncTimer = setTimeout(function () { UI.syncTimer = null; if (S.online) { drain(); commit(); } }, 900);
}

function topbar() {
  var conn;
  if (UI.syncing) conn = '<button class="conn sync" data-act="side" data-arg="demo"><span class="dot"></span>' + esc(t("syncing")) + "</button>";
  else if (S.online) conn = '<button class="conn" data-act="side" data-arg="demo"><span class="dot"></span>' + esc(t("online")) + ' · <span class="num">' + esc(t("lastSync", { t: time(S.lastSync) })) + "</span></button>";
  else conn = '<button class="conn off" data-act="side" data-arg="demo" title="' + esc(t("lastSync", { t: time(S.lastSync) })) + '"><span class="dot"></span>' + esc(t("offline")) + esc(offlinePill()) + ' · <span class="num">' + esc(t("waiting", { n: pendingCount() })) + "</span></button>";
  var meta = '<div class="meta"><span title="' + esc(t("branch")) + " · " + esc(nm(POS_DATA.register)) + '"><b>' + esc(nm(POS_DATA.branch)) + "</b></span>" +
    (S.user ? '<span title="' + esc(t("cashier")) + '">👤 <b>' + esc(userName(S.user.id)) + "</b></span>" : "") +
    (S.shift ? '<span title="' + esc(t("shift")) + " · " + time(S.shift.openedAt) + '" class="num">' + esc(t("shift")) + " #" + S.shift.no + "</span>" : "") +
    '<span title="' + esc(t("rate")) + '" class="num' + (rateStale() ? " stale" : "") + '"><b>$1 = ' + fmt(rate()) + "</b></span></div>";
  var nav = "";
  if (S.user && S.shift) {
    var active = S.orders.filter(function (o) { return o.status !== "handed"; }).length;
    nav = '<button class="btn' + (UI.view === "sale" ? " sel" : "") + '" data-act="go" data-arg="sale">' + esc(t("order")) + "</button>" +
      '<button class="btn' + (UI.view === "orders" ? " sel" : "") + '" data-act="go" data-arg="orders">' + esc(t("orders")) + (active ? ' <span class="tag info num">' + active + "</span>" : "") + "</button>" +
      '<button class="btn' + (UI.view === "kitchen" ? " sel" : "") + '" data-act="go" data-arg="kitchen">' + esc(t("kitchen")) + "</button>" +
      '<button class="btn' + (UI.view === "invoices" ? " sel" : "") + '" data-act="go" data-arg="invoices">' + esc(t("invoices")) + "</button>" +
      '<button class="btn" data-act="side" data-arg="menu">☰ ' + esc(t("menu")) + "</button>";
  }
  return '<header class="topbar"><span class="brand">' + esc(t("appName")) + "</span>" + meta + '<span class="spacer"></span>' + printerChip() + conn + nav +
    '<button class="iconbtn" data-act="side" data-arg="guide" title="' + esc(t("guide")) + '" aria-label="' + esc(t("guide")) + '">✓</button><button class="iconbtn" data-act="lang" title="' + esc(t("lang")) + '" aria-label="' + esc(t("lang")) + '">' + (POS_LANG === "ar" ? "EN" : "ع") + "</button></header>";
}

function banner() {
  var out = "";
  out += offlineBanners(); // C · long outage (pos-offline.js)
  if (UI.flash) {
    var msg = UI.flash.msg === "restored" ? t("restored") : UI.flash.msg === "synced" ? t("synced", { n: UI.flash.n }) : UI.flash.msg;
    out += '<div class="banner ' + UI.flash.kind + '">' + esc(msg) + '<span class="spacer"></span>' + (UI.flash.report ? '<button class="linkbtn" data-act="syncReport">' + esc(t("oReport")) + "</button> · " : "") + '<button class="linkbtn" data-act="flashClose">' + esc(t("close")) + "</button></div>";
  }
  return out;
}

/* ---------- login ---------- */
var LOGIN = { who: null, pin: "", err: "" };
function viewLogin() {
  var people = POS_DATA.staff.map(function (u) {
    return '<button class="person' + (LOGIN.who === u.id ? " sel" : "") + '" data-act="who" data-arg="' + u.id + '"><div class="av">' + esc(nm(u).charAt(0)) + "</div>" + esc(nm(u)) +
      '<div class="tiny muted">' + esc(u.role === "manager" ? t("manager") : t("cashier")) + "</div></button>";
  }).join("");
  var pad = "";
  if (LOGIN.who) {
    var dots = ""; for (var i = 0; i < 4; i++) dots += '<span class="pindot' + (i < LOGIN.pin.length ? " on" : "") + '"></span>';
    pad = '<div class="muted small" style="text-align:center">' + esc(t("enterPin")) + ' <span class="tiny">(demo: 1111 · 2222 · 9999)</span></div><div class="pinrow">' + dots + '</div><div class="err">' + esc(LOGIN.err) + "</div>" + keypad("pin");
  }
  return '<div class="center"><div class="card" style="width:min(420px,100%)"><h1>' + esc(t("loginTitle")) + '</h1><p class="sub">' + esc(nm(POS_DATA.tenant)) + " · " + esc(nm(POS_DATA.branch)) + '</p><div class="people">' + people + "</div>" + pad + '<button class="btn block" style="margin-top:12px" data-act="cardLogin">▭ ' + esc(t("cardLogin")) + ' <span class="tag">USR-03</span></button></div></div>';
}
function keypad(target, alt) {
  var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", target === "pin" ? "" : (alt || "00"), "0", "⌫"];
  return '<div class="keypad">' + keys.map(function (k) { return k === "" ? "<span></span>" : '<button data-act="key" data-arg="' + target + ":" + k + '">' + k + "</button>"; }).join("") + "</div>";
}

/* ---------- shift open ---------- */
function viewShiftOpen() {
  var f = POS_DATA.settings.openingFloat;
  return '<div class="center"><div class="card" style="width:min(460px,100%)"><h2>' + esc(t("openShiftTitle")) + '</h2><p class="sub">' + esc(t("floatHint")) + " " + assume(f.decision) + "</p>" +
    '<div class="grid2"><div class="field"><label for="fSYP">' + esc(t("openingFloat")) + ' · SYP</label><input class="input num" id="fSYP" inputmode="numeric" value="' + f.SYP + '"></div>' +
    '<div class="field"><label for="fUSD">' + esc(t("openingFloat")) + ' · USD</label><input class="input num" id="fUSD" inputmode="decimal" value="' + f.USD + '"></div></div>' +
    '<button class="btn primary lg block" data-act="openShift">' + esc(t("openShift")) + '</button><div style="margin-top:10px;text-align:center"><button class="linkbtn" data-act="logout">' + esc(t("logout")) + "</button></div></div></div>";
}

/* ---------- sale ---------- */
function viewSale() {
  var tabs = [{ id: "fav", label: "★ " + t("favourites") }].concat(POS_DATA.categories.map(function (c) { return { id: c.id, label: nm(c) }; }));
  var tabsH = tabs.map(function (c) { return '<button class="btn' + (UI.cat === c.id ? " sel" : "") + '" data-act="cat" data-arg="' + c.id + '">' + esc(c.label) + "</button>"; }).join("");
  var q = UI.q.trim().toLowerCase();
  var list = POS_DATA.items.filter(function (i) {
    if (q) return i.name.toLowerCase().indexOf(q) >= 0 || i.nameAr.indexOf(UI.q.trim()) >= 0 || i.barcode === q;
    return UI.cat === "fav" ? i.fav : i.cat === UI.cat;
  });
  var tiles = list.map(function (i) {
    var st = S.stock[i.id] || 0, out = st <= 0;
    var corner = out ? '<span class="tag bad">' + esc(t("outOfStock")) + "</span>" : st <= 5 ? '<span class="tag assume num">' + esc(t("left", { n: st })) + "</span>" : "";
    var promo = POS_DATA.promotions.filter(function (p) { return p.type === "offerOfDay" && p.itemId === i.id; })[0];
    if (promo && !out) corner = '<span class="tag ok">−' + promo.pct + "%</span>";
    return '<button class="tile" data-act="item" data-arg="' + i.id + '"' + (out ? " disabled" : "") + '><span class="sw" style="background:' + i.color + '"></span><span class="corner">' + corner + '</span><span class="nm">' + esc(nm(i)) +
      '</span><span class="pr num">' + syp(i.price) + '</span><span class="usd num">≈ ' + usd(i.price / rate()) + "</span></button>";
  }).join("");
  return '<div class="sale"><section class="catalog"><input class="input" id="q" data-model="q" placeholder="' + esc(t("search")) + '" value="' + esc(UI.q) + '" autocomplete="off"><div class="cattabs">' + tabsH + '</div><div class="tiles">' + tiles + "</div></section>" + orderPane() + "</div>";
}

function optText(l) {
  var parts = [];
  ["size", "sugar"].forEach(function (g) {
    if (l.opts && l.opts[g]) { var c = POS_DATA.optionGroups[g].choices.filter(function (x) { return x.id === l.opts[g]; })[0]; if (c) parts.push(g === "sugar" ? nm(POS_DATA.optionGroups.sugar) + ": " + nm(c) : nm(c)); }
  });
  if (l.note) parts.push("“" + l.note + "”");
  return parts.join(" · ");
}

function orderPane() {
  var o = S.order, tt = totals(o), payLater = S.saleMode === "payLater";
  var head = '<div class="ohead"><div class="row between"><b>' + (o ? esc(t("orderNo", { n: o.no })) : esc(t("order"))) + '</b><button class="btn" data-act="held"' + (S.held.length ? "" : " disabled") + ">" + esc(t("held", { n: S.held.length })) + "</button></div>" +
    '<div class="seg"><button class="' + (!o || o.type === "takeaway" ? "on" : "") + '" data-act="otype" data-arg="takeaway">' + esc(t("takeaway")) + '</button><button class="' + (o && o.type === "dinein" ? "on" : "") + '" data-act="otype" data-arg="dinein">' + esc(t("dineIn")) + "</button></div></div>";
  var lines = !o || !o.lines.length ? '<div class="empty">' + esc(t("emptyOrder")) + "</div>" : o.lines.map(function (l) {
    var it = item(l.itemId);
    return '<div class="line"><div><div class="t">' + esc(nm(it)) + '</div><div class="o">' + esc(optText(l)) + "</div></div>" +
      '<div class="amt num">' + syp(lineUnit(l) * l.qty) + "</div>" +
      '<div class="row"><span class="stepper"><button data-act="qty" data-arg="' + l.id + ':-1" aria-label="−">−</button><span class="num">' + l.qty + '</span><button data-act="qty" data-arg="' + l.id + ':1" aria-label="+">+</button></span>' +
      (it.options.length ? '<button class="linkbtn" data-act="editLine" data-arg="' + l.id + '">' + esc(t("update")) + "</button>" : '<button class="linkbtn" data-act="noteLine" data-arg="' + l.id + '">' + esc(t("note")) + "</button>") +
      '</div><div style="text-align:end"><button class="linkbtn danger" data-act="removeLine" data-arg="' + l.id + '">' + esc(t("remove")) + "</button></div></div>";
  }).join("");
  var sums = "";
  if (o && o.lines.length) {
    sums = '<div class="sums"><div class="r"><span>' + esc(t("subtotal")) + '</span><span class="num">' + syp(tt.subtotal) + "</span></div>";
    tt.promoLines.forEach(function (p) { sums += '<div class="r promo"><span>' + esc(nm(p.promo)) + (p.times > 1 ? " ×" + p.times : "") + '</span><span class="num">' + neg(p.amount) + "</span></div>"; });
    if (o.discount) sums += '<div class="r promo"><span>' + esc(t("manualDiscount")) + " (" + (o.discount.kind === "pct" ? o.discount.value + "%" : syp(o.discount.value)) + ") · " + esc(userName(o.discount.by)) + ' <button class="linkbtn danger" data-act="dropDiscount">×</button></span><span class="num">' + neg(tt.manual) + "</span></div>";
    if (tt.rounding) sums += '<div class="r muted small"><span>' + esc(t("rounding")) + " " + assume(POS_DATA.settings.rounding.decision) + '</span><span class="num"><bdi dir="ltr">' + (tt.rounding > 0 ? "+" : "−") + fmt(Math.abs(tt.rounding)) + "</bdi></span></div>";
    sums += '<div class="r tot"><span>' + esc(t("total")) + '</span><span class="num">' + syp(tt.total) + '</span></div><div class="r muted small"><span></span><span class="num">≈ ' + usd(tt.usd) + "</span></div></div>";
  }
  var has = o && o.lines.length;
  var actions = '<div class="actions"><div class="row"><button class="btn" data-act="hold"' + (has ? "" : " disabled") + ">" + esc(t("hold")) + '</button><button class="btn" data-act="discount"' + (has ? "" : " disabled") + ">" + esc(t("manualDiscount")) + '</button><button class="btn danger" data-act="clear"' + (has ? "" : " disabled") + ">" + esc(t("clear")) + "</button></div>" +
    '<div class="row"><button class="btn" data-act="split"' + (o && (o.lines.length > 1 || (o.lines[0] && o.lines[0].qty > 1)) ? "" : " disabled") + ">" + esc(t("split")) + '</button><button class="btn" data-act="staffMeal"' + (has ? "" : " disabled") + ">" + esc(t("staffMeal")) + "</button></div>" +
    (payLater ? '<button class="btn accent lg block" data-act="confirmOrder"' + (has ? "" : " disabled") + ">" + esc(t("confirmOrder")) + '</button><div class="tiny muted" style="text-align:center">' + esc(t("payOnHandover")) + "</div>"
      : '<button class="btn primary lg block num" data-act="pay"' + (has ? "" : " disabled") + ">" + esc(t("pay")) + (has ? " · " + syp(tt.total) : "") + "</button>") + "</div>";
  return '<aside class="orderpane">' + head + '<div class="lines">' + lines + "</div>" + sums + actions + "</aside>";
}

function tapItem(id) {
  var it = item(id);
  if ((S.stock[id] || 0) <= 0) return;
  if (it.options.length) openOptions(id, null);
  else { addLine(id, {}, ""); guide("F01", 1); commit(); }
}

/* ---------- options modal ---------- */
function openOptions(itemId, lineId) {
  var it = item(itemId), line = lineId ? S.order.lines.filter(function (l) { return l.id === lineId; })[0] : null;
  var sel = {}; it.options.forEach(function (g) { sel[g] = line ? line.opts[g] : POS_DATA.optionGroups[g].choices[g === "sugar" ? 2 : 0].id; });
  var note = line ? line.note : "";
  function body() {
    return it.options.map(function (g) {
      var grp = POS_DATA.optionGroups[g];
      return '<div class="small muted">' + esc(nm(grp)) + " · " + esc(t("required")) + '</div><div class="choices">' + grp.choices.map(function (c) {
        return '<button class="btn' + (sel[g] === c.id ? " sel" : "") + '" data-mact="opt" data-arg="' + g + ":" + c.id + '">' + esc(nm(c)) + (c.delta ? ' <span class="tiny num">+' + fmt(c.delta) + "</span>" : "") + "</button>";
      }).join("") + "</div>";
    }).join("") + '<div class="field"><label for="optNote">' + esc(t("note")) + '</label><input class="input" id="optNote" value="' + esc(note) + '"></div>';
  }
  openModal(nm(it) + " · " + syp(it.price), body, [
    { label: t("cancel"), act: closeModal },
    { label: line ? t("update") : t("add"), cls: "primary", act: function () {
      note = $("#optNote").value.trim();
      if (line) { line.opts = sel; line.note = note; line.key = itemId + "|" + JSON.stringify(sel) + "|" + note; }
      else addLine(itemId, sel, note);
      guide("F01", 1); closeModal(); commit();
    } }
  ], { opt: function (arg) { var p = arg.split(":"); sel[p[0]] = p[1]; } });
}

/* ---------- manager approval (discount, cancel, drawer, close) ---------- */
function managerApproval(opts) {
  // opts: { title, reason:bool, extra:fn()->html, validate:fn()->string|null, onOk:fn(managerId, reason) }
  var who = POS_DATA.staff.filter(function (u) { return u.role === "manager"; })[0];
  function body() {
    return (opts.intro ? '<p class="small muted" style="margin-top:0">' + opts.intro + "</p>" : "") + (opts.extra ? opts.extra() : "") +
      '<div class="grid2"><div class="field"><label>' + esc(t("manager")) + '</label><input class="input" value="' + esc(nm(who)) + '" disabled></div>' +
      '<div class="field"><label for="mPin">PIN <span class="tiny muted">(demo 9999)</span></label><input class="input num" id="mPin" type="password" inputmode="numeric" maxlength="4"></div></div>' +
      (opts.reason ? '<div class="field"><label for="mReason">' + esc(t("reason")) + '</label><input class="input" id="mReason"></div>' : "") + '<div class="err" id="mErr"></div>';
  }
  openModal(opts.title || t("managerApproval"), body, [
    { label: t("cancel"), act: closeModal },
    { label: t("approve"), cls: "primary", act: function () {
      var pin = $("#mPin").value, reason = opts.reason ? $("#mReason").value.trim() : "";
      var err = opts.validate ? opts.validate() : null;
      if (!err && pin !== who.pin) err = t("wrongPin");
      if (!err && opts.reason && !reason) err = t("reasonRequired");
      if (err) { $("#mErr").textContent = err; return; }
      closeModal(); opts.onOk(who.id, reason);
    } }
  ], opts.mact || {});
}

function openDiscount() {
  var tt = totals(), ceil = POS_DATA.settings.discountCeilingPct.value, kind = "pct", dv = 0;
  managerApproval({
    title: t("manualDiscount"), reason: true,
    intro: esc(t("ceiling", { n: ceil })) + " " + assume(POS_DATA.settings.discountCeilingPct.decision),
    extra: function () {
      return '<div class="choices"><button class="btn' + (kind === "pct" ? " sel" : "") + '" data-mact="dk" data-arg="pct">' + esc(t("pct")) + ' %</button><button class="btn' + (kind === "amt" ? " sel" : "") + '" data-mact="dk" data-arg="amt">' + esc(t("amount")) + ' SYP</button></div><div class="field"><label for="dVal">' + esc(kind === "pct" ? t("pct") : t("amount")) + '</label><input class="input num" id="dVal" inputmode="numeric"></div>';
    },
    mact: { dk: function (a) { kind = a; } },
    validate: function () {
      var v = parseFloat($("#dVal").value) || 0, base = tt.subtotal - tt.promo; dv = v;
      if (v <= 0) return t("amount") + "?";
      var pct = kind === "pct" ? v : v / base * 100;
      return pct > ceil ? t("overCeiling", { n: ceil }) : null;
    },
    onOk: function (mid, reason) {
      S.order.discount = { kind: kind, value: dv, by: mid, reason: reason };
      guide("F01", 2); commit();
    }
  });
}

/* ---------- payment ---------- */
function startPayment(orderRef) {
  UI.pay = { orderRef: orderRef || null, tenders: [], method: "cashSYP", entry: "", ref: "" };
  UI.view = "payment"; render();
}
function payOrder() { return UI.pay && UI.pay.orderRef ? S.orders.filter(function (o) { return o.id === UI.pay.orderRef; })[0].order : S.order; }
function viewPayment() {
  if (method(UI.pay.method).online && !S.online) UI.pay.method = "cashSYP";
  var o = payOrder(), tt = totals(o), ps = payState(tt.total, UI.pay.tenders), m = method(UI.pay.method);
  var tenders = UI.pay.tenders.map(function (x, i) {
    return '<div class="tender"><span>' + esc(t(x.method)) + (x.ref ? ' <span class="tiny muted">#' + esc(x.ref) + "</span>" : "") + '</span><span class="num">' + (x.currency === "USD" ? usd(x.amount) + ' <span class="tiny muted">= ' + syp(x.amount * x.rate) + "</span>" : syp(x.amount)) +
      ' <button class="linkbtn danger" data-act="dropTender" data-arg="' + i + '">×</button></span></div>';
  }).join("");
  var left = '<div class="panel"><div class="muted small">' + esc(t("total")) + '</div><div class="big num">' + syp(tt.total) + '</div><div class="muted num">≈ ' + usd(tt.usd) + " · " + esc(t("pinnedRate", { r: fmt(rate()) })) + "</div>" +
    '<h3 style="margin-top:16px">' + esc(t("tenders")) + (UI.pay.tenders.length > 1 ? " " + assume("D-10") : "") + "</h3>" + (tenders || '<div class="muted small">—</div>') +
    '<div style="margin-top:12px"><div class="kv"><span>' + esc(t("received")) + '</span><b class="num">' + syp(ps.paid) + '</b></div><div class="kv"><span>' + esc(t("remaining")) + '</span><b class="num">' + syp(ps.remaining) + "</b></div>" +
    '<div class="kv"><span>' + esc(t("change")) + " " + (ps.change ? assume("D-29") : "") + '</span><b class="num" style="color:var(--ok)">' + syp(ps.change) + "</b></div></div>" +
    '<div style="margin-top:10px">' + (UI.pay.company ? '<span class="tag info">' + esc(t("companySet", { n: UI.pay.company.name })) + '</span> ' : "") + '<button class="linkbtn" data-act="company">' + esc(t("company")) + '</button> ' + assume(POS_DATA.settings.companyInvoice.decision) + '</div>' +
    '<div class="row" style="margin-top:14px"><button class="btn" data-act="payBack">' + esc(t("back")) + '</button><button class="btn primary lg" style="flex:1" data-act="payConfirm"' + (ps.done && UI.pay.tenders.length ? "" : " disabled") + ">" + esc(t("confirmClose")) + "</button></div></div>";
  var methods = POS_DATA.methods.map(function (x) {
    var dis = x.online && !S.online;
    return '<button class="btn' + (UI.pay.method === x.id ? " sel" : "") + '" data-act="method" data-arg="' + x.id + '"' + (dis ? " disabled" : "") + ">" + esc(t(x.id)) + (x.decision ? '<span class="tiny">' + esc(x.decision) + "</span>" : "") + "</button>";
  }).join("");
  var remainingInCur = m.currency === "USD" ? ps.remaining / rate() : ps.remaining;
  var quick = [];
  if (m.currency === "USD") { var e = Math.ceil(remainingInCur * 100) / 100; quick = [e, Math.ceil(remainingInCur), Math.ceil(remainingInCur / 5) * 5, Math.ceil(remainingInCur / 10) * 10]; }
  else { quick = [remainingInCur]; if (m.cash) quick = quick.concat([Math.ceil(remainingInCur / 10000) * 10000, Math.ceil(remainingInCur / 50000) * 50000, Math.ceil(remainingInCur / 100000) * 100000]); }
  quick = quick.filter(function (v, i, a) { return v > 0 && a.indexOf(v) === i; });
  var quickH = quick.map(function (v, i) { return '<button class="btn num" data-act="quick" data-arg="' + v + '">' + (i === 0 ? esc(t("exact")) + " · " : "") + (m.currency === "USD" ? usd(v) : fmt(v)) + "</button>"; }).join("");
  var right = '<div class="panel"><h3>' + esc(t("method")) + "</h3>" + (!S.online ? '<div class="tag assume" style="margin-bottom:8px">' + esc(t("needsConnection")) + "</div>" : "") + '<div class="methods">' + methods + "</div>" +
    '<div class="amountbox num">' + (UI.pay.entry ? (m.currency === "USD" ? "$" + UI.pay.entry : fmt(+UI.pay.entry)) : '<span class="muted">0</span>') + "</div>" +
    '<div class="quick">' + quickH + "</div>" + (m.needsRef ? '<div class="field"><label for="refNo">' + esc(t("refNo")) + '</label><input class="input num" id="refNo" data-model="payRef" value="' + esc(UI.pay.ref) + '"></div>' : "") +
    keypad("amt", m.currency === "USD" ? "." : "00") + '<button class="btn primary block" style="margin-top:10px;min-height:48px" data-act="addTender"' + (ps.remaining > 0 ? "" : " disabled") + ">" + esc(t("addTender")) + "</button></div>";
  return '<div class="pay">' + left + right + "</div>";
}
function addTender(amount) {
  var m = method(UI.pay.method), o = payOrder(), tt = totals(o), ps = payState(tt.total, UI.pay.tenders);
  if (!(amount > 0) || ps.remaining <= 0) return;
  if (m.online && !S.online) return;
  if (!m.cash) { var cap = m.currency === "USD" ? ps.remaining / rate() : ps.remaining; amount = Math.min(amount, cap); } // non-cash never exceeds the balance
  if (m.needsRef && !UI.pay.ref.trim()) { toast(t("refNo") + "?"); return; }
  UI.pay.tenders.push({ method: m.id, currency: m.currency, amount: amount, rate: rate(), ref: m.needsRef ? UI.pay.ref.trim() : "" });
  UI.pay.entry = ""; UI.pay.ref = "";
  render();
}
function confirmPayment() {
  var prev = alreadyPaid(UI.pay.draftId); // D · the same payment never becomes two invoices
  if (prev) { UI.lastInvoice = prev.id; UI.pay = null; UI.view = "done"; S.payDraft = null; commit(); return; }
  var draftId = UI.pay.draftId;
  var ref = UI.pay.orderRef, o = payOrder(), inv = completeSale(o, UI.pay.tenders);
  if (UI.pay.company) inv.company = UI.pay.company;
  var cash = UI.pay.tenders.some(function (x) { return method(x.method).cash; });
  if (UI.pay.tenders.length > 1 || UI.pay.tenders.some(function (x) { return x.currency === "USD"; })) guide("F01", 4);
  guide("F01", 5);
  if (!S.online) guide("F05", 0);
  if (ref) { var bo = S.orders.filter(function (x) { return x.id === ref; })[0]; bo.unpaid = false; bo.invoiceId = inv.id; guide("F02", 2); }
  else { S.orders.push({ id: uid("K"), no: o.no, type: o.type, status: "preparing", unpaid: false, invoiceId: inv.id, order: JSON.parse(JSON.stringify(o)) }); S.order = null; }
  printAfterSale(inv, !!ref);
  offlineAfterSale(inv, draftId);
  UI.lastInvoice = inv.id; UI.pay = null; UI.view = "done";
  if (cash) toast(t("drawerOpened"));
  commit();
}

/* ---------- done ---------- */
function invoiceText(inv) { return paperReceipt(inv, { copy: inv._copy }); } // A · 80 mm paper (pos-print.js)
function viewDone() {
  var inv = S.invoices.filter(function (i) { return i.id === UI.lastInvoice; })[0];
  if (!inv) { UI.view = "sale"; return viewSale(); }
  var o = S.orders.filter(function (x) { return x.invoiceId === inv.id; })[0];
  var tickets = o ? kitchenTickets(o).map(function (k) { return k.html; }).join("") : "";
  var printed = inv.print && inv.print.receipt === "printed";
  return '<div class="done"><div class="panel"><div class="success">✓ ' + esc(t("paid")) + '</div><p class="muted">' + esc(t("sentToKitchen")) + " · " + esc(t("orderNo", { n: inv.orderNo })) + "</p>" +
    (inv.changeSYP ? '<div class="kv"><span>' + esc(t("change")) + '</span><b class="big num" style="font-size:28px">' + syp(inv.changeSYP) + "</b></div>" : "") +
    '<div class="kv"><span>' + esc(t("invoice")) + '</span><span class="num">' + esc(inv.no) + " " + syncTag(inv) + "</span></div>" + doneNotices(inv) +
    '<div class="row wrap" style="margin-top:16px"><button class="btn' + (printed ? "" : " lg") + '" data-act="printReceipt" data-arg="' + inv.id + '">🖨 ' + esc(printed ? t("reprint") : t("printReceipt")) + '</button><button class="btn" data-act="print">' + esc(t("pPreview")) + '</button><button class="btn primary lg" style="flex:1" data-act="newSale">' + esc(t("newSale")) + "</button></div>" +
    '<p class="tiny muted">FIS-01 · ' + esc(t("pOnRequest")) + "</p></div>" +
    '<div class="paper-col">' + invoiceText(inv) + '</div><div class="paper-col">' + tickets + "</div></div>";
}
function syncTag(inv) {
  if (inv.syncState === "synced") return '<span class="tag ok">✓ ' + esc(t("syncedTag")) + "</span>";
  if (inv.syncState === "offline") return '<span class="tag assume">' + esc(t("offline")) + "</span>";
  return '<span class="tag info">' + esc(t("pendingTag")) + "</span>";
}

/* ---------- orders board (prep & hand-over) ---------- */
function viewOrders() {
  var cols = [["preparing", t("preparing")], ["ready", t("ready")], ["handed", t("handedOver")]];
  var h = cols.map(function (c) {
    var list = S.orders.filter(function (o) { return o.status === c[0]; }).slice().reverse().slice(0, 12);
    return '<div class="col"><h3>' + esc(c[1]) + '<span class="tag num">' + list.length + "</span></h3>" + list.map(function (o) {
      var btn = "";
      if (o.status === "preparing") btn = '<button class="btn" data-act="ready" data-arg="' + o.id + '">' + esc(t("markReady")) + "</button>";
      if (o.status === "ready") btn = o.unpaid ? '<button class="btn primary" data-act="payNow" data-arg="' + o.id + '">' + esc(t("payNow")) + "</button>" : '<button class="btn primary" data-act="handOver" data-arg="' + o.id + '">' + esc(t("handOver")) + "</button>";
      if (o.status === "preparing" && o.unpaid) btn += '<button class="btn" data-act="payNow" data-arg="' + o.id + '">' + esc(t("payNow")) + "</button>";
      return '<div class="ocard"><div class="row between"><span class="n num">#' + o.no + '</span><span>' + esc(o.type === "dinein" ? t("dineIn") : t("takeaway")) + (o.unpaid ? ' <span class="tag assume">' + esc(t("unpaid")) + "</span>" : "") + (o.ticketFailed ? ' <span class="tag bad">🖨 ' + esc(t("pNotPrinted")) + "</span>" : "") + '</span></div><div class="small muted">' +
        o.order.lines.map(function (l) { return l.qty + "× " + esc(nm(item(l.itemId))); }).join(", ") + '</div><div class="row">' + btn + "</div></div>";
    }).join("") + "</div>";
  }).join("");
  return '<div class="page"><h2>' + esc(t("orders")) + '</h2><div class="board">' + h + "</div></div>";
}

/* ---------- invoices & cancel/refund ---------- */
function viewInvoices() {
  var list = shiftInvoices().slice().reverse();
  if (!list.length) return '<div class="page"><h2>' + esc(t("invoices")) + '</h2><div class="empty">' + esc(t("noInvoices")) + "</div></div>";
  var rows = list.map(function (i) {
    var st = i.status === "paid" ? '<span class="tag ok">' + esc(t("statusPaid")) + "</span>" : i.status === "refunded" ? '<span class="tag bad">' + esc(t("statusRefunded")) + "</span>" : '<span class="tag bad">' + esc(t("statusCancelled")) + "</span>";
    return '<tr class="click" data-act="invoice" data-arg="' + i.id + '"><td class="num">' + esc(i.no) + '</td><td class="num">' + time(i.ts) + "</td><td>#" + i.orderNo + '</td><td class="num">' + syp(i.totals.total) + "</td><td>" +
      i.tenders.map(function (x) { return esc(t(x.method)); }).join(" + ") + "</td><td>" + esc(userName(i.userId)) + "</td><td>" + st + "</td><td>" + syncTag(i) + "</td></tr>";
  }).join("");
  return '<div class="page"><h2>' + esc(t("invoices")) + '</h2><table class="list"><thead><tr><th>' + esc(t("invoice")) + "</th><th>⏱</th><th>" + esc(t("order")) + "</th><th>" + esc(t("total")) + "</th><th>" + esc(t("method")) + "</th><th>" + esc(t("cashier")) + "</th><th>" + esc(t("status")) + "</th><th>" + esc(t("syncCol")) + "</th></tr></thead><tbody>" + rows + "</tbody></table></div>";
}
function openInvoice(id) {
  var inv = S.invoices.filter(function (i) { return i.id === id; })[0];
  var btns = [{ label: t("close"), act: closeModal }];
  btns.push({ label: t("reprint"), act: function () { log("reprint", inv.no); printReceiptNow(inv, true); inv._copy = true; drawModal(); inv._copy = false; save(); } });
  if (inv.status === "paid") btns.push({ label: t("cancelInvoice"), cls: "danger", act: function () { closeModal(); cancelInvoice(inv); } });
  if (inv.status === "cancelled") btns.push({ label: t("refundCash"), cls: "primary", act: function () { closeModal(); refundInvoice(inv); } });
  openModal(t("invoice") + " · " + inv.no, function () { return invoiceText(inv); }, btns);
}
function cancelInvoice(inv) {
  managerApproval({
    title: t("cancelInvoice") + " · " + inv.no, reason: true,
    onOk: function (mid, reason) {
      inv.status = "cancelled"; inv.cancel = { by: mid, reason: reason, ts: Date.now() };
      inv.lines.forEach(function (l) { S.stock[l.itemId] = (S.stock[l.itemId] || 0) + l.qty; });
      queue("invoice", inv.id); inv.syncState = S.online ? "pending" : "offline";
      log("cancel", inv.no + " · " + reason + " · " + t("stockReturned"), mid);
      guide("F03", 0); toast(t("cancelDone")); commit();
      setTimeout(function () { openInvoice(inv.id); }, 50);
    }
  });
}
function refundInvoice(inv) {
  var r = refundAmounts(inv);
  inv.refund = { by: S.user.id, ts: Date.now(), SYP: r.SYP, USD: r.USD, nonCash: r.nonCash };
  inv.status = "refunded"; queue("invoice", inv.id);
  var nc = Object.keys(r.nonCash).map(function (m) { return t(m) + " " + fmt(r.nonCash[m]); }).join(", ");
  log("refund", inv.no + " · SYP " + fmt(r.SYP) + " · USD " + fmtUSD(r.USD) + (nc ? " · " + nc : "") + " · drawer");
  var slip = printJob({ kind: "refund", ref: inv.id });
  guide("F03", 1); toast(t("refundDone") + (slip ? "" : " · " + t("pNotPrinted"))); commit();
}

/* ---------- audit ---------- */
function viewAudit() {
  if (S.audit.some(function (a) { return a.action === "cancel"; })) guide("F03", 2);
  var rows = S.audit.slice().reverse().slice(0, 200).map(function (a) {
    return '<tr><td class="num">' + new Date(a.ts).toLocaleTimeString("en-GB") + "</td><td>" + esc(userName(a.userId)) + '</td><td><span class="tag">' + esc(a.action) + '</span></td><td class="small">' + esc(a.detail) + "</td></tr>";
  }).join("");
  return '<div class="page"><h2>' + esc(t("audit")) + '</h2><p class="muted small">' + esc(t("auditHint")) + '</p><table class="list"><thead><tr><th>⏱</th><th>' + esc(t("cashier")) + "</th><th>" + esc(t("action")) + "</th><th></th></tr></thead><tbody>" + rows + "</tbody></table></div>";
}

/* ---------- shift close ---------- */
function startClose() {
  managerApproval({ title: t("closeShift") + " · " + t("countBy"), onOk: function (mid) {
    UI.closing = { by: mid, SYP: "", USD: "", reason: "" }; UI.view = "close"; commit();
  } });
}
function viewClose() {
  var ex = expectedCash(), c = UI.closing, lim = POS_DATA.settings.varianceLimitSYP;
  var cs = c.SYP === "" ? null : +c.SYP, cu = c.USD === "" ? null : +c.USD;
  var vS = cs == null ? null : cs - ex.cash.SYP, vU = cu == null ? null : cu - ex.cash.USD;
  var vTotal = (vS || 0) + (vU || 0) * rate(), over = Math.abs(vTotal) > lim.value, ready = cs != null && cu != null;
  function row(cur, exp, id, val, v) {
    return '<tr><td><b>' + cur + '</b></td><td class="num">' + (cur === "USD" ? usd(exp) : fmt(exp)) + '</td><td><input class="input num" id="' + id + '" data-model="' + id + '" inputmode="decimal" value="' + esc(val) + '" style="max-width:160px"></td><td class="num ' + (v == null ? "" : v === 0 ? "var-ok" : "var-bad") + '">' + (v == null ? "—" : '<bdi dir="ltr">' + (v > 0 ? "+" : v < 0 ? "−" : "") + (cur === "USD" ? fmtUSD(Math.abs(v)) : fmt(Math.abs(v))) + "</bdi>") + "</td></tr>";
  }
  var nc = Object.keys(ex.nonCash).map(function (m) { return '<div class="kv"><span>' + esc(t(m)) + '</span><span class="num">' + fmt(ex.nonCash[m]) + "</span></div>"; }).join("") || '<div class="muted small">—</div>';
  var left = '<div class="panel"><h3>' + esc(t("cashCount")) + ' <span class="tag info">' + esc(t("countBy")) + ": " + esc(userName(c.by)) + '</span></h3><table class="list"><thead><tr><th></th><th>' + esc(t("expected")) + "</th><th>" + esc(t("counted")) + "</th><th>" + esc(t("variance")) + "</th></tr></thead><tbody>" +
    row("SYP", ex.cash.SYP, "cSYP", c.SYP, vS) + row("USD", ex.cash.USD, "cUSD", c.USD, vU) + "</tbody></table>" +
    (ready ? '<p class="' + (over ? "var-bad" : "var-ok") + '">' + esc(over ? t("overLimit", { n: syp(lim.value) }) : t("withinLimit", { n: syp(lim.value) })) + " " + assume(lim.decision) + "</p>" : "") +
    (ready && over ? '<div class="field"><label for="cReason">' + esc(t("reason")) + '</label><input class="input" id="cReason" data-model="cReason" value="' + esc(c.reason) + '"></div>' : "") +
    '<div class="row" style="margin-top:12px"><button class="btn" data-act="go" data-arg="sale">' + esc(t("back")) + '</button><button class="btn primary lg" style="flex:1" data-act="closeShift"' + (ready && (!over || c.reason.trim()) ? "" : " disabled") + ">" + esc(t("closeAndPrint")) + "</button></div></div>";
  var right = '<div class="panel"><h3>' + esc(t("shiftReport")) + '</h3><div class="kv"><span>' + esc(t("sales")) + '</span><b class="num">' + syp(ex.sales) + '</b></div><div class="kv"><span>' + esc(t("invoices")) + '</span><span class="num">' + ex.count + '</span></div><div class="kv"><span>' + esc(t("cancels")) + '</span><span class="num">' + ex.cancels + '</span></div><div class="kv"><span>' + esc(t("refunds")) + '</span><span class="num">' + ex.refunds + '</span></div><h3 style="margin-top:14px">' + esc(t("nonCash")) + "</h3>" + nc +
    '<h3 style="margin-top:14px">' + esc(t("openingFloat")) + '</h3><div class="kv"><span>SYP</span><span class="num">' + fmt(S.shift.float.SYP) + '</span></div><div class="kv"><span>USD</span><span class="num">' + fmtUSD(S.shift.float.USD) + "</span></div></div>";
  return '<div class="count">' + left + right + "</div>";
}
function doCloseShift() {
  var ex = expectedCash(), c = UI.closing, cs = +c.SYP, cu = +c.USD;
  var rep = { shiftNo: S.shift.no, openedAt: S.shift.openedAt, closedAt: Date.now(), userId: S.shift.userId, countedBy: c.by, float: S.shift.float,
    expected: ex.cash, counted: { SYP: cs, USD: cu }, variance: { SYP: cs - ex.cash.SYP, USD: cu - ex.cash.USD }, reason: c.reason, nonCash: ex.nonCash, sales: ex.sales, count: ex.count, cancels: ex.cancels, refunds: ex.refunds };
  var over = Math.abs(rep.variance.SYP + rep.variance.USD * rate()) > POS_DATA.settings.varianceLimitSYP.value;
  log("shiftClose", "#" + rep.shiftNo + " · var SYP " + fmt(rep.variance.SYP) + " · USD " + fmtUSD(rep.variance.USD) + (c.reason ? " · " + c.reason : ""), c.by);
  queue("shift", S.shift.id);
  rep.printed = printJob({ kind: "shift", report: rep });
  S.lastReport = rep; S.shift = null; UI.closing = null; UI.view = "report";
  guide("F04", 2); guide("F04", 3); guide("F04", 4);
  if (!S.online) guide("F05", 0);
  commit();
}
function viewReport() {
  var r = S.lastReport;
  if (!r) { UI.view = "sale"; return viewSale(); }
  return '<div class="center"><div class="card" style="width:min(420px,100%)">' + (r.printed ? "" : '<div class="pwarn"><b>⚠ ' + esc(t("pNotPrinted")) + "</b><div>" + esc(t("pQueueHint")) + "</div></div>") +
    '<div class="paper-stage">' + paperShift(r) + '</div><div class="row" style="margin-top:14px"><button class="btn" data-act="printShift">' + esc(t("pBrowserPrint")) + '</button><button class="btn primary lg" style="flex:1" data-act="reportDone">' + esc(t("done")) + "</button></div></div></div>";
}

/* ---------- side panels: menu, guide, demo ---------- */
function sidePanel() {
  if (!UI.side) return "";
  var title, body;
  if (UI.side === "menu") {
    title = t("menu");
    body = '<div class="menu-list"><button class="btn" data-act="go" data-arg="orders">' + esc(t("orders")) + '</button><button class="btn" data-act="go" data-arg="invoices">' + esc(t("invoices")) +
      '</button><button class="btn" data-act="drawer">' + esc(t("openDrawer")) + " · " + esc(t("noSale")) + '</button><button class="btn" data-act="startClose">' + esc(t("closeShift")) +
      '</button><button class="btn" data-act="openDisplay">' + esc(t("openDisplay")) + '</button><button class="btn" data-act="go" data-arg="audit">' + esc(t("audit")) + '</button><button class="btn" data-act="go" data-arg="printq">🖨 ' + esc(t("pToPrint")) + (S.printQueue.length ? ' <span class="tag bad num">' + S.printQueue.length + "</span>" : "") + '</button><button class="btn" data-act="logout">' + esc(t("logout")) + "</button></div>";
  } else if (UI.side === "guide") {
    title = t("guide");
    body = FLOWS.map(function (f) {
      var done = S.guide[f.id] || {}, n = Object.keys(done).length;
      return '<div class="flow"><h4><span>' + esc(f.ref) + " · " + esc(POS_LANG === "ar" ? f.ar : f.en) + "</span>" + (f.notBuilt ? "" : '<span class="tag ' + (n === f.steps.length ? "ok" : "") + ' num">' + n + "/" + f.steps.length + "</span>") + "</h4>" + (f.notBuilt ? '<div class="small muted">' + esc(t("notBuilt")) + "</div>" : "") +
        (f.steps.length ? "<ol>" + f.steps.map(function (s, i) { return '<li class="' + (done[i] ? "ok" : "") + '">' + esc(POS_LANG === "ar" ? s[1] : s[0]) + "</li>"; }).join("") + "</ol>" : "") + "</div>";
    }).join("") + '<button class="linkbtn" data-act="resetGuide">↺ ' + esc(t("resetGuide")) + "</button>";
  } else {
    title = t("demo");
    body = '<div class="menu-list"><button class="btn" data-act="toggleOnline">' + esc(S.online ? t("goOffline") : t("goOnline")) + '</button><button class="btn" data-act="powerCut">⚡ ' + esc(t("powerCut")) + "</button></div>" + printerDemo() + offlineDemo() +
      '<div class="field" style="margin-top:16px"><label>' + esc(t("saleModeLbl")) + '</label><div class="seg"><button class="' + (S.saleMode === "payFirst" ? "on" : "") + '" data-act="saleMode" data-arg="payFirst">' + esc(t("payFirst")) + '</button><button class="' + (S.saleMode === "payLater" ? "on" : "") + '" data-act="saleMode" data-arg="payLater">' + esc(t("payLater")) + "</button></div></div>" +
      '<div class="small muted" style="margin:12px 0">' + esc(t("waiting", { n: pendingCount() })) + " · " + esc(t("lastSync", { t: time(S.lastSync) })) + '</div><button class="btn danger" data-act="reset">' + esc(t("resetDemo")) + "</button>";
  }
  return '<aside class="side" role="dialog" aria-label="' + esc(title) + '"><header><h3>' + esc(title) + '</h3><button class="iconbtn" data-act="sideClose" aria-label="' + esc(t("close")) + '">✕</button></header><div class="body">' + body + "</div></aside>";
}

/* ---------- modal ---------- */
var MODAL = null;
function openModal(title, bodyFn, buttons, mact) {
  MODAL = { title: title, bodyFn: bodyFn, buttons: buttons, mact: mact || {} };
  drawModal();
}
function drawModal() {
  if (!MODAL) { $("#modal-root").innerHTML = ""; return; }
  var vals = {}; document.querySelectorAll("#modal-root input").forEach(function (i) { vals[i.id] = i.value; });
  $("#modal-root").innerHTML = '<div class="scrim" data-act="scrim"><div class="modal" role="dialog" aria-modal="true"><header><h3>' + esc(MODAL.title) + '</h3><button class="iconbtn" data-act="modalClose" aria-label="' + esc(t("close")) + '">✕</button></header><div class="body">' + MODAL.bodyFn() + "</div><footer>" +
    MODAL.buttons.map(function (b, i) { return '<button class="btn ' + (b.cls || "") + '" data-mbtn="' + i + '">' + esc(b.label) + "</button>"; }).join("") + "</footer></div></div>";
  Object.keys(vals).forEach(function (k) { var el = document.getElementById(k); if (el) el.value = vals[k]; });
  var first = $("#modal-root input:not([disabled])"); if (first && !first.value) first.focus();
}
function closeModal() { MODAL = null; drawModal(); }

/* ---------- events ---------- */
function onInput(e) {
  var m = e.target.dataset.model;
  if (!m) return;
  var v = e.target.value;
  if (m === "q") { UI.q = v; render(); }
  else if (m === "payRef") UI.pay.ref = v;
  else if (m === "cSYP") { UI.closing.SYP = v.replace(/[^\d.]/g, ""); render(); }
  else if (m === "cUSD") { UI.closing.USD = v.replace(/[^\d.]/g, ""); render(); }
  else if (m === "cReason") { UI.closing.reason = v; render(); }
}

function onClick(e) {
  var mb = e.target.closest("[data-mbtn]");
  if (mb && MODAL) { MODAL.buttons[+mb.dataset.mbtn].act(); return; }
  var ma = e.target.closest("[data-mact]");
  if (ma && MODAL) { var f = MODAL.mact[ma.dataset.mact]; if (f) { f(ma.dataset.arg); drawModal(); } return; }
  var el = e.target.closest("[data-act]");
  if (!el) return;
  if (el.dataset.act === "scrim" && e.target !== el) return;
  var h = H[el.dataset.act];
  if (h) h(el.dataset.arg, el);
}

var H = {
  lang: function () { setLang(POS_LANG === "ar" ? "en" : "ar"); render(); drawModal(); },
  side: function (a) { UI.side = UI.side === a ? null : a; render(); },
  sideClose: function () { UI.side = null; render(); },
  flashClose: function () { UI.flash = null; render(); },
  modalClose: closeModal, scrim: closeModal,
  go: function (a) { UI.view = a; UI.side = null; render(); },

  who: function (a) { LOGIN.who = a; LOGIN.pin = ""; LOGIN.err = ""; render(); },
  key: function (a) {
    var p = a.split(":"), target = p[0], k = p[1];
    if (target === "pin") {
      if (k === "⌫") LOGIN.pin = LOGIN.pin.slice(0, -1); else if (LOGIN.pin.length < 4) LOGIN.pin += k;
      if (LOGIN.pin.length === 4) {
        var u = staff(LOGIN.who);
        if (u.pin === LOGIN.pin) { S.user = { id: u.id }; log("login", nm(u), u.id); guide("F01", 0); LOGIN = { who: null, pin: "", err: "" }; UI.view = "sale"; commit(); return; }
        LOGIN.err = t("wrongPin"); LOGIN.pin = "";
      }
      render();
    } else {
      var en = UI.pay.entry;
      if (k === "⌫") en = en.slice(0, -1);
      else if (k === "." && en.indexOf(".") >= 0) return;
      else if (en.length < 12) en = (en === "0" ? "" : en) + (k === "." && !en ? "0." : k);
      UI.pay.entry = en; render();
    }
  },
  logout: function () { S.user = null; UI.side = null; commit(); },
  openShift: function () {
    var fs = parseFloat($("#fSYP").value) || 0, fu = parseFloat($("#fUSD").value) || 0;
    openShift({ SYP: fs, USD: fu }); guide("F04", 0); UI.view = "sale"; commit();
  },

  cat: function (a) { UI.cat = a; UI.q = ""; render(); },
  item: function (a) { tapItem(a); },
  otype: function (a) { if (!S.order) newOrder(); S.order.type = a; commit(); },
  qty: function (a) {
    var p = a.split(":"), l = S.order.lines.filter(function (x) { return x.id === p[0]; })[0];
    l.qty += +p[1]; if (l.qty <= 0) S.order.lines = S.order.lines.filter(function (x) { return x !== l; });
    commit();
  },
  removeLine: function (a) { S.order.lines = S.order.lines.filter(function (x) { return x.id !== a; }); commit(); },
  editLine: function (a) { var l = S.order.lines.filter(function (x) { return x.id === a; })[0]; openOptions(l.itemId, l.id); },
  noteLine: function (a) {
    var l = S.order.lines.filter(function (x) { return x.id === a; })[0];
    openModal(t("note"), function () { return '<input class="input" id="lnote" value="' + esc(l.note) + '">'; }, [{ label: t("cancel"), act: closeModal }, { label: t("update"), cls: "primary", act: function () { l.note = $("#lnote").value.trim(); closeModal(); commit(); } }]);
  },
  clear: function () { S.order = null; commit(); },
  discount: openDiscount,
  dropDiscount: function () { S.order.discount = null; commit(); },
  hold: function () { S.held.push(S.order); S.order = null; log("hold", "#" + S.held[S.held.length - 1].no); commit(); toast(t("hold") + " ✓"); },
  held: function () {
    openModal(t("held", { n: S.held.length }), function () {
      return S.held.map(function (o, i) { var tt = totals(o); return '<div class="tender"><span>#' + o.no + " · " + tt.count + ' <span class="tiny muted">' + time(o.createdAt) + '</span></span><span class="num">' + syp(tt.total) + ' <button class="btn" data-mact="resume" data-arg="' + i + '">▶</button></span></div>'; }).join("");
    }, [{ label: t("close"), act: closeModal }], { resume: function (i) {
      var o = S.held.splice(+i, 1)[0];
      if (S.order && S.order.lines.length) S.held.push(S.order);
      S.order = o; guide("F01", 3); log("resume", "#" + o.no); closeModal(); commit();
    } });
  },
  pay: function () { if (totals().promoLines.length) guide("F01", 2); startPayment(null); },
  confirmOrder: function () {
    var o = S.order;
    var ko = { id: uid("K"), no: o.no, type: o.type, status: "preparing", unpaid: true, invoiceId: null, createdTs: Date.now(), order: JSON.parse(JSON.stringify(o)) };
    S.orders.push(ko);
    log("orderConfirmed", "#" + o.no + " · pay later"); S.order = null; guide("F02", 0);
    toast(printKitchenFor(ko) ? t("pOrderNoTicket") : t("orderConfirmed")); commit();
  },

  method: function (a) { UI.pay.method = a; UI.pay.entry = ""; render(); },
  quick: function (a) { addTender(parseFloat(a)); },
  addTender: function () { addTender(parseFloat(UI.pay.entry)); },
  dropTender: function (a) { UI.pay.tenders.splice(+a, 1); render(); },
  payBack: function () { var ref = UI.pay.orderRef; UI.pay = null; UI.view = ref ? "orders" : "sale"; render(); },
  payConfirm: confirmPayment,
  print: function () { var inv = S.invoices.filter(function (i) { return i.id === UI.lastInvoice; })[0]; if (inv) previewPaper(t("invoice") + " · " + inv.no, paperReceipt(inv)); },
  printReceipt: function (a) { var inv = S.invoices.filter(function (i) { return i.id === a; })[0]; printReceiptNow(inv, inv.print && inv.print.receipt === "printed"); commit(); },
  printShift: function () { if (S.lastReport) browserPrint(paperShift(S.lastReport)); },
  newSale: function () { UI.view = "sale"; UI.lastInvoice = null; render(); },

  ready: function (a) {
    var o = S.orders.filter(function (x) { return x.id === a; })[0]; o.status = "ready";
    toast(t("callNumber", { n: o.no })); if (o.unpaid) guide("F02", 1); commit();
  },
  handOver: function (a) { var o = S.orders.filter(function (x) { return x.id === a; })[0]; o.status = "handed"; guide("F01", 6); log("handOver", "#" + o.no); commit(); },
  payNow: function (a) { startPayment(a); },

  invoice: openInvoice,
  drawer: function () {
    UI.side = null; render();
    managerApproval({ title: t("openDrawer") + " · " + t("noSale"), reason: true, onOk: function (mid, reason) {
      S.shift.drawerOpens.push({ by: mid, reason: reason, ts: Date.now() }); log("drawerOpen", reason, mid); guide("F04", 1); toast(t("drawerOpened")); commit();
    } });
  },
  startClose: function () { UI.side = null; render(); startClose(); },
  closeShift: doCloseShift,
  reportDone: function () { S.user = null; UI.view = "sale"; commit(); },

  toggleOnline: function () {
    if (S.online) { S.online = false; guide("F05", 1); commit(); return; }
    var n = pendingCount(); S.online = true; UI.syncing = true; render();
    setTimeout(function () { drain(); UI.syncing = false; UI.flash = { kind: "ok", msg: "synced", n: n }; guide("F05", 2); commit(); }, 1200);
  },
  powerCut: function () { S.powerCut = true; save(); location.reload(); },
  saleMode: function (a) { S.saleMode = a; log("setting", "saleMode = " + a); commit(); },
  reset: function () { resetAll(); UI = { view: "sale", cat: "fav", q: "", pay: null, lastInvoice: null, closing: null, side: null, flash: null, syncing: false }; render(); },
  resetGuide: function () { S.guide = {}; commit(); },
  cardLogin: cardLogin, split: openSplit, staffMeal: openStaffMeal, company: openCompany, openDisplay: function () { UI.side = null; render(); window.open("pos.html#display", "quantara-display"); },
  startPrep: function (a) { var o = S.orders.filter(function (x) { return x.id === a; })[0]; o.startedAt = Date.now(); commit(); },
  station: function (a) { UI.station = a; render(); }
};

Object.assign(H, PRINT_H); // B · printer handlers (pos-print.js)
Object.assign(H, OFF_H);   // C + D · long outage, power cut mid-payment (pos-offline.js)

/* ---------- boot (last: every var above is defined) ---------- */
setLang(POS_LANG);
if (location.hash === "#display") { bootDisplay(); } else {
if (S.powerCut) {
  S.powerCut = false; UI.flash = { kind: "ok", msg: "restored" };
  guide("F05", 3); if (S.invoices.length) guide("F05", 4);
  restorePayment(); save();
}
document.addEventListener("click", onClick);
document.addEventListener("input", onInput);
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.id === "q") { var it = POS_DATA.items.filter(function (i) { return i.barcode === UI.q.trim(); })[0]; if (it) { tapItem(it.id); UI.q = ""; render(); } }
  if (e.key === "Escape") closeModal();
});
render();
setInterval(function () { if (UI.view === "kitchen" && !MODAL) render(); }, 15000);
}
