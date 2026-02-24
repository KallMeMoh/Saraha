import jwt from 'jsonwebtoken';
import { notFoundException } from '../../common/response/response.js';
import { decrypt } from '../../common/utils/security/decrypt.js';
import DBRepo from '../../DB/db.repository.js';
import { MessageModel } from '../../DB/Models/Message.model.js';
import { UserModel } from '../../DB/Models/User.model.js';
import { JWT_SECRET } from '../../../config/config.service.js';

export const getUserProfile = async (userId) => {
  const user = await DBRepo.findOne({
    Model: UserModel,
    filters: { _id: userId },
    select: '-hashed_password',
  });

  if (!user) return notFoundException("User doesn't exist");

  const userObj = user.toObject();
  return { ...userObj, phone: decrypt(userObj.phone) };
};

export const createMessage = async (req, bodyData = {}) => {
  const recipient = await DBRepo.exists({
    Model: UserModel,
    filters: { _id: req.params.userId },
  });
  if (!recipient?._id) notFoundException("Recipient doesn't exist");

  let senderId = null;
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const { sub = null } = jwt.verify(token, JWT_SECRET);
      senderId = sub;
    } catch (_) {}
  }

  const message = await DBRepo.create({
    Model: MessageModel,
    data: {
      senderId,
      receiverId: recipient._id,
      content: bodyData.content,
    },
  });

  return message;
};
