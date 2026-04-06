// src/resources/note/note.types.ts
import { Note } from "../../generated/prisma"; // Caminho relativo para onde está sua pasta generated

// O que precisamos para CRIAR (Título e Conteúdo)
export type CreateNoteDto = Pick<Note, "title" | "content">;

// O que podemos ATUALIZAR (Geralmente igual ao Create, ou campos opcionais)
export type UpdateNoteDto = Partial<Pick<Note, "title" | "content">>;