# prototype/ — rules for Claude

- Reference prototype only: no frameworks, no build step, no npm. Must open via file://.
- Keep script order in `index.html`. Page kinds: list · record · settings · flow — reuse them, don't invent new layouts.
- Every string goes through `i18n.js` (AR + EN), terms from `docs/01-product/glossary.md`. Test in `dir="rtl"`.
- Use CSS logical properties; token values must match `docs/04-design/tokens/`.
- A screen marked `figma-approved` in the registry: match Figma visually; don't restyle.
- After changing a screen, update its row in `docs/04-design/screen-registry.md`.
