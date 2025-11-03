const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Middleware: Track and enforce analysis usage limits
 * Checks if organization has reached monthly analysis limit
 * Only enforces for FREE plan (PRO/ENTERPRISE unlimited)
 */
const trackAnalysisUsage = async (req, res, next) => {
  try {
    const org = req.organization;

    // PRO and ENTERPRISE plans have unlimited analyses
    if (org.plan === 'PRO' || org.plan === 'ENTERPRISE') {
      return next();
    }

    // FREE plan: Check limit
    if (org.monthlyAnalysisCount >= org.maxAnalysisPerMonth) {
      return res.status(403).json({
        success: false,
        message: `Aylık analiz limitinize ulaştınız (${org.maxAnalysisPerMonth}). PRO plana yükseltme yaparak sınırsız analiz yapabilirsiniz.`,
        error: {
          code: 'ANALYSIS_LIMIT_REACHED',
          current: org.monthlyAnalysisCount,
          limit: org.maxAnalysisPerMonth,
          plan: org.plan
        }
      });
    }

    // Increment counter
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        monthlyAnalysisCount: {
          increment: 1
        }
      }
    });

    next();
  } catch (error) {
    console.error('[UsageTracking] Error tracking analysis usage:', error);
    return res.status(500).json({
      success: false,
      message: 'Kullanım takibi sırasında hata oluştu'
    });
  }
};

/**
 * Middleware: Track and enforce CV upload usage limits
 * Checks if organization has reached monthly CV upload limit
 * Only enforces for FREE plan (PRO/ENTERPRISE unlimited)
 */
const trackCvUpload = async (req, res, next) => {
  try {
    const org = req.organization;

    // PRO and ENTERPRISE plans have unlimited CV uploads
    if (org.plan === 'PRO' || org.plan === 'ENTERPRISE') {
      return next();
    }

    // FREE plan: Check limit
    if (org.monthlyCvCount >= org.maxCvPerMonth) {
      return res.status(403).json({
        success: false,
        message: `Aylık CV yükleme limitinize ulaştınız (${org.maxCvPerMonth}). PRO plana yükseltme yaparak sınırsız CV yükleyebilirsiniz.`,
        error: {
          code: 'CV_LIMIT_REACHED',
          current: org.monthlyCvCount,
          limit: org.maxCvPerMonth,
          plan: org.plan
        }
      });
    }

    // Increment counter
    await prisma.organization.update({
      where: { id: org.id },
      data: {
        monthlyCvCount: {
          increment: 1
        }
      }
    });

    next();
  } catch (error) {
    console.error('[UsageTracking] Error tracking CV upload:', error);
    return res.status(500).json({
      success: false,
      message: 'Kullanım takibi sırasında hata oluştu'
    });
  }
};

module.exports = {
  trackAnalysisUsage,
  trackCvUpload
};
