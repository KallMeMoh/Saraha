import { createDecipheriv } from 'crypto';
import {
  ENCRYPTION_ALGO,
  ENCRYPTION_KEY,
} from '../../../../config/config.service.js';

const KEY = Buffer.from(ENCRYPTION_KEY, 'hex');

export function decrypt(
  encryptedData,
  inputEncoding = 'hex',
  outputEncoding = 'utf8',
) {
  const parts = encryptedData.split(':');
  if (!parts || parts.length !== 3)
    throw new Error('Wrong format for encryptedData');

  const [iv, authTag, ciphertext] = parts;

  const decipher = createDecipheriv(
    ENCRYPTION_ALGO,
    KEY,
    Buffer.from(iv, inputEncoding),
  );
  decipher.setAuthTag(Buffer.from(authTag, inputEncoding));

  let decrypted = decipher.update(ciphertext, inputEncoding, outputEncoding);
  decrypted += decipher.final(outputEncoding);

  return decrypted;
}
