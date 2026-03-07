import { Router } from 'express';
import * as MessageService from './message.service.js';
import {
  notFoundException,
  successResponse,
} from '../../common/response/response.js';
import { authenticate } from '../../middlewares/authentication.js';
import { uploadMiddleware } from '../../middlewares/upload.js';

export const messageRouter = Router();

// I don't like this also >:(

messageRouter.get('/', authenticate(), async (req, res) => {
  const messages = await MessageService.getUserMessages(req.userId);
  return successResponse({ res, statusCode: 200, data: { messages } });
});

messageRouter.post(
  '/:receiverId',
  authenticate(false),
  uploadMiddleware([{ name: 'attachments', maxCount: 10 }]),
  async (req, res) => {
    const message = await MessageService.createMessage(
      req.userId,
      req.params.receiverId,
      req.body.content,
      req.files,
    );
    return successResponse({ res, statusCode: 200, data: { message } });
  },
);

messageRouter.delete('/:messageId', authenticate(), async (req, res) => {
  const deleted = await MessageService.deleteMessage(
    req.userId,
    req.params.messageId,
  );

  if (deleted > 0) return successResponse({ res, statusCode: 200 });

  return notFoundException('Failed to delete message');
});
