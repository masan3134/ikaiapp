const {
  generateTest,
  getTestByToken,
  submitTest,
  getAttemptCount
} = require('../services/testGenerationService');
const { testEmailQueue } = require('../queues/testQueue');
const { testGenerationQueue } = require('../queues/testGenerationQueue');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Generate new test
 * POST /api/v1/tests/generate
 * Body: { jobPostingId, analysisId? }
 *
 * NEW: analysisId-based MASTER test strategy
 * - If analysisId provided: Create/reuse MASTER test for that analysis
 * - If no analysisId: Legacy job-based MASTER test (backwards compatible)
 */
async function createTest(req, res) {
  try {
    const { jobPostingId, analysisId } = req.body;
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const userRole = req.user.role;

    if (!jobPostingId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Job posting ID gereklidir'
      });
    }

    // Verify jobPosting access (same as analysis controller)
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId }
    });

    if (!jobPosting) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'İş ilanı bulunamadı'
      });
    }

    // Check organization isolation
    if (jobPosting.organizationId !== organizationId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu iş ilanına erişim yetkiniz yok'
      });
    }

    // ADMIN/MANAGER/HR_SPECIALIST can use any jobPosting in their org
    const canAccessAnyJobPosting = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole);
    if (!canAccessAnyJobPosting && jobPosting.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Bu iş ilanına erişim yetkiniz yok'
      });
    }

    // Generate test synchronously (already has rate limiter)
    const result = await generateTest(jobPostingId, userId, analysisId, organizationId);

    return res.json({
      success: true,
      data: {
        testId: result.testId,
        token: result.token,
        testUrl: result.testUrl,
        reused: result.reused
      }
    });
  } catch (error) {
    console.error('Test generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Generation Failed',
      message: error.message || 'Test oluşturulamadı'
    });
  }
}

/**
 * Send test link via email
 * POST /api/v1/tests/:testId/send-email
 */
async function sendTestEmail(req, res) {
  try {
    const { testId } = req.params;
    const { recipientEmail, recipientName } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email adresi gereklidir'
      });
    }

    const test = await prisma.assessmentTest.findFirst({
      where: {
        id: testId,
        organizationId: req.organizationId
      },
      include: {
        jobPosting: true
      }
    });

    if (!test) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Test bulunamadı'
      });
    }

    const testUrl = `${process.env.FRONTEND_URL}/test/${test.token}`;

    // Add email to queue (scalable for 1000s of users!)
    await testEmailQueue.add('send-test-email', {
      testId,
      recipientEmail,
      recipientName,
      testUrl,
      jobTitle: test.jobPosting.title
    });

    return res.json({
      success: true,
      message: 'Test linki email kuyruğuna eklendi'
    });

    // OLD CODE - commented out
    /*
    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 30px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🎯 Değerlendirme Testi</h1>
      <p style="margin: 8px 0 0; opacity: 0.9;">IKAI HR Platform</p>
    </div>

    <div style="padding: 30px;">
      <p style="margin: 0 0 16px; font-size: 16px;">Merhaba${recipientName ? ` ${recipientName}` : ''},</p>
      <p style="margin: 0 0 20px; color: #374151;">
        <strong>${test.jobPosting.title}</strong> pozisyonu için değerlendirme testine davet edildiniz.
      </p>

      <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px; margin: 20px 0; border-radius: 6px;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #1F2937;">Test Bilgileri:</p>
        <ul style="margin: 0; padding-left: 20px; color: #374151;">
          <li>Soru sayısı: 10</li>
          <li>Süre: 30 dakika</li>
          <li>Deneme hakkı: 3 kere</li>
          <li>Geçerlilik: 2 gün</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${testUrl}" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Teste Başla
        </a>
      </div>

      <p style="margin: 20px 0 0; font-size: 14px; color: #6B7280;">
        <strong>Not:</strong> Testi yarım bırakıp daha sonra devam edebilirsiniz (3 deneme hakkınız bulunmaktadır).
      </p>
    </div>

    <div style="padding: 20px; background: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #6B7280;">
        © 2025 IKAI HR Platform - Bu email otomatik gönderilmiştir.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: `Değerlendirme Testi - ${test.jobPosting.title}`,
      html: emailHtml
    });

    console.log(`📧 Test email sent to ${recipientEmail}`);

    return res.json({
      success: true,
      message: 'Test linki email ile gönderildi'
    });
    */
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      error: 'Email Failed',
      message: error.message || 'Email gönderilemedi'
    });
  }
}

/**
 * Get all tests for current user
 * GET /api/v1/tests
 */
