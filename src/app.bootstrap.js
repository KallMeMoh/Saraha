import express from 'express';
import { FRONTEND_URL, PORT, ROOT_DIR } from './config/index.js';
import { connectDB } from './database/mongo.connection.js';
import { authRouter } from './modules/auth/auth.controller.js';
import { userRouter } from './modules/user/user.controller.js';
import { authenticate } from './middlewares/authentication.js';
import { messageRouter } from './modules/message/message.controller.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './common/errors/http.error.js';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import cors from 'cors';
import { client, connectRedis } from './database/redis.connection.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export default async function bootstrap() {
  const app = express();
  // app.set('trust proxy', 1); // commented because I am on ec2 directly with no proxy infront
  // note to self: 1 !== true, true tursts the entire chain,
  // while 1 trusts the first proxy hop, important for
  // preventing ip spoofing

  await Promise.all([
    connectDB(),
    connectRedis(),
    mkdir(join(ROOT_DIR, 'uploads/covers'), { recursive: true }),
    mkdir(join(ROOT_DIR, 'uploads/avatars'), { recursive: true }),
    mkdir(join(ROOT_DIR, 'uploads/attachments'), { recursive: true }),
  ]);

  app.use(express.json());
  app.use(
    cors({
      origin: [FRONTEND_URL],
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60_000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      store: new RedisStore({
        sendCommand: (...args) => client.sendCommand(args),
      }),
      message: { error: 'Too many requests, rate limit exceeded' },
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
