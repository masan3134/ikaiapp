/**
 * Interview Scheduler Service
 *
 * NEW FEATURE #3: AI Interview Scheduler
 * AI-powered interview slot suggestions and scheduling
 *
 * Created: 2025-10-27
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const emailService = require('./emailService');

const prisma = new PrismaClient();

/**
 * Suggest time slots for interview
 * Uses AI to find optimal times based on:
 * - Interviewer's existing schedule
 * - Candidate's test completion time (if available)
 * - Business hours
 *
 * @param {string} candidateId
 * @param {string} interviewerId
 * @param {Date} preferredDate
 * @returns {Promise<Array>} Suggested time slots
 */
async function suggestTimeSlots(candidateId, interviewerId, preferredDate) {
  try {
    logger.info('Suggesting interview time slots', {
      candidateId,
      interviewerId,
      preferredDate
    });

    // 1. Get interviewer's existing interviews on that day
    const startOfDay = new Date(preferredDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(preferredDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingInterviews = await prisma.interview.findMany({
      where: {
        interviewerId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: { in: ['SCHEDULED', 'RESCHEDULED'] }
      },
      select: {
        scheduledAt: true,
        duration: true
      }
    });

    // 2. Generate available slots (9 AM - 5 PM, 1-hour intervals)
    const availableSlots = [];
    const businessHourStart = 9;
    const businessHourEnd = 17;

    for (let hour = businessHourStart; hour < businessHourEnd; hour++) {
      const slotTime = new Date(preferredDate);
      slotTime.setHours(hour, 0, 0, 0);

      // Check if slot conflicts with existing interviews
      const hasConflict = existingInterviews.some(interview => {
        const interviewStart = new Date(interview.scheduledAt);
        const interviewEnd = new Date(interviewStart.getTime() + interview.duration * 60000);
        const slotEnd = new Date(slotTime.getTime() + 60 * 60000);

        return (
          (slotTime >= interviewStart && slotTime < interviewEnd) ||
          (slotEnd > interviewStart && slotEnd <= interviewEnd)
        );
      });

      if (!hasConflict) {
        // AI scoring (simplified for MVP)
        // Prefer afternoon slots (higher productivity)
        const score = hour >= 14 && hour <= 16 ? 0.9 : 0.7;

        availableSlots.push({
          time: slotTime.toISOString(),
          score,
          reason: hour >= 14 && hour <= 16
            ? 'Optimal afternoon slot'
            : 'Available morning/late slot'
        });
      }
    }

    // 3. Sort by score and return top 5
    return availableSlots
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  } catch (error) {
    logger.error('Time slot suggestion error', { error: error.message });
    throw error;
  }
}

/**
 * Schedule an interview
 * Creates interview record and sends email notifications
 *
 * @param {object} data - Interview data
 * @returns {Promise<object>} Created interview
 */
async function scheduleInterview(data) {
  try {
    const {
      candidateId,
      interviewerId,
      analysisResultId,
      scheduledAt,
      duration,
      location,
      meetingLink,
      notes
    } = data;

    logger.info('Scheduling interview', {
      candidateId,
      interviewerId,
      scheduledAt
    });

    // 1. Get candidate and interviewer info
    const [candidate, interviewer] = await Promise.all([
      prisma.candidate.findUnique({ where: { id: candidateId } }),
      prisma.user.findUnique({ where: { id: interviewerId } })
    ]);

    if (!candidate || !interviewer) {
      throw new Error('Candidate or interviewer not found');
    }

    // 2. Create interview record
    const interview = await prisma.interview.create({
      data: {
        candidateId,
        interviewerId,
        analysisResultId,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        location,
        meetingLink,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        interviewer: {
          select: {
            email: true
          }
        }
      }
    });

    // 3. Send email to candidate
    try {
      await emailService.sendInterviewInvitation(candidate, interview);
      logger.info('Interview invitation sent to candidate', {
        interviewId: interview.id,
        candidateEmail: candidate.email
      });
    } catch (emailError) {
      logger.warn('Failed to send interview invitation', {
        error: emailError.message,
        interviewId: interview.id
      });
      // Don't fail the whole operation if email fails
    }

    // 4. Optional: Create Google Calendar event
    // Skipped for MVP - can be added later

    return interview;
  } catch (error) {
    logger.error('Interview scheduling error', { error: error.message });
    throw error;
  }
}

/**
 * Get all interviews for a user (interviewer or candidate)
 * @param {string} userId
 * @param {string} userRole
 * @param {object} filters
 * @returns {Promise<Array>}
 */
async function getAllInterviews(userId, userRole, filters = {}) {
  try {
    const whereClause = {};

    // Role-based filtering
    if (userRole === 'ADMIN' || userRole === 'MANAGER') {
      // Admins/Managers see all interviews
    } else {
      // Others only see their own interviews (as interviewer)
      whereClause.interviewerId = userId;
    }

    // Status filter
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      whereClause.scheduledAt = {};
      if (filters.startDate) whereClause.scheduledAt.gte = new Date(filters.startDate);
      if (filters.endDate) whereClause.scheduledAt.lte = new Date(filters.endDate);
    }

    const interviews = await prisma.interview.findMany({
      where: whereClause,
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        interviewer: {
          select: {
            id: true,
            email: true
          }
        },
        analysisResult: {
          select: {
            compatibilityScore: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    return interviews;
  } catch (error) {
    logger.error('Get interviews error', { error: error.message });
    throw error;
  }
}

/**
 * Update interview (reschedule, complete, cancel)
 * @param {string} interviewId
 * @param {object} updates
 * @param {string} userId - For authorization
 * @returns {Promise<object>}
 */
async function updateInterview(interviewId, updates, userId) {
  try {
    // Check ownership
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId }
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    // Only interviewer can update
    if (interview.interviewerId !== userId) {
      throw new Error('Unauthorized to update this interview');
    }

    // Update
    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: updates,
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    logger.info('Interview updated', {
      interviewId,
      updates: Object.keys(updates)
    });

    // If rescheduled, send notification
    if (updates.scheduledAt) {
      try {
        await emailService.sendInterviewRescheduleNotification(updated.candidate, updated);
      } catch (emailError) {
        logger.warn('Failed to send reschedule notification', { error: emailError.message });
      }
    }

    return updated;
  } catch (error) {
    logger.error('Interview update error', { error: error.message });
    throw error;
  }
}

/**
 * Cancel interview
 * @param {string} interviewId
 * @param {string} userId
 * @param {string} reason
 * @returns {Promise<object>}
 */
async function cancelInterview(interviewId, userId, reason = null) {
  try {
    const updated = await updateInterview(interviewId, {
      status: 'CANCELLED',
      notes: reason ? `Cancelled: ${reason}` : 'Cancelled'
    }, userId);

    logger.info('Interview cancelled', { interviewId, reason });

    return updated;
  } catch (error) {
    logger.error('Interview cancellation error', { error: error.message });
    throw error;
  }
}

module.exports = {
  suggestTimeSlots,
  scheduleInterview,
  getAllInterviews,
  updateInterview,
  cancelInterview
};
