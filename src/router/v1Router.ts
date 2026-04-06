import { Router } from 'express';
import noteRouter from '../resources/note/note.router';
import authRouter from '../resources/auth/auth.router'; // 1. DESCOMENTE ESTA LINHA

const router = Router();

// Todas as rotas de notas agora começam com /v1/notes
router.use('/notes', noteRouter);

router.use('/auth', authRouter); 

export default router;