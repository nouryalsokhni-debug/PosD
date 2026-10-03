/* Quantara POS — cashier prototype · printing (step 2 · A + B).
   Loaded after pos-store.js, before pos-app.js (which calls these at run time).
   A · 80 mm paper: customer receipt, kitchen ticket per station, refund slip, shift slip — FIS-02, FIS-07, HW-02
   B · printer problems: out of paper / off → the sale is still saved, the job waits in "To print" — FIS-01, OFF-01
   Rules: the receipt prints on request (FIS-01); kitchen tickets print by themselves when an order is confirmed.
   A failed job is never replayed by itself when the printer comes back (no duplicate tickets); the cashier chooses. */

/* ---------- state (older saved states get the new fields) ---------- */
function printInit() {
  if (!S.printers) S.printers = { receipt: "ok", kitchen: "ok" };
  if (!S.printQueue) S.printQueue = [];
}
printInit();

var PRINTER_OF = { receipt: "receipt", refund: "receipt", shift: "receipt", kitchen: "kitchen" };

/* ---------- small paper helpers ---------- */
function pRow(a, b, cls) { return '<div class="pr' + (cls ? " " + cls : "") + '"><span>' + a + '</span><span class="num">' + b + "</span></div>"; }
function pLine() { return '<div class="pl"></div>'; }
function pCenter(html, cls) { return '<div class="pc' + (cls ? " " + cls : "") + '">' + html + "</div>"; }
function pDate(ts) { var d = new Date(ts); return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear() + " " + time(ts); }
function paper(inner, cls) { return '<div class="paper' + (cls ? " " + cls : "") + '" dir="' + (POS_LANG === "ar" ? "rtl" : "ltr") + '">' + inner + "</div>"; }
function paperHead() {
  var r = POS_DATA.receipt;
  return pCenter('<span class="logo">' + esc(POS_DATA.tenant.id) + "</span>") +
    pCenter("<b class=\"pbig\">" + esc(nm(POS_DATA.tenant)) + "</b>") +
    pCenter(esc(nm(POS_DATA.branch)) + " · " + esc(nm(POS_DATA.register))) +
    pCenter(esc(POS_LANG === "ar" ? r.addressAr : r.address)) +
    pCenter('<span class="ltr">' + esc(r.phone) + "</span>") +
    (r.taxId ? pCenter(esc(t("taxId")) + ": " + esc(r.taxId)) : "");
}
function offlineMark(x) { return x.syncState !== "offline" ? "" : pCenter("⚠ " + esc(t("pOffline")), "pbox"); }

