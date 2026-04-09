import jwt from 'jsonwebtoken';
import { TokenType } from '../common/enums/token.enum.js';
import { getSignature } from '../common/utils/security/signature.js';
import { HttpError } from '../common/errors/http.error.js';
import RedisRepo from '../database/redis.repository.js';

export const authenticate =
  (strict = true, tokenType = TokenType.Access) =>
  async (req, res, next) => {
    const fail = (message) => {
      if (!strict) next();
      else throw new HttpError(401, message);
    };

    const authHeader = req.headers?.authorization;
    if (!authHeader) return fail(`Missing authorization header`);

    if (!authHeader.startsWith('Bearer ')) return fail('Invalid bearer key');

    const token = authHeader.split(' ')[1]?.trim();
    if (!token) return fail('Missing Token');

    try {
      const { aud } = jwt.decode(token) ?? {};
      const [role, type] = aud ?? [];

      if (!role || !type || type !== tokenType)
        return fail('Invalid or malformed token');

      const signature = getSignature(role)[`${tokenType}Signature`];
      if (!signature) return fail('Invalid or malformed token');

      const { sub, jti } = jwt.verify(token, signature);

      if (await RedisRepo.get(`jwt:blacklist:${jti}`))
        return fail('Invalid or malformed token');

      req.userId = sub;
      req.tokenId = jti;
      req.userRole = role;
      next();
    } catch (err) {
      if (err instanceof HttpError) throw err;
      return fail('Invalid or malformed token');
    }
  };
