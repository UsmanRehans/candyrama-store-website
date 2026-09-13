# CandyRama Order Fulfillment

This guide explains how Hani and the fulfillment team receive CandyRama orders and create shipping labels.

## 1. How orders arrive

1. A customer completes checkout through Stripe.
2. Stripe confirms payment to CandyRama.
3. The order appears in **Admin → Orders** with a `PAID` status.
4. The order card shows the order number, customer destination, order total, products, quantities, and SKUs.

Open the admin dashboard at [admin.thecandyrama.com](https://admin.thecandyrama.com) and select **Orders** in the left menu. Use **Refresh** if a newly paid order is not visible yet.

## 2. Check shipping before buying

1. Find the `PAID` order.
2. Select **Check rate**.
3. CandyRama sends the package weight, destination, and Rosenberg shipping origin to ShipStation.
4. The dashboard displays the cheapest eligible carrier service, price, estimated delivery time, and number of rates compared.

Checking a rate does **not** buy a label, create tracking, charge the ShipStation account, or change the order status. Media Mail and Library Mail are excluded because they cannot be used for candy.

## 3. Buy and print the label

1. Confirm that the customer address, products, and quantities look correct.
2. Select **Buy cheapest label**.
3. Read the confirmation message and approve the purchase only when ready.
4. CandyRama purchases the cheapest eligible rate, saves the tracking number, and changes the order to `PACKING`.
5. Select **Open label** to open the 4 × 6 PDF, then print it on the shipping-label printer.
6. Pack the listed products, attach the label, and hand the package to the carrier.

The customer receives a shipping-confirmation email containing the carrier and tracking number after the label is purchased.

## 4. What appears in ShipStation

CandyRama requests rates and purchases the label through the ShipStation API. The resulting shipment and purchased label will be visible in ShipStation's shipment/label history with its carrier, service, tracking number, and label cost.

CandyRama does **not currently import the original storefront order into ShipStation's Awaiting Shipment order queue**. The CandyRama admin dashboard remains the source for the order record and packing list; ShipStation is currently used for rating, label purchase, and tracking.

## Safety notes

- Use **Check rate** freely; it cannot purchase a label.
- **Buy cheapest label** creates a real ShipStation charge.
- Never buy a second label if **Open label** is already shown.
- If an address or rate looks wrong, stop and verify it before purchasing.
- Only approved CandyRama administrators can access these controls.
