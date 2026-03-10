import { Router } from 'express';
import * as UserService from './user.service.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { uploadAvatar } from '../../middlewares/upload.js';
import { validate } from '../../middlewares/validation.js';
import { IDSchema } from '../../common/validation/id.schema.js';
import { avatarSchema } from '../../common/validation/avatar.schema.js';

export const userRouter = Router();

// and this as well! :)

userRouter.get('/me', async (req, res) => {
  const user = await UserService.getUserProfile(req.userId);
  return res.status(200).json(user);
});

userRouter.get(
  '/:id',
  authorize(RoleEnum.Admin),
  validate(IDSchema),
  async (req, res) => {
    const user = await UserService.getUserProfile(req.params.id);
    return res.status(200).json(user);
  },
);

userRouter.put(
  '/avatar',
  uploadAvatar.fields([{ name: 'avatar', maxCount: 1 }]),
  validate(avatarSchema),
  async (req, res) => {
    await UserService.updateAvatar(req.userId, req.files.avatar[0].filename);
    return res.status(200).json({ message: 'Avatar updated successfully' });
  },
);

userRouter.delete('/', async (req, res) => {
  await UserService.deleteAccount(req.userId);
  return res.status(200).json({ message: 'Account deleted successfully' });
});

userRouter.delete(
  '/:id',
  authorize(RoleEnum.Admin),
  validate(IDSchema),
  async (req, res) => {
    await UserService.deleteAccount(req.params.id);
    return res.status(200).json({ message: 'Account deleted successfully' });
  },
);
