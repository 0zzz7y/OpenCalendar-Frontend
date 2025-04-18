import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Note from "../types/note";

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get<Note[]>(`${import.meta.env.VITE_BACKEND_URL}/notes`);
      console.log("Notes fetched:", response.data);
      setNotes(response.data);
    } catch (error) {
      toast.error("Failed to fetch notes");
    }
  };

  const addNote = async (note: Omit<Note, "id">) => {
    try {
      const response = await axios.post<Note>(`${import.meta.env.VITE_BACKEND_URL}/notes`, note);
      console.log("Note added:", response.data);      
      setNotes([response.data]);
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const updateNote = async (id: string, updated: Partial<Note>) => {
    try {
      const response = await axios.put<Note>(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`, updated);
      console.log("Note updated:", response.data);
      setNotes((prev) => prev.map((n) => (n.id === id ? response.data : n)));
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`);
      console.log("Note deleted:", id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  return {
    notes,
    setNotes,
    fetchNotes,
    addNote,
    updateNote,
    deleteNote
  };
};

export default useNotes;
