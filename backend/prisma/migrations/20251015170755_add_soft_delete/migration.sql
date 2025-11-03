-- AlterTable: Add soft delete fields to job_postings
ALTER TABLE "job_postings"
ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable: Add soft delete fields to candidates
ALTER TABLE "candidates"
ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex: Add index on isDeleted for job_postings
CREATE INDEX "job_postings_isDeleted_idx" ON "job_postings"("isDeleted");

-- CreateIndex: Add index on isDeleted for candidates
CREATE INDEX "candidates_isDeleted_idx" ON "candidates"("isDeleted");
