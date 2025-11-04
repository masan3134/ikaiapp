const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Export analysis to Excel
 */
async function exportToExcel(analysisId, organizationId) {
  const data = await getAnalysisData(analysisId, organizationId);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Analysis Results');

  // Headers (V7.1 Compatible)
  sheet.columns = [
    { header: 'Aday Adı', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Telefon', key: 'phone', width: 15 },
    { header: 'Nihai Uygunluk Puanı', key: 'compatibilityScore', width: 18 },
    { header: 'Deneyim Puanı (0-100)', key: 'experienceScore', width: 18 },
    { header: 'Eğitim Puanı (0-100)', key: 'educationScore', width: 18 },
    { header: 'Teknik Puanı (0-100)', key: 'technicalScore', width: 18 },
    { header: 'Soft Skills Puanı (0-100)', key: 'softSkillsScore', width: 20 },
    { header: 'Ekstra Puanı (0-100)', key: 'extraScore', width: 18 },
    { header: 'Tavsiye', key: 'recommendation', width: 35 },
    { header: 'Deneyim Özeti', key: 'experienceSummary', width: 50 },
    { header: 'Eğitim Özeti', key: 'educationSummary', width: 50 },
    { header: 'Kariyer Gelişimi', key: 'careerTrajectory', width: 40 },
    { header: 'Güçlü Yönler', key: 'keyStrengths', width: 60 },
    { header: 'Riskler', key: 'keyRisks', width: 60 },
    { header: 'Görüşme Soruları', key: 'interviewQuestions', width: 60 },
    { header: 'İşe Alım Takvimi', key: 'hiringTimeline', width: 40 }
  ];

  // Style header
  sheet.getRow(1).font = { bold: true, size: 12 };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF3B82F6' }
  };
  sheet.getRow(1).font.color = { argb: 'FFFFFFFF' };

  // Add data (V7.1 Compatible)
  data.results.forEach(result => {
    sheet.addRow({
      name: `${result.candidate.firstName} ${result.candidate.lastName}`,
      email: result.candidate.email || '-',
      phone: result.candidate.phone || '-',
      compatibilityScore: result.compatibilityScore,
      experienceScore: result.experienceScore || 0,
      educationScore: result.educationScore || 0,
      technicalScore: result.technicalScore || 0,
      softSkillsScore: result.softSkillsScore || 0,
      extraScore: result.extraScore || 0,
      recommendation: result.strategicSummary?.finalRecommendation || result.matchLabel || '-',
      experienceSummary: result.experienceSummary || result.candidate.experience || '-',
      educationSummary: result.educationSummary || result.candidate.education || '-',
      careerTrajectory: result.careerTrajectory || '-',
      keyStrengths: result.strategicSummary?.keyStrengths?.join('\n\n') || '-',
      keyRisks: result.strategicSummary?.keyRisks?.join('\n\n') || '-',
      interviewQuestions: result.strategicSummary?.interviewQuestions?.join('\n\n') || '-',
      hiringTimeline: result.strategicSummary?.hiringTimeline || '-'
    });
  });

  // Auto-fit columns with wrap text
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'top', wrapText: true };
      });
    }
  });

  return workbook;
}

/**
 * Export analysis to CSV
 */