/* ---------- A1 · customer receipt (FIS-02) ---------- */
function paperReceipt(inv, opts) {
  opts = opts || {};
  var h = paperHead() + pLine();
  if (opts.copy) h += pCenter("*** " + esc(t("copy")) + " ***", "pbox");
  h += pCenter("<b>" + esc(inv.company ? t("pCompanyInvoice") : t("invoice")) + "</b>");
  h += pRow(esc(t("invoice")), '<span class="ltr">' + esc(inv.no) + "</span>");
  h += pRow(esc(t("pDate")), '<span class="ltr">' + pDate(inv.ts) + "</span>");
  h += pRow(esc(t("cashier")), esc(userName(inv.userId)));
  h += pRow(esc(inv.orderType === "dinein" ? t("dineIn") : t("takeaway")), "");
  h += pCenter(esc(t("pOrderNo")) + '<div class="pnum">' + inv.orderNo + "</div>");
  if (inv.company) h += pLine() + pRow(esc(t("companyName")), esc(inv.company.name)) + (inv.company.tax ? pRow(esc(t("companyTax")), esc(inv.company.tax)) : "");
  if (inv.staffMeal) h += pRow("<b>" + esc(t("staffMeal")) + "</b>", esc(userName(inv.staffMeal)));
  h += pLine();
  inv.lines.forEach(function (l) {
    h += pRow(l.qty + "× " + esc(nm(item(l.itemId))), fmt(lineUnit(l) * l.qty));
    if (optText(l)) h += '<div class="popt">' + esc(optText(l)) + "</div>";
  });
  h += pLine();
  h += pRow(esc(t("subtotal")), fmt(inv.totals.subtotal));
  inv.totals.promoLines.forEach(function (p) { h += pRow(esc(nm(p.promo)), "−" + fmt(p.amount)); });
  if (inv.totals.manual) h += pRow(esc(t("manualDiscount")), "−" + fmt(inv.totals.manual));
  if (inv.totals.rounding) h += pRow(esc(t("rounding")), (inv.totals.rounding > 0 ? "+" : "−") + fmt(Math.abs(inv.totals.rounding)));
  h += pRow("<b>" + esc(t("total")) + "</b>", "<b>" + fmt(inv.totals.total) + " " + esc(t("pSyp")) + "</b>", "ptotal");
  var tx = POS_DATA.settings.tax; // set by the tenant at HQ (D-03); prices include it
  if (tx && tx.on && tx.ratePct > 0 && tx.included) h += pRow(esc(t("pTaxIncluded", { r: tx.ratePct })), fmt(Math.round(inv.totals.total * tx.ratePct / (100 + tx.ratePct))));
  h += pRow("", "≈ " + usd(inv.totals.usd));
  h += pLine();
  inv.tenders.forEach(function (x) { h += pRow(esc(t(x.method)) + (x.ref ? ' <span class="pmuted">#' + esc(x.ref) + "</span>" : ""), x.currency === "USD" ? usd(x.amount) : fmt(x.amount)); });
  if (inv.changeSYP) h += pRow(esc(t("change")), fmt(inv.changeSYP) + " " + esc(t("pSyp")));
  h += pCenter(esc(t("pinnedRate", { r: fmt(inv.rate) })), "pmuted");
  if (inv.rateStale) h += pCenter(esc(t("pRateFrom", { d: dayLabel(inv.rateStale) })), "pmuted");
  if (inv.status !== "paid") h += pLine() + pCenter("<b>" + esc(inv.status === "refunded" ? t("statusRefunded") : t("statusCancelled")) + "</b> · " + esc(inv.cancel.reason), "pbox");
  h += offlineMark(inv);
  h += pLine() + pCenter(esc(POS_LANG === "ar" ? POS_DATA.receipt.footerAr : POS_DATA.receipt.footer)) + pCenter("Quantara POS", "pmuted");
  return paper(h);
}

/* ---------- A2 · kitchen ticket, one per preparation station (KDS-04; an item with no station, e.g. packed beans, prints no ticket) ---------- */
function kitchenTickets(o) {
  var by = {};
  o.order.lines.forEach(function (l) { var s = stationOf(l.itemId); if (!s) return; (by[s.id] = by[s.id] || { st: s, lines: [] }).lines.push(l); });
  return Object.keys(by).map(function (k) { return { station: k, html: paperKitchen(o, by[k].st, by[k].lines) }; });
}
function paperKitchen(o, st, lines, opts) {
  opts = opts || {};
  var h = pCenter("<b>" + esc(nm(st)) + "</b>") + pCenter('<div class="pnum xl">' + o.no + "</div>") +
    pCenter("<b>" + esc(o.type === "dinein" ? t("dineIn") : t("takeaway")) + "</b> · " + time(o.createdTs || o.order.createdAt || Date.now()));
  if (o.unpaid) h += pCenter(esc(t("pUnpaid")), "pbox");
  if (opts.late) h += pCenter(esc(t("pLate", { t: time(opts.late) })), "pbox");
  h += pLine();
  lines.forEach(function (l) { h += '<div class="pk"><b>' + l.qty + "×</b> " + esc(nm(item(l.itemId))) + (optText(l) ? '<div class="popt">' + esc(optText(l)) + "</div>" : "") + "</div>"; });
  if (o.order.note) h += pLine() + pCenter(esc(o.order.note));
  return paper(h, "kitchen");
}

