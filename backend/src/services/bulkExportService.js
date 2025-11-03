const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportCandidatesToExcel(userId, role, candidateIds = null, organizationId) {
  const where = { organizationId };

  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  if (candidateIds && candidateIds.length > 0) {
    where.id = { in: candidateIds };
  }

  where.isDeleted = false;

  const candidates = await prisma.candidate.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Adaylar');

  sheet.columns = [
    { header: 'Ad', key: 'firstName', width: 15 },
    { header: 'Soyad', key: 'lastName', width: 15 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Telefon', key: 'phone', width: 15 },
    { header: 'Adres', key: 'address', width: 30 },
    { header: 'Dosya Adı', key: 'sourceFileName', width: 30 },
    { header: 'Deneyim', key: 'experience', width: 50 },
    { header: 'Eğitim', key: 'education', width: 50 },
    { header: 'Oluşturulma', key: 'createdAt', width: 20 }
  ];

  sheet.getRow(1).font = { bold: true, size: 12 };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3B82F6' }
  };
  sheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  candidates.forEach(c => {
    sheet.addRow({
      firstName: c.firstName || '-',
      lastName: c.lastName || '-',
      email: c.email || '-',
      phone: c.phone || '-',
      address: c.address || '-',
      sourceFileName: c.sourceFileName || '-',
      experience: c.experience || '-',
      education: c.education || '-',
      createdAt: new Date(c.createdAt).toLocaleString('tr-TR')
    });
  });

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell(cell => {
        cell.alignment = { vertical: 'top', wrapText: true };
      });
    }
  });

  return workbook;
}

async function exportCandidatesToCSV(userId, role, candidateIds = null, organizationId) {
  const where = { organizationId };

  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  if (candidateIds && candidateIds.length > 0) {
    where.id = { in: candidateIds };
  }

  where.isDeleted = false;

  const candidates = await prisma.candidate.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  const headers = [
    'Ad',
    'Soyad',
    'Email',
    'Telefon',
    'Adres',
    'Dosya Adı',
    'Deneyim',
    'Eğitim',
    'Oluşturulma'
  ];

  const rows = candidates.map(c => [
    c.firstName || '-',
    c.lastName || '-',
    c.email || '-',
    c.phone || '-',
    c.address || '-',
    c.sourceFileName || '-',
    escapeCsv(c.experience || '-'),
    escapeCsv(c.education || '-'),
    new Date(c.createdAt).toLocaleString('tr-TR')
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csv;
}

async function exportJobPostingsToExcel(userId, role, jobPostingIds = null, organizationId) {
  const where = { organizationId };

  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  if (jobPostingIds && jobPostingIds.length > 0) {
    where.id = { in: jobPostingIds };
  }

  where.isDeleted = false;

  const jobPostings = await prisma.jobPosting.findMany({
    where,
    include: {
      _count: {
        select: { analyses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('İş İlanları');

  sheet.columns = [
    { header: 'Başlık', key: 'title', width: 30 },
    { header: 'Departman', key: 'department', width: 20 },
    { header: 'Açıklama', key: 'description', width: 40 },
    { header: 'Detaylar', key: 'details', width: 60 },
    { header: 'Analiz Sayısı', key: 'analysisCount', width: 15 },
    { header: 'Oluşturulma', key: 'createdAt', width: 20 }
  ];

  sheet.getRow(1).font = { bold: true, size: 12 };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3B82F6' }
  };
  sheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  jobPostings.forEach(jp => {
    sheet.addRow({
      title: jp.title || '-',
      department: jp.department || '-',
      description: jp.description || '-',
      details: jp.details || '-',
      analysisCount: jp._count.analyses || 0,
      createdAt: new Date(jp.createdAt).toLocaleString('tr-TR')
    });
  });

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell(cell => {
        cell.alignment = { vertical: 'top', wrapText: true };
      });
    }
  });

  return workbook;
}

async function exportJobPostingsToCSV(userId, role, jobPostingIds = null, organizationId) {
  const where = { organizationId };

  if (role !== 'ADMIN') {
    where.userId = userId;
  }

  if (jobPostingIds && jobPostingIds.length > 0) {
    where.id = { in: jobPostingIds };
  }

  where.isDeleted = false;

  const jobPostings = await prisma.jobPosting.findMany({
    where,
    include: {
      _count: {
        select: { analyses: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const headers = [
    'Başlık',
    'Departman',
    'Açıklama',
    'Detaylar',
    'Analiz Sayısı',
    'Oluşturulma'
  ];

  const rows = jobPostings.map(jp => [
    jp.title || '-',
    jp.department || '-',
    escapeCsv(jp.description || '-'),
    escapeCsv(jp.details || '-'),
    jp._count.analyses || 0,
    new Date(jp.createdAt).toLocaleString('tr-TR')
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csv;
}

function escapeCsv(value) {
  if (!value) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

module.exports = {
  exportCandidatesToExcel,
  exportCandidatesToCSV,
  exportJobPostingsToExcel,
  exportJobPostingsToCSV
};
