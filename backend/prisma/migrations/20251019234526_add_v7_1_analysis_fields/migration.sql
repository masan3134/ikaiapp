-- AlterTable
ALTER TABLE "analysis_results" ADD COLUMN     "careerTrajectory" TEXT,
ADD COLUMN     "educationSummary" TEXT,
ADD COLUMN     "experienceSummary" TEXT,
ADD COLUMN     "scoringProfile" JSONB,
ADD COLUMN     "softSkillsScore" INTEGER,
ADD COLUMN     "strategicSummary" JSONB;
