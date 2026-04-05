import Joi from 'joi';
import { password, ln, token } from './fields.js';

export const resetPasswordSchema = Joi.object({
  body: Joi.object({
    new_password: password,
    confirm_new_password: password.valid(Joi.ref('password')).messages({
      'any.only': 'Passwords do not match',
    }),
  })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }),

  params: Joi.object({
    token,
  })
    .required()
    .messages({
      'any.required': 'Missing token param',
    }),
});
