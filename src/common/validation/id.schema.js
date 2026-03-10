import Joi from 'joi';
import { ln, id } from './fields.js';

export const IDSchema = Joi.object({
  body: Joi.object({}).optional(),

  query: Joi.object({ ln }),

  params: Joi.object({ id }),

  files: Joi.object({}),
});
