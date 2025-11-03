/*
  Warnings:

  - Added the required column `organizationId` to the `analyses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `assessment_tests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `bulk_upload_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `interviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `job_offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `job_postings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `offer_template_categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `offer_templates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- CreateTable (organizations must be created first)
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "logo" TEXT,
    "primaryColor" TEXT DEFAULT '#4F46E5',
    "industry" TEXT,
    "size" TEXT,
    "country" TEXT DEFAULT 'TR',
    "timezone" TEXT DEFAULT 'Europe/Istanbul',
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "planStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planExpiresAt" TIMESTAMP(3),
    "monthlyAnalysisCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyCvCount" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 1,
    "maxAnalysisPerMonth" INTEGER NOT NULL DEFAULT 10,
    "maxCvPerMonth" INTEGER NOT NULL DEFAULT 50,
    "maxUsers" INTEGER NOT NULL DEFAULT 2,
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTrial" BOOLEAN NOT NULL DEFAULT true,
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");
CREATE INDEX "organizations_slug_idx" ON "organizations"("slug");
CREATE INDEX "organizations_isActive_idx" ON "organizations"("isActive");
CREATE INDEX "organizations_plan_idx" ON "organizations"("plan");

-- Insert default organization (for existing data)
INSERT INTO "organizations" (
    "id",
    "name",
    "slug",
    "plan",
    "onboardingCompleted",
    "maxAnalysisPerMonth",
    "maxCvPerMonth",
    "maxUsers",
    "isActive",
    "isTrial",
    "createdAt",
    "updatedAt"
) VALUES (
    'default-org-ikai-2025',
    'Default Organization',
    'default',
    'ENTERPRISE',
    true,
    999999,
    999999,
    999999,
    true,
    false,
    NOW(),
    NOW()
);

-- AlterTable users (add columns first, then set values)
ALTER TABLE "users" ADD COLUMN "avatar" TEXT;
ALTER TABLE "users" ADD COLUMN "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN "isOnboarded" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "lastName" TEXT;
ALTER TABLE "users" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "users" ADD COLUMN "position" TEXT;

-- Update existing users with default organization
UPDATE "users" SET "organizationId" = 'default-org-ikai-2025' WHERE "organizationId" IS NULL;

-- Make organizationId NOT NULL after setting values
ALTER TABLE "users" ALTER COLUMN "organizationId" SET NOT NULL;

-- Add foreign key for users
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex for users
CREATE INDEX "users_organizationId_idx" ON "users"("organizationId");

-- AlterTable analyses
ALTER TABLE "analyses" ADD COLUMN "organizationId" TEXT;
UPDATE "analyses" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."userId") WHERE "organizationId" IS NULL;
ALTER TABLE "analyses" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "analyses_organizationId_idx" ON "analyses"("organizationId");
CREATE INDEX "analyses_organizationId_status_idx" ON "analyses"("organizationId", "status");

-- AlterTable analysis_results
ALTER TABLE "analysis_results" ADD COLUMN "organizationId" TEXT;
UPDATE "analysis_results" t SET "organizationId" = (SELECT a."organizationId" FROM "analyses" a WHERE a.id = t."analysisId") WHERE "organizationId" IS NULL;
ALTER TABLE "analysis_results" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "analysis_results_organizationId_idx" ON "analysis_results"("organizationId");
CREATE INDEX "analysis_results_organizationId_compatibilityScore_idx" ON "analysis_results"("organizationId", "compatibilityScore");

-- AlterTable assessment_tests
ALTER TABLE "assessment_tests" ADD COLUMN "organizationId" TEXT;
UPDATE "assessment_tests" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."createdBy") WHERE "organizationId" IS NULL;
ALTER TABLE "assessment_tests" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "assessment_tests_organizationId_idx" ON "assessment_tests"("organizationId");
CREATE INDEX "assessment_tests_organizationId_expiresAt_idx" ON "assessment_tests"("organizationId", "expiresAt");

-- AlterTable bulk_upload_sessions
ALTER TABLE "bulk_upload_sessions" ADD COLUMN "organizationId" TEXT;
UPDATE "bulk_upload_sessions" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."userId") WHERE "organizationId" IS NULL;
ALTER TABLE "bulk_upload_sessions" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "bulk_upload_sessions_organizationId_idx" ON "bulk_upload_sessions"("organizationId");
CREATE INDEX "bulk_upload_sessions_organizationId_status_idx" ON "bulk_upload_sessions"("organizationId", "status");

-- AlterTable candidates
ALTER TABLE "candidates" ADD COLUMN "organizationId" TEXT;
UPDATE "candidates" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."userId") WHERE "organizationId" IS NULL;
ALTER TABLE "candidates" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "candidates_organizationId_idx" ON "candidates"("organizationId");
CREATE INDEX "candidates_organizationId_isDeleted_idx" ON "candidates"("organizationId", "isDeleted");

-- AlterTable interviews
ALTER TABLE "interviews" ADD COLUMN "organizationId" TEXT;
UPDATE "interviews" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."createdBy") WHERE "organizationId" IS NULL;
ALTER TABLE "interviews" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "interviews_organizationId_idx" ON "interviews"("organizationId");
CREATE INDEX "interviews_organizationId_status_idx" ON "interviews"("organizationId", "status");

-- AlterTable job_offers
ALTER TABLE "job_offers" ADD COLUMN "organizationId" TEXT;
UPDATE "job_offers" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."createdBy") WHERE "organizationId" IS NULL;
ALTER TABLE "job_offers" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "job_offers_organizationId_idx" ON "job_offers"("organizationId");
CREATE INDEX "job_offers_organizationId_status_idx" ON "job_offers"("organizationId", "status");

-- AlterTable job_postings
ALTER TABLE "job_postings" ADD COLUMN "organizationId" TEXT;
UPDATE "job_postings" t SET "organizationId" = (SELECT "organizationId" FROM "users" WHERE id = t."userId") WHERE "organizationId" IS NULL;
ALTER TABLE "job_postings" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "job_postings_organizationId_idx" ON "job_postings"("organizationId");
CREATE INDEX "job_postings_organizationId_isDeleted_idx" ON "job_postings"("organizationId", "isDeleted");

-- AlterTable offer_template_categories
ALTER TABLE "offer_template_categories" ADD COLUMN "organizationId" TEXT;
UPDATE "offer_template_categories" SET "organizationId" = 'default-org-ikai-2025' WHERE "organizationId" IS NULL;
ALTER TABLE "offer_template_categories" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "offer_template_categories_organizationId_idx" ON "offer_template_categories"("organizationId");
CREATE INDEX "offer_template_categories_organizationId_order_idx" ON "offer_template_categories"("organizationId", "order");

-- AlterTable offer_templates
ALTER TABLE "offer_templates" ADD COLUMN "organizationId" TEXT;
UPDATE "offer_templates" SET "organizationId" = 'default-org-ikai-2025' WHERE "organizationId" IS NULL;
ALTER TABLE "offer_templates" ALTER COLUMN "organizationId" SET NOT NULL;
CREATE INDEX "offer_templates_organizationId_idx" ON "offer_templates"("organizationId");
CREATE INDEX "offer_templates_organizationId_isActive_idx" ON "offer_templates"("organizationId", "isActive");
