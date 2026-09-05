# CandyRama Store

Custom Next.js storefront with a portable commerce backend. The public site never talks directly to payment, shipping, or admin services: it uses versioned server routes under `/api/v1`.

## Stack

- Next.js 16 on Vercel
- Supabase PostgreSQL, Auth, and Storage
- Prisma ORM and migrations
- Stripe hosted Checkout and verified webhooks
- ShipStation API v2 rate shopping and label purchase
- Resend transactional email

## Local setup

1. Install Node.js 22 and run `npm install`.
2. Create a Supabase project and copy `.env.example` to `.env.local`.
3. Add the pooled Supabase connection as `DATABASE_URL` and the direct connection as `DIRECT_URL`.
4. Run `npm run db:migrate -- --name init`, then `npm run db:seed`.
5. Add Stripe test keys. In another terminal, run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and copy its webhook secret.
6. Add a ShipStation API key, connect the desired carriers in ShipStation, and enter the physical ship-from address.
7. Add a verified Resend sending domain and API key.
8. Run `npm run dev`.

The first migration is intentionally generated against the real Supabase database so Prisma records it in `_prisma_migrations`. Commit the generated `prisma/migrations` directory before production deployment.

## Production setup

Import the repository into Vercel and add every value from `.env.example` to the Production and Preview environments. Set `NEXT_PUBLIC_SITE_URL` to the production origin. The build command is `npm run build`.

In Stripe, create a production webhook for `/api/webhooks/stripe` with these events:

- `checkout.session.completed`
- `checkout.session.expired`

After creating an admin in Supabase Auth, insert a matching `AdminProfile` row using the Auth user's UUID. Shipping-label purchasing requires that user's Supabase access token and rejects non-admin callers.

## Commerce behavior

- Prices and availability are always loaded from PostgreSQL, never trusted from the browser.
- Stock is reserved transactionally for 30 minutes when checkout begins.
- Failed or expired checkout sessions restore inventory.
- Stripe webhook event IDs are stored to make payment handling idempotent.
- Orders receive non-sequential public references such as `CR-001001` and can be looked up only with the matching email.
- Standard shipping is $5.99 and free at $50. Admin label purchasing uses ShipStation Rate Shopper's `cheapest` strategy across the carriers connected to the ShipStation account.
- Card data stays entirely inside Stripe Checkout and never enters CandyRama's database.

## Catalog administration

The admin catalog is available at `/admin/catalog`. Only users present in Supabase Auth and the `AdminProfile` table can call its APIs.

- **Download products** creates a current `.xlsx` workbook from PostgreSQL.
- **Upload edited workbook** validates every row before applying changes transactionally.
- Stock changes create `StockMovement` records and every import creates an `AuditLog` record.
- Slugs are permanent identifiers. Image URLs are reference-only in Excel.
- Product images use the `product-media` Supabase Storage bucket and are uploaded separately through the authenticated image endpoint.

To add an administrator, invite the person through Supabase Auth and insert their Auth UUID and email into `AdminProfile`. Admin sign-in uses one-time email links rather than shared passwords.

## Useful commands

```bash
npm run dev
npm run build
npm run db:migrate
npm run db:deploy
npm run db:seed
npm audit
```