/* ---------- A3 · refund slip (PAY-12) ---------- */
function paperRefund(inv) {
  var r = inv.refund, h = paperHead() + pLine() + pCenter("<b>" + esc(t("pRefundSlip")) + "</b>");
  h += pRow(esc(t("invoice")), '<span class="ltr">' + esc(inv.no) + "</span>") + pRow(esc(t("pDate")), '<span class="ltr">' + pDate(r.ts) + "</span>") + pRow(esc(t("cashier")), esc(userName(r.by)));
  h += pRow(esc(t("pApprovedBy")), esc(userName(inv.cancel.by))) + pRow(esc(t("reason")), esc(inv.cancel.reason)) + pLine();
  if (r.SYP) h += pRow(esc(t("cashSYP")), fmt(r.SYP));
  if (r.USD) h += pRow(esc(t("cashUSD")), usd(r.USD));
  Object.keys(r.nonCash || {}).forEach(function (m) { h += pRow(esc(t(m)), fmt(r.nonCash[m])); });
  h += pLine() + pRow("<b>" + esc(t("total")) + "</b>", "<b>" + fmt(inv.totals.total) + " " + esc(t("pSyp")) + "</b>", "ptotal");
  h += offlineMark(inv) + '<div class="psign">' + esc(t("pSignature")) + "</div>";
  return paper(h);
}

/* ---------- A4 · shift slip (CSH-07) ---------- */
function paperShift(r) {
  function v(n, u) { return (n > 0 ? "+" : n < 0 ? "−" : "") + (u ? fmtUSD(Math.abs(n)) : fmt(Math.abs(n))); }
  var h = paperHead() + pLine() + pCenter("<b>" + esc(t("shiftReport")) + " #" + r.shiftNo + "</b>");
  h += pRow(esc(t("pOpened")), '<span class="ltr">' + pDate(r.openedAt) + "</span>") + pRow(esc(t("pClosed")), '<span class="ltr">' + pDate(r.closedAt) + "</span>");
  h += pRow(esc(t("cashier")), esc(userName(r.userId))) + pRow(esc(t("countBy")), esc(userName(r.countedBy))) + pLine();
  h += pRow(esc(t("sales")), fmt(r.sales)) + pRow(esc(t("invoices")), r.count) + pRow(esc(t("cancels")), r.cancels) + pRow(esc(t("refunds")), r.refunds) + pLine();
  h += '<div class="pgrid"><span></span><span>' + esc(t("expected")) + "</span><span>" + esc(t("counted")) + "</span><span>" + esc(t("variance")) + "</span>" +
    "<span>SYP</span><span>" + fmt(r.expected.SYP) + "</span><span>" + fmt(r.counted.SYP) + "</span><span>" + v(r.variance.SYP) + "</span>" +
    "<span>USD</span><span>" + fmtUSD(r.expected.USD) + "</span><span>" + fmtUSD(r.counted.USD) + "</span><span>" + v(r.variance.USD, 1) + "</span></div>";
  if (r.reason) h += pRow(esc(t("reason")), esc(r.reason));
  h += pLine() + pCenter("<b>" + esc(t("nonCash")) + "</b>");
  var nc = Object.keys(r.nonCash); h += nc.length ? nc.map(function (m) { return pRow(esc(t(m)), fmt(r.nonCash[m])); }).join("") : pCenter("—");
  h += pRow(esc(t("openingFloat")) + " SYP", fmt(r.float.SYP)) + pRow(esc(t("openingFloat")) + " USD", fmtUSD(r.float.USD));
  h += (S.online ? "" : pCenter("⚠ " + esc(t("pOffline")), "pbox")) + '<div class="psign">' + esc(t("pSignature")) + "</div>";
  return paper(h);
}

