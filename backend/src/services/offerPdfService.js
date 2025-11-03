const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');
const minioService = require('./minioService');

const prisma = new PrismaClient();

/**
 * Generate job offer PDF
 * Feature #2: PDF Oluşturma
 */
async function generateOfferPdf(offerId) {
  try {
    // Get offer with all relations
    const offer = await prisma.jobOffer.findUnique({
      where: { id: offerId },
      include: {
        candidate: true,
        jobPosting: true,
        creator: true
      }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Create PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {});

    // Header with logo
    doc.fontSize(24)
       .fillColor('#3B82F6')
       .text('İŞ TEKLİFİ', { align: 'center' })
       .moveDown();

    doc.fontSize(10)
       .fillColor('#6B7280')
       .text('IKAI HR Platform', { align: 'center' })
       .moveDown(2);

    // Candidate greeting
    doc.fontSize(16)
       .fillColor('#1F2937')
       .text(`Sayın ${offer.candidate.firstName} ${offer.candidate.lastName},`)
       .moveDown();

    doc.fontSize(12)
       .fillColor('#4B5563')
       .text(`Firmamız bünyesinde ${offer.position} pozisyonunda sizinle çalışmaktan mutluluk duyacağız.`)
       .moveDown(2);

    // Offer details box
    const boxY = doc.y;
    doc.rect(50, boxY, 495, 200)
       .fillAndStroke('#F9FAFB', '#3B82F6');

    doc.fillColor('#1F2937')
       .fontSize(14)
       .text('📋 Teklif Detayları', 70, boxY + 20);

    doc.fontSize(11)
       .fillColor('#374151')
       .text(`Pozisyon: ${offer.position}`, 70, boxY + 50)
       .text(`Departman: ${offer.department}`, 70, boxY + 70)
       .text(`Maaş: ₺${offer.salary.toLocaleString('tr-TR')} (${offer.currency})`, 70, boxY + 90)
       .text(`Başlangıç Tarihi: ${new Date(offer.startDate).toLocaleDateString('tr-TR')}`, 70, boxY + 110)
       .text(`Çalışma Şekli: ${getWorkTypeLabel(offer.workType)}`, 70, boxY + 130);

    doc.y = boxY + 200;
    doc.moveDown(2);

    // Benefits section
    if (offer.benefits && Object.keys(offer.benefits).length > 0) {
      doc.fontSize(14)
         .fillColor('#1F2937')
         .text('🎁 Yan Haklar')
         .moveDown(0.5);

      doc.fontSize(11)
         .fillColor('#374151');

      const benefits = offer.benefits;
      if (benefits.insurance) doc.text('• Özel Sağlık Sigortası');
      if (benefits.meal) doc.text(`• Yemek Kartı (₺${benefits.meal}/ay)`);
      if (benefits.transportation) doc.text('• Ulaşım Desteği');
      if (benefits.gym) doc.text('• Spor Salonu Üyeliği');
      if (benefits.education) doc.text('• Eğitim Desteği');

      doc.moveDown(2);
    }

    // Terms section
    if (offer.terms) {
      doc.fontSize(14)
         .fillColor('#1F2937')
         .text('📜 Şartlar ve Koşullar')
         .moveDown(0.5);

      doc.fontSize(10)
         .fillColor('#4B5563')
         .text(offer.terms, { align: 'justify' })
         .moveDown(2);
    }

    // Validity notice box
    const noticeY = doc.y;
    doc.rect(50, noticeY, 495, 60)
       .fillAndStroke('#FEF3C7', '#F59E0B');

    doc.fontSize(11)
       .fillColor('#92400E')
       .text(`📅 Bu teklif ${new Date(offer.expiresAt).toLocaleDateString('tr-TR')} tarihine kadar geçerlidir.`, 70, noticeY + 20);

    doc.y = noticeY + 60;
    doc.moveDown(2);

    // Footer
    doc.fontSize(9)
       .fillColor('#9CA3AF')
       .text('Bu belge elektronik olarak oluşturulmuştur.', { align: 'center' })
       .text(`Teklif ID: ${offer.id}`, { align: 'center' })
       .text(`Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}`, { align: 'center' });

    // Finalize PDF
    doc.end();

    // Wait for completion
    const pdfBuffer = await new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // Upload to MinIO
    const filename = `offer-${offer.id}-${Date.now()}.pdf`;
    const fileUrl = await minioService.uploadFile('offers', filename, pdfBuffer, 'application/pdf');

    

    return {
      buffer: pdfBuffer,
      filename,
      url: fileUrl
    };
  } catch (error) {
    console.error('❌ Generate PDF error:', error);
    throw error;
  }
}

/**
 * Get work type label in Turkish
 */
function getWorkTypeLabel(type) {
  const labels = {
    office: 'Ofis',
    hybrid: 'Hibrit',
    remote: 'Uzaktan'
  };
  return labels[type] || type;
}

module.exports = {
  generateOfferPdf
};