async function exportToCSV(analysisId, organizationId) {
  const data = await getAnalysisData(analysisId, organizationId);

  const headers = [
    'Aday Adı',
    'Email',
    'Telefon',
    'Nihai Uygunluk Puanı',
    'Deneyim Puanı',
    'Eğitim Puanı',
    'Teknik Puanı',
    'Soft Skills Puanı',
    'Ekstra Puanı',
    'Tavsiye',
    'Yönetici Özeti',
    'Deneyim Özeti',
    'Eğitim Özeti',
    'Kariyer Gelişimi',
    'Güçlü Yönler',
    'Riskler'
  ];

  const rows = data.results.map(result => [
    `${result.candidate.firstName} ${result.candidate.lastName}`,
    result.candidate.email || '-',
    result.candidate.phone || '-',
    result.compatibilityScore,
    result.experienceScore || 0,
    result.educationScore || 0,
    result.technicalScore || 0,
    result.softSkillsScore || 0,
    result.extraScore || 0,
    escapeCsv(result.strategicSummary?.finalRecommendation || result.matchLabel || '-'),
    escapeCsv(result.strategicSummary?.executiveSummary || '-'),
    escapeCsv(result.experienceSummary || result.candidate.experience || '-'),
    escapeCsv(result.educationSummary || result.candidate.education || '-'),
    escapeCsv(result.careerTrajectory || '-'),
    escapeCsv(result.strategicSummary?.keyStrengths?.join(' | ') || '-'),
    escapeCsv(result.strategicSummary?.keyRisks?.join(' | ') || '-')
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csv;
}

/**
 * Export analysis to HTML (Print-Ready)
 */
async function exportToHTML(analysisId, organizationId) {
  const data = await getAnalysisData(analysisId, organizationId);

  // Calculate stats for overview
  const stats = {
    total: data.results.length,
    avgScore: Math.round(data.results.reduce((sum, r) => sum + r.compatibilityScore, 0) / data.results.length),
    highMatch: data.results.filter(r => r.compatibilityScore >= 80).length,
    goodMatch: data.results.filter(r => r.compatibilityScore >= 60 && r.compatibilityScore < 80).length,
    lowMatch: data.results.filter(r => r.compatibilityScore < 60).length,
    topCandidate: data.results[0] || null
  };

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analiz Raporu - ${escapeHtml(data.jobPosting.title)}</title>
  <style>
    :root {
      --primary: #3B82F6;
      --success: #10B981;
      --warning: #F59E0B;
      --danger: #EF4444;
      --gray-50: #F9FAFB;
      --gray-100: #F3F4F6;
      --gray-200: #E5E7EB;
      --gray-700: #374151;
      --gray-900: #111827;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: var(--gray-900);
      background: #fff;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, var(--primary) 0%, #2563EB 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 40px;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2);
    }

    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .header p {
      font-size: 16px;
      opacity: 0.9;
    }

    /* Job Info */
    .job-info {
      background: var(--gray-50);
      border: 2px solid var(--gray-200);
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 40px;
    }

    .job-info h2 {
      color: var(--primary);
      font-size: 20px;
      margin-bottom: 20px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .info-item {
      display: flex;
      gap: 8px;
    }

    .info-label {
      font-weight: 600;
      color: var(--gray-700);
      min-width: 120px;
    }

    .info-value {
      color: var(--gray-900);
    }

    /* Overview Stats */
    .overview {
      margin-bottom: 40px;
    }

    .overview h2 {
      font-size: 24px;
      margin-bottom: 24px;
      color: var(--gray-900);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border: 2px solid var(--gray-200);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: var(--gray-700);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-card.high .stat-value { color: var(--success); }
    .stat-card.good .stat-value { color: var(--primary); }
    .stat-card.low .stat-value { color: var(--danger); }

    /* Summary Table */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .summary-table th {
      background: var(--gray-900);
      color: white;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .summary-table td {
      padding: 16px;
      border-bottom: 1px solid var(--gray-200);
      font-size: 14px;
    }

    .summary-table tr:hover {
      background: var(--gray-50);
    }

    .score-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    }

    .score-badge.high {
      background: #D1FAE5;
      color: #065F46;
    }

    .score-badge.good {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .score-badge.low {
      background: #FEE2E2;
      color: #991B1B;
    }

    /* Detailed Results */
    .details h2 {
      font-size: 28px;
      margin-bottom: 30px;
      color: var(--gray-900);
      border-bottom: 3px solid var(--primary);
      padding-bottom: 12px;
    }

    .candidate-card {
      background: white;
      border: 3px solid var(--gray-200);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 40px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      page-break-inside: avoid;
    }

    .candidate-card.high { border-color: var(--success); }
    .candidate-card.good { border-color: var(--primary); }
    .candidate-card.low { border-color: var(--danger); }

    .candidate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--gray-200);
    }

    .candidate-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--gray-900);
    }

    .candidate-label {
      font-size: 18px;
      font-weight: 600;
      padding: 8px 20px;
      border-radius: 24px;
    }

    .candidate-label.high {
      background: var(--success);
      color: white;
    }

    .candidate-label.good {
      background: var(--primary);
      color: white;
    }

    .candidate-label.low {
      background: var(--danger);
      color: white;
    }

    .contact-info {
      font-size: 14px;
      color: var(--gray-700);
      margin-bottom: 24px;
    }

    .scores-section {
      margin-bottom: 32px;
    }

    .scores-section h3 {
      font-size: 18px;
      margin-bottom: 16px;
      color: var(--gray-900);
    }

    .scores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .score-item {
      background: var(--gray-50);
      border-radius: 8px;
      padding: 16px;
      border-left: 4px solid;
    }

    .score-item.total { border-left-color: var(--primary); }
    .score-item.exp { border-left-color: #8B5CF6; }
    .score-item.edu { border-left-color: #EC4899; }
    .score-item.tech { border-left-color: var(--warning); }
    .score-item.extra { border-left-color: var(--success); }

    .score-label {
      font-size: 12px;
      color: var(--gray-700);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .score-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--gray-900);
    }

    .score-max {
      font-size: 16px;
      color: var(--gray-700);
    }

    .score-bar {
      height: 8px;
      background: var(--gray-200);
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }

    .score-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 4px;
    }

    .score-bar-fill.total { background: var(--primary); }
    .score-bar-fill.exp { background: #8B5CF6; }
    .score-bar-fill.edu { background: #EC4899; }
    .score-bar-fill.tech { background: var(--warning); }
    .score-bar-fill.soft { background: #F97316; }
    .score-bar-fill.extra { background: var(--success); }

    /* V7.1: Strategic Summary Styles */
    .strategic-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }

    .strategic-section h3 {
      color: white;
      margin-bottom: 20px;
    }

    .strategic-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 20px;
    }

    .recommendation-badge {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.9);
    }

    .recommendation-badge.high { color: #059669; }
    .recommendation-badge.good { color: #3B82F6; }
    .recommendation-badge.low { color: #DC2626; }

    .executive-summary, .key-strengths, .key-risks, .interview-questions, .hiring-timeline {
      background: rgba(255, 255, 255, 0.95);
      color: #1F2937;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }

    .executive-summary h4, .key-strengths h4, .key-risks h4, .interview-questions h4, .hiring-timeline h4 {
      color: #1F2937;
      margin-bottom: 12px;
      font-size: 16px;
    }

    .key-strengths ul, .key-risks ul, .interview-questions ol {
      margin: 0;
      padding-left: 24px;
    }

    .key-strengths li, .key-risks li, .interview-questions li {
      margin: 12px 0;
      line-height: 1.6;
    }

    .comments-section {
      margin-bottom: 24px;
    }

    .comments-section h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .comments-section.positive h4 {
      color: var(--success);
    }

    .comments-section.negative h4 {
      color: var(--danger);
    }

    .comment-list {
      list-style: none;
    }

    .comment-item {
      padding: 12px 16px;
      margin-bottom: 8px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
    }

    .comment-item.positive {
      background: #D1FAE5;
      border-left: 4px solid var(--success);
    }

    .comment-item.negative {
      background: #FEE2E2;
      border-left: 4px solid var(--danger);
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
      }

      .no-print {
        display: none !important;
      }

      .container {
        max-width: 100%;
        padding: 20px;
      }

      .candidate-card {
        page-break-inside: avoid;
        margin-bottom: 30px;
        box-shadow: none;
      }

      .header {
        box-shadow: none;
      }
    }

    /* Print Button */
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      border: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      transition: all 0.2s;
      z-index: 1000;
    }

    .print-button:hover {
      background: #2563EB;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    .print-button:active {
      transform: translateY(0);
    }

    /* Chart */
    .chart-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
      border: 2px solid var(--gray-200);
    }

    .chart-bars {
      display: flex;
      gap: 12px;
      height: 200px;
      align-items: flex-end;
      padding: 20px 0;
    }

    .chart-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .bar {
      width: 100%;
      background: linear-gradient(to top, var(--primary), #60A5FA);
      border-radius: 8px 8px 0 0;
      position: relative;
      transition: all 0.3s;
    }

    .bar:hover {
      opacity: 0.8;
    }

    .bar-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--gray-700);
      text-align: center;
    }

    .bar-value {
      font-size: 14px;
      font-weight: 700;
      color: var(--gray-900);
      margin-bottom: 4px;
    }
  </style>
</head>
<body>
  <!-- Print Button -->
  <button class="print-button no-print" onclick="window.print()">
    🖨️ PDF Yazdır
  </button>

  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 CV ANALİZ RAPORU</h1>
      <p>IKAI HR Platform - Yapay Zeka Destekli CV Değerlendirme</p>
    </div>

    <!-- Job Info -->
    <div class="job-info">
      <h2>💼 İş İlanı Bilgileri</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Pozisyon:</span>
          <span class="info-value">${escapeHtml(data.jobPosting.title)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Departman:</span>
          <span class="info-value">${escapeHtml(data.jobPosting.department)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Analiz Tarihi:</span>
          <span class="info-value">${new Date(data.createdAt).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Toplam Aday:</span>
          <span class="info-value">${data.results.length} kişi</span>
        </div>
      </div>
    </div>

    <!-- Overview Section -->
    <div class="overview">
      <h2>📈 Genel Özet</h2>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.total}</div>
          <div class="stat-label">Toplam Aday</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.avgScore}</div>
          <div class="stat-label">Ortalama Puan</div>
        </div>
        <div class="stat-card high">
          <div class="stat-value">${stats.highMatch}</div>
          <div class="stat-label">Güçlü Eşleşme</div>
        </div>
        <div class="stat-card good">
          <div class="stat-value">${stats.goodMatch}</div>
          <div class="stat-label">İyi Eşleşme</div>
        </div>
        <div class="stat-card low">
          <div class="stat-value">${stats.lowMatch}</div>
          <div class="stat-label">Uyum Düşük</div>
        </div>
      </div>

      <!-- Score Distribution Chart -->
      <div class="chart-container">
        <h3 style="margin-bottom: 20px; color: var(--gray-900);">📊 Puan Dağılımı</h3>
        <div class="chart-bars">
          ${data.results.map((r, i) => `
            <div class="chart-bar">
              <div class="bar-value">${r.compatibilityScore}</div>
              <div class="bar" style="height: ${r.compatibilityScore * 2}px; max-height: 200px;"></div>
              <div class="bar-label">Aday ${i + 1}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Summary Table -->
      <table class="summary-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Aday Adı</th>
            <th>Email</th>
            <th>Toplam Puan</th>
            <th>Deneyim</th>
            <th>Eğitim</th>
            <th>Teknik</th>
            <th>Ekstra</th>
            <th>Eşleşme</th>
          </tr>
        </thead>
        <tbody>
          ${data.results.map((r, i) => {
            const scoreClass = r.compatibilityScore >= 80 ? 'high' :
                              r.compatibilityScore >= 60 ? 'good' : 'low';
            return `
              <tr>
                <td><strong>${i + 1}</strong></td>
                <td><strong>${escapeHtml(r.candidate.firstName)} ${escapeHtml(r.candidate.lastName)}</strong></td>
                <td>${escapeHtml(r.candidate.email || '-')}</td>
                <td><span class="score-badge ${scoreClass}">${r.compatibilityScore}/100</span></td>
                <td>${r.experienceScore || 0}/40</td>
                <td>${r.educationScore || 0}/30</td>
                <td>${r.technicalScore || 0}/20</td>
                <td>${r.extraScore || 0}/10</td>
                <td><span class="score-badge ${scoreClass}">${escapeHtml(r.matchLabel || '-')}</span></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Detailed Candidate Results -->
    <div class="details">
      <h2>👥 Detaylı Aday Değerlendirmeleri</h2>

      ${data.results.map((result, index) => {
        const scoreClass = result.compatibilityScore >= 80 ? 'high' :
                          result.compatibilityScore >= 60 ? 'good' : 'low';

        return `
          <div class="candidate-card ${scoreClass}">
            <!-- Header -->
            <div class="candidate-header">
              <div>
                <div class="candidate-name">
                  ${index + 1}. ${escapeHtml(result.candidate.firstName)} ${escapeHtml(result.candidate.lastName)}
                </div>
                <div class="contact-info">
                  ${result.candidate.email ? `📧 ${escapeHtml(result.candidate.email)}` : ''}
                  ${result.candidate.email && result.candidate.phone ? ' • ' : ''}
                  ${result.candidate.phone ? `📱 ${escapeHtml(result.candidate.phone)}` : ''}
                </div>
              </div>
              <div class="candidate-label ${scoreClass}">
                ${escapeHtml(result.matchLabel || 'N/A')}
              </div>
            </div>

            <!-- Scores (V7.1: All 0-100) -->
            <div class="scores-section">
              <h3>📊 Puanlar (V7.1 Sistem - Tüm Skorlar 0-100)</h3>
              <div class="scores-grid">
                <div class="score-item total">
                  <div class="score-label">🎯 Nihai Uygunluk</div>
                  <div class="score-value">${result.compatibilityScore}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill total" style="width: ${result.compatibilityScore}%"></div>
                  </div>
                </div>
                <div class="score-item exp">
                  <div class="score-label">💼 Deneyim</div>
                  <div class="score-value">${result.experienceScore || 0}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill exp" style="width: ${result.experienceScore || 0}%"></div>
                  </div>
                </div>
                <div class="score-item edu">
                  <div class="score-label">🎓 Eğitim</div>
                  <div class="score-value">${result.educationScore || 0}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill edu" style="width: ${result.educationScore || 0}%"></div>
                  </div>
                </div>
                <div class="score-item tech">
                  <div class="score-label">🔧 Teknik</div>
                  <div class="score-value">${result.technicalScore || 0}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill tech" style="width: ${result.technicalScore || 0}%"></div>
                  </div>
                </div>
                <div class="score-item soft">
                  <div class="score-label">👥 Soft Skills</div>
                  <div class="score-value">${result.softSkillsScore || 0}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill soft" style="width: ${result.softSkillsScore || 0}%"></div>
                  </div>
                </div>
                <div class="score-item extra">
                  <div class="score-label">⭐ Ekstra</div>
                  <div class="score-value">${result.extraScore || 0}<span class="score-max">/100</span></div>
                  <div class="score-bar">
                    <div class="score-bar-fill extra" style="width: ${result.extraScore || 0}%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- V7.1: Strategic Summary -->
            ${result.strategicSummary ? `
              <div class="strategic-section">
                <h3>🎯 Stratejik Değerlendirme</h3>
                <div class="strategic-card">
                  <div class="recommendation-badge ${scoreClass}">
                    ${escapeHtml(result.strategicSummary.finalRecommendation || '-')}
                  </div>
                  <div class="executive-summary">
                    <h4>📋 Yönetici Özeti</h4>
                    <p>${escapeHtml(result.strategicSummary.executiveSummary || '-')}</p>
                  </div>

                  ${result.strategicSummary.keyStrengths?.length ? `
                    <div class="key-strengths">
                      <h4>✅핵심 Güçlü Yönler</h4>
                      <ul>
                        ${result.strategicSummary.keyStrengths.map((s, i) => `
                          <li><strong>${i + 1}.</strong> ${escapeHtml(s)}</li>
                        `).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  ${result.strategicSummary.keyRisks?.length ? `
                    <div class="key-risks">
                      <h4>⚠️ Riskler ve Azaltma Stratejileri</h4>
                      <ul>
                        ${result.strategicSummary.keyRisks.map(r => `
                          <li>${escapeHtml(r)}</li>
                        `).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  ${result.strategicSummary.interviewQuestions?.length ? `
                    <div class="interview-questions">
                      <h4>💬 Önerilen Görüşme Soruları</h4>
                      <ol>
                        ${result.strategicSummary.interviewQuestions.map(q => `
                          <li>${escapeHtml(q)}</li>
                        `).join('')}
                      </ol>
                    </div>
                  ` : ''}

                  ${result.strategicSummary.hiringTimeline ? `
                    <div class="hiring-timeline">
                      <h4>⏰ İşe Alım Takvimi</h4>
                      <p>${escapeHtml(result.strategicSummary.hiringTimeline)}</p>
                    </div>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            <!-- Positive Comments -->
            ${result.positiveComments && result.positiveComments.length > 0 ? `
              <div class="comments-section positive">
                <h4>✅ Güçlü Yönler</h4>
                <ul class="comment-list">
                  ${result.positiveComments.map(c => `
                    <li class="comment-item positive">${escapeHtml(c)}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- Negative Comments -->
            ${result.negativeComments && result.negativeComments.length > 0 ? `
              <div class="comments-section negative">
                <h4>⚠️ Gelişim Alanları</h4>
                <ul class="comment-list">
                  ${result.negativeComments.map(c => `
                    <li class="comment-item negative">${escapeHtml(c)}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 40px 0; color: var(--gray-700); font-size: 14px; border-top: 2px solid var(--gray-200); margin-top: 40px;">
      <p>Bu rapor IKAI HR Platform tarafından ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.</p>
      <p style="margin-top: 8px; font-size: 12px; color: var(--gray-700);">
        © 2025 IKAI HR Platform - Tüm hakları saklıdır.
      </p>
    </div>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Get analysis data with all relations
 */
async function getAnalysisData(analysisId, organizationId) {
  const analysis = await prisma.analysis.findFirst({
    where: { id: analysisId, organizationId },
    select: { id: true }
  });

  if (!analysis) {
    throw new Error('Analysis not found');
  }

  const data = await prisma.$queryRaw`
    SELECT
      a.id,
      a.status,
      a."createdAt",
      a."completedAt",
      json_build_object(
        'id', jp.id,
        'title', jp.title,
        'department', jp.department,
        'details', jp.details
      ) as "jobPosting",
      (
        SELECT json_agg(
          json_build_object(
            'id', ar.id,
            'candidateId', ar."candidateId",
            'compatibilityScore', ar."compatibilityScore",
            'experienceScore', ar."experienceScore",
            'educationScore', ar."educationScore",
            'technicalScore', ar."technicalScore",
            'softSkillsScore', ar."softSkillsScore",
            'extraScore', ar."extraScore",
            'matchLabel', ar."matchLabel",
            'experienceSummary', ar."experienceSummary",
            'educationSummary', ar."educationSummary",
            'careerTrajectory', ar."careerTrajectory",
            'scoringProfile', ar."scoringProfile",
            'strategicSummary', ar."strategicSummary",
            'positiveComments', ar."positiveComments",
            'negativeComments', ar."negativeComments",
            'candidate', json_build_object(
              'id', c.id,
              'firstName', c."firstName",
              'lastName', c."lastName",
              'email', c.email,
              'phone', c.phone,
              'address', c.address,
              'experience', c.experience,
              'education', c.education
            )
          )
          ORDER BY ar."compatibilityScore" DESC
        )
        FROM analysis_results ar
        LEFT JOIN candidates c ON ar."candidateId" = c.id
        WHERE ar."analysisId" = a.id
      ) as results
    FROM analyses a
    LEFT JOIN job_postings jp ON a."jobPostingId" = jp.id
    WHERE a.id = ${analysisId}
  `;

  if (!data || data.length === 0) {
    throw new Error('Analysis not found');
  }

  return data[0];
}

/**
 * Helper: Escape CSV values
 */
function escapeCsv(value) {
  if (!value) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Helper: Escape HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  exportToExcel,
  exportToCSV,
  exportToHTML,
  getAnalysisData
};
