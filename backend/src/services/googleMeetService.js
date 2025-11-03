const { google } = require('googleapis');

/**
 * Google Meet Service
 * Creates Google Calendar events with Google Meet links
 */

class GoogleMeetService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
    this.isEnabled = process.env.GOOGLE_CALENDAR_ENABLED === 'true';
    
    if (this.isEnabled) {
      this.initializeClient();
    }
  }

  initializeClient() {
    try {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      
      console.log('✅ Google Meet Service initialized');
    } catch (error) {
      console.error('❌ Google Meet Service initialization failed:', error.message);
      this.isEnabled = false;
    }
  }

  /**
   * Create a Google Meet link for an interview
   * @param {Object} interviewData - Interview details
   * @returns {Promise<{meetLink: string, eventId: string}>}
   */
  async createMeetLink(interviewData) {
    if (!this.isEnabled) {
      throw new Error('Google Calendar API is not enabled');
    }

    const { title, description, startTime, endTime, attendees } = interviewData;

    try {
      const event = {
        summary: title || 'Mülakat Görüşmesi',
        description: description || 'IKAI HR - Mülakat',
        start: {
          dateTime: startTime,
          timeZone: 'Europe/Istanbul'
        },
        end: {
          dateTime: endTime,
          timeZone: 'Europe/Istanbul'
        },
        attendees: attendees.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }       // 30 min before
          ]
        }
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: 1,
        sendUpdates: 'all', // Send email to all attendees
        requestBody: event
      });

      return {
        meetLink: response.data.hangoutLink,
        eventId: response.data.id,
        htmlLink: response.data.htmlLink
      };
    } catch (error) {
      console.error('❌ Failed to create Google Meet link:', error.message);
      throw new Error('Google Meet link oluşturulamadı: ' + error.message);
    }
  }

  /**
   * Update an existing Google Calendar event
   * @param {string} eventId - Google Calendar event ID
   * @param {Object} updates - Updated event data
   * @returns {Promise<Object>}
   */
  async updateMeetEvent(eventId, updates) {
    if (!this.isEnabled) {
      throw new Error('Google Calendar API is not enabled');
    }

    try {
      const event = await this.calendar.events.get({
        calendarId: 'primary',
        eventId: eventId
      });

      const updatedEvent = {
        ...event.data,
        ...updates
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all',
        requestBody: updatedEvent
      });

      return response.data;
    } catch (error) {
      console.error('❌ Failed to update Google Meet event:', error.message);
      throw error;
    }
  }

  /**
   * Cancel a Google Calendar event
   * @param {string} eventId - Google Calendar event ID
   * @returns {Promise<void>}
   */
  async cancelMeetEvent(eventId) {
    if (!this.isEnabled) {
      throw new Error('Google Calendar API is not enabled');
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      console.log(`✅ Google Meet event cancelled: ${eventId}`);
    } catch (error) {
      console.error('❌ Failed to cancel Google Meet event:', error.message);
      throw error;
    }
  }

  /**
   * Generate a mock Meet link (for development/testing)
   * @returns {Object}
   */
  generateMockLink() {
    const randomCode = Math.random().toString(36).substr(2, 12);
    return {
      meetLink: `https://meet.google.com/mock-${randomCode}`,
      eventId: `mock-event-${Date.now()}`,
      htmlLink: 'https://calendar.google.com',
      isMock: true
    };
  }
}

// Singleton instance
const googleMeetService = new GoogleMeetService();

module.exports = googleMeetService;
