# U.S. order requests and payment links

Owner approved September 16, 2026: accept unpaid orders for review even when recorded stock is zero. No inventory counts are invented or changed.

Customers add active catalog variants to their bag and submit a U.S. shipping address. The API saves an Order with PENDING status and line-item price snapshots. The returned order number is an acknowledgment of an unpaid request. Country must be US; state must be one of the 50 states or DC; ZIP must use U.S. format. This is format validation, not postal deliverability verification.

Staff review requests in `/admin/orders`. New requests trigger customer and operations notifications through the configured email provider. If email delivery fails, the saved request remains in admin. Confirm stock, the shipping address, applicable offers, and tax before sending a payment link manually. The estimated amount is not the final invoice. Do not pack or ship an unpaid request. Existing label endpoints reject PENDING orders.

Payment links are a manual staff step; this release does not automatically generate links or reconcile payments from externally created links. The team must verify payment and reconcile the order through its operational process before fulfillment. Online Stripe checkout is exposed only when live mode and a live secret key are configured. Test-mode payments are not offered to customers.

The request API uses a client-generated UUID as the order ID, with exact-payload retry matching. Reusing an ID for changed details returns a conflict; duplicate retries do not create another order or resend notifications. The endpoint limits an email to three new pending requests per 15 minutes. Items and prices are resolved server-side. Stock and Sugar Points are not consumed by an unpaid request.

Validation: schema tests cover U.S. addressing, rejection of other countries and malformed ZIPs, duplicate SKU quantity caps, payload matching for idempotency, and bundle/shipping math. A local API request with a non-U.S. country returned 400 before persistence. Local browser review covered quick add, bag navigation, and the U.S. address form. No production test order or charge was created; actual email delivery was not tested in this release.
