const { Worker } = require('bullmq');
const { PrismaClient } = require('@prisma/client');
const { batchAnalyzeCVsWithChunking } = require('../services/geminiDirectService');
const { setCachedAnalysis } = require('../services/cacheService');
const { connection } = require('../queues/analysisQueue');
const minioService = require('../services/minioService');
const { sanitizeFileName } = require('../utils/fileName');

const prisma = new PrismaClient();

// n8n removed - All analysis now uses Direct Gemini (simpler, faster)

const processor = async (job) => {
  const { analysisId, jobPostingId, candidateIds } = job.data;
  console.log(`⚙️ Processing analysis ${analysisId} with ${candidateIds.length} CVs (Direct Gemini)`);

  try {
    // 1. Set analysis status to PROCESSING
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING' },
    });

    // 2. Fetch job posting
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
      select: {
        id: true,
        title: true,
        department: true,
        details: true,
        notes: true
      }
    });

    // 3. Fetch candidates
    const candidates = await prisma.candidate.findMany({
      where: {
        id: { in: candidateIds }
      },
      select: {
        id: true,
        userId: true,
        sourceFileName: true,
        fileUrl: true
      }
    });

    // 4. Download all CVs
    const candidatesData = [];
    for (const candidate of candidates) {
      try {
        const sanitizedFileName = sanitizeFileName(candidate.sourceFileName);
        const stream = await minioService.downloadFile(candidate.userId, sanitizedFileName);
        const chunks = [];
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
        const cvBuffer = Buffer.concat(chunks);

        candidatesData.push({
          id: candidate.id,
          fileName: candidate.sourceFileName,
          cvBuffer: cvBuffer
        });
      } catch (downloadError) {
        console.error(`❌ Failed to download CV for ${candidate.id}:`, downloadError.message);
      }
    }

    // 5. Call Gemini Direct API with chunking (auto-splits if > BATCH_SIZE)
    const batchResults = await batchAnalyzeCVsWithChunking(analysisId, jobPosting, candidatesData);

    // 6. Save results to database
    if (batchResults && batchResults.length > 0) {
      await prisma.$transaction(async (tx) => {
        for (const result of batchResults) {
          if (!result.candidateId) continue;

          // Update candidate info
          await tx.candidate.update({
            where: { id: result.candidateId },
            data: {
              firstName: result.personalInfo?.firstName || result.firstName || 'Aday',
              lastName: result.personalInfo?.lastName || result.lastName || 'Belirtilmemiş',
              phone: result.personalInfo?.phone || result.phone || '',
              email: result.personalInfo?.email || result.email || '',
              address: result.personalInfo?.address || result.address || '',
              experience: result.analysisSummaries?.experienceSummary || result.experience || '',
              education: result.analysisSummaries?.educationSummary || result.education || '',
              generalComment: result.analysisSummaries?.careerTrajectory || result.generalComment || ''
            }
          });

          // Create analysis result
          await tx.analysisResult.create({
            data: {
              analysisId,
              candidateId: result.candidateId,
              experienceScore: result.scores?.experienceScore || result.experienceScore || null,
              educationScore: result.scores?.educationScore || result.educationScore || null,
              technicalScore: result.scores?.technicalScore || result.technicalScore || null,
              softSkillsScore: result.scores?.softSkillsScore || null,
              extraScore: result.scores?.extraScore || result.extraScore || null,
              compatibilityScore: result.scores?.finalCompatibilityScore || result.compatibilityScore || 0,
              scoringProfile: result.scoringProfile || null,
              experienceSummary: result.analysisSummaries?.experienceSummary || result.experience || null,
              educationSummary: result.analysisSummaries?.educationSummary || result.education || null,
              careerTrajectory: result.analysisSummaries?.careerTrajectory || 'Kariyer bilgileri mevcut değil.',
              positiveComments: result.analysisSummaries?.positiveComments || result.positiveComments || [],
              negativeComments: result.analysisSummaries?.negativeComments || result.negativeComments || [],
              strategicSummary: result.strategicSummary || null,
              matchLabel: result.strategicSummary?.finalRecommendation || result.matchLabel || 'İyi Eşleşme'
            }
          });
        }

        // Mark analysis as COMPLETED
        await tx.analysis.update({
          where: { id: analysisId },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            version: { increment: 1 }
          }
        });
      });

      // 7. Cache the results for future use
      await setCachedAnalysis(jobPostingId, candidateIds, batchResults);

      console.log(`✅ Analysis ${analysisId} completed (${candidateIds.length} CVs, Direct Gemini)`);
      return { status: 'completed', cvCount: candidateIds.length };
    } else {
      throw new Error('No results from Gemini API');
    }

  } catch (error) {
    console.error(`❌ Analysis ${analysisId} failed:`, error.message);

    // Mark analysis as FAILED in the database
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        status: 'FAILED',
        errorMessage: 'Analysis failed: ' + error.message,
      },
    });

    // Re-throw the error to mark the job as failed in BullMQ
    throw error;
  }
};

const worker = new Worker('analysis-processing', processor, {
  connection,
  concurrency: 3, // Reduced from 10 to 3 for Gemini API rate limit protection
  // Calculation: 3 workers × 6 CVs/batch = 18 parallel Gemini calls (safe for 15 RPM limit)
  limiter: {
    max: 5,         // Max 5 analysis jobs
    duration: 60000 // per minute
  },
  removeOnComplete: { count: 1000 },
  removeOnFail: { count: 5000 },
  attempts: 2, // Retry once on failure
  backoff: {
    type: 'exponential',
    delay: 10000 // Start with 10s delay
  }
});

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed for analysis ${job.data.analysisId}`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

console.log('🚀 Analysis worker started (Direct Gemini mode - n8n removed)');

module.exports = worker;
