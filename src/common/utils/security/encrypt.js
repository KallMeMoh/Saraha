import { createCipheriv, randomBytes } from 'crypto';
import {
  ENCRYPTION_ALGO,
  ENCRYPTION_KEY,
} from '../../../../config/config.service.js';

const KEY = Buffer.from(ENCRYPTION_KEY, 'hex');

export function encrypt(data, inputEncoding = 'utf8', outputEncoding = 'hex') {
  const iv = randomBytes(16);

  const cipher = createCipheriv(ENCRYPTION_ALGO, KEY, iv);

  let encrypted = cipher.update(data, inputEncoding, outputEncoding);
  encrypted += cipher.final(outputEncoding);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString(outputEncoding),
    authTag.toString(outputEncoding),
    encrypted,
  ].join(':');
}
