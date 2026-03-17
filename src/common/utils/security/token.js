import jwt from 'jsonwebtoken';
import { TokenType } from '../../enums/token.enum.js';
import { getSignature } from './signature.js';

export const generateTokens = (userId, userRole) => {
  const { accessSignature, refreshSignature } = getSignature(userRole);

  const accessToken = jwt.sign({ sub: userId }, accessSignature, {
    audience: [userRole, TokenType.Access],
    expiresIn: '15m',
  });

  // shouldn't refresh token be an httpOnly
  // cookie and not sent in response body?
  const refreshToken = jwt.sign({ sub: userId }, refreshSignature, {
    audience: [userRole, TokenType.Refresh],
    expiresIn: '1y',
  });

  return { accessToken, refreshToken };
};
