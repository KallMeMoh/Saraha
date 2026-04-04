import { randomInt } from 'node:crypto';
import { createTransport } from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../../../config/index.js';
import { otpTemplate } from './otp.template.js';
import RedisRepo from '../../../database/redis.repository.js';

const transporter = createTransport({
  host: 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendOTPEmail = async (key, user, subject, reason) => {
  const code = randomInt(100_000, 999_999).toString();
  await RedisRepo.set(`${key}`, `${code}`, {
    expiration: {
      type: 'EX',
      value: 300,
    },
  });

  await transporter.sendMail({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject,
    html: otpTemplate(code, reason),
  });

  return code; // in case I need it
};
