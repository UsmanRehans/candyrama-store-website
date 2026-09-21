# Amazon website preview release — September 16, 2026

Owner explicitly requested publishing the website preview, not Amazon Seller Central. Promoted the previously reviewed revision 07 Store and A+ concept from outputs/amazon-v7 into versioned assets/amazon-demo/review-v7. Existing login remains required. Signed-in /amazon-demo redirects to /amazon-demo/preview/index.html. The new asset route uses a fixed 13-file allowlist, existing session verification, private no-store and noindex headers. Assets are included in server tracing.

Updated preview status language and removed unconfirmed 1lb/2lb size claims. Original 8oz sample is clearly qualified. Rejected/unreviewed September16 image drafts are not included. This is the reviewed concept preview, not upload-ready Amazon content.

Local production build and TypeScript passed; tracing includes the preview assets. Signed-in end-to-end retest was not performed: automatic approval review rejected direct session-cookie creation for testing. Normal owner sign-in remains the supported walkthrough path. Prior revision07 desktop/mobile interactions are documented in amazon-v7-local-review.md.
