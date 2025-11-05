const { verifyToken } = require('../utils/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware to authenticate JWT token
 * Extracts token from Authorization header or cookies
 * Verifies token and attaches user to req.user
 */
async function authenticateToken(req, res, next) {
  try {
    // Extract token from Authorization header, cookies, or query string
    let token = null;

    // Check Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to query string (for HTML reports opened in new tab)
    if (!token && req.query && req.query.token) {
      token = req.query.token;
    }

    // Fallback to cookies if no Authorization header
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: error.message
      });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        department: true, // For department isolation (MANAGER role)
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
}

/**
 * Middleware to require ADMIN role
 * Must be used after authenticateToken middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }

  next();
}

/**
 * Middleware to require specific roles
 * @param {Array} roles - Array of allowed roles (e.g., ['ADMIN', 'MANAGER'])
 */
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole
};
