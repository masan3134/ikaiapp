const { exportToExcel, exportToCSV, exportToHTML } = require('../services/exportService');

/**
 * Export analysis to Excel
 * GET /api/v1/analyses/:id/export/xlsx
 */
async function exportAnalysisToExcel(req, res) {
  try {
    const { id } = req.params;

    const workbook = await exportToExcel(id);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analiz-${id}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel export error:', error);

    if (error.message === 'Analysis not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    res.status(500).json({
      error: 'Export Failed',
      message: 'Excel export sırasında hata oluştu'
    });
  }
}

/**
 * Export analysis to CSV
 * GET /api/v1/analyses/:id/export/csv
 */
async function exportAnalysisToCSV(req, res) {
  try {
    const { id } = req.params;

    const csv = await exportToCSV(id);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analiz-${id}.csv`
    );

    // UTF-8 BOM for Excel compatibility
    res.write('\uFEFF');
    res.write(csv);
    res.end();
  } catch (error) {
    console.error('CSV export error:', error);

    if (error.message === 'Analysis not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    res.status(500).json({
      error: 'Export Failed',
      message: 'CSV export sırasında hata oluştu'
    });
  }
}

/**
 * Export analysis to HTML (Print-Ready)
 * GET /api/v1/analyses/:id/export/html
 */
async function exportAnalysisToHTML(req, res) {
  try {
    const { id } = req.params;

    const html = await exportToHTML(id);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (error) {
    console.error('HTML export error:', error);

    if (error.message === 'Analysis not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Analiz bulunamadı'
      });
    }

    res.status(500).json({
      error: 'Export Failed',
      message: 'HTML export sırasında hata oluştu'
    });
  }
}

module.exports = {
  exportAnalysisToExcel,
  exportAnalysisToCSV,
  exportAnalysisToHTML
};
