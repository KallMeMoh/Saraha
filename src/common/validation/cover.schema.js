import Joi from 'joi';
import { ln, file } from './fields.js';

export const coverSchema = Joi.object({
  body: Joi.object({}).unknown(true),

  query: Joi.object({ ln }),

  params: Joi.object({}),

  files: Joi.object({
    cover: Joi.array().min(1).items(file).required(),
  })
    .required()
    .messages({
      'any.required': 'Please upload at least 1 cover picture',
    }),
});
