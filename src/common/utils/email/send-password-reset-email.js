import { transporter } from './index.js';
import { passwordResetTemplate } from './password-reset.template.js';

export const sendPasswordResetEmail = async (email, link) => {
  await transporter.sendMail({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset your SarahaClone password',
    html: passwordResetTemplate(link),
  });
};
