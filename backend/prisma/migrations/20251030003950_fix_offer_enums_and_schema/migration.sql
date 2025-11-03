/*
  Warnings:

  - The `status` column on the `job_offers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approvalStatus` column on the `job_offers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bucket` on the `offer_attachments` table. All the data in the column will be lost.
  - The `status` column on the `offer_negotiations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('draft', 'pending_approval', 'approved', 'sent', 'accepted', 'rejected', 'expired', 'cancelled');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "NegotiationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'superseded');

-- AlterTable
ALTER TABLE "job_offers" DROP COLUMN "status",
ADD COLUMN     "status" "OfferStatus" NOT NULL DEFAULT 'draft',
DROP COLUMN "approvalStatus",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "offer_attachments" DROP COLUMN "bucket";

-- AlterTable
ALTER TABLE "offer_negotiations" DROP COLUMN "status",
ADD COLUMN     "status" "NegotiationStatus" NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "job_offers_status_idx" ON "job_offers"("status");

-- CreateIndex
CREATE INDEX "job_offers_approvalStatus_idx" ON "job_offers"("approvalStatus");

-- CreateIndex
CREATE INDEX "offer_negotiations_status_idx" ON "offer_negotiations"("status");
