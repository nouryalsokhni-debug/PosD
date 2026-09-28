/* Quantara POS — cashier prototype · long outages and power cuts (step 2 · C + D).
   Loaded after pos-print.js, before pos-app.js (which calls these at run time).
   C · long offline: how long, stronger warning after N hours, day change keeps the last known USD rate,
       local retention limit, and a sync report that lists what HQ changed meanwhile — OFF-01…09, PAY-04, D-26
   D · power cut mid-payment: the open payment comes back exactly, a non-cash payment entered before the cut
       is confirmed by the cashier, and the same payment can never become two invoices — OFF-08
   The prototype clock can jump forward (demo) so hours and days can be shown without waiting. */

function offInit() {
  if (S.clockOffset == null) S.clockOffset = 0;          // demo only: simulated time jump (ms)
  if (S.offlineSince === undefined) S.offlineSince = S.online ? null : Date.now();
  if (!S.rateDate) S.rateDate = dayKey(Date.now());      // day the USD rate was last received from HQ
  if (!S.hqPending) S.hqPending = [];                     // HQ edits made while this register was offline (demo)
  if (S.payDraft === undefined) S.payDraft = null;        // open payment, saved on every change
}
offInit();

function simNow() { return Date.now() + (S.clockOffset || 0); }
function dayKey(ts) { var d = new Date(ts); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function dayLabel(key) { var p = key.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
function offlineMs() { return S.online || !S.offlineSince ? 0 : Math.max(0, simNow() - S.offlineSince); }
function dur(ms) { var m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24); return d ? t("oDurD", { d: d, h: h % 24 }) : h ? t("oDurH", { h: h, m: m % 60 }) : t("oDurM", { m: m }); }
function rateStale() { return !S.online && dayKey(simNow()) !== S.rateDate; }
function oldestPendingTs() { return S.queue.length ? S.queue.reduce(function (a, q) { return Math.min(a, q.ts); }, Infinity) : null; }
function retentionLeftDays() {
  var days = POS_DATA.settings.offline.retentionDays.value, oldest = oldestPendingTs();
  if (oldest == null) return days;
  return Math.max(0, days - (simNow() - oldest + (S.clockOffset ? 0 : 0)) / 864e5);
}

/* ---------- C · banners and top-bar text ---------- */
function offlineBanners() {
  var out = "", warnH = POS_DATA.settings.offline.warnHours;
  if (!S.online) {
    var ms = offlineMs(), long = ms >= warnH.value * 3600000;
    out += '<div class="banner ' + (long ? "bad" : "warn") + '">⚠ ' + esc(t(long ? "oLong" : "offlineBanner", { n: pendingCount(), d: dur(ms) })) +
      (long ? ' <span class="tag assume">' + esc(t("assumption")) + " · " + warnH.decision + "</span>" : "") + "</div>";
    if (rateStale()) out += '<div class="banner warn">💱 ' + esc(t("oRateStale", { r: fmt(rate()), d: dayLabel(S.rateDate) })) + "</div>";
    var left = retentionLeftDays();
    if (left < 2) out += '<div class="banner bad">🗄 ' + esc(t("oRetention", { d: Math.max(0, Math.floor(left * 24)) })) + "</div>";
  }
  return out;
}
function offlinePill() { return S.online ? "" : " · " + dur(offlineMs()); }

/* ---------- C · going offline / back online with a sync report ---------- */
function goOffline() { S.online = false; S.offlineSince = simNow(); guide("F05", 1); }
function goOnline(done) {
  var q = S.queue.slice(), n = q.length, kinds = {};
  q.forEach(function (x) { kinds[x.kind] = (kinds[x.kind] || 0) + 1; });
  var tookMs = offlineMs(), hq = S.hqPending.slice();
  S.online = true; UI.syncing = true; render();
  setTimeout(function () {
    drain();
    hq.forEach(applyHqChange);                       // D-26: HQ owns prices and the menu — its values win
    S.hqPending = []; S.rateDate = dayKey(simNow()); S.offlineSince = null;
    S.lastSyncReport = { at: simNow(), offlineFor: tookMs, sent: kinds, total: n, hq: hq };
    UI.syncing = false; UI.flash = { kind: "ok", msg: t("synced", { n: n }), report: true };
    guide("F05", 2); if (hq.length) guide("F08", 2);
    commit(); if (hq.length) showSyncReport(); if (done) done();
  }, 900);
}
function applyHqChange(c) {
  var it = item(c.itemId);
  if (c.kind === "price") it.price = c.to;
  if (c.kind === "pause") S.stock[c.itemId] = 0;
}
function showSyncReport() {
  var r = S.lastSyncReport; if (!r) return;
  openModal(t("oReport"), function () {
    var sent = Object.keys(r.sent).map(function (k) { return '<div class="kv"><span>' + esc(t("oKind_" + k)) + '</span><b class="num">' + r.sent[k] + "</b></div>"; }).join("") || '<div class="muted small">—</div>';
    var hq = r.hq.map(function (c) {
      var nmI = nm(item(c.itemId));
      return '<div class="kv"><span>' + esc(c.kind === "price" ? t("oHqPrice", { i: nmI, a: fmt(c.from), b: fmt(c.to) }) : t("oHqPause", { i: nmI })) + '</span><span class="tiny muted num">' + time(c.at) + "</span></div>";
    }).join("");
    return '<p class="small muted">' + esc(t("oOfflineFor", { d: dur(r.offlineFor) })) + "</p><h4>" + esc(t("oSent", { n: r.total })) + "</h4>" + sent +
      "<h4>" + esc(t("oReceived")) + "</h4>" + (hq || '<div class="muted small">' + esc(t("oNoHq")) + "</div>") +
      (r.hq.length ? '<p class="small">' + esc(t("oHqRule")) + ' <span class="tag">D-26</span></p>' : "") +
      '<p class="small var-ok">✓ ' + esc(t("oNoConflict")) + "</p>";
  }, [{ label: t("close"), cls: "primary", act: closeModal }]);
}

/* ---------- C · demo: HQ edits while the register is offline ---------- */
function demoHqChange() {
  var latte = item("i03"), cake = item("i11");
  S.hqPending = [
    { kind: "price", itemId: latte.id, from: latte.price, to: latte.price + 3000, at: simNow() - 40 * 60000, by: "HQ manager" },
    { kind: "pause", itemId: cake.id, at: simNow() - 25 * 60000, by: "HQ manager" }
  ];
  log("hqChangeWaiting", S.hqPending.length + " changes waiting at HQ");
  toast(t("oHqQueued"));
}

/* ---------- D · power cut mid-payment ---------- */
function snapshotPay() {
  var d = UI.view === "payment" && UI.pay ? JSON.parse(JSON.stringify(UI.pay)) : null;
  if (d && !d.draftId) { UI.pay.draftId = d.draftId = uid("D"); }
  if (JSON.stringify(d) !== JSON.stringify(S.payDraft)) { S.payDraft = d; save(); }
}
/* After a sale: remember which payment made it (never twice), and whether the USD rate was stale. */
function offlineAfterSale(inv, draftId) {
  inv.draftId = draftId || null;
  if (rateStale()) { inv.rateStale = S.rateDate; guide("F08", 1); }
  if (!S.online && offlineMs() >= POS_DATA.settings.offline.warnHours.value * 3600000) guide("F08", 0);
  S.payDraft = null;
}
function alreadyPaid(draftId) { return draftId ? S.invoices.filter(function (i) { return i.draftId === draftId; })[0] : null; }
/* Called at boot after a power cut. Returns true when a payment was restored. */
function restorePayment() {
  var d = S.payDraft; if (!d) return false;
  var inv = alreadyPaid(d.draftId);
  if (inv) { S.payDraft = null; UI.lastInvoice = inv.id; UI.view = "done"; UI.flash = { kind: "ok", msg: t("oAlreadyPaid", { n: inv.no }) }; return true; }
  UI.pay = d; UI.view = "payment"; UI.flash = { kind: "ok", msg: t("oPayRestored") }; guide("F08", 3);
  var nonCash = d.tenders.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return !method(o.x.method).cash; });
  if (nonCash.length) setTimeout(function () { askWasPaid(nonCash); }, 30);
  return true;
}
function askWasPaid(list) {
  var o = list[0];
  openModal(t("oWasPaid"), function () {
    return '<p>' + esc(t("oWasPaidBody", { m: t(o.x.method), a: fmt(o.x.amount), r: o.x.ref || "—" })) + '</p><p class="small muted">' + esc(t("oWasPaidHint")) + "</p>";
  }, [
    { label: t("oNotPaid"), cls: "danger", act: function () { UI.pay.tenders.splice(o.i, 1); log("payCheck", t(o.x.method) + " #" + (o.x.ref || "") + " · " + t("oNotPaid")); next(); } },
    { label: t("oYesPaid"), cls: "primary", act: function () { UI.pay.tenders[o.i].checked = true; log("payCheck", t(o.x.method) + " #" + (o.x.ref || "") + " · " + t("oYesPaid")); next(); } }
  ]);
  function next() { guide("F08", 4); closeModal(); var rest = list.slice(1).map(function (r) { return { x: r.x, i: UI.pay.tenders.indexOf(r.x) }; }).filter(function (r) { return r.i > -1; }); commit(); if (rest.length) askWasPaid(rest); }
}

