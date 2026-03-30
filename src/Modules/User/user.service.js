import { HttpError } from '../../common/errors/HttpError.js';
import { decrypt } from '../../common/utils/security/decrypt.js';
import DBRepo from '../../DB/mongoose.repository.js';
import { UserModel } from '../../DB/Models/User.model.js';
import { RoleEnum } from '../../common/enums/user.enum.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { ROOT_DIR } from '../../config/index.js';

export const getUserProfile = async (userId) => {
  const user = await DBRepo.findOne({
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

export const updateAvatar = async (userId, path) => {
  const { matchedCount, modifiedCount } = await DBRepo.updateOne({
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
  const user = await DBRepo.findOne({
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
  const user = await DBRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (!user) throw new HttpError(404, 'Account does not exist');
  if (user.covers.length + paths.length > 2)
    throw new HttpError(422, 'Invalid number of cover images');

  await DBRepo.updateOne({
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
  const { deletedCount } = await DBRepo.deleteOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (deletedCount < 1) throw new HttpError(404, 'Account does not exist');
};
