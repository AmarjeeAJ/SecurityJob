import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import env from '../config/env.js';
import { AppError } from './error.middleware.js';

const PHOTO_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const RESUME_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const PHOTO_EXTENSIONS = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
const RESUME_EXTENSIONS = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

const uploadRoot = path.resolve(env.uploadDirectory);
ensureDir(path.join(uploadRoot, 'photos'));
ensureDir(path.join(uploadRoot, 'resumes'));

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const subDir = file.fieldname === 'photo' ? 'photos' : 'resumes';
    callback(null, path.join(uploadRoot, subDir));
  },
  filename(req, file, callback) {
    const extensions = file.fieldname === 'photo' ? PHOTO_EXTENSIONS : RESUME_EXTENSIONS;
    const extension = extensions[file.mimetype] || '';
    const randomName = crypto.randomBytes(24).toString('hex');
    callback(null, `${randomName}${extension}`);
  },
});

function fileFilter(req, file, callback) {
  const allowed = file.fieldname === 'photo' ? PHOTO_MIME_TYPES : RESUME_MIME_TYPES;
  if (!allowed.has(file.mimetype)) {
    return callback(new AppError(
      file.fieldname === 'photo'
        ? 'The uploaded photo must be a JPG, PNG or WEBP file.'
        : 'The uploaded resume must be a PDF, DOC or DOCX file.',
      422
    ));
  }
  callback(null, true);
}

export const uploadCandidateDocuments = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxFileSize, files: 2 },
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
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
