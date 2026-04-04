import { Router } from 'express';
import * as MessageService from './message.service.js';
import { authenticate } from '../../middlewares/authentication.js';
import { uploadAttachment } from '../../middlewares/upload.js';
import { validate } from '../../middlewares/validation.js';
import { IDSchema } from '../../common/validation/id.schema.js';
import { messageSchema } from '../../common/validation/message.schema.js';

export const messageRouter = Router();

// I am slowly starting to like this also :)

messageRouter.get('/', authenticate(), async (req, res) => {
  const messages = await MessageService.getUserMessages(req.userId);
  return res.status(200).json(messages);
});

messageRouter.post(
  '/:id',
  authenticate(false),
  uploadAttachment.fields([{ name: 'attachments', maxCount: 10 }]),
  validate(messageSchema),
  async (req, res) => {
    const message = await MessageService.createMessage(
      req.userId,
      req.params.id,
      req.body.content,
      req.files.attachments,
    );
    return res.status(200).json({ message });
  },
);

messageRouter.delete(
  '/:id',
  authenticate(),
  validate(IDSchema),
  async (req, res) => {
    await MessageService.deleteMessage(req.userId, req.params.id);
    return res.status(200).json({ message: 'Message deleted successfully' });
  },
);
