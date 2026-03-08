import Joi from 'joi';
import { email, password, ln } from './fields.js';

export const loginSchema = Joi.object({
  body: Joi.object({ email, password })
    .required()
    .messages({ 'any.required': 'Missing request body' }),

  query: Joi.object({ ln }).required(),

  params: Joi.object({}).required(), // must expect nothing from the user
});
