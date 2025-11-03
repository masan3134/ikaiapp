const { emailQueue } = require('../queues/emailQueue');

/**
 * Email Queue Service
 * Helper functions to add emails to the queue
 */

/**
 * Queue analysis report email
 */
async function queueAnalysisReportEmail(analysisId, recipientEmail, formats = ['html']) {
  const job = await emailQueue.add('analysis-report', {
    type: 'analysis-report',
    data: {
      analysisId,
      recipientEmail,
      formats
    }
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });

  return {
    jobId: job.id,
    queueName: 'generic-email',
    emailType: 'analysis-report'
  };
}

/**
 * Queue interview invitation email
 */
async function queueInterviewInvitationEmail(candidate, interview) {
  const job = await emailQueue.add('interview-invitation', {
    type: 'interview-invitation',
    data: {
      candidate,
      interview
    }
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });

  return {
    jobId: job.id,
    queueName: 'generic-email',
    emailType: 'interview-invitation'
  };
}

/**
 * Queue interview reschedule notification
 */
async function queueInterviewRescheduleEmail(candidate, interview) {
  const job = await emailQueue.add('interview-reschedule', {
    type: 'interview-reschedule',
    data: {
      candidate,
      interview
    }
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });

  return {
    jobId: job.id,
    queueName: 'generic-email',
    emailType: 'interview-reschedule'
  };
}

/**
 * Queue generic email
 */
async function queueGenericEmail(to, subject, html) {
  const job = await emailQueue.add('generic-email', {
    type: 'generic',
    data: {
      to,
      subject,
      html
    }
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });

  return {
    jobId: job.id,
    queueName: 'generic-email',
    emailType: 'generic'
  };
}

module.exports = {
  queueAnalysisReportEmail,
  queueInterviewInvitationEmail,
  queueInterviewRescheduleEmail,
  queueGenericEmail
};
