import { Note } from './types';

let mockNotes: Note[] = [];

export const getNotes = async (): Promise<Note[]> => {
  return [...mockNotes];
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const newNote = {
    ...note,
    id: Date.now().toString(),
  };
  mockNotes.push(newNote);
  return newNote;
};

export const updateNote = async (updatedNote: Note): Promise<Note> => {
  mockNotes = mockNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
  return updatedNote;
};

export const deleteNote = async (id: string): Promise<void> => {
  mockNotes = mockNotes.filter((n) => n.id !== id);
};
