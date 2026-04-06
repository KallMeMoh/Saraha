import { Router } from 'express';
import * as AuthService from './auth.service.js';
import { authenticate } from '../../middlewares/authentication.js';
import { TokenType } from '../../common/enums/token.enum.js';
import { validate } from '../../middlewares/validation.js';
import { loginSchema } from '../../common/validation/login.schema.js';
import { signupSchema } from '../../common/validation/signup.schema.js';
import { confirmationSchema } from '../../common/validation/confirmation.schema.js';
import { resetPasswordSchema } from '../../common/validation/reset-passowrd.shcmea.js';
import { forgetPasswordSchema } from '../../common/validation/forget-passowrd.shcmea.js';

export const authRouter = Router();

// I am slowly starting to like this :)

authRouter.post('/signup', validate(signupSchema), async (req, res) => {
  await AuthService.signup(req.body);
  return res.status(201).json({ message: 'Account created successfully' });
});

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const credentials = await AuthService.login(req.body);
  return res.status(200).json({
    message: credentials.requires2FA
      ? 'Please provide your 2FA OTP'
      : 'Logged in successfully',
    credentials,
  });
});

authRouter.post(
  '/login/confirm',
  validate(confirmationSchema),
  async (req, res) => {
    const credentials = await AuthService.confirmLogin(req.body);
    return res
      .status(200)
      .json({ message: 'Logged in successfully', credentials });
  },
);

authRouter.post('/oauth/signup/google', async (req, res) => {
  await AuthService.googleSignup(req.body.idToken);
  return res.status(201).json({ message: 'Account created successfully' });
});

authRouter.post('/oauth/login/google', async (req, res) => {
  const tokens = await AuthService.googleLogin(req.body);
  return res.status(201).json({ message: 'Logged in successfully', ...tokens });
});

authRouter.post(
  '/token/refresh',
  authenticate(true, TokenType.Refresh),
  async (req, res) => {
    const accessToken = await AuthService.rotateToken(req.userId, req.tokenId);
    return res
      .status(200)
      .json({ message: 'Token refreshed successfully', accessToken });
  },
);

authRouter.post(
  '/password/forget',
  validate(forgetPasswordSchema),
  async (req, res) => {
    await AuthService.resetPassword(req.body);
    return res.status(200).json({ message: 'Please check your inbox' });
  },
);

authRouter.post(
  '/password/reset/:token',
  validate(resetPasswordSchema),
  async (req, res) => {
    await AuthService.verifyResetPassword(req.params.token, req.body);
    res.status(200).json({ message: 'Password reset successfully' });
  },
);

authRouter.post('/logout', authenticate(), async (req, res) => {
  await AuthService.blacklistToken(req.tokenId);
  return res.status(200).json({ message: 'Token revoked successfully' });
});
