// src/features/note/hooks/useNotes.ts
import { useState, useEffect } from 'react';
import { Note } from '../types';
import {
  getNotes,
  createNote as createNoteApi,
  updateNote as updateNoteApi,
  deleteNote as deleteNoteApi,
} from '../mockApi';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  const createNote = async (note: Omit<Note, 'id'>) => {
    const created = await createNoteApi(note);
    setNotes((prev) => [...prev, created]);
  };

  const updateNote = async (note: Note) => {
    const updated = await updateNoteApi(note);
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNote = async (id: string) => {
    await deleteNoteApi(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, createNote, updateNote, deleteNote };
}
