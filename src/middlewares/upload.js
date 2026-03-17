import multer from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { HttpError } from '../common/errors/HttpError.js';
import { ROOT_DIR } from '../config/index.js';

const avatarStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, join(ROOT_DIR, 'uploads/avatars')),
  filename: (req, _, callback) => callback(null, `${req.userId}`),
});

const attachmentStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, join(ROOT_DIR, 'uploads/attachments')),
  filename: (_, file, callback) =>
    callback(
      null,
      `${Date.now()}_${randomUUID()}.${file.mimetype.split('/').at(-1)}`,
    ),
});

const avatarTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const attachmentTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'video/mkv',
  'video/mp4',
  'audio/mp3',
  'application/pdf',
  'application/zip',
];

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: (_, file, callback) => {
    if (avatarTypes.includes(file.mimetype)) return callback(null, true);
    callback(new Error('Invalid file format'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadAttachment = multer({
  storage: attachmentStorage,
  fileFilter: (_, file, callback) => {
    if (attachmentTypes.includes(file.mimetype)) return callback(null, true);
    callback(new HttpError(422, 'Invalid file format'));
  },
  limits: { fileSize: 25 * 1024 * 1024 },
});
