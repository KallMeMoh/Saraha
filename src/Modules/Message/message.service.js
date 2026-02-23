import {
  notFoundException,
  unauthorizedException,
} from '../../common/response/response.js';
import DBRepo from '../../DB/db.repository.js';
import { MessageModel } from '../../DB/Models/Message.model.js';
import { UserModel } from '../../DB/Models/User.model.js';

export const getUserMessages = async (userId) => {
  const { _id } = await DBRepo.exists({
    Model: UserModel,
    filters: { _id: userId },
  });
  if (!_id) return notFoundException('Account does not exist');

  const messages =
    (await DBRepo.findMany({
      Model: MessageModel,
      filters: { senderId: _id },
    })) || [];

  return messages;
};

export const deleteMessage = async (userId, messageId) => {
  const message = await DBRepo.findOne({
    Model: MessageModel,
    filters: { _id: messageId },
  });

  if (!message) return notFoundException('Message not found');

  // middleware already prevents unauthorized access and
  // if logged in isn't the sender or message sender was anonymous
  // then can't delete message
  if (message.senderId !== userId || message.senderId)
    return unauthorizedException('You are not the author of this message');

  const { deletedCount } = await message.deleteOne();

  return deletedCount;
};
