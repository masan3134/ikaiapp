const Minio = require('minio');

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'ikai-cv-files';
const PRESIGNED_URL_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Ensure bucket exists, create if not
 */
async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`✅ MinIO bucket '${BUCKET_NAME}' created`);
    }
  } catch (error) {
    console.error('MinIO bucket check error:', error);
    throw error;
  }
}

/**
 * Upload file to MinIO
 * @param {string} userId - User ID
 * @param {string} fileName - Original file name
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<string>} Object name (path)
 */
async function uploadFile(userId, fileName, fileBuffer, mimeType) {
  try {
    await ensureBucket();

    const objectName = `${userId}/${fileName}`;
    const metadata = {
      'Content-Type': mimeType,
      'Upload-Date': new Date().toISOString()
    };

    await minioClient.putObject(
      BUCKET_NAME,
      objectName,
      fileBuffer,
      fileBuffer.length,
      metadata
    );

    console.log(`✅ File uploaded to MinIO: ${objectName}`);
    return objectName;
  } catch (error) {
    console.error('MinIO upload error:', error);
    throw new Error(`Failed to upload file to storage: ${error.message}`);
  }
}

/**
 * Get presigned URL for file access
 * @param {string} userId - User ID
 * @param {string} fileName - File name
 * @returns {Promise<string>} Presigned URL
 */
async function getFileUrl(userId, fileName) {
  try {
    const objectName = `${userId}/${fileName}`;
    const url = await minioClient.presignedGetObject(
      BUCKET_NAME,
      objectName,
      PRESIGNED_URL_EXPIRY
    );
    return url;
  } catch (error) {
    console.error('MinIO presigned URL error:', error);
    throw new Error(`Failed to generate file URL: ${error.message}`);
  }
}

/**
 * Delete file from MinIO
 * @param {string} userId - User ID
 * @param {string} fileName - File name
 * @returns {Promise<void>}
 */
async function deleteFile(userId, fileName) {
  try {
    const objectName = `${userId}/${fileName}`;
    await minioClient.removeObject(BUCKET_NAME, objectName);
    console.log(`✅ File deleted from MinIO: ${objectName}`);
  } catch (error) {
    console.error('MinIO delete error:', error);
    throw new Error(`Failed to delete file from storage: ${error.message}`);
  }
}

/**
 * Download file from MinIO
 * @param {string} userId - User ID
 * @param {string} fileName - File name
 * @returns {Promise<Stream>} File stream
 */
async function downloadFile(userId, fileName) {
  try {
    const objectName = `${userId}/${fileName}`;
    const stream = await minioClient.getObject(BUCKET_NAME, objectName);
    return stream;
  } catch (error) {
    console.error('MinIO download error:', error);
    throw new Error(`Failed to download file from storage: ${error.message}`);
  }
}

/**
 * Check if file exists in MinIO
 * @param {string} userId - User ID
 * @param {string} fileName - File name
 * @returns {Promise<boolean>} True if exists
 */
async function fileExists(userId, fileName) {
  try {
    const objectName = `${userId}/${fileName}`;
    await minioClient.statObject(BUCKET_NAME, objectName);
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
}

/**
 * List all files for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of file objects
 */
async function listUserFiles(userId) {
  try {
    const prefix = `${userId}/`;
    const files = [];
    const stream = minioClient.listObjects(BUCKET_NAME, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on('data', (obj) => files.push(obj));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  } catch (error) {
    console.error('MinIO list files error:', error);
    throw new Error(`Failed to list files: ${error.message}`);
  }
}

module.exports = {
  uploadFile,
  getFileUrl,
  deleteFile,
  downloadFile,
  fileExists,
  listUserFiles,
  ensureBucket
};
