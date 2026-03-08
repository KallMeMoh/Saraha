import express from 'express';
import { PORT } from '../config/config.service.js';
import { connectDB } from './DB/connection.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { authenticate } from './middlewares/authentication.js';
import { messageRouter } from './Modules/Message/message.controller.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { HttpError } from './common/errors/HttpError.js';

export default async function bootstrap() {
  const app = express();

  await connectDB();

  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/users', authenticate(), userRouter);
  app.use('/messages', messageRouter);

  app.use('{/*dummy}', (req, res) => {
    throw new HttpError(404, 'Endpoint not found');
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
