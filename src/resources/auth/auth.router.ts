import { Router } from 'express';
import authController from './auth.controller';
import isAuth from '../../middlewares/isAuth';
import validateBody from '../../middlewares/validateBody';
import { signupSchema, loginSchema } from './auth.schema';

const router = Router();

// POST /v1/auth/signup -> Valida o body e cria conta
router.post('/signup', validateBody(signupSchema), authController.signup);

// POST /v1/auth/login -> Valida o body e inicia sessão
router.post('/login', validateBody(loginSchema), authController.login);

// POST /v1/auth/logout -> Rota protegida, encerra sessão
router.post('/logout', isAuth, authController.logout);

export default router;