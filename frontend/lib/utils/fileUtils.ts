/**
 * File utility functions
 */

/**
 * Format file size in bytes to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Check if file is valid PDF
 */
export function isValidPDF(file: File): boolean {
  const validTypes = ['application/pdf'];
  const validExtensions = ['pdf'];

  const ext = getFileExtension(file.name);
  return validTypes.includes(file.type) && validExtensions.includes(ext);
}

/**
 * Check if file type is valid for CV upload
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  const ext = getFileExtension(file.name);
  return allowedTypes.includes(ext) || allowedTypes.includes(file.type);
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Validate file size (max 10MB for CV uploads)
 */
export function isValidFileSize(file: File, maxSizeMB = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}
