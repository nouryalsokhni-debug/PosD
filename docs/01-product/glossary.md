---
title: Glossary (EN / AR)
status: living
owner: PO
last_updated: 2026-10-03
---

# Glossary — use these words exactly (UI, docs, Jira, Figma)

New term? Add it here **before** using it anywhere.

| English | العربية | Meaning |
|---|---|---|
| Operator | المشغّل (كوانتارا) | Quantara, the company running the SaaS |
| Tenant | العميل / المنشأة | A business subscribed to Quantara (e.g., Electro Café) |
| Branch | الفرع | One location of a tenant |
| Register / POS terminal | نقطة البيع | One cashier station in a branch |
| Cashier app | تطبيق نقطة البيع (الكاشير) | The selling screen |
| Branch server | خادم الفرع | The small computer in each branch: keeps the branch's stock, orders, shifts and invoice numbers, prints, and syncs with Quantara (ADR-001) |
| Setup code | رمز التجهيز | One-time code that links a new branch server to its branch |
| Tenant code / Branch code | رمز المستأجر / رمز الفرع | 2–4 letters; together they start every invoice number (`EC-MAIN-000001`) |
| People and roles | الأشخاص والأدوار | The HQ page for staff (People) and what each role may do (Permissions) |
| Back-office access | دخول لوحة الإدارة | Sign-in to the panel by email or phone + password, through an invite |
| Temporary PIN | رمز مؤقت | 4-digit PIN shown once to HQ; the person changes it at the first till sign-in |
| Retire (a register) | إخراج من الخدمة | The register can't open new shifts; its history stays |
| Customer display | شاشة الزبون | Screen facing the customer |
| Tenant HQ / back office | لوحة التحكم المركزية / الإدارة المركزية | The tenant's head office. "Central" in the client spec = tenant HQ, **never** Quantara |
| Operator control panel | لوحة تحكم المشغّل | Quantara staff panel across all tenants |
| Order | الطلب | Items being sold before payment is complete |
| Held order | طلب معلّق | Order parked to serve another customer (POS-06) |
| Invoice / Receipt | الفاتورة | Record created for every paid sale; printed on request (FIS-01) |
| Prep ticket | قسيمة التحضير | Ticket for barista/kitchen with order number & type |
| Dine-in / Takeaway | محلي / سفري | Order type |
| Item | الصنف | Something on the menu |
| Option / Modifier | خيار | Size (changes price), sugar level (doesn't) |
| Combo | كومبو | Bundle at a set price |
| Offer of the day | عرض اليوم | Daily promotion |
| Manual discount | الخصم اليدوي | Discount entered by staff, within a ceiling |
| Mixed payment | دفع مختلط | One invoice paid with several methods |
| Exchange rate | سعر الصرف | Daily SYP/USD rate, fixed on each invoice (PAY-04) |
| Shift | الوردية | A cashier's working session on a register |
| Cash drawer | درج النقود / الصندوق | Physical drawer; one per register |
| Opening float | الرصيد الافتتاحي | Cash in drawer at shift start, per currency |
| Cash count | جرد الصندوق | Counting actual cash at shift close |
| Variance | الفرق | Counted cash minus expected cash |
| Cancel (after payment) | إلغاء فاتورة | Voids a paid invoice; manager + reason |
| Refund | إرجاع نقود | Money returned to customer |
| Waste / Spoilage | الهدر / التالف | Stock removed without sale |
| Stock count | الجرد | Physical stock check |
| Offline mode | العمل دون اتصال | Working without internet |
| Sync | المزامنة | Sending local data to the cloud when online |
| Audit log | سجل التدقيق | Unchangeable record of sensitive actions |
| Mall share | نسبة المول | Mall's percentage of sales (D-02) |
