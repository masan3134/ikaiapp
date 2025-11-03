/**
 * Sanitize filename - remove Turkish characters and special chars
 */
function sanitizeFileName(fileName) {
  const charMap = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  };

  let sanitized = fileName;

  // Replace Turkish characters
  Object.keys(charMap).forEach(key => {
    sanitized = sanitized.replace(new RegExp(key, 'g'), charMap[key]);
  });

  // Remove special characters except dots, dashes, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Remove multiple underscores
  sanitized = sanitized.replace(/_+/g, '_');

  return sanitized;
}

module.exports = { sanitizeFileName };
