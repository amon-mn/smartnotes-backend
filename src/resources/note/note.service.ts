import { Note, PrismaClient } from "../../generated/prisma";
import { CreateNoteDto, UpdateNoteDto } from "./note.types";

const prisma = new PrismaClient();

export async function getAllNotes(userId: string): Promise<Note[]> {
  return await prisma.note.findMany({ where: { userId } });
}

export async function getNoteById(id: string, userId: string): Promise<Note | null> {
  return await prisma.note.findFirst({ where: { id, userId } });
}

export async function createNote(dto: CreateNoteDto, userId: string): Promise<Note> {
  return await prisma.note.create({
    data: { ...dto, userId },
  });
}

export async function updateNote(id: string, dto: UpdateNoteDto, userId: string): Promise<Note | null> {
  const result = await prisma.note.updateMany({
    where: { id, userId }, 
    data: dto,
  });

  if (result.count === 0) return null;

  return await prisma.note.findUnique({ where: { id } });
}

export async function deleteNote(id: string, userId: string): Promise<boolean> {
  const result = await prisma.note.deleteMany({
    where: { id, userId }
  });

  return result.count > 0;
}