/* ---------- demo panel additions ---------- */
function offlineDemo() {
  var b = function (act, label, dis) { return '<button class="btn" data-act="' + act + '"' + (dis ? " disabled" : "") + ">" + esc(label) + "</button>"; };
  return '<div class="field" style="margin-top:16px"><label>' + esc(t("oDemoTitle")) + '</label><div class="menu-list">' +
    b("offJump", t("oJump2h"), S.online) + b("offJumpDay", t("oJumpDay"), S.online) + b("offHq", t("oHqBtn"), S.online) +
    b("payCut", "⚡ " + t("oPayCut"), UI.view !== "payment") + b("syncReport", t("oReport"), !S.lastSyncReport) + "</div>" +
    '<p class="tiny muted">' + esc(t("oStorage", { n: pendingCount(), d: POS_DATA.settings.offline.retentionDays.value })) + " " + assume(POS_DATA.settings.offline.retentionDays.decision) + "</p></div>";
}
var OFF_H = {
  toggleOnline: function () { if (S.online) { goOffline(); commit(); } else goOnline(); },
  offJump: function () { S.clockOffset += 2 * 3600000; commit(); },
  offJumpDay: function () { var d = new Date(simNow()); d.setHours(24, 30, 0, 0); S.clockOffset += d.getTime() - simNow(); commit(); },
  offHq: function () { demoHqChange(); commit(); },
  payCut: function () { snapshotPay(); S.powerCut = true; save(); location.reload(); },
  syncReport: function () { UI.side = null; render(); showSyncReport(); }
};

