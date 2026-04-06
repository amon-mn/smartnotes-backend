import { Router } from 'express';
import v1Router from './v1Router';

const router = Router();

// Todas as rotas do v1Router agora terão o prefixo /v1 (Requisito 4 do PDF)
router.use('/v1', v1Router);

export default router;