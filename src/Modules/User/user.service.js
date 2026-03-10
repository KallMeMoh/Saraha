import { HttpError } from '../../common/errors/HttpError.js';
import { decrypt } from '../../common/utils/security/decrypt.js';
import DBRepo from '../../DB/db.repository.js';
import { UserModel } from '../../DB/Models/User.model.js';

export const getUserProfile = async (userId) => {
  const user = await DBRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
    select: '-hashed_password',
  });

  if (!user) throw new HttpError(404, "User doesn't exist");

  const userObj = user.toObject({ getters: true });
  delete userObj.id;
  return { ...userObj, phone: decrypt(userObj.phone) };
};

export const updateAvatar = async (userId, path) => {
  const { matchedCount, modifiedCount } = await DBRepo.updateOne({
    Model: UserModel,
    filters: { _id: userId },
    updates: { $set: { avatar: `uploads/avatars/${path}` } },
  });

  if (!matchedCount) throw new HttpError(404, 'Account does not exist');
  if (!modifiedCount) throw new HttpError(400, "Couldn't update avatar");
};

export const deleteAccount = async (userId) => {
  const { deletedCount } = await DBRepo.deleteOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (deletedCount < 1) throw new HttpError(404, 'Account does not exist');
};
