import Joi from 'joi';
import { password, ln } from './fields.js';

export const changePasswordSchema = Joi.object({
  body: Joi.object({
    old_password: password,
    new_password: password.invalid(Joi.ref('old_password')).messages({
      'any.invalid': 'New Password must be different from old password',
    }),
    confirm_new_password: password.valid(Joi.ref('new_password')).messages({
      'any.only': 'Passwords do not match',
    }),
  })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }),

  params: Joi.object({}),
});
