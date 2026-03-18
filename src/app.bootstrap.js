import express from 'express';
import { PORT, ROOT_DIR } from './config/index.js';
import { connectDB } from './DB/mongo.connection.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { authenticate } from './middlewares/authentication.js';
import { messageRouter } from './Modules/Message/message.controller.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './common/errors/HttpError.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import cors from 'cors';
import { connectRedis } from './DB/redis.connection.js';

export default async function bootstrap() {
  const app = express();

  await Promise.all([
    connectDB(),
    connectRedis(),
    mkdir(join(ROOT_DIR, '../uploads/attachments'), { recursive: true }),
    mkdir(join(ROOT_DIR, '../uploads/avatars'), { recursive: true }),
  ]);

  app.use(express.json());
  app.use(
    cors({
      origin: ['http://localhost:3001'],
      credentials: true,
    }),
  );

  // yes you are reasing this line right, anyone could
  // access any of the assets as they please...
  app.use('/uploads', express.static(join(ROOT_DIR, '../uploads')));

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
