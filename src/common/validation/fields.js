import Joi from 'joi';
import { GenderEnum } from '../enums/user.enum.js';

export let username = Joi.string()
  .trim()
  .min(3)
  .max(20)
  .pattern(/^[A-Z]/)
  .pattern(/^[a-zA-Z0-9_]+$/, 'special')
  .required()
  .messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 20 characters',
    'string.pattern.base': 'Username must start with an uppercase letter',
    'string.pattern.name': 'Username can only include _ special character',
    'any.required': 'Missing username field',
  });

export let email = Joi.string()
  .trim()
  .lowercase()
  .email()
  .max(254)
  .required()
  .messages({
    'string.email': 'Invalid email address',
    'string.max': 'Invalid email address',
    'any.required': 'Missing email field',
  });

export let password = Joi.string()
  .min(8)
  .max(72)
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[0-9]/, 'number')
  .pattern(/[^a-zA-Z0-9]/, 'special')
  .required()
  .messages({
    'string.min': 'Passwords must be at least 8 characters',
    'string.max': 'Passwords must be at most 72 characters',
    'string.pattern.name':
      'Passwords must contain at least one {{#name}} character',
    'any.required': 'Missing password fields',
  });

export let phone = Joi.string()
  .trim()
  .pattern(/^\+[1-9]\d{1,14}$/)
  .required()
  .messages({
    'string.pattern.base':
      'Phone must be a valid international number (e.g. +1234567890)',
    'any.required': 'Missing phone field',
  });

export let birth_date = Joi.date()
  .custom((value, helpers) => {
    const minAge = 16;
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - minAge);

    if (value > cutoff) return helpers.error('date.minAge');

    return value;
  })
  .required()
  .messages({
    'date.base': 'Invalid birth date',
    'date.minAge': 'You must be at least 16 years old',
  });

export let gender = Joi.string()
  .trim()
  .valid(...Object.keys(GenderEnum))
  .required()
  .messages({
    'any.only': 'Gender must be Male or Female',
    'any.required': 'Missing gender field',
  });

export let content = Joi.string().trim().min(1).max(2000).required().messages({
  'string.min': 'Message cannot be empty',
  'string.max': 'Message cannot exceed 2000 characters',
  'any.required': 'Missing message content',
});

export let recipientId = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/, 'ObjectId')
  .required()
  .messages({
    'string.pattern.name': 'Invalid recipient ID',
    'any.required': 'Missing recipient ID',
  });

export let code = Joi.string()
  .length(6)
  .pattern(/^[0-9]{6}$/)
  .required()
  .messages({
    'string.length': 'OTP must be 6 digits',
    'string.pattern.base': 'OTP must be numeric',
    'any.required': 'Missing OTP code',
  });
