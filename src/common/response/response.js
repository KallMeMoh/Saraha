import { NODE_ENV } from '../../../config/config.service.js';

export const successResponse = ({ res, statusCode = 200, data }) => {
  return res.status(statusCode).json({ statusCode, message: 'Done', data });
};

export const globalErrorHandling = (error, req, res, next) => {
  // outrages, but this is the "right way" according to Route
  return NODE_ENV === 'development'
    ? res
        .status(error.cause?.statusCode ?? 500)
        .json({ errMsg: error.message, error, stack: error.stack })
    : res
        .status(error.cause?.statusCode ?? 500)
        .json({ errMsg: error.message, error, stack: error.stack });
};

export const badRequestException = (msg) => {
  throw new Error(msg, { cause: { statusCode: 400 } });
};

export const unauthorizedException = (msg) => {
  throw new Error(msg, { cause: { statusCode: 401 } });
};

export const notFoundException = (msg) => {
  throw new Error(msg, { cause: { statusCode: 404 } });
};

export const conflictException = (msg) => {
  throw new Error(msg, { cause: { statusCode: 409 } });
};
