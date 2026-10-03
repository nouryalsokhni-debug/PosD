# prototype/ — rules for Claude

- Reference prototype only: no frameworks, no build step, no npm. Every page opens via file://.
- Three entries: `index.html` (panel, 3 layers), `pos.html` (cashier app), `requirements.html` (coverage). Keep each file's script order. Cashier code uses the `pos-` prefix; never mix it with the panel.
- Panel: every screen is one of the four page kinds in `js/pages.js` (list · record · settings · flow) built from `js/ui.js` components. Don't invent new layouts.
- Panel files by day: Day 4–5 = `data.js, i18n.js, store.js, ui.js, shell.js, pages.js, pages-hq.js, app.js`; Day 10 = `data-ops.js, i18n-ops.js, pages-ops.js, pages-ops2.js, css/ops.css`; Day 11 = `data-billing.js, i18n-quantara.js, pages-quantara.js` (Quantara billing, support, platform settings, screen states). Module 1 (3 Oct) = `i18n-m1.js, pages-m1.js` (HQ Branches and registers, People and roles — they replace the Day 5/10 versions). Use `UI.StateView` for empty/loading/error/offline/forbidden. Add new screens in new files where you can; touch Day 4–5 files only for routes (`app.js`), nav (`shell.js`) and script tags.
- Every string in both languages: panel → `i18n.js` / `i18n-ops.js` (via `I18n.extend`); cashier → `pos-i18n.js` (or `Object.assign(POS_I18N.en/ar, …)` in its own file, like `pos-print.js`). Anything printed goes through `pos-print.js` (80 mm paper + print jobs); never build receipt HTML elsewhere. Offline time, sync report and power-cut recovery live in `pos-offline.js`; use `simNow()` for anything that depends on how long the till was offline. Terms from `docs/01-product/glossary.md`. Test in `dir="rtl"`.
- Ownership: any value someone owns shows an `OwnerTag`, `OverrideTag` or `SyncNote` (see README "Who owns what").
- A value waiting for a client decision shows `Waits for D-xx` (panel `Decision()`, cashier `assume()`); change the value in `data-ops.js` / `pos-data.js` when the decision closes.
- Use CSS logical properties; token values must match `docs/04-design/tokens/`.
- A screen marked `figma-approved` in the registry: match Figma visually; don't restyle.
- After changing a screen: update its row in `docs/04-design/screen-registry.md` and rerun `python prototype/tools/build-coverage.py`.
- Sample data: Electro Café follows `clients/electro-cafe/seed.md` in **both** `js/data.js` and `js/pos-data.js` (same names, prices, option prices, staff). Change the seed doc and both files together.
- Invoice numbers are per branch (`Store.invoiceSeries(tn, b)` → `EC-MAIN`); never add the register to the number.
- Electro Café amounts are in the new Syrian pound (Latte 220, not 22,000); rounding step 5. Menu sections are the top-level categories (To drink, To eat, Our beans); an item with no station (packed beans) prints no kitchen ticket.
- The till is an iPad: check `pos.html` at 1180×820 and 1080×810, touch only.
