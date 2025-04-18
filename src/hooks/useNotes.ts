import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Note from "../types/note";

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNotes = async (pageNumber = 0, reset = false) => {
    try {
      const response = await axios.get<PaginatedResponse<Note>>(
        `${import.meta.env.VITE_BACKEND_URL}/notes`,
        { params: { page: pageNumber, size } }
      );

      const data = response.data;

      setNotes((prev) => reset ? data.content : [...prev, ...data.content]);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      toast.error("Failed to fetch notes");
    }
  };

  const reloadNotes = async () => {
    try {
      let allNotes: Note[] = [];
      let currentPage = 0;
      let total = 1;

      do {
        const response = await axios.get<PaginatedResponse<Note>>(
          `${import.meta.env.VITE_BACKEND_URL}/notes`,
          { params: { page: currentPage, size } }
        );

        const data = response.data;
        allNotes = [...allNotes, ...data.content];
        total = data.totalPages;
        currentPage++;
      } while (currentPage < total);

      setNotes(allNotes);
      setPage(0);
      setTotalPages(1);
      setTotalElements(allNotes.length);
    } catch (error) {
      toast.error("Failed to reload all notes");
    }
  };

  const loadNextPage = async () => {
    if (page + 1 >= totalPages) return;
    setIsLoadingMore(true);
    await fetchNotes(page + 1);
    setIsLoadingMore(false);
  };

  const addNote = async (note: Omit<Note, "id">) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notes`, note);
      await reloadNotes();
    } catch (error) {
      toast.error("Failed to add note");
    }
  };

  const updateNote = async (id: string, updated: Partial<Note>) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`, updated);
      await reloadNotes();
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/${id}`);
      await reloadNotes();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  useEffect(() => {
    reloadNotes();
  }, []);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    reloadNotes,
    loadNextPage,
    page,
    size,
    totalPages,
    totalElements,
    isLoadingMore
  };
};

export default useNotes;
