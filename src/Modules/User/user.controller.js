import { Router } from 'express';
import * as UserService from './user.service.js';
import { successResponse } from '../../common/response/response.js';
import { authenticate } from '../../middlewares/authentication.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { uploadMiddleware } from '../../middlewares/multer.js';

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

userRouter.put(
  '/avatar',
  authenticate(),
  uploadMiddleware([{ name: 'avatar', maxCount: 1 }]),
  async (req, res) => {
    await UserService.updateAvatar(req.userId, req.files[0].path);
    return successResponse({ res, statusCode: 200 });
  },
);

userRouter.delete('/', authenticate(), async (req, res) => {
  await UserService.deleteAccount(req.userId);
  return successResponse({ res, statusCode: 200 });
});

userRouter.delete(
  '/:userId',
  authenticate(),
  authorize(RoleEnum.Admin),
  async (req, res) => {
    await UserService.deleteAccount(req.params.userId);
    return successResponse({ res, statusCode: 200 });
  },
);
