/* Quantara POS — cashier prototype · strings (EN / AR). Terms from docs/01-product/glossary.md */
var POS_I18N = {
  en: {
    appName: "Quantara POS", lang: "العربية",
    // shell
    branch: "Branch", register: "Register", cashier: "Cashier", shift: "Shift", rate: "Rate",
    online: "Online", offline: "Offline", waiting: "{n} waiting", lastSync: "last sync {t}", syncing: "Syncing…",
    menu: "Menu", guide: "Flow guide", logout: "Switch user",
    // login
    loginTitle: "Who is selling?", enterPin: "Enter PIN", wrongPin: "Wrong PIN", signIn: "Sign in",
    // shift
    openShiftTitle: "Open shift", openingFloat: "Opening float", openShift: "Open shift",
    floatHint: "Count the cash in the drawer, per currency.",
    // sale
    favourites: "Favourites", search: "Search name or barcode…", outOfStock: "Out", left: "{n} left",
    order: "Order", orderNo: "Order #{n}", dineIn: "Dine-in", takeaway: "Takeaway",
    emptyOrder: "Tap an item to start the order.", note: "Note", addNote: "Add note",
    subtotal: "Subtotal", discount: "Discount", promos: "Offers", total: "Total", rounding: "Rounding",
    pay: "Pay", confirmOrder: "Confirm order", hold: "Hold", held: "Held ({n})", clear: "Clear",
    manualDiscount: "Manual discount", remove: "Remove",
    // options
    add: "Add to order", update: "Update", required: "Required",
    // manager approval
    managerApproval: "Manager approval", manager: "Manager", approve: "Approve", cancel: "Cancel", reason: "Reason",
    reasonRequired: "A reason is required", ceiling: "Ceiling {n}%", pct: "Percent", amount: "Amount",
    overCeiling: "Above the {n}% ceiling",
    // payment
    payment: "Payment", method: "Method", received: "Received", remaining: "Remaining", change: "Change",
    addTender: "Add", exact: "Exact", tenders: "Payments", confirmClose: "Confirm & close order",
    refNo: "Reference no.", needsConnection: "Needs connection — use cash while offline",
    back: "Back", pinnedRate: "Rate pinned: 1 USD = {r} SYP",
    cashSYP: "Cash SYP", cashUSD: "Cash USD", card: "Card", syriatel: "Syriatel Cash", sham: "Sham Cash",
    // done
    paid: "Paid", sentToKitchen: "Sent to preparation", printInvoice: "Print invoice", newSale: "New sale",
    invoice: "Invoice", prepTicket: "Prep ticket", drawerOpened: "Drawer opened",
    orderConfirmed: "Order confirmed — prep ticket printed", payOnHandover: "Customer pays on hand-over",
    // orders board
    orders: "Orders", preparing: "Preparing", ready: "Ready", handedOver: "Handed over",
    markReady: "Ready — call", handOver: "Hand over", callNumber: "Calling #{n}", unpaid: "Unpaid", payNow: "Take payment",
    // invoices
    invoices: "Invoices", noInvoices: "No invoices in this shift yet.", status: "Status",
    statusPaid: "Paid", statusCancelled: "Cancelled", statusRefunded: "Cancelled · refunded",
    cancelInvoice: "Cancel invoice", refundCash: "Refund cash", stockReturned: "Stock returned",
    cancelDone: "Invoice cancelled. Refund the customer.", refundDone: "Refund done — drawer opened",
    // shift close
    closeShift: "Close shift", cashCount: "Cash count", expected: "Expected", counted: "Counted", variance: "Variance",
    withinLimit: "Within limit ({n})", overLimit: "Above limit ({n}) — manager approval + reason",
    nonCash: "Non-cash", shiftReport: "Shift report", sales: "Sales", cancels: "Cancels", refunds: "Refunds",
    closeAndPrint: "Close & print report", countBy: "Counted by the branch manager",
    // drawer
    openDrawer: "Open drawer", noSale: "No sale",
    // audit
    audit: "Audit log", auditHint: "Cannot be edited or deleted (USR-05).",
    // offline / demo
    demo: "Demo controls", goOffline: "Go offline", goOnline: "Go online", powerCut: "Simulate power cut",
    resetDemo: "Reset demo data", saleModeLbl: "Sale mode (branch setting)", payFirst: "Pay first", payLater: "Pay later",
    restored: "Power came back — the open order was restored.", offlineBanner: "Offline — selling continues. {n} records will sync when back online.",
    synced: "Back online — {n} records synced.",
    assumption: "Assumption", notBuilt: "Needs the HQ build (POSD-85)",
    close: "Close", done: "Done",
    kitchen: "Kitchen", start: "Start", allStations: "All stations", newOrder: "New", overdue: "Waiting {m} min", kWaiting: "{m} min",
    cardLogin: "Tap staff card", cardRead: "Card read", split: "Split bill", splitTitle: "Split the bill by items", splitHint: "Tick the items the first customer pays for. The rest stays as a held order.",
    splitDone: "Split — the rest is held as order #{n}", splitNeed: "Tick at least one item, not all", staffMeal: "Staff meal", staffMealFor: "Staff member",
    mealLeft: "Left today: {n}", mealOver: "Above the daily staff-meal limit", mealDone: "Staff meal recorded at zero price",
    company: "Invoice to a company", companyName: "Company name", companyTax: "Tax number", companySet: "Company: {n}", reprint: "Reprint", copy: "COPY", copyPrinted: "Copy printed",
    openDisplay: "Open customer display", displayWelcome: "Welcome", displayReady: "Ready — please collect", displayTotal: "To pay", nowPreparing: "Preparing", syncedTag: "Synced", pendingTag: "Waiting to sync", syncCol: "Sync", action: "Action", resetGuide: "Reset guide"
  },
  ar: {
    appName: "كوانتارا · نقطة البيع", lang: "English",
    branch: "الفرع", register: "نقطة البيع", cashier: "الكاشير", shift: "الوردية", rate: "سعر الصرف",
    online: "متصل", offline: "دون اتصال", waiting: "{n} بانتظار المزامنة", lastSync: "آخر مزامنة {t}", syncing: "جارٍ المزامنة…",
    menu: "القائمة", guide: "دليل الفلو", logout: "تبديل المستخدم",
    loginTitle: "من يبيع الآن؟", enterPin: "أدخل الرمز", wrongPin: "رمز خاطئ", signIn: "دخول",
    openShiftTitle: "فتح الوردية", openingFloat: "الرصيد الافتتاحي", openShift: "فتح الوردية",
    floatHint: "عُدّ النقد في الدرج، لكل عملة على حدة.",
    favourites: "المفضلة", search: "بحث بالاسم أو الباركود…", outOfStock: "نفد", left: "بقي {n}",
    order: "الطلب", orderNo: "طلب رقم {n}", dineIn: "محلي", takeaway: "سفري",
    emptyOrder: "اضغط على صنف لبدء الطلب.", note: "ملاحظة", addNote: "إضافة ملاحظة",
    subtotal: "المجموع الفرعي", discount: "الخصم", promos: "العروض", total: "الإجمالي", rounding: "التقريب",
    pay: "دفع", confirmOrder: "تأكيد الطلب", hold: "تعليق", held: "المعلّقة ({n})", clear: "مسح",
    manualDiscount: "خصم يدوي", remove: "حذف",
    add: "إضافة إلى الطلب", update: "تحديث", required: "إلزامي",
    managerApproval: "اعتماد مدير الفرع", manager: "المدير", approve: "اعتماد", cancel: "إلغاء", reason: "السبب",
    reasonRequired: "السبب إلزامي", ceiling: "السقف {n}٪", pct: "نسبة", amount: "مبلغ",
    overCeiling: "أعلى من سقف {n}٪",
    payment: "الدفع", method: "الوسيلة", received: "المستلم", remaining: "المتبقي", change: "الباقي",
    addTender: "إضافة", exact: "المبلغ تماماً", tenders: "الدفعات", confirmClose: "تأكيد وإغلاق الطلب",
    refNo: "رقم المرجع", needsConnection: "تحتاج اتصالاً — استخدم النقد أثناء الانقطاع",
    back: "رجوع", pinnedRate: "السعر المثبّت: ١ دولار = {r} ل.س",
    cashSYP: "نقد ل.س", cashUSD: "نقد دولار", card: "بطاقة", syriatel: "سيريتل كاش", sham: "شام كاش",
    paid: "تم الدفع", sentToKitchen: "أُرسل للتحضير", printInvoice: "طباعة الفاتورة", newSale: "بيع جديد",
    invoice: "الفاتورة", prepTicket: "قسيمة التحضير", drawerOpened: "فُتح الدرج",
    orderConfirmed: "تم تأكيد الطلب — طُبعت قسيمة التحضير", payOnHandover: "يدفع الزبون عند التسليم",
    orders: "الطلبات", preparing: "قيد التحضير", ready: "جاهز", handedOver: "سُلّم",
    markReady: "جاهز — نداء", handOver: "تسليم", callNumber: "نداء رقم {n}", unpaid: "غير مدفوع", payNow: "استلام الدفع",
    invoices: "الفواتير", noInvoices: "لا فواتير في هذه الوردية بعد.", status: "الحالة",
    statusPaid: "مدفوعة", statusCancelled: "ملغاة", statusRefunded: "ملغاة · مُرجعة",
    cancelInvoice: "إلغاء الفاتورة", refundCash: "إرجاع النقود", stockReturned: "أُعيد المخزون",
    cancelDone: "أُلغيت الفاتورة. أرجِع المبلغ للزبون.", refundDone: "تم الإرجاع — فُتح الدرج",
    closeShift: "إغلاق الوردية", cashCount: "جرد الصندوق", expected: "المتوقع", counted: "الفعلي", variance: "الفرق",
    withinLimit: "ضمن الحد ({n})", overLimit: "أعلى من الحد ({n}) — اعتماد المدير مع سبب",
    nonCash: "غير نقدي", shiftReport: "تقرير الوردية", sales: "المبيعات", cancels: "الإلغاءات", refunds: "الإرجاعات",
    closeAndPrint: "إغلاق وطباعة التقرير", countBy: "يجري الجرد مدير الفرع",
    openDrawer: "فتح الدرج", noSale: "دون عملية",
    audit: "سجل التدقيق", auditHint: "لا يمكن تعديله أو حذفه (USR-05).",
    demo: "أدوات العرض", goOffline: "قطع الاتصال", goOnline: "إعادة الاتصال", powerCut: "محاكاة انقطاع الكهرباء",
    resetDemo: "إعادة ضبط بيانات العرض", saleModeLbl: "نمط البيع (إعداد الفرع)", payFirst: "دفع مسبق", payLater: "دفع لاحق",
    restored: "عادت الكهرباء — تمت استعادة الطلب المفتوح.", offlineBanner: "دون اتصال — البيع مستمر. {n} قيد ستُزامن عند عودة الاتصال.",
    synced: "عاد الاتصال — تمت مزامنة {n} قيد.",
    assumption: "افتراض", notBuilt: "يحتاج بناء لوحة الإدارة (POSD-85)",
    close: "إغلاق", done: "تم",
    kitchen: "المطبخ", start: "بدء", allStations: "كل المحطات", newOrder: "جديد", overdue: "بانتظار {m} دقيقة", kWaiting: "{m} دقيقة",
    cardLogin: "مرّر بطاقة الموظف", cardRead: "قُرئت البطاقة", split: "تقسيم الحساب", splitTitle: "تقسيم الحساب حسب الأصناف", splitHint: "حدّد الأصناف التي يدفعها الزبون الأول. يبقى الباقي طلباً معلّقاً.",
    splitDone: "تم التقسيم — الباقي معلّق كطلب رقم {n}", splitNeed: "حدّد صنفاً واحداً على الأقل، لا كلها", staffMeal: "وجبة موظف", staffMealFor: "الموظف",
    mealLeft: "المتبقي اليوم: {n}", mealOver: "أعلى من حد وجبات الموظف اليومي", mealDone: "سُجّلت وجبة الموظف بسعر صفر",
    company: "فاتورة باسم شركة", companyName: "اسم الشركة", companyTax: "الرقم الضريبي", companySet: "الشركة: {n}", reprint: "إعادة طباعة", copy: "نسخة", copyPrinted: "طُبعت نسخة",
    openDisplay: "فتح شاشة الزبون", displayWelcome: "أهلاً بكم", displayReady: "جاهز — تفضّل بالاستلام", displayTotal: "المطلوب", nowPreparing: "قيد التحضير", syncedTag: "تمت المزامنة", pendingTag: "بانتظار المزامنة", syncCol: "المزامنة", action: "الإجراء", resetGuide: "إعادة ضبط الدليل"
  }
};

var POS_LANG = "en";
try { var _l = localStorage.getItem("quantara.lang"); if (_l === "ar" || _l === "en") POS_LANG = _l; } catch (e) {}

function t(key, vars) {
  var s = (POS_I18N[POS_LANG] && POS_I18N[POS_LANG][key]) || POS_I18N.en[key] || key;
  if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}
function nm(o) { return POS_LANG === "ar" ? (o.nameAr || o.name) : o.name; }
function setLang(l) {
  POS_LANG = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  try { localStorage.setItem("quantara.lang", l); } catch (e) {}
}
