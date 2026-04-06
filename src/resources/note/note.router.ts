import { Router } from 'express';
import noteController from './note.controller';
import isAuth from '../../middlewares/isAuth';
import validateBody from '../../middlewares/validateBody';
import { noteSchema } from './note.schema';

const router = Router();

// Todas as rotas abaixo requerem sessão ativa (Requisito 4.2)

// GET /v1/notes -> Lista notas do usuário
router.get('/', isAuth, noteController.index);

// POST /v1/notes -> Cria nota (Valida título/conteúdo)
router.post('/', isAuth, validateBody(noteSchema), noteController.create);

// GET /v1/notes/:id -> Busca uma nota específica
router.get('/:id', isAuth, noteController.read);

// PUT /v1/notes/:id -> Atualiza nota (Valida novos dados)
router.put('/:id', isAuth, validateBody(noteSchema), noteController.update);

// DELETE /v1/notes/:id -> Remove nota
router.delete('/:id', isAuth, noteController.remove);

export default router;