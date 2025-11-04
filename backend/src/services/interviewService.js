const { PrismaClient } = require('@prisma/client');
const googleMeetService = require('./googleMeetService');
const { queueGenericEmail } = require('./emailQueueService');

const prisma = new PrismaClient();

class InterviewService {
  
  /**
   * Get recent candidates for selection (Step 1)
   */
  async getRecentCandidates(userId, organizationId, { search, limit = 10 }) {
    const where = {
      userId,
      organizationId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    return await prisma.candidate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      }
    });
  }

  /**
   * Check for scheduling conflicts (Step 2)
   */
  async checkConflicts(date, time, interviewerId, organizationId) {
    const conflicts = await prisma.interview.findMany({
      where: {
        date: new Date(date),
        time,
        organizationId,
        status: { notIn: ['cancelled', 'completed'] },
        OR: [
          { interviewerId },
          { candidates: { some: {} } }
        ]
      },
      include: {
        candidates: {
          include: {
            candidate: { select: { firstName: true, lastName: true } }
          }
        },
        interviewer: { select: { email: true } }
      }
    });

    return {
      hasConflict: conflicts.length > 0,
      conflicts: conflicts.map(c => ({
        id: c.id,
        candidateNames: c.candidates.map(ic => 
          `${ic.candidate.firstName} ${ic.candidate.lastName}`
        ).join(', '),
        type: c.type,
        time: c.time,
        interviewer: c.interviewer.email
      }))
    };
  }

  /**
   * Create interview with Google Meet (Step 5)
   */
  async createInterview(data, userId, organizationId) {
    const {
      candidateIds,
      type,
      date,
      time,
      duration = 60,
      location,
      interviewerId,
      notes,
      emailTemplate,
      meetingTitle
    } = data;

    let meetLink = null;
    let meetEventId = null;

    // Create Google Meet for online interviews
    if (type === 'online' && googleMeetService.isEnabled) {
      try {
        const startDateTime = new Date(`${date}T${time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        const candidates = await prisma.candidate.findMany({
          where: { id: { in: candidateIds } },
          select: { email: true }
        });

        const meetData = await googleMeetService.createMeetLink({
          title: meetingTitle || 'Mülakat Görüşmesi',
          description: notes || 'IKAI HR - Mülakat',
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          attendees: candidates.map(c => c.email)
        });

        meetLink = meetData.meetLink;
        meetEventId = meetData.eventId;
      } catch (error) {
        console.error('❌ Google Meet creation failed:', error.message);
        // Continue without Meet link
      }
    }

    // Create interview in database
    const interview = await prisma.interview.create({
      data: {
        type,
        date: new Date(date),
        time,
        duration,
        location,
        meetLink,
        meetEventId,
        meetingTitle,
        interviewerId,
        notes,
        emailTemplate,
        createdBy: userId,
        organizationId,
        candidates: {
          create: candidateIds.map(id => ({ candidateId: id }))
        }
      },
      include: {
        candidates: {
          include: { candidate: true }
        },
        interviewer: true
      }
    });

    // Send emails to all candidates
    await this.sendInterviewEmails(interview);

    return interview;
  }

  /**
   * Send interview invitation emails
   */
  async sendInterviewEmails(interview) {
    const typeLabels = {
      phone: 'Telefon Görüşmesi',
      online: 'Online Görüşme (Google Meet)',
      'in-person': 'Yüz Yüze Görüşme'
    };

    for (const ic of interview.candidates) {
      const candidate = ic.candidate;
      
      const emailHtml = interview.emailTemplate || this.generateDefaultTemplate({
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        date: interview.date,
        time: interview.time,
        type: typeLabels[interview.type],
        location: interview.location,
        meetLink: interview.meetLink,
        notes: interview.notes
      });

      try {
        // Queue email instead of sending directly
        await queueGenericEmail(
          candidate.email,
          'Mülakat Daveti',
          emailHtml
        );
        console.log(`📧 Interview email queued for ${candidate.email}`);
      } catch (error) {
        console.error(`❌ Failed to queue email for ${candidate.email}:`, error.message);
      }
    }

    await prisma.interview.update({
      where: { id: interview.id },
      data: { emailSent: true }
    });
  }

  /**
   * Generate default email template
   */
  generateDefaultTemplate(data) {
    const { candidateName, date, time, type, location, meetLink, notes } = data;
    const dateStr = new Date(date).toLocaleDateString('tr-TR');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e9ecef; }
          .detail-label { font-weight: bold; min-width: 120px; }
          .meet-link { background: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
          .footer { text-align: center; color: #6c757d; margin-top: 30px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Mülakat Davetiyesi</h1>
          </div>
          <div class="content">
            <p>Sayın <strong>${candidateName}</strong>,</p>
            <p>IKAI HR olarak başvurunuz için mülakat görüşmesi yapmak isteriz.</p>
            
            <div class="details">
              <h3>📋 Mülakat Detayları:</h3>
              <div class="detail-row">
                <div class="detail-label">📅 Tarih:</div>
                <div>${dateStr}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">🕐 Saat:</div>
                <div>${time}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">📍 Tür:</div>
                <div>${type}</div>
              </div>
              ${location ? `<div class="detail-row">
                <div class="detail-label">📌 Konum:</div>
                <div>${location}</div>
              </div>` : ''}
            </div>

            ${meetLink ? `<div style="text-align: center;">
              <a href="${meetLink}" class="meet-link">🎥 Google Meet'e Katıl</a>
            </div>` : ''}

            ${notes ? `<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>ℹ️ Ek Bilgi:</strong><br>
              ${notes}
            </div>` : ''}

            <p style="margin-top: 30px;">Saygılarımızla,<br><strong>IKAI HR - İK Departmanı</strong></p>
          </div>
          <div class="footer">
            <p>Bu e-posta IKAI HR sistemi tarafından otomatik oluşturulmuştur.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get all interviews with filters
   */
  async getInterviews(userId, organizationId, userRole, filters = {}) {
    const { status, type, candidateId, page = 1, limit = 20 } = filters; // Parse to int
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    // Role-based filtering
    let where = {};

    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN: ALL interviews from ALL organizations
      where = {};
    } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/MANAGER/HR: ALL interviews from their organization
      where = {
        organizationId
      };
    } else {
      // USER: Only their own interviews
      where = {
        createdBy: userId,
        organizationId
      };
    }

    if (status) where.status = status;
    if (type) where.type = type;
    if (candidateId) {
      where.candidates = {
        some: {
          candidateId: candidateId
        }
      };
    }

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        include: {
          candidates: {
            include: {
              candidate: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              }
            }
          },
          interviewer: {
            select: { email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitInt
      }),
      prisma.interview.count({ where })
    ]);

    return {
      interviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get interview statistics
   */
  async getStats(userId, organizationId, userRole) {
    // Role-based filtering
    let where = {};

    if (userRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN: ALL interviews from ALL organizations
      where = {};
    } else if (['ADMIN', 'MANAGER', 'HR_SPECIALIST'].includes(userRole)) {
      // ADMIN/MANAGER/HR: ALL interviews from their organization
      where = { organizationId };
    } else {
      // USER: Only their own interviews
      where = { createdBy: userId, organizationId };
    }

    const [total, scheduled, completed, cancelled] = await Promise.all([
      prisma.interview.count({ where }),
      prisma.interview.count({ where: { ...where, status: 'scheduled' } }),
      prisma.interview.count({ where: { ...where, status: 'completed' } }),
      prisma.interview.count({ where: { ...where, status: 'cancelled' } })
    ]);

    return { total, scheduled, completed, cancelled };
  }
}

module.exports = new InterviewService();
