const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const crypto = require('crypto');

const prisma = new PrismaClient();

// Redis client will be injected
let redisClient;
let emailQueue; // BullMQ email queue

function setRedisClient(client) {
  redisClient = client;
}

function setEmailQueue(queue) {
  emailQueue = queue;
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

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already exists'
      });
    }

    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const organization = await prisma.organization.create({
      data: {
        name: `${email.split('@')[0]}'s Organization`,
        slug: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        plan: 'FREE',
        maxAnalysisPerMonth: 10,
        maxCvPerMonth: 50,
        maxUsers: 2,
        onboardingCompleted: false,
        isTrial: true,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      }
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
        organizationId: organization.id,
        emailVerified: false,
        verificationToken,
        verificationExpiry
      },
      select: {
        id: true,
        email: true,
        role: true,
        organizationId: true,
        emailVerified: true,
        createdAt: true
      }
    });

    // Send email verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8103';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    if (emailQueue) {
      try {
        await emailQueue.add('generic-email', {
          type: 'generic',
          data: {
            to: email,
            subject: 'Email Doğrulama - İKAI HR Platform',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                  .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                  .footer { text-align: center; color: #6c757d; margin-top: 30px; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>✉️ Email Doğrulama</h1>
                  </div>
                  <div class="content">
                    <p>Merhaba,</p>
                    <p><strong>İKAI HR Platform</strong>'a hoş geldiniz!</p>
                    <p>Hesabınızı aktifleştirmek için lütfen aşağıdaki butona tıklayarak email adresinizi doğrulayın:</p>
                    <div style="text-align: center;">
                      <a href="${verificationUrl}" class="button">Email Adresimi Doğrula</a>
                    </div>
                    <p>Alternatif olarak, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
                    <p style="background: white; padding: 15px; border-radius: 6px; word-break: break-all; font-size: 12px;">
                      ${verificationUrl}
                    </p>
                    <p style="margin-top: 30px; color: #666;">
                      <strong>Not:</strong> Bu link 24 saat geçerlidir.
                    </p>
                    <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                  </div>
                  <div class="footer">
                    <p>Bu e-posta İKAI HR sistemi tarafından otomatik oluşturulmuştur.</p>
                    <p>© 2025 İKAI - AI-Powered HR Platform</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
        });
        console.log(`✉️ Verification email queued for: ${email}`);
      } catch (emailError) {
        console.error('Email queue error:', emailError);
        // Don't fail registration if email fails
      }
    } else {
      console.warn('⚠️ Email queue not available, verification email not sent');
    }

    // Return success (NO token until email verified)
    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      email: user.email,
      emailVerified: false,
      requiresVerification: true
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
 * Verify Email
 * GET /api/auth/verify-email/:token
 */
async function verifyEmail(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Verification token is required'
      });
    }

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Invalid or expired verification token'
      });
    }

    // Check if token is expired
    if (user.verificationExpiry && new Date() > user.verificationExpiry) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Verification token has expired. Please request a new one.'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(200).json({
        message: 'Email already verified',
        alreadyVerified: true
      });
    }

    // Update user: set emailVerified = true, clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiry: null
      }
    });

    // Generate JWT token now that email is verified
    const jwtToken = generateToken(user.id, user.role);

    // Store session in Redis
    if (redisClient && redisClient.isOpen) {
      try {
        const sessionData = JSON.stringify({
          token: jwtToken,
          userId: user.id,
          email: user.email,
          role: user.role,
          createdAt: new Date().toISOString()
        });
        await redisClient.setEx(`session:${user.id}`, SESSION_TTL, sessionData);
      } catch (redisError) {
        console.error('Redis session storage error:', redisError);
      }
    }

    console.log(`✅ Email verified for: ${user.email}`);

    // Return success with token
    res.status(200).json({
      message: 'Email verified successfully!',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: true
      },
      token: jwtToken
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify email'
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

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        emailVerified: false,
        requiresVerification: true
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
        organizationId: userWithoutPassword.organizationId,
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
  setEmailQueue,
  register,
  verifyEmail,
  login,
  logout,
  me,
  refreshToken
};
