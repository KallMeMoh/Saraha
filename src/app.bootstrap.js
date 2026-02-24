import express from 'express';
import { PORT } from '../config/config.service.js';
import { connectDB } from './DB/connection.js';
import {
  globalErrorHandling,
  notFoundException,
} from './common/response/response.js';
import { authRouter } from './Modules/Auth/auth.controller.js';
import { userRouter } from './Modules/User/user.controller.js';
import { authMiddleware } from './middlewares/authentication.js';
import { messageRouter } from './Modules/Message/message.controller.js';

export default async function bootstrap() {
  const app = express();

  await connectDB();

  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/messages', authMiddleware, messageRouter);

  app.use('{/*dummy}', (req, res) => {
    return notFoundException('Endpoint not found');
  });

  app.use(globalErrorHandling);

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}
