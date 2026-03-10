import Joi from 'joi';
import { ln, file } from './fields.js';

export const avatarSchema = Joi.object({
  body: Joi.object({}).unknown(true),

  query: Joi.object({ ln }),

  params: Joi.object({}),

  files: Joi.object({
    avatar: Joi.array().min(1).items(file),
  }),
});