/* ---------- B · jobs: print now, or wait in "To print" ---------- */
function jobHtml(j) {
  if (j.kind === "receipt") { var i = invById(j.ref); return i ? paperReceipt(i, { copy: j.copy }) : ""; }
  if (j.kind === "refund") { var r = invById(j.ref); return r ? paperRefund(r) : ""; }
  if (j.kind === "shift") return j.report ? paperShift(j.report) : "";
  var o = S.orders.filter(function (x) { return x.id === j.ref; })[0]; if (!o) return "";
  var tk = kitchenTickets(o).filter(function (x) { return x.station === j.station; })[0];
  return tk ? (j.failedAt ? paperKitchen(o, stationById(j.station), o.order.lines.filter(function (l) { var so = stationOf(l.itemId); return so && so.id === j.station; }), { late: j.failedAt }) : tk.html) : "";
}
function invById(id) { return S.invoices.filter(function (i) { return i.id === id; })[0]; }
function stationById(id) { return POS_DATA.stations.filter(function (s) { return s.id === id; })[0]; }
function jobLabel(j) {
  if (j.kind === "kitchen") { var o = S.orders.filter(function (x) { return x.id === j.ref; })[0]; return t("pKitchenTicket") + " · " + nm(stationById(j.station)) + " · #" + (o ? o.no : "?"); }
  if (j.kind === "shift") return t("shiftReport") + " #" + (j.report ? j.report.shiftNo : "");
  var i = invById(j.ref); return (j.kind === "refund" ? t("pRefundSlip") : t("pReceipt")) + " · " + (i ? i.no : "");
}
/* Returns true when printed. A failure keeps the job (and the reason) in S.printQueue. */
function printJob(j) {
  var p = PRINTER_OF[j.kind], st = S.printers[p];
  if (st !== "ok") {
    j.id = j.id || uid("P"); j.failedAt = j.failedAt || Date.now(); j.reason = st;
    if (!S.printQueue.some(function (x) { return x.id === j.id; })) S.printQueue.push(j);
    log("printFail", jobLabel(j) + " · " + t("pr_" + st)); guide("F07", 2);
    return false;
  }
  S.printQueue = S.printQueue.filter(function (x) { return x.id !== j.id; });
  if (j.kind === "kitchen") guide("F07", 1);
  if (j.kind === "refund" || j.kind === "shift") guide("F07", 4);
  if (j.failedAt) guide("F07", 3);
  log("print", jobLabel(j) + (j.copy ? " · " + t("copy") : "") + (j.failedAt ? " · " + t("pRetried") : ""));
  return true;
}
function printKitchenFor(o) {
  var fail = 0;
  kitchenTickets(o).forEach(function (tk) { if (!printJob({ kind: "kitchen", ref: o.id, station: tk.station })) fail++; });
  o.ticketFailed = fail > 0;
  return fail;
}
/* Called by pos-app after payment. Kitchen ticket prints unless the order was already sent (pay later). */
function printAfterSale(inv, fromPayLater) {
  var o = S.orders.filter(function (x) { return x.invoiceId === inv.id; })[0];
  inv.print = { receipt: "none" };
  if (o && !fromPayLater) { o.createdTs = inv.ts; printKitchenFor(o); }
}
function retryJob(id) {
  var j = S.printQueue.filter(function (x) { return x.id === id; })[0]; if (!j) return;
  if (printJob(j)) { markPrinted(j); toast(t("pPrintedOk", { what: jobLabel(j) })); } else toast(t("pStillFailing", { why: t("pr_" + S.printers[PRINTER_OF[j.kind]]) }));
}
function markPrinted(j) {
  if (j.kind === "receipt") { var i = invById(j.ref); if (i) i.print = { receipt: "printed" }; }
  if (j.kind === "kitchen") { var o = S.orders.filter(function (x) { return x.id === j.ref; })[0]; if (o) o.ticketFailed = S.printQueue.some(function (x) { return x.kind === "kitchen" && x.ref === o.id; }); }
}
function printReceiptNow(inv, copy) {
  var ok = printJob({ kind: "receipt", ref: inv.id, copy: !!copy });
  inv.print = { receipt: ok ? "printed" : "failed" }; if (ok) guide("F07", 0);
  toast(ok ? t(copy ? "copyPrinted" : "pReceiptPrinted") : t("pNotPrinted") + " · " + t("pr_" + S.printers.receipt));
  return ok;
}

