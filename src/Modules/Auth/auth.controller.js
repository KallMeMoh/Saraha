import { Router } from 'express';
import * as AuthService from './auth.service.js';
import { authenticate } from '../../middlewares/authentication.js';
import { TokenType } from '../../common/enums/token.enum.js';
import { validate } from '../../middlewares/validation.js';
import { loginSchema } from '../../common/validation/login.schema.js';
import { signupSchema } from '../../common/validation/signup.schema.js';
import { OTPSchema } from '../../common/validation/otp.schema.js';

export const authRouter = Router();

// I am slowly starting to like this :)

authRouter.post('/signup', validate(signupSchema), async (req, res) => {
  await AuthService.signup(req.body);
  return res.status(201).json({ message: 'Account created successfully' });
});

authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const tokens = await AuthService.login(req.body);
  return res.status(200).json({ message: 'Logged in successfully', ...tokens });
});

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
    const accessToken = await AuthService.rotateToken(req.userId);
    return res
      .status(200)
      .json({ message: 'Token refreshed successfully', accessToken });
  },
);

authRouter.post('/otp/resend', authenticate(), async (req, res) => {
  await AuthService.resendOTP(req.userId);
  return res.status(200).json({ message: 'OTP code emailed successfully' });
});

authRouter.post(
  '/otp/verify',
  validate(OTPSchema),
  authenticate(),
  async (req, res) => {
    await AuthService.verifyOTP(req.userId, req.body?.otp);
    return res
      .status(200)
      .json({ message: 'Account has been verified successfully' });
  },
);
