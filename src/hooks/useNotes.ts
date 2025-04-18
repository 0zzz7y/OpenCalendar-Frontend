import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Note } from "../types/note";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = async () => {
    const response = await axios.get<Note[]>("/notes");
    setNotes(response.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, setNotes, fetchNotes };
};