/* ---------- UI pieces used by pos-app ---------- */
function printerChip() {
  var bad = ["receipt", "kitchen"].filter(function (p) { return S.printers[p] !== "ok"; }), n = S.printQueue.length;
  if (!bad.length && !n) return "";
  var label = bad.length ? t("pr_" + S.printers[bad[0]]) : t("pToPrint"), full = bad.length ? t("pPrinterName_" + bad[0]) + ": " + label : label;
  return '<button class="conn off printchip" data-act="go" data-arg="printq" title="' + esc(full) + '" aria-label="' + esc(full) + '">🖨 ' + esc(label) + (n ? ' · <span class="num">' + n + "</span>" : "") + "</button>";
}
function doneNotices(inv) {
  var o = S.orders.filter(function (x) { return x.invoiceId === inv.id; })[0], out = "";
  if (inv.print && inv.print.receipt === "failed") out += '<div class="pwarn"><b>⚠ ' + esc(t("pReceiptFailed")) + "</b><div>" + esc(t("pSavedAnyway", { n: inv.no })) + '</div><div class="row"><button class="btn primary" data-act="printRetryInv" data-arg="' + inv.id + '">' + esc(t("pRetry")) + '</button><button class="btn" data-act="go" data-arg="printq">' + esc(t("pToPrint")) + "</button></div></div>";
  if (o && o.ticketFailed) out += '<div class="pwarn"><b>⚠ ' + esc(t("pKitchenFailed")) + "</b><div>" + esc(t("pReadOut")) + "</div></div>";
  return out;
}
function viewPrintQueue() {
  var q = S.printQueue.slice().reverse();
  var status = ["receipt", "kitchen"].map(function (p) { var s = S.printers[p]; return '<div class="kv"><span>🖨 ' + esc(t("pPrinterName_" + p)) + '</span><span class="tag ' + (s === "ok" ? "ok" : "bad") + '">' + esc(t("pr_" + s)) + "</span></div>"; }).join("");
  var rows = q.map(function (j) {
    return '<tr><td>' + esc(jobLabel(j)) + '</td><td class="num">' + time(j.failedAt) + "</td><td>" + esc(t("pr_" + j.reason)) + '</td><td><div class="row"><button class="btn" data-act="printPreview" data-arg="' + j.id + '">' + esc(t("pPreview")) + '</button><button class="btn primary" data-act="printRetry" data-arg="' + j.id + '">' + esc(t("pRetry")) + "</button></div></td></tr>";
  }).join("");
  return '<div class="page"><h2>' + esc(t("pToPrint")) + ' <span class="tag">FIS-01 · HW-02</span></h2><p class="muted small">' + esc(t("pQueueHint")) + '</p><div class="count" style="padding:0;margin-bottom:12px"><div class="panel">' + status + '</div><div class="panel"><p class="small muted" style="margin:0 0 8px">' + esc(t("pNoReplay")) + "</p>" +
    (q.length ? '<button class="btn primary block" data-act="printRetryAll">' + esc(t("pRetryAll", { n: q.length })) + "</button>" : "") + "</div></div>" +
    (q.length ? '<table class="list"><thead><tr><th>' + esc(t("pJob")) + "</th><th>⏱</th><th>" + esc(t("pWhy")) + "</th><th></th></tr></thead><tbody>" + rows + "</tbody></table>" : '<div class="empty">✓ ' + esc(t("pNothing")) + "</div>") + "</div>";
}
/* Paper preview in a modal + real browser print (80 mm) for testing on a thermal printer. */
function previewPaper(title, html) {
  openModal(title, function () { return '<div class="paper-stage">' + html + "</div>"; }, [
    { label: t("close"), act: closeModal },
    { label: t("pBrowserPrint"), cls: "primary", act: function () { browserPrint(html); } }
  ]);
}
function browserPrint(html) {
  var root = $("#print-root"); if (!root) return;
  root.innerHTML = html; window.print();
}
function printerDemo() {
  function seg(p, opts) {
    return '<div class="field"><label>🖨 ' + esc(t("pPrinterName_" + p)) + '</label><div class="seg">' + opts.map(function (s) { return '<button class="' + (S.printers[p] === s ? "on" : "") + '" data-act="printerSet" data-arg="' + p + ":" + s + '">' + esc(t("pr_" + s)) + "</button>"; }).join("") + "</div></div>";
  }
  return '<div style="margin-top:16px">' + seg("receipt", ["ok", "paper", "off"]) + seg("kitchen", ["ok", "off"]) + "</div>";
}
var PRINT_H = {
  printRetry: function (a) { retryJob(a); commit(); },
  printRetryAll: function () {
    var ids = S.printQueue.map(function (j) { return j.id; }), ok = 0;
    ids.forEach(function (id) { var j = S.printQueue.filter(function (x) { return x.id === id; })[0]; if (j && printJob(j)) { markPrinted(j); ok++; } });
    toast(ok ? t("pRetriedN", { n: ok, m: ids.length }) : t("pStillFailing", { why: "" })); commit();
  },
  printRetryInv: function (a) { var j = S.printQueue.filter(function (x) { return x.kind === "receipt" && x.ref === a; })[0]; if (j) retryJob(j.id); else printReceiptNow(invById(a)); var i = invById(a); if (j && !S.printQueue.some(function (x) { return x.id === j.id; })) i.print = { receipt: "printed" }; commit(); },
  printPreview: function (a) { var j = S.printQueue.filter(function (x) { return x.id === a; })[0]; if (j) previewPaper(jobLabel(j), jobHtml(j)); },
  printerSet: function (a) {
    var p = a.split(":"), was = S.printers[p[0]]; S.printers[p[0]] = p[1];
    log("printer", t("pPrinterName_" + p[0]) + " · " + t("pr_" + p[1]));
    var waiting = S.printQueue.filter(function (j) { return PRINTER_OF[j.kind] === p[0]; }).length;
    if (p[1] === "ok" && was !== "ok" && waiting) UI.flash = { kind: "ok", msg: t("pBack", { n: waiting }) };
    commit();
  }
};

