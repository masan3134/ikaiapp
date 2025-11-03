const {
  exportCandidatesToExcel,
  exportCandidatesToCSV,
  exportJobPostingsToExcel,
  exportJobPostingsToCSV
} = require('../services/bulkExportService');

/**
 * Export candidates to Excel
 * GET /api/v1/candidates/export/xlsx?ids=id1,id2,id3
 */
async function exportCandidatesXLSX(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const ids = req.query.ids ? req.query.ids.split(',').filter(Boolean) : null;

    const workbook = await exportCandidatesToExcel(userId, role, ids, req.organizationId);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=adaylar-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

    console.log(`✅ Candidates Excel exported by ${req.user.email}${ids ? ` (${ids.length} selected)` : ' (all)'}`);
  } catch (error) {
    console.error('Candidates Excel export error:', error);
    res.status(500).json({
      error: 'Export Failed',
      message: 'Excel export sırasında hata oluştu'
    });
  }
}

/**
 * Export candidates to CSV
 * GET /api/v1/candidates/export/csv?ids=id1,id2,id3
 */
async function exportCandidatesCSV(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const ids = req.query.ids ? req.query.ids.split(',').filter(Boolean) : null;

    const csv = await exportCandidatesToCSV(userId, role, ids, req.organizationId);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=adaylar-${Date.now()}.csv`
    );

    res.write('\uFEFF');
    res.write(csv);
    res.end();

    console.log(`✅ Candidates CSV exported by ${req.user.email}${ids ? ` (${ids.length} selected)` : ' (all)'}`);
  } catch (error) {
    console.error('Candidates CSV export error:', error);
    res.status(500).json({
      error: 'Export Failed',
      message: 'CSV export sırasında hata oluştu'
    });
  }
}

/**
 * Export job postings to Excel
 * GET /api/v1/job-postings/export/xlsx?ids=id1,id2,id3
 */
async function exportJobPostingsXLSX(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const ids = req.query.ids ? req.query.ids.split(',').filter(Boolean) : null;

    const workbook = await exportJobPostingsToExcel(userId, role, ids, req.organizationId);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=is-ilanlari-${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

    console.log(`✅ Job Postings Excel exported by ${req.user.email}${ids ? ` (${ids.length} selected)` : ' (all)'}`);
  } catch (error) {
    console.error('Job Postings Excel export error:', error);
    res.status(500).json({
      error: 'Export Failed',
      message: 'Excel export sırasında hata oluştu'
    });
  }
}

/**
 * Export job postings to CSV
 * GET /api/v1/job-postings/export/csv?ids=id1,id2,id3
 */
async function exportJobPostingsCSV(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const ids = req.query.ids ? req.query.ids.split(',').filter(Boolean) : null;

    const csv = await exportJobPostingsToCSV(userId, role, ids, req.organizationId);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=is-ilanlari-${Date.now()}.csv`
    );

    res.write('\uFEFF');
    res.write(csv);
    res.end();

    console.log(`✅ Job Postings CSV exported by ${req.user.email}${ids ? ` (${ids.length} selected)` : ' (all)'}`);
  } catch (error) {
    console.error('Job Postings CSV export error:', error);
    res.status(500).json({
      error: 'Export Failed',
      message: 'CSV export sırasında hata oluştu'
    });
  }
}

module.exports = {
  exportCandidatesXLSX,
  exportCandidatesCSV,
  exportJobPostingsXLSX,
  exportJobPostingsCSV
};
