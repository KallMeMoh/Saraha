import {
  badRequestException,
  notFoundException,
} from '../../common/response/response.js';
import { decrypt } from '../../common/utils/security/decrypt.js';
import DBRepo from '../../DB/db.repository.js';
import { MessageModel } from '../../DB/Models/Message.model.js';
import { UserModel } from '../../DB/Models/User.model.js';

export const getUserProfile = async (userId) => {
  const user = await DBRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
    select: '-hashed_password',
  });

  if (!user) return notFoundException("User doesn't exist");

  const userObj = user.toObject({ getters: true });
  return { ...userObj, phone: decrypt(userObj.phone) };
};

export const updateAvatar = async (userId, path) => {
  const { matchedCount, modifiedCount } = await DBRepo.updateOne({
    Model: UserModel,
    filters: { _id: userId },
    updates: { $set: { avatar: path } },
  });

  if (!matchedCount) return notFoundException('Account does not exist');
  if (!modifiedCount) return badRequestException("Couldn't update avatar");
};

export const deleteAccount = async (userId) => {
  const { deletedCount } = await DBRepo.deleteOne({
    Model: UserModel,
    filters: { _id: userId },
  });

  if (deletedCount < 1) return notFoundException('Account does not exist');
};
