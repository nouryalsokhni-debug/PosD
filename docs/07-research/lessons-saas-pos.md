---
title: Lessons — building a POS SaaS
status: approved
owner: PO
last_updated: 2026-09-28
---

# Lessons — mistakes to avoid

## Offline POS
- Treat offline as the **default mode**; reconnection is harder than offline itself.
- Expect duplicates, timing conflicts and partial updates on sync → idempotent operations, IDs generated on the device.
- Prevent printer commands being replayed on reconnect.
- Test with real cuts on site, not only simulations.

## Multi-tenant SaaS
- Tenancy in the data model from day one; never retrofit.
- No custom features per client — settings only.
- Automate tenant onboarding; manual provisioning doesn't scale.
- Know the per-tenant running cost before setting prices.
- Tested backups & restore; untested backups are hope.

## Emerging markets
- Local payment gateways are fragile: reconcile first, handle late/duplicate confirmations.
- Tax IDs, invoice numbering, audit trail exist from day one.
- Architecture follows economics: shared DB + tenant ID is usually right for small businesses.

## Sources
- https://dev.to/keyar/we-built-a-pos-system-that-had-to-work-without-internet-heres-what-we-learned-mcg
- https://www.infoq.com/presentations/saas-mistakes/
- https://medium.com/@walexy85/building-a-multi-tenant-saas-for-an-emerging-market-what-nobody-tells-you-014c57be8e7f
