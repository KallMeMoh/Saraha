import { Router } from 'express';
import * as AuthService from './auth.service.js';
import { successResponse } from '../../common/response/response.js';
import { authenticate } from '../../middlewares/authentication.js';
import { TokenType } from '../../common/enums/token.enum.js';

export const authRouter = Router();

// I don't like this >:(

authRouter.post('/signup', async (req, res) => {
  const data = await AuthService.signup(req.body);
  return successResponse({ res, statusCode: 201 });
});

authRouter.post('/login', async (req, res) => {
  const data = await AuthService.login(req.body);
  return successResponse({ res, statusCode: 200, data });
});

authRouter.post(
  '/token/refresh',
  authenticate(true, TokenType.Refresh),
  async (req, res) => {
    const data = await AuthService.rotateToken(req.userId);
    return successResponse({ res, statusCode: 200, data });
  },
);

authRouter.post('/otp/resend', authenticate(), async (req, res) => {
  await AuthService.resendOTP(req.userId);
  return successResponse({ res, statusCode: 200 });
});

authRouter.post('/otp/verify', authenticate(), async (req, res) => {
  await AuthService.verifyOTP(req.userId, req.body?.otp);
  return successResponse({ res, statusCode: 200 });
});
