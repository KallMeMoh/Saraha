import Joi from 'joi';
import { otp, ln, token } from './fields.js';

export const confirmationSchema = Joi.object({
  body: Joi.object({ otp, token })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }),

  params: Joi.object({}), // must expect nothing from the user
});
