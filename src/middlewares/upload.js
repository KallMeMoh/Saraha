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

export const upload = multer({ storage });