async function getAllTests(req, res) {
  try {
    const userId = req.user.id;
    const organizationId = req.organizationId;
    const { jobPostingId, status, search, page = 1, limit = 20 } = req.query;

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    const where = {
      createdBy: userId,
      organizationId
    };

    if (jobPostingId) {
      where.jobPostingId = jobPostingId;
    }

    const tests = await prisma.assessmentTest.findMany({
      where,
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            department: true
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limitInt
    });

    const total = await prisma.assessmentTest.count({ where });

    return res.json({
      success: true,
      data: tests,
      pagination: {
        total,
        page: pageInt,
        limit: limitInt,
        pages: Math.ceil(total / limitInt)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Fetch Failed',
      message: error.message || 'Testler getirilemedi'
    });
  }
}

/**
 * Get test info (public)
 * GET /api/v1/public/test/:token
 */
async function getPublicTest(req, res) {
  try {
    const { token } = req.params;

    const test = await getTestByToken(token);

    if (!test) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Test bulunamadı'
      });
    }

    if (test.isExpired) {
      return res.status(410).json({
        error: 'Expired',
        message: 'Test süresi dolmuş'
      });
    }

    // Don't send correct answers to client
    const questions = test.questions.map(q => ({
      id: q.id,
      category: q.category,
      question: q.question,
      options: q.options
    }));

    // Check if this test has ANY submissions (to show warning)
    const submissionCount = test._count?.submissions || 0;

    return res.json({
      success: true,
      data: {
        test: {
          id: test.id,
          jobTitle: test.jobPosting.title,
          department: test.jobPosting.department,
          questions,
          timeLimit: 30,
          maxAttempts: test.maxAttempts,
          expiresAt: test.expiresAt,
          hasSubmissions: submissionCount > 0
        }
      }
    });
  } catch (error) {
    console.error('Get public test error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Test bilgileri alınamadı'
    });
  }
}

/**
 * Check attempt count for email (public)
 * POST /api/v1/tests/public/:token/check-attempts
 */
async function checkAttempts(req, res) {
  try {
    const { token } = req.params;
    const { candidateEmail } = req.body;

    if (!candidateEmail) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email gereklidir'
      });
    }

    const test = await getTestByToken(token);

    if (!test || test.isExpired) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Test bulunamadı veya süresi dolmuş'
      });
    }

    // Check submissions for this email
    const submissions = await prisma.testSubmission.findMany({
      where: {
        testId: test.id,
        candidateEmail
      },
      orderBy: { completedAt: 'desc' }
    });

    const attemptCount = submissions.length;
    const completed = attemptCount > 0; // If any submission exists, test is completed
    const lastSubmission = submissions[0];

    return res.json({
      success: true,
      attemptCount,
      completed,
      maxAttempts: test.maxAttempts,
      lastScore: lastSubmission?.score || null,
      lastAttempt: lastSubmission?.completedAt || null
    });

  } catch (error) {
    console.error('Check attempts error:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'Deneme kontrolü yapılamadı'
    });
  }
}

/**
 * Submit test (public)
 * POST /api/v1/public/test/:token/submit
 */
async function submitPublicTest(req, res) {
  try {
    const { token } = req.params;
    const { candidateEmail, candidateName, answers, startedAt, metadata } = req.body;

    if (!candidateEmail || !answers || !startedAt) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email, cevaplar ve başlangıç zamanı gereklidir'
      });
    }

    const result = await submitTest(
      token,
      candidateEmail,
      candidateName,
      answers,
      startedAt,
      metadata
    );

    return res.json({
      success: true,
      message: 'Test başarıyla tamamlandı. Değerlendirmeniz kaydedildi.'
    });
  } catch (error) {
    if (error.message === 'Invalid or expired test') {
      return res.status(410).json({
        error: 'Expired',
        message: 'Test geçersiz veya süresi dolmuş'
      });
    }

    if (error.message === 'Maximum attempts exceeded') {
      return res.status(403).json({
        error: 'Limit Exceeded',
        message: 'Maximum 3 deneme hakkınızı kullandınız'
      });
    }

    res.status(500).json({
      error: 'Submission Failed',
      message: error.message || 'Test gönderilemedi'
    });
  }
}

/**
 * Get test submissions
 * GET /api/v1/tests/:testId/submissions
 * OR
 * GET /api/v1/tests/submissions?candidateEmail={email} (get all tests for a candidate)
 */
async function getTestSubmissions(req, res) {
  try {
    const { testId } = req.params;
    const { candidateEmail } = req.query;
    const organizationId = req.organizationId;

    const where = {};

    if (testId) {
      where.testId = testId;
    }

    if (candidateEmail) {
      where.candidateEmail = candidateEmail;
    }

    if (!testId && !candidateEmail) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'testId veya candidateEmail parametresi gereklidir'
      });
    }

    if (testId) {
      where.test = { organizationId };
    }

    const submissions = await prisma.testSubmission.findMany({
      where,
      include: {
        test: {
          select: {
            id: true,
            token: true,
            questions: true,
            expiresAt: true,
            jobPosting: {
              select: {
                id: true,
                title: true,
                department: true
              }
            }
          }
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    return res.json({
      success: true,
      submissions
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server Error',
      message: 'Sonuçlar alınamadı'
    });
  }
}

module.exports = {
  createTest,
  sendTestEmail,
  getAllTests,
  getPublicTest,
  checkAttempts,
  submitPublicTest,
  getTestSubmissions
};
