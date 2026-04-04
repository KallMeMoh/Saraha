import { HttpError } from '../../common/errors/HttpError.js';
import { decrypt } from '../../common/utils/security/decrypt.js';
import DatabaseRepo from '../../database/mongoose.repository.js';
import { UserModel } from '../../database/models/user.model.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { ROOT_DIR } from '../../config/index.js';
import { sendOTPEmail } from '../../common/utils/email/send-otp-email.js';
import RedisRepo from '../../database/redis.repository.js';

export const getUserProfile = async (userId) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
    select: '-hashed_password',
  });

  if (!user) throw new HttpError(404, "User doesn't exist");

  user.visits++;
  await user.save();

  const {
    _id,
    phone,
    birth_date,
    genderValue,
    roleValue,
    provider,
    updatedAt,
    __v,
    visits,
    ...userObj
  } = user.toObject();

  return {
    ...userObj,
    ...(user.roleValue === RoleEnum.Admin
      ? { visits, phone: decrypt(phone) }
      : {}),
  };
};

export const request2FAActivation = async (userId) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.verified) throw new HttpError(409, 'Account already verified');

  const codeExists = await RedisRepo.exists(
    `user:2fa-activation-code:${user._id}`,
  );
  if (codeExists) return;

  await sendOTPEmail(
    `user:2fa-activation-code:${user._id}`,
    user,
    'Your SarahaClone 2FA setup code',
    'enable two-factor authentication',
  );
};

export const activate2FA = async (userId, code) => {
  const [user, otp] = await Promise.all([
    DatabaseRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    RedisRepo.get(`user:2fa-activation-code:${userId}`),
  ]);

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.verified) throw new HttpError(409, 'Account already verified');
  if (otp !== code)
    throw new HttpError(401, 'Invalid Code, please try again later');

  await RedisRepo.del(`user:2fa-activation-code:${userId}`);
  user.has2FA = true;
  await user.save();
};

export const requestVerificationCode = async (userId) => {
  const [user, otpExists] = await Promise.all([
    DatabaseRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    RedisRepo.exists(`user:verification-code:${userId}`),
  ]);
  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.verified) throw new HttpError(409, 'Account already verified');
  if (otpExists) return;

  await sendOTPEmail(
    `user:verification-code:${userId}`,
    user,
    'Your Account Verification Code',
    'verify your email address',
  );
};

export const verifyUserAccount = async (userId, code) => {
  const [user, otp] = await Promise.all([
    DatabaseRepo.findOne({ Model: UserModel, filters: { _id: userId } }),
    RedisRepo.get(`user:verification-code:${userId}`),
  ]);

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.verified) throw new HttpError(409, 'Account already verified');
  if (otp !== code)
    throw new HttpError(401, 'Invalid Code, please try again later');

  await RedisRepo.del(`user:user-verification:${userId}`);
  user.verified = true;
  await user.save();
};

export const updateAvatar = async (userId, path) => {
  const { matchedCount, modifiedCount } = await DatabaseRepo.updateOne({
    Model: UserModel,
    filters: { _id: userId },
    updates: [
      {
        $set: {
          gallery: {
            $concatArrays: ['$gallery', ['$avatar']],
          },
          avatar: `uploads/avatars/${path}`,
        },
      },
    ],
    options: {
      updatePipeline: true,
    },
  });

  if (!matchedCount) throw new HttpError(404, 'Account does not exist');
  if (!modifiedCount) throw new HttpError(400, "Couldn't update avatar");
};

export const deleteAvatar = async (userId) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (!user.avatar) return;

  const avatarPath = join(ROOT_DIR, user.avatar);

  user.avatar = null;
  await user.save();

  await unlink(avatarPath);
};

export const updateCover = async (userId, paths) => {
  const user = await DatabaseRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.covers.length + paths.length > 2)
    throw new HttpError(422, 'Invalid number of cover images');

  await DatabaseRepo.updateOne({
    Model: UserModel,
    filters: { _id: userId },
    updates: {
      $push: {
        covers: {
          $each: paths.map((file) => `uploads/covers/${file.filename}`),
        },
      },
    },
  });
};

export const deleteAccount = async (userId) => {
  const { deletedCount } = await DatabaseRepo.deleteOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (deletedCount < 1) throw new HttpError(404, 'Account does not exist');
};
