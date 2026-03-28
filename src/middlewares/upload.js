import multer from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { HttpError } from '../common/errors/HttpError.js';
import { ROOT_DIR } from '../config/index.js';

function getFileDestination(path) {
  let res = '';
  if (path.match(/^\/messages\/[0-9a-fA-F]{24}$/)) {
    res = '/uploads/attachments';
  } else if (path === '/users/avatar') {
    res = '/uploads/avatars';
  } else if (path === '/users/cover') {
    res = '/uploads/covers';
  } else {
    res = '/uploads';
  }

  return join(ROOT_DIR, res);
}

const storage = multer.diskStorage({
  destination: (req, _, cb) =>
    cb(null, getFileDestination(req.originalUrl.split('?')[0])),
  filename: (_, file, callback) =>
    callback(
      null,
      `${Date.now()}_${randomUUID()}.${file.mimetype.split('/').at(-1)}`,
    ),
});

const pictureTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const attachmentTypes = [
  'video/mkv',
  'video/mp4',
  'audio/mp3',
  'application/pdf',
  'application/zip',
];

export const uploadAvatar = multer({
  storage,
  fileFilter: (_, file, callback) => {
    if (pictureTypes.includes(file.mimetype)) return callback(null, true);
    callback(new HttpError(422, 'Invalid file format'));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCover = multer({
  storage,
  fileFilter: (_, file, callback) => {
    if (pictureTypes.includes(file.mimetype)) return callback(null, true);
    callback(new HttpError(422, 'Invalid file format'));
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadAttachment = multer({
  storage,
  fileFilter: (_, file, callback) => {
    const fileTypes = attachmentTypes.concat(pictureTypes);
    if (fileTypes.includes(file.mimetype)) return callback(null, true);
    callback(new HttpError(422, 'Invalid file format'));
  },
  limits: { fileSize: 25 * 1024 * 1024 },
});
