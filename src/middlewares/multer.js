import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, _, callback) =>
    callback(
      null,
      `uploads/${req.url === '/avatar' ? 'avatars' : 'attachments'}`,
    ),
  filename: (req, file, callback) =>
    callback(
      null,
      req.url === '/avatar'
        ? `${req.userId}`
        : `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    ),
});

const upload = multer({ storage });

// uploadMiddleware([{ name: 'avatar', maxCount: 1 }])
// uploadMiddleware([{ name: 'attachments', maxCount: 8 }])
// uploadMiddleware([{ name: 'avatar', maxCount: 1 }, { name: 'attachments', maxCount: 8 }])

export const uploadMiddleware = (fields) => {
  if (fields.length === 1) {
    const { name, maxCount } = fields[0];
    return upload.array(name, maxCount);
  } else if (fields.length > 1) {
    return upload.fields(fields);
  } else {
    throw new TypeError('Expected a non-empty array');
  }
};
