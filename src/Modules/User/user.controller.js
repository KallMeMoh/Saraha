import { Router } from 'express';
import * as UserService from './user.service.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { uploadMiddleware } from '../../middlewares/upload.js';

export const userRouter = Router();

// and this as well! :)

userRouter.get('/me', async (req, res) => {
  const user = await UserService.getUserProfile(req.userId);
  return res.status(200).json(user);
});

userRouter.get('/:userId', authorize(RoleEnum.Admin), async (req, res) => {
  const user = await UserService.getUserProfile(req.params.userId);
  return res.status(200).json(user);
});

userRouter.put(
  '/avatar',
  uploadMiddleware([{ name: 'avatar', maxCount: 1 }]),
  async (req, res) => {
    await UserService.updateAvatar(req.userId, req.files[0].path);
    return res.status(200).json({ message: 'Avatar updated successfully' });
  },
);

userRouter.delete('/', async (req, res) => {
  await UserService.deleteAccount(req.userId);
  return res.status(200).json({ message: 'Account deleted successfully' });
});

userRouter.delete('/:userId', authorize(RoleEnum.Admin), async (req, res) => {
  await UserService.deleteAccount(req.params.userId);
  return res.status(200).json({ message: 'Account deleted successfully' });
});
