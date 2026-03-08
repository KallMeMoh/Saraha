import Joi from 'joi';
import { email, password } from './fields.js';

export const loginSchema = Joi.object({
  body: Joi.object({ email, password })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({}).required(), // must expect nothing from the user

  params: Joi.object({}).required(), // same here
});
