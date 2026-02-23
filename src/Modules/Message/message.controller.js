import { Router } from 'express';
import * as MessageService from './message.service.js';
import {
  notFoundException,
  successResponse,
} from '../../common/response/response.js';

export const messageRouter = Router();

// I don't like this also >:(

messageRouter.get('/', async (req, res) => {
  const user = await MessageService.getUserMessages(req.userId);
  return successResponse({ res, statusCode: 200, data: user });
});

messageRouter.delete('/:messageId', async (req, res) => {
  const deleted = await MessageService.deleteMessage(
    req.userId,
    req.params.messageId,
  );

  if (deleted > 0)
    return successResponse({ res, statusCode: 200, data: message });

  return notFoundException('Failed to delete message');
});
