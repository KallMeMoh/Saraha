import Joi from 'joi';
import { email, ln } from './fields.js';

export const forgetPasswordSchema = Joi.object({
  body: Joi.object({ email }).required().messages({
    'any.required': 'Missing request body',
  }),

  query: Joi.object({ ln }),

  params: Joi.object({}),
});
