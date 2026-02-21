import { Router } from 'express';
import { loginService, registerService } from './auth.service';

export const authRouter = Router();

authRouter.post('/register', registerService);

authRouter.post('/login', loginService);
