-- AlterTable: Add sub-scores and match label to analysis_results
ALTER TABLE "analysis_results" ADD COLUMN "experienceScore" INTEGER;
ALTER TABLE "analysis_results" ADD COLUMN "educationScore" INTEGER;
ALTER TABLE "analysis_results" ADD COLUMN "technicalScore" INTEGER;
ALTER TABLE "analysis_results" ADD COLUMN "extraScore" INTEGER;
ALTER TABLE "analysis_results" ADD COLUMN "matchLabel" TEXT;
