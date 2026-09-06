-- The original variant migration was edited after it had already been applied
-- remotely. Add the two metadata fields as a new, forward-only migration.
SET lock_timeout = '5s';

DO $$
BEGIN
  CREATE TYPE "CategoryConfidence" AS ENUM ('HIGH', 'REVIEW');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "categoryConfidence" "CategoryConfidence" NOT NULL DEFAULT 'REVIEW',
  ADD COLUMN IF NOT EXISTS "sourceMasterSkus" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
