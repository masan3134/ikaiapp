const multer = require('multer');
const path = require('path');
const iconv = require('iconv-lite');

// Fix filename encoding issues (Latin-1 to UTF-8)
const fixFilenameEncoding = (filename) => {
  try {
    // Decode Latin-1 and re-encode as UTF-8
    const buffer = Buffer.from(filename, 'latin1');
    return iconv.decode(buffer, 'utf8');
  } catch (error) {
    console.error('Filename encoding error:', error);
    return filename;
  }
};

// Configure multer with memory storage (file stored in buffer)
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Fix filename encoding before validation
  file.originalname = fixFilenameEncoding(file.originalname);

  // Allowed file extensions
  const allowedExtensions = /pdf|doc|docx|html|txt|csv/;

  // Check extension
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Allowed MIME types
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html',
    'text/plain',
    'text/csv'
  ];

  // Check MIME type
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Sadece PDF, DOCX, DOC, HTML, TXT, CSV dosyaları kabul edilir'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 10 // Maximum 10 files
  }
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File Too Large',
        message: 'Dosya boyutu 10MB\'ı aşamaz'
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too Many Files',
        message: 'Maksimum 10 dosya yüklenebilir'
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected Field',
        message: 'Beklenmeyen dosya alanı'
      });
    }

    // Other multer errors
    return res.status(400).json({
      error: 'Upload Error',
      message: err.message
    });
  } else if (err) {
    // Other errors (e.g., from fileFilter)
    if (err.message.includes('kabul edilir')) {
      return res.status(400).json({
        error: 'Invalid File Type',
        message: err.message
      });
    }

    // Generic error
    return res.status(400).json({
      error: 'Upload Error',
      message: err.message
    });
  }

  next();
};

module.exports = {
  upload,
  handleMulterError
};
