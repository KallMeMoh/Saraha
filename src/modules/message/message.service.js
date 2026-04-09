import { HttpError } from '../../common/errors/http.error.js';
import DatabaseRepo from '../../database/mongoose.repository.js';
import { MessageModel } from '../../database/models/message.model.js';
import { UserModel } from '../../database/models/user.model.js';

export const getUserMessages = async (userId) => {
  const exist = await DatabaseRepo.exists({
    Model: UserModel,
    filters: { _id: userId },
  });
  if (!exist) throw new HttpError(404, 'Account does not exist');

  const messages =
    (await DatabaseRepo.find({
      Model: MessageModel,
      filters: { receiverId: exist._id },
    })) || [];

  return messages;
};

export const createMessage = async (
  senderId,
  receiverId,
  content,
  attachments = [],
) => {
  const [recipient, sender] = await Promise.all([
    DatabaseRepo.exists({
      Model: UserModel,
      filters: { _id: receiverId },
    }),
    DatabaseRepo.exists({
      Model: UserModel,
      filters: { _id: senderId },
    }),
  ]);
  if (!recipient?._id) throw new HttpError(404, "Recipient doesn't exist");
  if (sender && recipient._id.equals(sender._id))
    throw new HttpError(400, 'Sending a message to yourself?');

  const message = await DatabaseRepo.create({
    Model: MessageModel,
    data: {
      receiverId: recipient._id,
      content,
      attachments: attachments.map(
        (file) => `uploads/attachments/${file.filename}`,
      ),
      ...(sender ? { senderId: sender._id } : {}),
    },
  });

  return message;
};

export const deleteMessage = async (userId, messageId) => {
  const { deletedCount } = await DatabaseRepo.deleteOne({
    Model: MessageModel,
    filters: {
      _id: messageId,
      senderId: userId,
    },
  });

  if (!deletedCount) throw new HttpError(404, 'Message not found');

  return deletedCount;
};
