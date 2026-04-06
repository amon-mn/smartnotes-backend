import { Request, Response, RequestHandler } from 'express';
import * as noteService from './note.service';
import { CreateNoteDto, UpdateNoteDto } from './note.types';

interface NoteParams {
  id: string;
}

const index: RequestHandler = async (req, res) => {
  try {
    const userId = req.session.uid;

    // Se o middleware isAuth falhar ou não estiver na rota, o controller barra aqui
    if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });

    const notes = await noteService.getAllNotes(userId);
    
    // IMPORTANTE: Se notes for null/undefined, retorna []. 
    // Isso evita o erro "notas.map is not a function" no front.
    return res.status(200).json(notes || []); 
  } catch (error) {
    // Se der erro no banco, o front espera um array ou redirecionamento.
    // Retornar 500 faz o 'catch' do professor te jogar pro login.
    return res.status(500).json({ error: "Erro ao listar notas" });
  }
};

const create: RequestHandler = async (req, res) => {
  try {
    const dto = req.body as CreateNoteDto; 
    const userId = req.session.uid!;
    
    const newNote = await noteService.createNote(dto, userId);
    return res.status(201).json(newNote);
  } catch (error) {
    // 422 deve ser tratado pelo middleware de Joi. 500 aqui é falha de banco.
    return res.status(500).json({ error: "Erro ao criar nota" });
  }
};

const read: RequestHandler<NoteParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.uid!;
    
    const note = await noteService.getNoteById(id, userId);
    
    // Requisito 6.4 (IDOR): Retornar 404 se não encontrar OU se for de outro usuário
    if (!note) return res.status(404).json({ error: "Nota não encontrada" });
    
    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar nota" });
  }
};

const update: RequestHandler<NoteParams> = async (req, res) => {
  try {
    const { id } = req.params; 
    const dto = req.body as UpdateNoteDto;
    const userId = req.session.uid!;
    
    const updatedNote = await noteService.updateNote(id, dto, userId);
    
    // Requisito 6.4: Se o update retornar null (porque não era do usuário), 404.
    if (!updatedNote) return res.status(404).json({ error: "Nota não encontrada" });
    
    return res.status(200).json(updatedNote);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar nota" });
  }
};

const remove: RequestHandler<NoteParams> = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.uid!;
    
    const success = await noteService.deleteNote(id, userId);
    
    if (!success) return res.status(404).json({ error: "Nota não encontrada" });
    
    // Requisito 4.2: 204 No Content para exclusão bem sucedida
    return res.status(204).send(); 
  } catch (error) {
    return res.status(500).json({ error: "Erro ao remover nota" });
  }
};

export default { index, create, read, update, remove };