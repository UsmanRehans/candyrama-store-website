SET lock_timeout = '5s';

ALTER TABLE "Customer"
  ADD COLUMN "referralCode" TEXT,
  ADD COLUMN "rewardPoints" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "Customer_referralCode_key" ON "Customer"("referralCode");

ALTER TABLE "Order"
  ADD COLUMN "giftRecipientName" TEXT,
  ADD COLUMN "giftMessage" TEXT,
  ADD COLUMN "referralCode" TEXT,
  ADD COLUMN "rewardPointsRedeemed" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "rewardPointsEarned" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "CheckoutAttempt"
  ADD COLUMN "giftRecipientName" TEXT,
  ADD COLUMN "giftMessage" TEXT,
  ADD COLUMN "referralCode" TEXT,
  ADD COLUMN "useRewards" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "rewardPointsRedeemed" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "RewardLedger" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "orderId" TEXT,
  "points" INTEGER NOT NULL,
  "reason" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RewardLedger_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RewardLedger_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "RewardLedger_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "RewardLedger_points_check" CHECK ("points" <> 0)
);

CREATE INDEX "RewardLedger_customerId_createdAt_idx" ON "RewardLedger"("customerId", "createdAt");
CREATE INDEX "RewardLedger_orderId_idx" ON "RewardLedger"("orderId");

CREATE TABLE "Referral" (
  "id" TEXT NOT NULL,
  "codeSnapshot" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredCustomerId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "bonusPoints" INTEGER NOT NULL DEFAULT 100,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Referral_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Referral_referredCustomerId_fkey" FOREIGN KEY ("referredCustomerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Referral_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Referral_not_self_check" CHECK ("referrerId" <> "referredCustomerId"),
  CONSTRAINT "Referral_bonusPoints_check" CHECK ("bonusPoints" > 0)
);

CREATE UNIQUE INDEX "Referral_referredCustomerId_key" ON "Referral"("referredCustomerId");
CREATE UNIQUE INDEX "Referral_orderId_key" ON "Referral"("orderId");
CREATE INDEX "Referral_referrerId_createdAt_idx" ON "Referral"("referrerId", "createdAt");

CREATE TABLE "NewsletterSubscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'homepage',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

ALTER TABLE "RewardLedger" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Referral" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON "RewardLedger", "Referral", "NewsletterSubscriber" FROM anon, authenticated;
