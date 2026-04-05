import { Router } from 'express';
import * as UserService from './user.service.js';
import { authorize } from '../../middlewares/authorization.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { uploadAvatar, uploadCover } from '../../middlewares/upload.js';
import { validate } from '../../middlewares/validation.js';
import { IDSchema } from '../../common/validation/id.schema.js';
import { avatarSchema } from '../../common/validation/avatar.schema.js';
import { authenticate } from '../../middlewares/authentication.js';
import { coverSchema } from '../../common/validation/cover.schema.js';
import { OTPSchema } from '../../common/validation/otp.schema.js';
import { changePasswordSchema } from '../../common/validation/change-passowrd.shcmea.js';

export const userRouter = Router();

// and this as well! :)

userRouter.get('/:id', validate(IDSchema), async (req, res) => {
  const user = await UserService.getUserProfile(req.params.id);
  return res.status(200).json(user);
});

// Note to self: These 2 are for enabling 2FA service
userRouter.post('/2fa/enable', async (req, res) => {
  await UserService.request2FAActivation(req.userId);
  return res.status(200).json({ message: 'Please check your inbox' });
});

userRouter.post('/2fa/verify', validate(OTPSchema), async (req, res) => {
  await UserService.activate2FA(req.userId, req.body.code);
  return res
    .status(200)
    .json({ message: 'Account has been verified successfully' });
});

// Note to self: These 2 are for flipping the verified account flag (user.verified)
userRouter.post('/verification/resend', async (req, res) => {
  await UserService.requestVerificationCode(req.userId);
  return res.status(200).json({ message: 'OTP code emailed successfully' });
});

userRouter.post('/verify', validate(OTPSchema), async (req, res) => {
  await UserService.verifyUserAccount(req.userId, req.body.code);
  return res
    .status(200)
    .json({ message: 'Account has been verified successfully' });
});

userRouter.post(
  '/password/update',
  validate(changePasswordSchema),
  async (req, res) => {
    await UserService.updateUserPassword(req.userId, req.tokenId, req.body);
    return res.status(200).json({ message: 'Password updated successfully' });
  },
);

userRouter.put(
  '/avatar',
  authenticate(),
  uploadAvatar.fields([{ name: 'avatar', maxCount: 1 }]),
  validate(avatarSchema),
  async (req, res) => {
    await UserService.updateAvatar(req.userId, req.files.avatar[0].filename);
    return res.status(200).json({ message: 'Avatar updated successfully' });
  },
);

userRouter.delete('/avatar', authenticate(), async (req, res) => {
  await UserService.deleteAvatar(req.userId);
  return res.status(200).json({ message: 'Avatar removed successfully' });
});

userRouter.patch(
  '/cover',
  authenticate(),
  uploadCover.fields([{ name: 'cover', maxCount: 2 }]),
  validate(coverSchema),
  async (req, res) => {
    await UserService.updateCover(req.userId, req.files.cover);
    return res.status(200).json({ message: 'Cover updated successfully' });
  },
);

userRouter.delete('/', authenticate(), async (req, res) => {
  await UserService.deleteAccount(req.userId);
  return res.status(200).json({ message: 'Account deleted successfully' });
});

userRouter.delete(
  '/:id',
  authorize(RoleEnum.Admin),
  validate(IDSchema),
  authenticate(),
  async (req, res) => {
    await UserService.deleteAccount(req.params.id);
    return res.status(200).json({ message: 'Account deleted successfully' });
  },
);
