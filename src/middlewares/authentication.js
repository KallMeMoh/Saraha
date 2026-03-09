import jwt from 'jsonwebtoken';
import { TokenType } from '../common/enums/token.enum.js';
import { getSignature } from '../common/utils/security/signature.js';
import { HttpError } from '../common/errors/HttpError.js';

export const authenticate =
  (strict = true, tokenType = TokenType.Access) =>
  (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      if (strict) throw new HttpError(401, `Missing ${tokenType} token`);
      return next();
    }

    if (!authHeader.startsWith('Bearer ')) {
      if (strict) throw new HttpError(401, 'Invalid bearer key');
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { aud } = jwt.decode(token);
    const [role, type] = aud;

    let verified;
    try {
      if (type !== tokenType) {
        if (strict) throw new HttpError(401, 'Invalid or malformed token');
        return next();
      }

      const signature = getSignature(role)[`${tokenType}Signature`];

      verified = jwt.verify(token, signature);
    } catch (err) {
      if (strict) throw new HttpError(401, 'Invalid or malformed token');
      return next();
    }

    // I am definitely not making a db query here
    req.userId = verified.sub;
    req.userRole = role;
    next();
  };
