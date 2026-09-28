/* Quantara POS — cashier prototype · state, rules and persistence.
   One state object, saved locally after every action so a power cut never loses the open order (OFF-08). */

var STORE_KEY = "quantara.pos.v1";

function freshState() {
  var stock = {};
  POS_DATA.items.forEach(function (i) { stock[i.id] = i.stock; });
  return {
    v: 1,
    online: true, lastSync: Date.now(), queue: [],
    saleMode: POS_DATA.settings.saleMode,
    stock: stock,
    user: null, shift: null, shiftSeq: 0,
    order: null, held: [], orderSeq: 100, invoiceSeq: 0,
    orders: [], invoices: [], audit: [], lastReport: null,
    guide: {}, powerCut: false,
    printers: { receipt: "ok", kitchen: "ok" }, printQueue: [], // pos-print.js
    clockOffset: 0, offlineSince: null, rateDate: null, hqPending: [], payDraft: null, lastSyncReport: null // pos-offline.js
  };
}

var S = load();

function load() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) { var s = JSON.parse(raw); if (s && s.v === 1) return s; }
  } catch (e) {}
  return freshState();
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }
function resetAll() { S = freshState(); save(); }

/* ---------- helpers ---------- */
function uid(p) { return p + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); } // device-generated IDs: safe offline
function item(id) { return POS_DATA.items.filter(function (i) { return i.id === id; })[0]; }
function staff(id) { return POS_DATA.staff.filter(function (u) { return u.id === id; })[0]; }
function rate() { return POS_DATA.settings.exchangeRate; }
function fmt(n) { return new Intl.NumberFormat("en-US").format(Math.round(n)); }
function fmtUSD(n) { return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n); }
function time(ts) { var d = new Date(ts); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
function method(id) { return POS_DATA.methods.filter(function (m) { return m.id === id; })[0]; }

function log(action, detail, userId) {
  var e = { id: uid("A"), ts: Date.now(), userId: userId || (S.user && S.user.id), action: action, detail: detail || "" };
  S.audit.push(e); queue("audit", e.id);
}
function queue(kind, ref) {
  S.queue.push({ kind: kind, ref: ref, ts: Date.now() });
}
function guide(flow, step) {
  S.guide[flow] = S.guide[flow] || {};
  S.guide[flow][step] = true;
}

/* ---------- order ---------- */
/* POS-02: a random four-digit order number, unique for the day (called out when ready). */
function newOrder() {
  S.orderSeq += 1;
  var used = S.orders.map(function (o) { return o.no; }).concat(S.held.map(function (o) { return o.no; })), no;
  do { no = 1000 + Math.floor(Math.random() * 9000); } while (used.indexOf(no) > -1);
  S.order = { id: uid("O"), no: no, type: "takeaway", lines: [], discount: null, createdAt: Date.now() };
}
function lineUnit(l) {
  var it = item(l.itemId), u = it.price;
  if (l.opts && l.opts.size) {
    var c = POS_DATA.optionGroups.size.choices.filter(function (x) { return x.id === l.opts.size; })[0];
    if (c) u += c.delta;
  }
  return u;
}
function addLine(itemId, opts, note) {
  if (!S.order) newOrder();
  var key = itemId + "|" + JSON.stringify(opts || {}) + "|" + (note || "");
  var ex = S.order.lines.filter(function (l) { return l.key === key; })[0];
  if (ex) ex.qty += 1;
  else S.order.lines.push({ id: uid("L"), key: key, itemId: itemId, opts: opts || {}, note: note || "", qty: 1 });
}

function totals(order) {
  var o = order || S.order, st = POS_DATA.settings;
  var r = { subtotal: 0, promo: 0, promoLines: [], manual: 0, beforeRound: 0, rounding: 0, total: 0, usd: 0, count: 0 };
  if (!o) return r;
  o.lines.forEach(function (l) { r.subtotal += lineUnit(l) * l.qty; r.count += l.qty; });
  POS_DATA.promotions.forEach(function (p) {
    if (p.type === "offerOfDay") {
      var d = 0;
      o.lines.forEach(function (l) { if (l.itemId === p.itemId) d += lineUnit(l) * l.qty * p.pct / 100; });
      if (d > 0) { r.promo += d; r.promoLines.push({ promo: p, amount: d }); }
    }
    if (p.type === "combo") {
      var a = 0, b = 0;
      o.lines.forEach(function (l) {
        if (p.items[0].indexOf(l.itemId) >= 0) a += l.qty;
        if (p.items[1].indexOf(l.itemId) >= 0) b += l.qty;
      });
      var n = Math.min(a, b);
      if (n > 0) { r.promo += n * p.discount; r.promoLines.push({ promo: p, amount: n * p.discount, times: n }); }
    }
  });
  var afterPromo = r.subtotal - r.promo;
  if (o.discount) r.manual = o.discount.kind === "pct" ? afterPromo * o.discount.value / 100 : Math.min(o.discount.value, afterPromo);
  r.beforeRound = Math.max(0, afterPromo - r.manual);
  var step = st.rounding.step;
  r.total = Math.round(r.beforeRound / step) * step;
  r.rounding = r.total - r.beforeRound;
  r.usd = r.total / rate();
  return r;
}

/* ---------- payment ---------- */
function tenderSYP(t) { return t.currency === "USD" ? t.amount * t.rate : t.amount; }
function payState(total, tenders) {
  var paid = 0, cashPaid = 0;
  tenders.forEach(function (t) { var v = tenderSYP(t); paid += v; if (method(t.method).cash) cashPaid += v; });
  var remaining = Math.max(0, total - paid);
  var change = Math.max(0, paid - total);
  return { paid: paid, remaining: remaining, change: Math.min(change, cashPaid), done: paid >= total && total >= 0 };
}

/* Complete a sale: create the invoice, deduct stock, open drawer if cash, queue for sync. */
function completeSale(order, tenders, opts) {
  var tt = totals(order), ps = payState(tt.total, tenders);
  S.invoiceSeq += 1;
  var no = POS_DATA.tenant.id + "-" + POS_DATA.branch.id + "-" + POS_DATA.register.id + "-" + ("00000" + S.invoiceSeq).slice(-6); // D-27
  var inv = {
    id: uid("I"), no: no, orderNo: order.no, orderType: order.type, ts: Date.now(),
    userId: S.user.id, shiftId: S.shift.id, lines: JSON.parse(JSON.stringify(order.lines)),
    discount: order.discount, totals: tt, tenders: tenders, changeSYP: ps.change, rate: rate(),
    status: "paid", syncState: S.online ? "pending" : "offline"
  };
  S.invoices.push(inv);
  if (!(opts && opts.stockAlreadyDeducted)) order.lines.forEach(function (l) { S.stock[l.itemId] = Math.max(0, (S.stock[l.itemId] || 0) - l.qty); });
  queue("invoice", inv.id);
  var cash = tenders.some(function (t) { return method(t.method).cash; });
  log("sale", no + " · " + fmt(tt.total) + " SYP" + (cash ? " · drawer" : ""));
  if (order.discount) log("discount", no + " · " + (order.discount.kind === "pct" ? order.discount.value + "%" : fmt(order.discount.value)) + " · " + order.discount.reason, order.discount.by);
  return inv;
}

/* ---------- shift ---------- */
function openShift(floatAmt) {
  S.shiftSeq += 1;
  S.shift = { id: uid("S"), no: S.shiftSeq, userId: S.user.id, openedAt: Date.now(), float: floatAmt, drawerOpens: [] };
  queue("shift", S.shift.id);
  log("shiftOpen", "SYP " + fmt(floatAmt.SYP) + " · USD " + fmtUSD(floatAmt.USD));
}
function shiftInvoices() { return S.shift ? S.invoices.filter(function (i) { return i.shiftId === S.shift.id; }) : []; }
function expectedCash() {
  var e = { SYP: S.shift.float.SYP, USD: S.shift.float.USD }, nonCash = {}, sales = 0, cancels = 0, refunds = 0;
  shiftInvoices().forEach(function (inv) {
    inv.tenders.forEach(function (t) {
      if (t.method === "cashSYP") e.SYP += t.amount;
      else if (t.method === "cashUSD") e.USD += t.amount;
      else nonCash[t.method] = (nonCash[t.method] || 0) + t.amount;
    });
    e.SYP -= inv.changeSYP;
    if (inv.status === "paid") sales += inv.totals.total; else cancels += 1;
    if (inv.refund) {
      e.SYP -= inv.refund.SYP; e.USD -= inv.refund.USD;
      Object.keys(inv.refund.nonCash || {}).forEach(function (m) { nonCash[m] = (nonCash[m] || 0) - inv.refund.nonCash[m]; });
      refunds += 1;
    }
  });
  return { cash: e, nonCash: nonCash, sales: sales, cancels: cancels, refunds: refunds, count: shiftInvoices().length };
}

/* Refund amounts follow the original tenders; cash SYP is net of change given. */
function refundAmounts(inv) {
  var r = { SYP: 0, USD: 0, nonCash: {} };
  inv.tenders.forEach(function (t) {
    if (t.method === "cashSYP") r.SYP += t.amount;
    else if (t.method === "cashUSD") r.USD += t.amount;
    else r.nonCash[t.method] = (r.nonCash[t.method] || 0) + t.amount;
  });
  r.SYP -= inv.changeSYP;
  if (r.SYP < 0) { r.SYP = 0; }
  return r;
}

/* ---------- sync (simulated) ---------- */
function pendingCount() { return S.queue.length; }
function drain() {
  var n = S.queue.length;
  S.queue = [];
  S.invoices.forEach(function (i) { i.syncState = "synced"; });
  S.lastSync = Date.now();
  return n;
}
