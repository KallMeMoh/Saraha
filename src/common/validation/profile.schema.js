import Joi from 'joi';
import { ln, userId } from './fields.js';

export const profileSchema = Joi.object({
  body: Joi.object({}).optional(),

  query: Joi.object({ ln }),

  params: Joi.object({ userId }),
});
