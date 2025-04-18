import { useState, useCallback, useEffect } from "react";
import axios from "axios";

import Note from "../types/note";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
    try {
      const response = await axios.get<Note[]>("/notes");
      setNotes(response.data ?? []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    setNotes,
    fetchNotes
  };
};

export default useNotes;
