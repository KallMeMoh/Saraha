import express from 'express';
import { PORT } from '../config/config.service.js';
import { connectDB } from './DB/connection.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { authenticate } from './middlewares/authentication.js';
import { messageRouter } from './Modules/Message/message.controller.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './common/errors/HttpError.js';
import { mkdir, readFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export default async function bootstrap() {
  const app = express();

  await Promise.all([
    connectDB(),
    mkdir(join(__dirname, '../uploads/attachments'), { recursive: true }),
    mkdir(join(__dirname, '../uploads/avatars'), { recursive: true }),
  ]);

  app.use(express.json());

  // yes you are reasing this line right, anyone could
  // access any of the assets as they please...
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  app.use('/auth', authRouter);
  app.use('/users', authenticate(), userRouter);
  app.use('/messages', messageRouter);

  app.use('{/*dummy}', (_, __) => {
    throw new HttpError(404, 'Endpoint not found');
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
