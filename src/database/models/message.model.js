import { model, Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const MessageModel = model('Message', messageSchema);
