import Joi from 'joi';
import {
  username,
  email,
  phone,
  gender,
  birth_date,
  password,
  ln,
} from './fields.js';

export const signupSchema = Joi.object({
  body: Joi.object({
    username,
    email,
    phone,
    gender,
    birth_date,
    password,
    confirm_password: password.valid(Joi.ref('password')).messages({
      'any.only': 'Passwords do not match',
    }),
  })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }).required(),

  params: Joi.object({}).required(), // must expect nothing from the user
});
