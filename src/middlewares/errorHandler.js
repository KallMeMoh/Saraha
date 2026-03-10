import Joi from 'joi';
import { HttpError } from '../common/errors/HttpError.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof Joi.ValidationError) {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.details.map((d) => ({
        field: d.path.join('.'),
        error: d.message,
      })),
    });
  } else if (err instanceof MulterError) {
    return res.status(422).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
