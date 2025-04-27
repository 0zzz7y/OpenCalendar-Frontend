// src/component/note/NotePanel.tsx

/**
 * NotesPanel component
 *
 * Displays a draggable panel of user notes on the current calendar view.
 * Provides functionality to add, update, and delete notes.
 */
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Box, IconButton } from "@mui/material"

// Custom hook for note CRUD operations
import useNotes from "@/repository/note.repository"
// Global application state store
import useApplicationStorage from "@/storage/useApplicationStorage"
// Card component for rendering individual notes
import NoteCard from "./NoteCard"
import MESSAGE from "@/constant/ui/message"
import type Note from "@/model/domain/note"
import LABEL from "@/constant/ui/label"
import { AddButton } from "../common"
import { toast } from "react-toastify"

async function addNote(note: Partial<Note>): Promise<Note> {
  // Implementation here
  return {
    id: "generated-id",
    name: note.name || "",
    description: note.description || "",
    calendar:
      note.calendar !== undefined
        ? note.calendar
        : (() => {
            throw new Error("Calendar is required")
          })(),
    category: note.category
  } // Replace with actual implementation
}

export default function NotesPanel() {
  const { addNote, updateNote, deleteNote } = useNotes()
  const { notes, categories, calendars } = useApplicationStorage()
  const [localNotes, setLocalNotes] = useState<Note[]>([])
  const [notePositions, setNotePositions] = useState<Record<string, { x: number; y: number }>>({})

  // Sync local copy with global notes whenever they change
  useEffect(() => {
    if (Array.isArray(notes)) setLocalNotes(notes)
  }, [notes])

  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars])
  const defaultCategory = useMemo(() => categories[0] || undefined, [categories])

  const handleUpdate = useCallback(
    (updated: Note) => {
      setLocalNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
      updateNote(updated)
    },
    [updateNote]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setLocalNotes((prev) => prev.filter((n) => n.id !== id))
      setNotePositions((prev) => {
        const { [id]: _, ...rest } = prev
        return rest
      })
      await deleteNote(id)
    },
    [deleteNote]
  )

  const handleAddNote = useCallback(async () => {
    if (!defaultCalendar) {
      toast.error("Cannot create note. No calendar is available.");
      return;
    }

    const container = document.querySelector("#notes-container") as HTMLElement;
    const containerWidth = container?.offsetWidth || 800;
    const containerHeight = container?.offsetHeight || 600;

    const tempId = `temp-${Date.now()}`;
    const randomX = Math.random() * (containerWidth - 200);
    const randomY = Math.random() * (containerHeight - 100);

    const newNote: Note = {
      id: tempId,
      name: "New Note",
      description: "Description",
      calendar: defaultCalendar,
      category: defaultCategory,
    };

    setLocalNotes((prev) => [...prev, newNote]);
    setNotePositions((prev) => ({
      ...prev,
      [tempId]: { x: randomX, y: randomY },
    }));

    try {
      const saved: Note = await addNote({
        name: newNote.name,
        description: newNote.description,
        calendar: newNote.calendar,
        category: newNote.category,
      });

      if (saved !== undefined) {
        setLocalNotes((prev) => prev.map((n) => (n.id === tempId ? saved : n)));
        setNotePositions((prev) => {
          const { [tempId]: position, ...rest } = prev;
          return { ...rest, [saved.id]: position };
        });
      }
    } catch {
      toast.error("Failed to create note.");
      setLocalNotes((prev) => prev.filter((n) => n.id !== tempId));
      setNotePositions((prev) => {
        const { [tempId]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [addNote, defaultCalendar, defaultCategory]);

  return (
    <Box
      id="notes-container"
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden"
      }}
    >
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {localNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            name={note.name}
            content={note.description}
            calendar={note.calendar}
            categories={categories}
            initialX={notePositions[note.id]?.x || 0}
            initialY={notePositions[note.id]?.y || 0}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </Box>

        <AddButton
          onClick={handleAddNote}
          sx={{
            position: "absolute",
            bottom: 12,
            right: 8,
            zIndex: 1300
          }}
        >
        </AddButton>
    </Box>
  )
}

