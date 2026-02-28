import { notFoundException } from '../../common/response/response.js';
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

export const createMessage = async (authorId, receiverId, content) => {
  const recipient = await DBRepo.exists({
    Model: UserModel,
    filters: { _id: receiverId },
  });
  if (!recipient?._id) notFoundException("Recipient doesn't exist");

  const message = await DBRepo.create({
    Model: MessageModel,
    data: {
      receiverId: recipient._id,
      content,
      ...(authorId ? { senderId: authorId } : {}),
    },
  });

  return message;
};
