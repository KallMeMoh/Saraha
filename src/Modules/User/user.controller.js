import { Router } from 'express';
import * as UserService from './user.service.js';
import { successResponse } from '../../common/response/response.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { uploadMiddleware } from '../../middlewares/upload.js';

export const userRouter = Router();

// and this as well >:(

userRouter.get('/me', async (req, res) => {
  const user = await UserService.getUserProfile(req.userId);
  return successResponse({ res, statusCode: 200, data: { user } });
});

userRouter.get('/:userId', authorize(RoleEnum.Admin), async (req, res) => {
  const user = await UserService.getUserProfile(req.params.userId);
  return successResponse({ res, statusCode: 200, data: { user } });
});

userRouter.put(
  '/avatar',
  uploadMiddleware([{ name: 'avatar', maxCount: 1 }]),
  async (req, res) => {
    await UserService.updateAvatar(req.userId, req.files[0].path);
    return successResponse({ res, statusCode: 200 });
  },
);

userRouter.delete('/', async (req, res) => {
  await UserService.deleteAccount(req.userId);
  return successResponse({ res, statusCode: 200 });
});

userRouter.delete('/:userId', authorize(RoleEnum.Admin), async (req, res) => {
  await UserService.deleteAccount(req.params.userId);
  return successResponse({ res, statusCode: 200 });
});
