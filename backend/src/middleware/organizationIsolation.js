const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Organization Isolation Middleware
 * Ensures users can only access data belonging to their organization
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const enforceOrganizationIsolation = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli'
      });
    }

    // Fetch user with organization
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: true
      }
    });

    // Check if user exists
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Check if organization exists
    if (!user.organization) {
      return res.status(403).json({
        success: false,
        message: 'Organizasyon bulunamadı'
      });
    }

    // Check if organization is active
    if (!user.organization.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Organizasyon askıya alınmış. Lütfen destek ile iletişime geçin.'
      });
    }

    // Attach organization data to request
    req.organizationId = user.organizationId;
    req.organization = user.organization;
    req.userRole = user.role; // Attach role for SUPER_ADMIN checks

    // Continue to next middleware/controller
    next();
  } catch (error) {
    console.error('[OrganizationIsolation] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Organizasyon doğrulaması sırasında hata oluştu'
    });
  }
};

module.exports = { enforceOrganizationIsolation };
