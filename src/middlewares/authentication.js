import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/config.service.js';
import { unauthorizedException } from '../common/response/response.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedException('No token provided');
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return unauthorizedException('Invalid or malformed token');
  }

  req.userId = decoded.sub;
  next();
};
