import { createTransport } from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../../../config/index.js';
import { otpTemplate } from './OTPTemplate.js';
import { randomInt } from 'crypto';
import RedisRepo from '../../../DB/redis.repository.js';

const transporter = createTransport({
  host: 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendOTPEmail = async (user) => {
  const code = randomInt(100_000, 999_999).toString();

  await RedisRepo.set(`otp:user:${user._id}`, `${code}`, {
    expiration: {
      type: 'EX',
      time: 300,
    },
  });

  await transporter.sendMail({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Verify your Saraha account',
    html: otpTemplate(code),
  });
};
