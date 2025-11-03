-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "job_postings" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "assessment_tests" (
    "id" TEXT NOT NULL,
    "jobPostingId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_submissions" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "candidateId" TEXT,
    "candidateEmail" TEXT NOT NULL,
    "candidateName" TEXT,
    "answers" JSONB NOT NULL,
    "score" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "test_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_tests_token_key" ON "assessment_tests"("token");

-- CreateIndex
CREATE INDEX "assessment_tests_token_idx" ON "assessment_tests"("token");

-- CreateIndex
CREATE INDEX "assessment_tests_jobPostingId_idx" ON "assessment_tests"("jobPostingId");

-- CreateIndex
CREATE INDEX "assessment_tests_createdBy_idx" ON "assessment_tests"("createdBy");

-- CreateIndex
CREATE INDEX "assessment_tests_expiresAt_idx" ON "assessment_tests"("expiresAt");

-- CreateIndex
CREATE INDEX "test_submissions_testId_idx" ON "test_submissions"("testId");

-- CreateIndex
CREATE INDEX "test_submissions_candidateEmail_idx" ON "test_submissions"("candidateEmail");

-- CreateIndex
CREATE INDEX "test_submissions_candidateId_idx" ON "test_submissions"("candidateId");

-- CreateIndex
CREATE INDEX "test_submissions_completedAt_idx" ON "test_submissions"("completedAt");

-- CreateIndex
CREATE INDEX "analyses_status_idx" ON "analyses"("status");

-- AddForeignKey
ALTER TABLE "assessment_tests" ADD CONSTRAINT "assessment_tests_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "job_postings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_tests" ADD CONSTRAINT "assessment_tests_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_submissions" ADD CONSTRAINT "test_submissions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "assessment_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_submissions" ADD CONSTRAINT "test_submissions_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
