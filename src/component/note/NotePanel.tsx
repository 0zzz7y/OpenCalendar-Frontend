import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import useNotes from "@/repository/note.repository";
import useAppStore from "@/store/useAppStore";
import NoteCard from "./NoteCard";
import MESSAGES from "@/constant/ui/messages";
import type Note from "@/model/domain/note";

/**
 * Panel displaying draggable note cards and an add button.
 */
export default function NotesPanel() {
  const { addNote, updateNote, deleteNote } = useNotes();
  const { notes, categories, calendars } = useAppStore();

  const [localNotes, setLocalNotes] = useState<Note[]>([]);

  // Sync store notes to local state
  useEffect(() => {
    if (Array.isArray(notes)) {
      setLocalNotes(notes);
    }
  }, [notes]);

  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars]);
  const defaultCategory = useMemo(() => categories[0] || undefined, [categories]);

  const handleUpdate = useCallback(
    (updated: Note) => {
      setLocalNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
      );
      updateNote(updated);
    },
    [updateNote]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setLocalNotes((prev) => prev.filter((n) => n.id !== id));
      await deleteNote(id);
    },
    [deleteNote]
  );

  const handleAddNote = useCallback(async () => {
    if (!defaultCalendar) return;

    const tempId = `temp-${Date.now()}`;
    const newNote: Note = {
      id: tempId,
      name: MESSAGES.NEW_NOTE,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory,
      positionX: Math.random() * 300,
      positionY: Math.random() * 200,
    };

    // Optimistically render
    setLocalNotes((prev) => [...prev, newNote]);

    try {
      const saved = await addNote({
        name: newNote.name,
        description: newNote.description,
        calendar: newNote.calendar,
        category: newNote.category,
        positionX: newNote.positionX,
        positionY: newNote.positionY,
      });
      if (saved) {
        setLocalNotes((prev) =>
          prev.map((n) => (n.id === tempId ? { ...saved, id: saved.id } as Note : n))
        );
      }
    } catch {
      // Revert on failure
      setLocalNotes((prev) => prev.filter((n) => n.id !== tempId));
    }
  }, [addNote, defaultCalendar, defaultCategory]);

  return (
    <Box position="absolute" top={0} left={0} width="100vw" height="100vh" zIndex={1}>
      {localNotes.map((note) => (
        <NoteCard
          key={note.id}
          name={note.name}
          content={note.description}
          calendar={note.calendar}
          categories={categories}
          initialX={note.positionX}
          initialY={note.positionY}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      <IconButton
        onClick={handleAddNote}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          bgcolor: "primary.main",
          color: "white",
          zIndex: 1300,
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
