import Joi from 'joi';
import { otp, ln } from './fields.js';

export const OTPSchema = Joi.object({
  body: Joi.object({ otp })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }),

  params: Joi.object({}), // must expect nothing from the user
});
