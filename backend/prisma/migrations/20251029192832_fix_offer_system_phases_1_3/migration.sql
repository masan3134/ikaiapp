/*
  Warnings:

  - Made the column `approvalStatus` on table `job_offers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "job_offers" ADD COLUMN     "approvalNotes" TEXT,
ADD COLUMN     "customFields" JSONB,
ALTER COLUMN "approvalStatus" SET NOT NULL,
ALTER COLUMN "approvalStatus" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "offer_negotiations" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "initiatedBy" TEXT NOT NULL,
    "counterSalary" INTEGER,
    "counterBenefits" JSONB,
    "message" TEXT NOT NULL,
    "response" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offer_negotiations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_attachments" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "bucket" TEXT NOT NULL DEFAULT 'offers',
    "description" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offer_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_revisions" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "changeType" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changes" JSONB,
    "changeNotes" TEXT,
    "changedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offer_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offer_negotiations_offerId_idx" ON "offer_negotiations"("offerId");

-- CreateIndex
CREATE INDEX "offer_negotiations_status_idx" ON "offer_negotiations"("status");

-- CreateIndex
CREATE INDEX "offer_negotiations_createdAt_idx" ON "offer_negotiations"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "offer_attachments_offerId_idx" ON "offer_attachments"("offerId");

-- CreateIndex
CREATE INDEX "offer_revisions_offerId_idx" ON "offer_revisions"("offerId");

-- CreateIndex
CREATE INDEX "offer_revisions_createdAt_idx" ON "offer_revisions"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "offer_revisions_offerId_version_key" ON "offer_revisions"("offerId", "version");

-- CreateIndex
CREATE INDEX "job_offers_approvalStatus_idx" ON "job_offers"("approvalStatus");

-- AddForeignKey
ALTER TABLE "offer_negotiations" ADD CONSTRAINT "offer_negotiations_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_negotiations" ADD CONSTRAINT "offer_negotiations_respondedBy_fkey" FOREIGN KEY ("respondedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_attachments" ADD CONSTRAINT "offer_attachments_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_attachments" ADD CONSTRAINT "offer_attachments_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_revisions" ADD CONSTRAINT "offer_revisions_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_revisions" ADD CONSTRAINT "offer_revisions_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
