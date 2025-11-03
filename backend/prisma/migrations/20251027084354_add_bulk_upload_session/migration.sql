-- CreateTable
CREATE TABLE "bulk_upload_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalFiles" INTEGER NOT NULL,
    "processedFiles" INTEGER NOT NULL DEFAULT 0,
    "successfulFiles" INTEGER NOT NULL DEFAULT 0,
    "failedFiles" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "results" JSONB,
    "autoAnalyze" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bulk_upload_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bulk_upload_sessions_userId_idx" ON "bulk_upload_sessions"("userId");

-- CreateIndex
CREATE INDEX "bulk_upload_sessions_status_idx" ON "bulk_upload_sessions"("status");

-- CreateIndex
CREATE INDEX "bulk_upload_sessions_createdAt_idx" ON "bulk_upload_sessions"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "analyses_userId_status_idx" ON "analyses"("userId", "status");

-- CreateIndex
CREATE INDEX "analyses_createdAt_idx" ON "analyses"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "analysis_results_analysisId_compatibilityScore_idx" ON "analysis_results"("analysisId", "compatibilityScore");

-- CreateIndex
CREATE INDEX "analysis_results_createdAt_idx" ON "analysis_results"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "candidates_userId_isDeleted_idx" ON "candidates"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "candidates_createdAt_idx" ON "candidates"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "job_postings_userId_isDeleted_idx" ON "job_postings"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "job_postings_createdAt_idx" ON "job_postings"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "test_submissions_testId_score_idx" ON "test_submissions"("testId", "score" DESC);

-- CreateIndex
CREATE INDEX "test_submissions_score_idx" ON "test_submissions"("score" DESC);

-- AddForeignKey
ALTER TABLE "bulk_upload_sessions" ADD CONSTRAINT "bulk_upload_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
