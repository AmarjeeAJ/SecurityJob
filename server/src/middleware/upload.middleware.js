import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import env from '../config/env.js';
import { AppError } from './error.middleware.js';

const AADHAAR_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AADHAAR_EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.resolve(__dirname, '../..');

const uploadRoot = path.isAbsolute(env.uploadDirectory)
  ? env.uploadDirectory
  : fs.existsSync(path.resolve(serverDir, env.uploadDirectory))
  ? path.resolve(serverDir, env.uploadDirectory)
  : path.resolve(process.cwd(), env.uploadDirectory);

ensureDir(path.join(uploadRoot, 'aadhaar'));

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(uploadRoot, 'aadhaar'));
  },
  filename(req, file, callback) {
    const extension = AADHAAR_EXTENSIONS[file.mimetype] || '';
    const randomName = crypto.randomBytes(24).toString('hex');
    callback(null, `${randomName}${extension}`);
  },
});

function fileFilter(req, file, callback) {
  if (!AADHAAR_MIME_TYPES.has(file.mimetype)) {
    return callback(new AppError('Aadhaar card images must be a JPG, PNG or WEBP file.', 422));
  }
  callback(null, true);
}

export const uploadCandidateDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize, files: 2 },
}).fields([
  { name: 'aadhaarFront', maxCount: 1 },
  { name: 'aadhaarBack', maxCount: 1 },
]);

export function handleUploadErrors(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('The uploaded file is too large.', 422));
    }
    return next(new AppError('File upload failed. Please try again.', 422));
  }
  next(err);
}

export { uploadRoot };
