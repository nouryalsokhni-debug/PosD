---
title: Permissions matrix
status: draft
owner: PO
last_updated: 2026-09-28
source: client spec v1, section ٤
---

# Permissions matrix

Roles are configurable; each sensitive action is bound to a role (USR-01, USR-02). Values below = **Electro Café defaults** from spec v1.

| Action | Who | Status |
|---|---|---|
| Remove item before payment | Cashier | confirmed |
| Cancel invoice after payment | Branch manager | confirmed |
| Cash refund | Cashier — drawer opens inside the logged operation | confirmed |
| Open drawer without a sale | Branch manager + reason | confirmed |
| Close shift | Cashier | confirmed |
| Cash count at close | Branch manager | confirmed |
| Change item price | HQ admin | confirmed |
| View reports | HQ admin, branch manager | confirmed |
| Manual discount | Branch manager, within central ceiling | assumed (D-04) |

**Drawer rule:** sale and refund open the drawer automatically inside a logged operation; free opening only by branch manager with reason. The cashier never needs a free-open permission.
