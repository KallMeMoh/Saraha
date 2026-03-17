import { createTransport } from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../../../config/index.js';
import { otpTemplate } from './OTPTemplate.js';
import DBRepo from '../../../DB/db.repository.js';
import { OTPModel } from '../../../DB/Models/OTP.model.js';
import { randomInt } from 'crypto';

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
  await DBRepo.create({
    Model: OTPModel,
    data: {
      code,
      authorId: user._id.toString(),
    },
  });
  await transporter.sendMail({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Verify your Saraha account',
    html: otpTemplate(code),
  });
};

// sendOTPEmail({ email: 'kallmemoh@gmail.com' });
