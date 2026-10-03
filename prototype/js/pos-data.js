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
    exchangeRate: 13000,           // SYP per 1 USD — entered daily by HQ (PAY-04). SAMPLE value, same as the HQ panel
    rounding: { step: 500, mode: "nearest", decision: "D-11" },
    waitAlertMin: 8,               // KDS-05 — order turns red after this many minutes
    staffMealLimitSYP: { value: 30000, decision: "D-16" },
    companyInvoice: { enabled: true, decision: "D-18" },
    discountCeilingPct: { value: 15, decision: "D-04" },
    openingFloat: { SYP: 200000, USD: 0, decision: "D-23" },
    varianceLimitSYP: { value: 5000, decision: "D-06" },
    offline: { warnHours: { value: 4, decision: "D-12" }, retentionDays: { value: 7, decision: "D-12" } }, // OFF-09
    taxIncluded: true, taxRatePct: { value: 0, decision: "D-03" }
  },

  /* Receipt header/footer (FIS-02). Printing: receipt on request (FIS-01), kitchen ticket always. SAMPLE values. */
  receipt: {
    address: "Main street, Damascus", addressAr: "الشارع الرئيسي، دمشق", phone: "+963 11 000 0000",
    taxId: { value: "—", decision: "D-03" },
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

  /* Preparation stations (KDS-04, waits for D-14): which categories go where */
  stations: [ { id: "bar", name: "Coffee bar", nameAr: "بار القهوة", cats: ["hot", "cold"] }, { id: "pastry", name: "Pastry counter", nameAr: "ركن الحلويات", cats: ["sweet", "snack"] } ],

  categories: [
    { id: "hot",   name: "Hot drinks",  nameAr: "مشروبات ساخنة" },
    { id: "cold",  name: "Cold drinks", nameAr: "مشروبات باردة" },
    { id: "sweet", name: "Sweets",      nameAr: "حلويات" },
    { id: "snack", name: "Snacks",      nameAr: "سناكات" }
  ],

  /* Option groups: size changes price, sugar does not (config) */
  optionGroups: {
    size:  { name: "Size", nameAr: "الحجم", required: true, choices: [
      { id: "s", name: "Small", nameAr: "صغير", delta: 0 },
      { id: "m", name: "Medium", nameAr: "وسط", delta: 4000 },
      { id: "l", name: "Large", nameAr: "كبير", delta: 7000 } ] },
    sugar: { name: "Sugar", nameAr: "السكر", required: true, choices: [
      { id: "none", name: "No sugar", nameAr: "بدون", delta: 0 },
      { id: "low",  name: "Light",    nameAr: "قليل", delta: 0 },
      { id: "med",  name: "Medium",   nameAr: "وسط",  delta: 0 },
      { id: "high", name: "Sweet",    nameAr: "زيادة", delta: 0 } ] },
    milk:  { name: "Milk", nameAr: "الحليب", required: true, choices: [
      { id: "full", name: "Full fat", nameAr: "كامل الدسم", delta: 0 },
      { id: "oat",  name: "Oat",      nameAr: "شوفان",      delta: 5000 } ] }
  },

  /* Items — same seed as the back office (docs/05-architecture/seed-electro-cafe.md); `hq` is the item's id there.
     name + localised name on every entity (R-03). Stock by finished item (D-01 assumption). */
  items: [
    { id: "i01", hq: "ec-espresso", cat: "hot", name: "Espresso", nameAr: "إسبريسو", price: 15000, fav: true, options: ["size","sugar"], stock: 80, color: "#7a4b2a", barcode: "1001" },
    { id: "i02", hq: "ec-cappuccino", cat: "hot", name: "Cappuccino", nameAr: "كابتشينو", price: 20000, fav: true, options: ["size","sugar","milk"], stock: 60, color: "#a0673c", barcode: "1002" },
    { id: "i03", hq: "ec-latte", cat: "hot", name: "Latte", nameAr: "لاتيه", price: 22000, fav: true, options: ["size","sugar","milk"], stock: 60, color: "#c08a55", barcode: "1003" },
    { id: "i04", hq: "ec-turkish", cat: "hot", name: "Turkish coffee", nameAr: "قهوة تركية", price: 12000, fav: true, options: ["sugar"], stock: 90, color: "#5a3a22", barcode: "1004" },
    { id: "i05", hq: "ec-tea", cat: "hot", name: "Black tea", nameAr: "شاي أسود", price: 8000, fav: false, options: ["sugar"], stock: 99, color: "#9c5b2e", barcode: "1005" },
    { id: "i06", hq: "ec-iced", cat: "cold", name: "Iced coffee", nameAr: "قهوة مثلجة", price: 25000, fav: true, options: ["size","sugar","milk"], stock: 40, color: "#6b8fa3", barcode: "2001" },
    { id: "i07", hq: "ec-lemonade", cat: "cold", name: "Lemon mint", nameAr: "ليمون ونعناع", price: 18000, fav: true, options: ["size","sugar"], stock: 40, color: "#6f9d4a", barcode: "2002" },
    { id: "i08", hq: "ec-water", cat: "cold", name: "Water", nameAr: "مياه", price: 5000, fav: false, options: [], stock: 120, color: "#5f8fbf", barcode: "6210001000038" },
    { id: "i09", hq: "ec-frappe", cat: "cold", name: "Frappé", nameAr: "فرابيه", price: 28000, fav: false, options: ["size","sugar"], stock: 3, color: "#8a6f9e", barcode: "2004" },
    { id: "i10", hq: "ec-brownie", cat: "sweet", name: "Brownie", nameAr: "براوني", price: 16000, fav: true, options: [], stock: 25, color: "#4e342e", barcode: "6210001000045" },
    { id: "i11", hq: "ec-cheesecake", cat: "sweet", name: "Cheesecake", nameAr: "تشيز كيك", price: 30000, fav: false, options: [], stock: 12, color: "#d2a15a", barcode: "3002" },
    { id: "i12", hq: "ec-croissant", cat: "sweet", name: "Croissant", nameAr: "كرواسان", price: 14000, fav: true, options: [], stock: 0, color: "#c9914b", barcode: "6210001000014" },
    { id: "i13", hq: "ec-club", cat: "snack", name: "Club sandwich", nameAr: "كلوب ساندويش", price: 40000, fav: false, options: [], stock: 15, color: "#8d7b4e", barcode: "4001" },
    { id: "i14", hq: "ec-chips", cat: "snack", name: "Chips", nameAr: "شيبس", price: 8000, fav: false, options: [], stock: 50, color: "#c2a13a", barcode: "6210001000052" },
    { id: "i15", hq: "ec-cake", cat: "sweet", name: "Cake slice", nameAr: "قطعة كيك", price: 20000, fav: false, options: [], stock: 18, color: "#b5651d", barcode: "6210001000021" }
  ],

  /* Automatic promotions (PRC-04 → PRC-06). Simple rules for the prototype. */
  promotions: [
    { id: "p1", type: "combo", name: "Coffee + Brownie", nameAr: "قهوة + براوني",
      items: [["i01","i02","i03"], ["i10"]], discount: 5000 },
    { id: "p2", type: "offerOfDay", name: "Offer of the day: Lemon mint −20%", nameAr: "عرض اليوم: ليمون ونعناع −٢٠٪",
      itemId: "i07", pct: 20 }
  ]
};
