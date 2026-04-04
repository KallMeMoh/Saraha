import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { TokenType } from '../../enums/token.enum.js';
import { getSignature } from './signature.js';

export const generateTokens = (userId, userRole, jti = undefined) => {
  const jwtid = jti ?? randomUUID();
  const { accessSignature, refreshSignature } = getSignature(userRole);

  const accessToken = jwt.sign({ sub: userId }, accessSignature, {
    audience: [userRole, TokenType.Access], // peak self reflection: the role is compared in authorization middleware. it's value is dependant on a DB lookup in token rotation endpoint
    expiresIn: '15m',
    jwtid,
  });

  // shouldn't refresh token be an httpOnly
  // cookie and not sent in response body?
  const refreshToken = jwt.sign({ sub: userId }, refreshSignature, {
    audience: [userRole, TokenType.Refresh], // peak self reflection: the role here is only used for sig. selection in auth middleware, IT IS NOT A SOURCE OF TRUTH
    expiresIn: '1y',
    jwtid,
  });

  return { accessToken, refreshToken };
};
