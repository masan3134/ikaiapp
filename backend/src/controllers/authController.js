const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');

const prisma = new PrismaClient();

// Redis client will be injected
let redisClient;

function setRedisClient(client) {
  redisClient = client;
}

const SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Store session in Redis
    if (redisClient && redisClient.isOpen) {
      try {
        const sessionData = JSON.stringify({
          token,
          userId: user.id,
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString()
        });
        await redisClient.setEx(`session:${user.id}`, SESSION_TTL, sessionData);
      } catch (redisError) {
        console.error('Redis session storage error:', redisError);
        // Continue even if Redis fails
      }
    }

    // Return user and token
    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    });
  }
}

/**
 * Login user
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    // Store/update session in Redis
    if (redisClient && redisClient.isOpen) {
      try {
        const sessionData = JSON.stringify({
          token,
          userId: user.id,
          email: user.email,
          role: user.role,
          lastLogin: new Date().toISOString()
        });
        await redisClient.setEx(`session:${user.id}`, SESSION_TTL, sessionData);
      } catch (redisError) {
        console.error('Redis session storage error:', redisError);
        // Continue even if Redis fails
      }
    }

    // Return user and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        createdAt: userWithoutPassword.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
}

/**
 * Logout user
 * POST /api/auth/logout
 * Requires authentication
 */
async function logout(req, res) {
  try {
    const userId = req.user.id;

    // Delete session from Redis
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(`session:${userId}`);
      } catch (redisError) {
        console.error('Redis session deletion error:', redisError);
        // Continue even if Redis fails
      }
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout'
    });
  }
}

/**
 * Get current user
 * GET /api/auth/me
 * Requires authentication
 */
function me(req, res) {
  // req.user is already populated by authenticateToken middleware
  res.json({
    user: req.user
  });
}

/**
 * Refresh token
 * POST /api/auth/refresh
 * Requires authentication
 */
async function refreshToken(req, res) {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Generate new token
    const newToken = generateToken(userId, userRole);

    // Update session in Redis
    if (redisClient && redisClient.isOpen) {
      try {
        const sessionData = JSON.stringify({
          token: newToken,
          userId: userId,
          email: req.user.email,
          role: userRole,
          refreshedAt: new Date().toISOString()
        });
        await redisClient.setEx(`session:${userId}`, SESSION_TTL, sessionData);
      } catch (redisError) {
        console.error('Redis session update error:', redisError);
        // Continue even if Redis fails
      }
    }

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh token'
    });
  }
}

module.exports = {
  setRedisClient,
  register,
  login,
  logout,
  me,
  refreshToken
};
