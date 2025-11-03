-- CreateTable
CREATE TABLE "job_offers" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "salary" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "startDate" TIMESTAMP(3) NOT NULL,
    "workType" TEXT NOT NULL,
    "benefits" JSONB NOT NULL,
    "terms" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sentAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptanceToken" TEXT NOT NULL,
    "acceptanceUrl" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" TIMESTAMP(3),
    "approvalStatus" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_offers_acceptanceToken_key" ON "job_offers"("acceptanceToken");

-- CreateIndex
CREATE INDEX "job_offers_candidateId_idx" ON "job_offers"("candidateId");

-- CreateIndex
CREATE INDEX "job_offers_jobPostingId_idx" ON "job_offers"("jobPostingId");

-- CreateIndex
CREATE INDEX "job_offers_createdBy_idx" ON "job_offers"("createdBy");

-- CreateIndex
CREATE INDEX "job_offers_status_idx" ON "job_offers"("status");

-- CreateIndex
CREATE INDEX "job_offers_acceptanceToken_idx" ON "job_offers"("acceptanceToken");

-- CreateIndex
CREATE INDEX "job_offers_expiresAt_idx" ON "job_offers"("expiresAt");

-- CreateIndex
CREATE INDEX "job_offers_sentAt_idx" ON "job_offers"("sentAt");

-- CreateIndex
CREATE INDEX "job_offers_createdAt_idx" ON "job_offers"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
