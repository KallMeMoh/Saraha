import { Router } from 'express';
import * as AuthService from './auth.service.js';
import { successResponse } from '../../common/response/response.js';

export const authRouter = Router();

// I don't like this >:(

authRouter.post('/signup', async (req, res) => {
  const data = await AuthService.signup(req.body);
  return successResponse({ res, statusCode: 201 });
});

authRouter.post('/login', async (req, res) => {
  const token = await AuthService.login(req.body);
  return successResponse({ res, statusCode: 200, data: { token } });
});
