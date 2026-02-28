import jwt from 'jsonwebtoken';
import {
  badRequestException,
  unauthorizedException,
} from '../common/response/response.js';
import { TokenType } from '../common/enums/token.enum.js';
import { getSignature } from '../common/utils/security/signature.js';

export const authentication =
  (tokenType = TokenType.Access) =>
  (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return badRequestException('Invalid bearer key');
    }

    const token = authHeader.split(' ')[1];
    let verified;
    try {
      const { aud } = jwt.decode(token);
      const [role, type] = aud;

      if (type !== tokenType)
        return unauthorizedException('Invalid or malformed token');

      const signature = getSignature(role)[`${tokenType}Signature`];

      verified = jwt.verify(token, signature);
    } catch (err) {
      return unauthorizedException('Invalid or malformed token');
    }

    // I am definitely  not making a db query here
    req.userId = verified.sub;
    req.userRole = role;
    next();
  };
