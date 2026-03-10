import Joi from 'joi';
import { content, file, id, ln } from './fields.js';

export const messageSchema = Joi.object({
  body: Joi.object({ content })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }),

  params: Joi.object({ id }),

  files: Joi.object({
    attachments: Joi.array().optional().items(file),
  })
    .required()
    .messages({
      'any.required': 'Missing multipart form-data',
    }),
});
