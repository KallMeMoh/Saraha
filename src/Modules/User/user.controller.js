import { Router } from 'express';
import * as UserService from './user.service.js';
import { successResponse } from '../../common/response/response.js';
import { authMiddleware } from '../../middlewares/authentication.js';

export const userRouter = Router();

// and this as well >:(

userRouter.get('/', authMiddleware, async (req, res) => {
  const user = await UserService.getUserProfile(req.userId);
  return successResponse({ res, statusCode: 200, data: user });
});

userRouter.post('/:userId/messages', async (req, res) => {
  const message = await UserService.createMessage(req, req.body);
  return successResponse({ res, statusCode: 200, data: message });
});
