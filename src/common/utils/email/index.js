import { createTransport } from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from '../../../config/index.js';

export const transporter = createTransport({
  host: 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
