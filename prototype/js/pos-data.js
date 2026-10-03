/* Quantara POS — cashier prototype · sample data
   Everything here is SAMPLE data for the prototype. Field names are plain on purpose:
   the back end starts from them. Values marked with a D-number are ASSUMPTIONS
   waiting for a decision in docs/06-decisions/decision-log.md. */

var POS_DATA = {
  /* Three tiers (ADR-001): this till talks to the branch server; the branch server gives invoice numbers and syncs with the cloud. */
  tenant: { id: "EC", name: "Electro Café", nameAr: "إلكترو كافيه" },
  branch: { id: "MAIN", name: "Main branch", nameAr: "الفرع الرئيسي" },
  register: { id: "R1", name: "Register 1", nameAr: "نقطة البيع ١" },

  /* Branch settings (spec §٥). Assumptions flagged with the decision they wait for. */
  settings: {
    saleMode: "payFirst",          // payFirst | payLater  (FLOW-01 / FLOW-02, per branch)
    currencyBase: "SYP",
    exchangeRate: 130,             // new SYP per 1 USD — entered daily by HQ (PAY-04). SAMPLE value, same as the HQ panel
    rounding: { step: 5, mode: "nearest" },   // D-11 decided 3 Oct: new Syrian pound (1 new = 100 old, since 1 Jan 2026); the step is an HQ setting
    waitAlertMin: 8,               // KDS-05 — order turns red after this many minutes
    staffMealLimitSYP: { value: 300, decision: "D-16" },
    companyInvoice: { enabled: true, decision: "D-18" },
    discountCeilingPct: { value: 15, decision: "D-04" },
    openingFloat: { SYP: 2000, USD: 0, decision: "D-23" },
    varianceLimitSYP: { value: 50, decision: "D-06" },
    offline: { warnHours: { value: 4, decision: "D-12" }, retentionDays: { value: 7, decision: "D-12" } }, // OFF-09
    tax: { on: false, ratePct: 0, included: true }   // D-03 decided 3 Oct: each tenant sets its own tax at HQ; off for this sample
  },

  /* Receipt header/footer (FIS-02). Printing: receipt on request (FIS-01), kitchen ticket always. SAMPLE values. */
  receipt: {
    address: "Main street, Damascus", addressAr: "الشارع الرئيسي، دمشق", phone: "+963 11 000 0000",
    taxId: "",   // printed only when the tenant has entered one at HQ
    footer: "Thank you — see you soon", footerAr: "شكرًا لزيارتكم"
  },

  /* Staff — PINs are for the prototype only */
  staff: [
    { id: "u1", name: "Hala",  nameAr: "هلا",  role: "cashier", pin: "1111" },
    { id: "u2", name: "Samer", nameAr: "سامر", role: "cashier", pin: "2222" },
    { id: "u3", name: "Maya",  nameAr: "مايا", role: "manager", pin: "9999" }
  ],

  /* Payment methods (config: Cash SYP, cash USD, card, Syriatel Cash, Sham Cash) */
  methods: [
    { id: "cashSYP", currency: "SYP", cash: true,  online: false },
    { id: "cashUSD", currency: "USD", cash: true,  online: false },
    { id: "card",    currency: "SYP", cash: false, online: true, decision: "D-29" },
    { id: "syriatel",currency: "SYP", cash: false, online: true, needsRef: true },
    { id: "sham",    currency: "SYP", cash: false, online: true, needsRef: true }
  ],

  /* Preparation stations (KDS-04): which sections go where */
stations: [ { id: "bar", name: "Drinks bar", nameAr: "بار المشروبات", cats: ["drink"] }, { id: "kitchen", name: "Food counter", nameAr: "ركن المأكولات", cats: ["eat"] } ],   // D-14 decided: two stations; "Our beans" need no ticket

  categories: [   // the three sections the client named (3 Oct); every staff member can sell from all of them
    { id: "drink", name: "To drink",  nameAr: "للشرب" },
    { id: "eat",   name: "To eat",    nameAr: "للأكل" },
    { id: "beans", name: "Our beans", nameAr: "بنّنا" }
  ],

  /* Option groups: size changes price, sugar does not (config) */
  optionGroups: {
    size:  { name: "Size", nameAr: "الحجم", required: true, choices: [
      { id: "s", name: "Small", nameAr: "صغير", delta: 0 },
      { id: "m", name: "Medium", nameAr: "وسط", delta: 40 },
      { id: "l", name: "Large", nameAr: "كبير", delta: 70 } ] },
    sugar: { name: "Sugar", nameAr: "السكر", required: true, choices: [
      { id: "none", name: "No sugar", nameAr: "بدون", delta: 0 },
      { id: "low",  name: "Light",    nameAr: "قليل", delta: 0 },
      { id: "med",  name: "Medium",   nameAr: "وسط",  delta: 0 },
      { id: "high", name: "Sweet",    nameAr: "زيادة", delta: 0 } ] },
    milk:  { name: "Milk", nameAr: "الحليب", required: true, choices: [
      { id: "full", name: "Full fat", nameAr: "كامل الدسم", delta: 0 },
      { id: "oat",  name: "Oat",      nameAr: "شوفان",      delta: 50 } ] }
  },

  /* Items — same seed as the back office (docs/05-architecture/seed-electro-cafe.md); `hq` is the item's id there.
     name + localised name on every entity (R-03). Stock by finished item (D-01 assumption). */
  items: [
    { id: "i01", hq: "ec-espresso", cat: "drink", sub: "hot", name: "Espresso", nameAr: "إسبريسو", price: 150, fav: true, options: ["size","sugar"], stock: 80, color: "#7a4b2a", barcode: "1001" },
    { id: "i02", hq: "ec-cappuccino", cat: "drink", sub: "hot", name: "Cappuccino", nameAr: "كابتشينو", price: 200, fav: true, options: ["size","sugar","milk"], stock: 60, color: "#a0673c", barcode: "1002" },
    { id: "i03", hq: "ec-latte", cat: "drink", sub: "hot", name: "Latte", nameAr: "لاتيه", price: 220, fav: true, options: ["size","sugar","milk"], stock: 60, color: "#c08a55", barcode: "1003" },
    { id: "i04", hq: "ec-turkish", cat: "drink", sub: "hot", name: "Turkish coffee", nameAr: "قهوة تركية", price: 120, fav: true, options: ["sugar"], stock: 90, color: "#5a3a22", barcode: "1004" },
    { id: "i05", hq: "ec-tea", cat: "drink", sub: "hot", name: "Black tea", nameAr: "شاي أسود", price: 80, fav: false, options: ["sugar"], stock: 99, color: "#9c5b2e", barcode: "1005" },
    { id: "i06", hq: "ec-iced", cat: "drink", sub: "cold", name: "Iced coffee", nameAr: "قهوة مثلجة", price: 250, fav: true, options: ["size","sugar","milk"], stock: 40, color: "#6b8fa3", barcode: "2001" },
    { id: "i07", hq: "ec-lemonade", cat: "drink", sub: "cold", name: "Lemon mint", nameAr: "ليمون ونعناع", price: 180, fav: true, options: ["size","sugar"], stock: 40, color: "#6f9d4a", barcode: "2002" },
    { id: "i08", hq: "ec-water", cat: "drink", sub: "cold", name: "Water", nameAr: "مياه", price: 50, fav: false, options: [], stock: 120, color: "#5f8fbf", barcode: "6210001000038" },
    { id: "i09", hq: "ec-frappe", cat: "drink", sub: "cold", name: "Frappé", nameAr: "فرابيه", price: 280, fav: false, options: ["size","sugar"], stock: 3, color: "#8a6f9e", barcode: "2004" },
    { id: "i10", hq: "ec-brownie", cat: "eat", sub: "sweet", name: "Brownie", nameAr: "براوني", price: 160, fav: true, options: [], stock: 25, color: "#4e342e", barcode: "6210001000045" },
    { id: "i11", hq: "ec-cheesecake", cat: "eat", sub: "sweet", name: "Cheesecake", nameAr: "تشيز كيك", price: 300, fav: false, options: [], stock: 12, color: "#d2a15a", barcode: "3002" },
    { id: "i12", hq: "ec-croissant", cat: "eat", sub: "sweet", name: "Croissant", nameAr: "كرواسان", price: 140, fav: true, options: [], stock: 0, color: "#c9914b", barcode: "6210001000014" },
    { id: "i13", hq: "ec-club", cat: "eat", sub: "snack", name: "Club sandwich", nameAr: "كلوب ساندويش", price: 400, fav: false, options: [], stock: 15, color: "#8d7b4e", barcode: "4001" },
    { id: "i14", hq: "ec-chips", cat: "eat", sub: "snack", name: "Chips", nameAr: "شيبس", price: 80, fav: false, options: [], stock: 50, color: "#c2a13a", barcode: "6210001000052" },
    { id: "i15", hq: "ec-cake", cat: "eat", sub: "sweet", name: "Cake slice", nameAr: "قطعة كيك", price: 200, fav: false, options: [], stock: 18, color: "#b5651d", barcode: "6210001000021" },
    { id: "i16", hq: "ec-soup", cat: "eat", sub: "soup", name: "Lentil soup", nameAr: "شوربة عدس", price: 180, fav: false, options: [], stock: 20, color: "#b9722d", barcode: "4003" },
    { id: "i17", hq: "ec-beans-house", cat: "beans", sub: null, name: "House blend beans 250 g", nameAr: "بنّ الخلطة الخاصة 250 غ", price: 1200, fav: false, options: [], stock: 30, color: "#6f4e37", barcode: "6210001000069" },
    { id: "i18", hq: "ec-beans-espresso", cat: "beans", sub: null, name: "Espresso roast beans 250 g", nameAr: "بنّ إسبريسو 250 غ", price: 1350, fav: false, options: [], stock: 24, color: "#3e2723", barcode: "6210001000076" }
  ],

  /* Automatic promotions (PRC-04 → PRC-06). Simple rules for the prototype. */
  promotions: [
    { id: "p1", type: "combo", name: "Coffee + Brownie", nameAr: "قهوة + براوني",
      items: [["i01","i02","i03"], ["i10"]], discount: 50 },
    { id: "p2", type: "offerOfDay", name: "Offer of the day: Lemon mint −20%", nameAr: "عرض اليوم: ليمون ونعناع −٢٠٪",
      itemId: "i07", pct: 20 }
  ]
};
