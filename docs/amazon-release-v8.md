# Amazon creative revision 08

September 14, 2026. Owner authorized production publication of the reviewed local preview, including 18 separate candy groups and a stacked CANDY / RAMA masthead flanked by candy accents.

## Release scope

The existing authenticated `/amazon-demo` now directs signed-in visitors to `/amazon-demo/preview`. Exact reviewed standalone artwork, styles, scripts and fonts are served through an authenticated explicit allowlist. Signout is available in review notes. This is the private website creative preview, not an Amazon marketplace upload. Product visuals remain illustrative; exact SKU/label fidelity is unverified.

Production deployment dpl_HZyQr3mQReAWV4byVLzUUcPaZDK1 contained uncommitted storefront changes. To avoid reverting them, 23 differing files were retrieved from that deployment's source API and SHA-1 checked against its file manifest before being recorded as the release baseline. Current local storefront redesign work was not included.

## Validation

- Production build and TypeScript passed; scoped lint passed.
- Signed-out preview redirects to login; protected new assets return 401.
- Signed-in root redirects to new preview; HTML contains new header/banner.
- All 14 supporting assets return byte-for-byte expected files.
- Unknown asset paths return 404; logout clears the session cookie.
- 18-group banner was independently accepted by Vita for illustrative use; parent inspected stacked header on desktop and 390px mobile using existing brand artwork and transparent candy accents.
- Product stories and review controls retain the reviewed standalone implementation.

Deployment status is recorded after live checks.
