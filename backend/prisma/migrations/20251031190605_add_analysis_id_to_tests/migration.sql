-- AlterTable
ALTER TABLE "assessment_tests" ADD COLUMN     "analysisId" TEXT;

-- CreateIndex
CREATE INDEX "assessment_tests_analysisId_idx" ON "assessment_tests"("analysisId");

-- CreateIndex
CREATE INDEX "assessment_tests_analysisId_maxAttempts_idx" ON "assessment_tests"("analysisId", "maxAttempts");
