const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Utility service to handle secure local storage of user-uploaded files.
 * Organizes files into subdirectories under 'uploads/<userId>/<type>'.
 * Designed with defensive coding standards (directory verification, sanitization, unique naming).
 */

/**
 * Sanitizes a filename to prevent path traversal attacks and remove unsafe characters.
 * 
 * @param {string} originalName - The original name of the uploaded file.
 * @returns {string} Sanitized filename.
 */
function sanitizeFilename(originalName) {
  // Extract file extension cleanly
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);

  // Strip path traversal sequences, replace spaces/uncommon characters with hyphens
  const cleanBase = base
    .replace(/[.]{2,}/g, '') // Remove double dots
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace non-alphanumeric with hyphens
    .substring(0, 100); // Enforce reasonable length constraint

  // Append unique suffix to guarantee uniqueness and prevent collision overrides
  const uniqueSuffix = crypto.randomBytes(6).toString('hex');
  
  return `${cleanBase}-${uniqueSuffix}${ext}`;
}

/**
 * Programmatically writes a file buffer to local disk under a user-partitioned directory structure.
 * 
 * @param {string} userId - The authenticated user's ID.
 * @param {Buffer} fileBuffer - File contents in buffer format.
 * @param {string} originalName - Original filename for extension and sanitization.
 * @param {string} subfolder - Targeted category folder (e.g., 'resumes', 'audios').
 * @returns {Promise<string>} Relative path to the saved file from the server root.
 */
async function storeUserFile(userId, fileBuffer, originalName, subfolder) {
  if (!userId) {
    throw new Error('User ID is required to partition file uploads securely.');
  }
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error('Invalid file content buffer provided.');
  }

  // Base directory pointing to 'server/uploads'
  const baseUploadsDir = path.resolve(__dirname, '../../uploads');
  
  // User & subfolder partitioned target directory under dedicated 'users' namespace
  const targetDir = path.join(baseUploadsDir, 'users', userId.toString(), subfolder);

  // Ensure the directory structure exists recursively
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate safe unique filename
  const safeFilename = sanitizeFilename(originalName);
  const fullPath = path.join(targetDir, safeFilename);

  // Save the buffer to local disk
  await fs.promises.writeFile(fullPath, fileBuffer);

  // Return server-relative path for clean DB records (e.g., 'uploads/users/123/resumes/my-resume-abc123.pdf')
  return path.join('uploads', 'users', userId.toString(), subfolder, safeFilename).replace(/\\/g, '/');
}

module.exports = {
  storeUserFile,
  sanitizeFilename
};
