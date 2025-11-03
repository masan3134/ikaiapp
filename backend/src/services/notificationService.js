const emailService = require('./emailService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationService {
  /**
   * Notifies the offer creator when a candidate responds to an offer.
   * @param {object} offer - The full offer object, including creator and candidate.
   * @param {string} decision - 'accepted' or 'rejected'.
   * @param {string} [reason] - The reason for rejection.
   */
  async notifyHRofOfferResponse(offer, decision, reason) {
    const creator = await prisma.user.findUnique({ where: { id: offer.createdBy } });
    if (!creator) return;

    const subject = `Teklif Yanıtı: ${offer.candidate.firstName} ${offer.candidate.lastName} - ${decision === 'accepted' ? 'Kabul Etti' : 'Reddetti'}`;
    const body = `
      <p>Merhaba ${creator.email},</p>
      <p>${offer.candidate.firstName} ${offer.candidate.lastName} adlı aday, ${offer.position} pozisyonu için gönderdiğiniz teklifi <strong>${decision === 'accepted' ? 'KABUL ETTİ' : 'REDDETTİ'}</strong>.</p>
      ${decision === 'rejected' ? `<p><strong>Reddetme Nedeni:</strong> ${reason}</p>` : ''}
      <p>Detayları görüntülemek için IKAI platformunu ziyaret edebilirsiniz.</p>
    `;

    await emailService.sendGenericEmail(creator.email, subject, body);
  }

  /**
   * Notifies managers/admins that an offer is awaiting their approval.
   * @param {object} offer - The full offer object, including creator and candidate.
   */
  async notifyManagerOfApprovalRequest(offer) {
    const managers = await prisma.user.findMany({
      where: {
        OR: [{ role: 'ADMIN' }, { role: 'MANAGER' }]
      }
    });
    if (managers.length === 0) return;

    const subject = `Onay Bekleyen Teklif: ${offer.position} - ${offer.candidate.firstName} ${offer.candidate.lastName}`;
    const body = `
      <p>Merhaba,</p>
      <p>${offer.creator.email} tarafından oluşturulan bir iş teklifi onayınızı bekliyor.</p>
      <ul>
        <li><strong>Aday:</strong> ${offer.candidate.firstName} ${offer.candidate.lastName}</li>
        <li><strong>Pozisyon:</strong> ${offer.position}</li>
        <li><strong>Teklifi Oluşturan:</strong> ${offer.creator.email}</li>
      </ul>
      <p>Lütfen IKAI platformuna giriş yaparak teklifi inceleyip kararınızı belirtin.</p>
    `;

    const recipients = managers.map(m => m.email);
    for (const recipient of recipients) {
      await emailService.sendGenericEmail(recipient, subject, body);
    }
  }

  /**
   * Notifies the offer creator about the decision on their approval request.
   * @param {object} offer - The full offer object.
   * @param {string} decision - 'approved' or 'rejected'.
   * @param {string} [notes] - Approval notes or rejection reason.
   */
  async notifyCreatorOfApprovalDecision(offer, decision, notes) {
    const subject = `Teklif Onay Durumu: ${decision === 'approved' ? 'Onaylandı' : 'Reddedildi'}`;
    const body = `
      <p>Merhaba ${offer.creator.email},</p>
      <p>${offer.position} pozisyonu için oluşturduğunuz teklif, yönetici tarafından <strong>${decision === 'approved' ? 'ONAYLANDI' : 'REDDEDİLDİ'}</strong>.</p>
      ${notes ? `<p><strong>Yönetici Notu:</strong> ${notes}</p>` : ''}
      <p>${decision === 'approved' ? 'Artık teklifi adaya gönderebilirsiniz.' : 'Lütfen teklifi revize edip tekrar onaya gönderin.'}</p>
    `;

    await emailService.sendGenericEmail(offer.creator.email, subject, body);
  }

  /**
   * Notifies the offer creator that an offer has expired.
   * @param {object} offer - The full offer object.
   */
  async notifyCreatorOfOfferExpiration(offer) {
    const subject = `Süresi Dolan Teklif: ${offer.position} - ${offer.candidate.firstName} ${offer.candidate.lastName}`;
    const body = `
      <p>Merhaba ${offer.creator.email},</p>
      <p>${offer.candidate.firstName} ${offer.candidate.lastName} adlı adaya gönderdiğiniz ${offer.position} pozisyonu teklifinin süresi dolmuştur.</p>
      <p>Gerekirse teklifin süresini uzatabilir veya yeni bir teklif oluşturabilirsiniz.</p>
    `;
    await emailService.sendGenericEmail(offer.creator.email, subject, body);
  }
}

module.exports = new NotificationService();