/* ---------- strings ---------- */
Object.assign(POS_I18N.en, {
  taxId: "Tax ID", pTaxIncluded: "Includes tax {r}%", pDate: "Date", pOrderNo: "Order number", pSyp: "SYP", pCompanyInvoice: "Company invoice",
  pOffline: "Issued offline — not synced yet", pUnpaid: "NOT PAID — pay at hand-over", pLate: "Late print · ordered {t}",
  pRefundSlip: "Refund slip", pApprovedBy: "Approved by", pSignature: "Signature: ____________", pOpened: "Opened", pClosed: "Closed",
  pReceipt: "Receipt", pKitchenTicket: "Kitchen ticket", pRetried: "printed after a failure",
  pr_ok: "Ready", pr_paper: "Out of paper", pr_off: "Printer off",
  pPrinterName_receipt: "Receipt printer", pPrinterName_kitchen: "Kitchen printer",
  pToPrint: "To print", pPrintedOk: "Printed: {what}", pStillFailing: "Still not printing {why}", pReceiptPrinted: "Receipt printed",
  pNotPrinted: "Not printed", pReceiptFailed: "Receipt not printed", pSavedAnyway: "The sale is saved as invoice {n}. Print it when the printer is ready, or continue.",
  pKitchenFailed: "Kitchen ticket not printed", pReadOut: "The order is on the kitchen screen. Read it out to the bar until the printer is back.",
  pRetry: "Retry", pRetryAll: "Retry all ({n})", pRetriedN: "Printed {n} of {m}", pPreview: "Preview", pJob: "Print job", pWhy: "Why",
  pNothing: "Nothing waiting to print", pQueueHint: "Every sale is saved whether it prints or not. Jobs that could not print wait here.",
  pNoReplay: "When a printer comes back, nothing prints by itself — so no ticket is printed twice. Retry what is still needed.",
  pBrowserPrint: "Print (80 mm)", pBack: "Printer is back. {n} waiting to print — open To print.", printReceipt: "Print receipt", pPrinters: "Printers", pRateFrom: "Last known rate from {d} (offline)", pOrderNoTicket: "Order confirmed · kitchen ticket not printed — read it out", pOnRequest: "The receipt prints when the customer asks; the invoice is saved either way."
});
Object.assign(POS_I18N.ar, {
  taxId: "الرقم الضريبي", pTaxIncluded: "يشمل ضريبة {r}%", pDate: "التاريخ", pOrderNo: "رقم الطلب", pSyp: "ل.س", pCompanyInvoice: "فاتورة شركة",
  pOffline: "صدرت دون اتصال — لم تُزامن بعد", pUnpaid: "غير مدفوع — الدفع عند التسليم", pLate: "طباعة متأخرة · الطلب {t}",
  pRefundSlip: "إيصال إرجاع", pApprovedBy: "بموافقة", pSignature: "التوقيع: ____________", pOpened: "الفتح", pClosed: "الإغلاق",
  pReceipt: "الإيصال", pKitchenTicket: "قسيمة المطبخ", pRetried: "طُبعت بعد تعذّر",
  pr_ok: "جاهزة", pr_paper: "نفد الورق", pr_off: "الطابعة مطفأة",
  pPrinterName_receipt: "طابعة الإيصالات", pPrinterName_kitchen: "طابعة المطبخ",
  pToPrint: "بانتظار الطباعة", pPrintedOk: "طُبع: {what}", pStillFailing: "ما زالت لا تطبع {why}", pReceiptPrinted: "طُبع الإيصال",
  pNotPrinted: "لم يُطبع", pReceiptFailed: "لم يُطبع الإيصال", pSavedAnyway: "البيع محفوظ بالفاتورة {n}. اطبعها حين تجهز الطابعة، أو تابع.",
  pKitchenFailed: "لم تُطبع قسيمة المطبخ", pReadOut: "الطلب ظاهر على شاشة المطبخ. اقرأه للبار حتى تعود الطابعة.",
  pRetry: "أعد المحاولة", pRetryAll: "أعد الكل ({n})", pRetriedN: "طُبع {n} من {m}", pPreview: "معاينة", pJob: "مهمة الطباعة", pWhy: "السبب",
  pNothing: "لا شيء بانتظار الطباعة", pQueueHint: "كل بيع محفوظ سواء طُبع أم لا. ما تعذّرت طباعته ينتظر هنا.",
  pNoReplay: "حين تعود الطابعة لا يُطبع شيء تلقائيًا — كي لا تتكرر قسيمة. أعد ما زال مطلوبًا.",
  pBrowserPrint: "اطبع (80 مم)", pBack: "عادت الطابعة. {n} بانتظار الطباعة — افتح «بانتظار الطباعة».", printReceipt: "اطبع الإيصال", pPrinters: "الطابعات", pRateFrom: "آخر سعر معروف من {d} (دون اتصال)", pOrderNoTicket: "تأكّد الطلب · لم تُطبع قسيمة المطبخ — اقرأه للبار", pOnRequest: "يُطبع الإيصال حين يطلبه الزبون؛ الفاتورة محفوظة في الحالتين."
});