/* ---------- strings ---------- */
Object.assign(POS_I18N.en, {
  oDurM: "{m} min", oDurH: "{h} h {m} min", oDurD: "{d} d {h} h",
  offlineBanner: "Offline for {d} — selling continues. {n} records will sync when back online.",
  oLong: "Offline for {d}. Selling is safe on this register ({n} records waiting). If the line is still down, call support.",
  oRateStale: "New day while offline: using the last known rate $1 = {r} from {d} until HQ sends today's rate.",
  oRetention: "This register can keep about {d} more hours of offline records. Connect it to the internet soon.",
  oReport: "Sync report", oOfflineFor: "Offline for {d}.", oSent: "Sent to HQ ({n})", oReceived: "Received from HQ",
  oKind_invoice: "Invoices", oKind_audit: "Audit entries", oKind_shift: "Shifts",
  oHqPrice: "{i}: price {a} → {b}", oHqPause: "{i}: paused by HQ", oNoHq: "No changes from HQ.",
  oHqRule: "HQ owns prices and the menu, so its values now apply. Sales made while offline keep the price they were sold at.",
  oNoConflict: "No conflicts — sales, refunds and shift closes never conflict.",
  oHqQueued: "HQ changed the menu — the register will receive it at the next sync.",
  oPayRestored: "Power came back — the open payment was restored exactly as it was.",
  oAlreadyPaid: "Power came back — this payment was already saved as invoice {n}. Nothing was charged twice.",
  oWasPaid: "Was this payment received?", oWasPaidBody: "{m} for {a} (reference {r}) was entered before the power cut. Did the money arrive?",
  oWasPaidHint: "Check the wallet app or the customer's confirmation. If not, the amount is removed and asked again.",
  oYesPaid: "Yes, received", oNotPaid: "No — remove it",
  oDemoTitle: "Long outage & power cut", oJump2h: "+2 hours offline", oJumpDay: "Next day (still offline)", oHqBtn: "HQ changes the menu meanwhile",
  oPayCut: "Power cut during payment", oStorage: "{n} records waiting. This register keeps up to {d} days offline."
});
Object.assign(POS_I18N.ar, {
  oDurM: "{m} د", oDurH: "{h} س {m} د", oDurD: "{d} ي {h} س",
  offlineBanner: "دون اتصال منذ {d} — البيع مستمر. {n} قيد ستُزامن عند عودة الاتصال.",
  oLong: "دون اتصال منذ {d}. البيع آمن على هذا الجهاز ({n} قيد بالانتظار). إن بقي الخط مقطوعًا فاتصل بالدعم.",
  oRateStale: "يوم جديد دون اتصال: يُستخدم آخر سعر معروف $1 = {r} من {d} حتى ترسل الإدارة سعر اليوم.",
  oRetention: "يستطيع هذا الجهاز حفظ نحو {d} ساعة إضافية من القيود دون اتصال. صِله بالإنترنت قريبًا.",
  oReport: "تقرير المزامنة", oOfflineFor: "دون اتصال لمدة {d}.", oSent: "أُرسل إلى الإدارة ({n})", oReceived: "وصل من الإدارة",
  oKind_invoice: "فواتير", oKind_audit: "قيود السجل", oKind_shift: "ورديات",
  oHqPrice: "{i}: السعر {a} ← {b}", oHqPause: "{i}: أوقفته الإدارة", oNoHq: "لا تغييرات من الإدارة.",
  oHqRule: "الأسعار والقائمة ملك الإدارة، فتُطبّق قيمها الآن. المبيعات أثناء الانقطاع تبقى بسعر بيعها.",
  oNoConflict: "لا تعارض — المبيعات والإرجاعات وإغلاق الورديات لا تتعارض أبدًا.",
  oHqQueued: "غيّرت الإدارة القائمة — يستلمها الجهاز في المزامنة القادمة.",
  oPayRestored: "عادت الكهرباء — استُعيد الدفع المفتوح كما كان تمامًا.",
  oAlreadyPaid: "عادت الكهرباء — هذا الدفع محفوظ مسبقًا بالفاتورة {n}. لم يُحتسب مرتين.",
  oWasPaid: "هل وصل هذا الدفع؟", oWasPaidBody: "أُدخل {m} بمبلغ {a} (المرجع {r}) قبل انقطاع الكهرباء. هل وصل المال؟",
  oWasPaidHint: "تحقق من تطبيق المحفظة أو تأكيد الزبون. إن لم يصل يُحذف المبلغ ويُطلب مجددًا.",
  oYesPaid: "نعم، وصل", oNotPaid: "لا — احذفه",
  oDemoTitle: "انقطاع طويل وانقطاع كهرباء", oJump2h: "+ساعتان دون اتصال", oJumpDay: "اليوم التالي (ما زال دون اتصال)", oHqBtn: "الإدارة تغيّر القائمة خلال ذلك",
  oPayCut: "انقطاع كهرباء أثناء الدفع", oStorage: "{n} قيد بالانتظار. يحفظ هذا الجهاز حتى {d} أيام دون اتصال."
});
