import { Router } from 'express';
import * as UserService from './user.service.js';
import { successResponse } from '../../common/response/response.js';
import { authenticate } from '../../middlewares/authentication.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';

export const userRouter = Router();

// and this as well >:(

userRouter.get('/me', authenticate(), async (req, res) => {
  const user = await UserService.getUserProfile(req.userId);
  return successResponse({ res, statusCode: 200, data: { user } });
});

userRouter.get(
  '/:userId',
  authenticate(),
  authorize(RoleEnum.Admin),
  async (req, res) => {
    const user = await UserService.getUserProfile(req.params.userId);
    return successResponse({ res, statusCode: 200, data: { user } });
  },
);

userRouter.post(
  '/:receiverId/messages',
  authenticate(false),
  async (req, res) => {
    const message = await UserService.createMessage(
      req.userId,
      req.params.receiverId,
      req.body.content,
    );
    return successResponse({ res, statusCode: 200, data: { message } });
  },
);
