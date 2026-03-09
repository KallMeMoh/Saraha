import { Router } from 'express';
import * as MessageService from './message.service.js';
import { authenticate } from '../../middlewares/authentication.js';
import { upload } from '../../middlewares/upload.js';

export const messageRouter = Router();

// I am slowly starting to like this also :)

messageRouter.get('/', authenticate(), async (req, res) => {
  const messages = await MessageService.getUserMessages(req.userId);
  return res.status(200).json({ messages });
});

messageRouter.post(
  '/:receiverId',
  authenticate(false),
  upload.fields([{ name: 'attachments', maxCount: 10 }]),
  async (req, res) => {
    const message = await MessageService.createMessage(
      req.userId,
      req.params.receiverId,
      req.body.content,
      req.files,
    );
    return res.status(200).json({ message });
  },
);

messageRouter.delete('/:messageId', authenticate(), async (req, res) => {
  await MessageService.deleteMessage(req.userId, req.params.messageId);
  return res.status(200).json({ message: 'Message deleted successfully' });
});
