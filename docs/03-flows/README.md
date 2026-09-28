---
title: Business flows
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1 section ٤ (source/POS_Specs_Client_v1.ar.md)
---

# Business flows

Flows describe **what happens, step by step**, independent of screens. Screens implement flows; design a flow before its screens.

| ID | Flow | Surface | Status |
|---|---|---|---|
| FLOW-01 | [Counter sale — pay first](FLOW-01-counter-sale.md) (Electro Café mode) | Cashier app | draft |
| FLOW-02 | [Sale — pay later](FLOW-02-pay-later.md) (setting per branch) | Cashier app | draft |
| FLOW-03 | [Cancel & refund after payment](FLOW-03-cancel-refund.md) | Cashier app | draft |
| FLOW-04 | [Shift & cash drawer](FLOW-04-shift-cash.md) | Cashier app | draft |
| FLOW-05 | [Offline operation](FLOW-05-offline.md) | All | draft |
| FLOW-06 | [Back office operations](FLOW-06-back-office.md) | Tenant back office | draft |
| FLOW-07 | Tenant onboarding (operator) | Operator control panel | to write |
| — | [Permissions matrix](permissions-matrix.md) | All | draft |

Each flow file: steps · requirement refs · open decisions that affect it · edge cases (offline, cancel, errors).
