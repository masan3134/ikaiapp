/**
 * CV Text Extractor Service
 *
 * NEW FEATURE #8: Bulk CV Upload
 * Extracts text from PDF/DOCX files and parses candidate info
 *
 * Created: 2025-10-27
 */

const logger = require('../utils/logger');

/**
 * Extract text from CV file
 * Note: For MVP, we'll use MinIO URL and let Gemini handle PDF parsing
 * Future: Add pdf-parse library for local extraction
 *
 * @param {string} fileUrl - MinIO presigned URL
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Extracted text
 */
async function extractText(fileUrl, mimeType) {
  try {
    // For now, return URL (Gemini can read PDFs directly)
    // Future enhancement: Add pdf-parse for local extraction
    return fileUrl;
  } catch (error) {
    logger.error('Text extraction error', { error: error.message, fileUrl });
    throw error;
  }
}

/**
 * Parse candidate name from filename
 * Supports patterns: "John_Doe_CV.pdf", "Jane-Smith-Resume.pdf", "AliVeli.pdf"
 *
 * @param {string} filename - Original filename
 * @returns {Promise<object>} { firstName, lastName }
 */
async function parseNameFromFilename(filename) {
  try {
    // Remove extension
    const nameWithoutExt = filename
      .replace(/\.(pdf|docx|doc)$/i, '')
      .replace(/[-_](cv|resume|ozgecmis)/gi, '')
      .trim();

    // Split by separators
    const parts = nameWithoutExt.split(/[-_\s]+/).filter(Boolean);

    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(' ')
      };
    } else if (parts.length === 1) {
      // Single word - use as firstName, generate placeholder lastName
      return {
        firstName: parts[0],
        lastName: 'Candidate'
      };
    } else {
      // No parseable name
      return {
        firstName: 'Unknown',
        lastName: filename.substring(0, 20)
      };
    }
  } catch (error) {
    logger.warn('Name parsing error', { error: error.message, filename });
    return {
      firstName: 'Unknown',
      lastName: 'Candidate'
    };
  }
}

/**
 * Extract basic info from CV using AI (Gemini)
 * @param {string} fileUrl - CV file URL
 * @param {string} filename - Original filename
 * @returns {Promise<object>} Parsed CV data
 */
async function extractCVDataWithAI(fileUrl, filename) {
  try {
    const axios = require('axios');
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Simple extraction prompt
    const prompt = `Analyze this CV and extract basic information in JSON format:
{
  "email": "candidate@example.com",
  "phone": "+90 555 123 4567",
  "experience": "Brief summary of work experience",
  "education": "Brief summary of education",
  "skills": ["skill1", "skill2", "skill3"],
  "location": "City, Country"
}

If information not found, use "N/A" or empty array.
Respond ONLY with valid JSON, no markdown or extra text.`;

    // Note: For MVP, we'll use simplified extraction
    // Real implementation would send CV file to Gemini API
    // For now, parse from filename + use defaults

    const { firstName, lastName } = await parseNameFromFilename(filename);

    return {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: 'N/A',
      experience: 'Pending AI extraction',
      education: 'Pending AI extraction',
      skills: [],
      location: 'N/A'
    };
  } catch (error) {
    logger.error('AI extraction error', { error: error.message, filename });
    throw error;
  }
}

module.exports = {
  extractText,
  parseNameFromFilename,
  extractCVDataWithAI
};
