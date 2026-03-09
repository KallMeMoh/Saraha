import { HttpError } from '../../common/errors/HttpError.js';
import DBRepo from '../../DB/db.repository.js';
import { MessageModel } from '../../DB/Models/Message.model.js';
import { UserModel } from '../../DB/Models/User.model.js';

export const getUserMessages = async (userId) => {
  const { _id } = await DBRepo.exists({
    Model: UserModel,
    filters: { _id: userId },
  });
  if (!_id) throw new HttpError(404, 'Account does not exist');

  const messages =
    (await DBRepo.find({
      Model: MessageModel,
      filters: { senderId: _id },
    })) || [];

  return messages;
};

export const createMessage = async (
  authorId,
  receiverId,
  content,
  attachments = [],
) => {
  const recipient = await DBRepo.exists({
    Model: UserModel,
    filters: { _id: receiverId },
  });
  if (!recipient?._id) throw new HttpError(404, "Recipient doesn't exist");

  const message = await DBRepo.create({
    Model: MessageModel,
    data: {
      receiverId: recipient._id,
      content,
      attachments: attachments.map((file) => file.path),
      ...(authorId ? { senderId: authorId } : {}),
    },
  });

  return message;
};

export const deleteMessage = async (userId, messageId) => {
  const { deletedCount } = await DBRepo.deleteOne({
    Model: MessageModel,
    filters: {
      _id: messageId,
      senderId: userId,
    },
  });

  if (!deletedCount) throw new HttpError(404, 'Message not found');

  return deletedCount;
};
