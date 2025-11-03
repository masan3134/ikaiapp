-- Performance Optimization Migration
-- Adds composite indexes and timestamp indexes for common query patterns

-- JobPosting indexes
CREATE INDEX IF NOT EXISTS "job_postings_userId_isDeleted_idx" ON "job_postings"("userId", "isDeleted");
CREATE INDEX IF NOT EXISTS "job_postings_createdAt_idx" ON "job_postings"("createdAt" DESC);

-- Candidate indexes
CREATE INDEX IF NOT EXISTS "candidates_userId_isDeleted_idx" ON "candidates"("userId", "isDeleted");
CREATE INDEX IF NOT EXISTS "candidates_createdAt_idx" ON "candidates"("createdAt" DESC);

-- Analysis indexes
CREATE INDEX IF NOT EXISTS "analyses_userId_status_idx" ON "analyses"("userId", "status");
CREATE INDEX IF NOT EXISTS "analyses_createdAt_idx" ON "analyses"("createdAt" DESC);

-- AnalysisResult indexes
CREATE INDEX IF NOT EXISTS "analysis_results_analysisId_compatibilityScore_idx" ON "analysis_results"("analysisId", "compatibilityScore");
CREATE INDEX IF NOT EXISTS "analysis_results_createdAt_idx" ON "analysis_results"("createdAt" DESC);

-- TestSubmission indexes
CREATE INDEX IF NOT EXISTS "test_submissions_testId_score_idx" ON "test_submissions"("testId", "score" DESC);
CREATE INDEX IF NOT EXISTS "test_submissions_score_idx" ON "test_submissions"("score" DESC);

-- Performance stats
COMMENT ON INDEX "job_postings_userId_isDeleted_idx" IS 'Composite index for active postings by user';
COMMENT ON INDEX "candidates_userId_isDeleted_idx" IS 'Composite index for active candidates by user';
COMMENT ON INDEX "analyses_userId_status_idx" IS 'Composite index for dashboard filtering';
COMMENT ON INDEX "analysis_results_analysisId_compatibilityScore_idx" IS 'Composite index for score filtering';
COMMENT ON INDEX "test_submissions_testId_score_idx" IS 'Composite index for top scorers per test';
