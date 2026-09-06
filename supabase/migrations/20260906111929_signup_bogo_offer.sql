alter table "CheckoutAttempt"
  add column "discountCode" text,
  add column "promotionDiscountCents" integer not null default 0;

alter table "NewsletterSubscriber"
  add column "consentedAt" timestamp(3) not null default current_timestamp,
  add column "offerReservedAttemptId" text,
  add column "offerReservedUntil" timestamp(3),
  add column "offerRedeemedAt" timestamp(3);

alter table "CheckoutAttempt"
  add constraint "CheckoutAttempt_promotionDiscountCents_check"
  check ("promotionDiscountCents" >= 0);

create index "NewsletterSubscriber_active_offerRedeemedAt_idx"
  on "NewsletterSubscriber" ("active", "offerRedeemedAt");

create index "NewsletterSubscriber_offerReservedUntil_idx"
  on "NewsletterSubscriber" ("offerReservedUntil");
