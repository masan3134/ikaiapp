/*
  Warnings:

  - You are about to drop the column `candidateId` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `googleEventId` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `meetingLink` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `interviews` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `interviews` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `interviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `interviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `interviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `interviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "interviews" DROP CONSTRAINT "interviews_candidateId_fkey";

-- DropIndex
DROP INDEX "interviews_analysisResultId_idx";

-- DropIndex
DROP INDEX "interviews_candidateId_idx";

-- DropIndex
DROP INDEX "interviews_interviewerId_scheduledAt_idx";

-- DropIndex
DROP INDEX "interviews_scheduledAt_idx";

-- AlterTable
ALTER TABLE "interviews" DROP COLUMN "candidateId",
DROP COLUMN "completedAt",
DROP COLUMN "feedback",
DROP COLUMN "googleEventId",
DROP COLUMN "meetingLink",
DROP COLUMN "rating",
DROP COLUMN "scheduledAt",
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailTemplate" TEXT,
ADD COLUMN     "meetEventId" TEXT,
ADD COLUMN     "meetLink" TEXT,
ADD COLUMN     "meetingTitle" TEXT,
ADD COLUMN     "time" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'scheduled';

-- CreateTable
CREATE TABLE "interview_candidates" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "attended" BOOLEAN,
    "feedback" TEXT,
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "interview_candidates_interviewId_idx" ON "interview_candidates"("interviewId");

-- CreateIndex
CREATE INDEX "interview_candidates_candidateId_idx" ON "interview_candidates"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "interview_candidates_interviewId_candidateId_key" ON "interview_candidates"("interviewId", "candidateId");

-- CreateIndex
CREATE INDEX "interviews_date_time_idx" ON "interviews"("date", "time");

-- CreateIndex
CREATE INDEX "interviews_createdAt_idx" ON "interviews"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_candidates" ADD CONSTRAINT "interview_candidates_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_candidates" ADD CONSTRAINT "interview_candidates_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
