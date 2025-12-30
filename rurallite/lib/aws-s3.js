/**
 * AWS S3 Configuration and Helper Functions
 * Handles file upload operations using pre-signed URLs
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 Client
// Use environment variables for credentials and region. Never hardcode secrets.
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Allowed file types and max size
const ALLOWED_FILE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'text/plain': '.txt',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (adjust as needed)

/**
 * Validate file type and size
 */
// Enforce file type and size on server for security
if (!ALLOWED_FILE_TYPES[fileType]) {
  return {
    valid: false,
    error: `Unsupported file type: ${fileType}. Allowed types: ${Object.keys(ALLOWED_FILE_TYPES).join(', ')}`
  };
}
if (fileSize > MAX_FILE_SIZE) {
  return {
    valid: false,
    error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  };
}
return { valid: true };
}

/**
 * Generate unique file key with timestamp and random string
 */
// Use a unique, non-guessable key for each upload
export function generateFileKey(filename, userId = null) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.substring(filename.lastIndexOf('.'));
  const prefix = userId ? `user-${userId}` : 'public';
  return `uploads/${prefix}/${timestamp}-${randomString}${extension}`;
}

/**
 * Generate pre-signed URL for file upload
 * @param {string} filename - Original filename
 * @param {string} fileType - MIME type
 * @param {number} fileSize - File size in bytes
 * @param {number} userId - Optional user ID
 * @param {number} expiresIn - URL expiry time in seconds (default: 60)
 * @returns {Promise<{success: boolean, uploadURL?: string, key?: string, error?: string}>}
 */
export async function generatePresignedUploadURL(filename, fileType, fileSize, userId = null, expiresIn = 60) {
  try {
    // Validate file
    const validation = validateFile(fileType, fileSize);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique key
    const key = generateFileKey(filename, userId);

    // Create PutObject command with best practices
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType, // Enforce content-type server-side
      ACL: 'private', // Always private
      ServerSideEncryption: 'AES256', // Enable server-side encryption
      Metadata: {
        'original-filename': filename,
        'uploaded-by': userId ? userId.toString() : 'anonymous',
        'upload-timestamp': new Date().toISOString(),
      },
    });

    // Generate pre-signed URL with short expiry
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      success: true,
      uploadURL,
      key,
      publicURL: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    };
  } catch (error) {
    // Never leak sensitive error details in production
    console.error('Error generating pre-signed URL:', error);
    return {
      success: false,
      error: 'Failed to generate pre-signed URL. Please try again.'
    };
  }
}

/**
 * Delete file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<{success: boolean, error?: string}>}
 */
// Delete file from S3 (best practice: only allow for authorized users)
export async function deleteFile(key) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: 'Failed to delete file.' };
  }
}

export { s3Client };
