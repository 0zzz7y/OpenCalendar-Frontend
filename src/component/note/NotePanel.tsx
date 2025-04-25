// src/component/note/NotePanel.tsx

/**
 * NotesPanel component
 *
 * Displays a draggable panel of user notes on the current calendar view.
 * Provides functionality to add, update, and delete notes.
 */
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Box, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

// Custom hook for note CRUD operations
import useNotes from "@/repository/note.repository"
// Global application state store
import useAppStore from "@/store/useAppStore"
// Card component for rendering individual notes
import NoteCard from "./NoteCard"
import MESSAGE from "@/constant/ui/message"
import type Note from "@/model/domain/note"
import LABEL from "@/constant/ui/label"

export default function NotesPanel() {
  // Destructure note operations from repository hook
  const { addNote, updateNote, deleteNote } = useNotes()
  // Get global arrays of notes, categories, and calendars
  const { notes, categories, calendars } = useAppStore()
  // Local state to manage immediate UI updates before persistence
  const [localNotes, setLocalNotes] = useState<Note[]>([])

  /**
   * Sync local copy with global notes whenever they change
   */
  useEffect(() => {
    if (Array.isArray(notes)) setLocalNotes(notes)
  }, [notes])

  /**
   * Default references for adding new notes
   */
  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars])
  const defaultCategory = useMemo(() => categories[0] || undefined, [categories])

  /**
   * Update handler: updates note in local state and persists change
   */
  const handleUpdate = useCallback(
    (updated: Note) => {
      setLocalNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
      updateNote(updated)
    },
    [updateNote]
  )

  /**
   * Delete handler: removes note from local state and backend
   */
  const handleDelete = useCallback(
    async (id: string) => {
      setLocalNotes((prev) => prev.filter((n) => n.id !== id))
      await deleteNote(id)
    },
    [deleteNote]
  )

  /**
   * Add handler: creates a temp note, persists it, and reconciles IDs
   */
  const handleAddNote = useCallback(async () => {
    if (!defaultCalendar) return
    // Temporary ID for optimistic UI update
    const tempId = `temp-${Date.now()}`
    const newNote: Note = {
      id: tempId,
      name: MESSAGE.NEW_NOTE,
      description: LABEL.DESCRIPTION,
      calendar: defaultCalendar,
      category: defaultCategory,
      // Random initial position
      positionX: Math.random() * 200,
      positionY: Math.random() * 200
    }
    // Optimistically add to UI
    setLocalNotes((prev) => [...prev, newNote])

    try {
      // Persist to backend
      const saved = await addNote({
        name: newNote.name,
        description: newNote.description,
        calendar: newNote.calendar,
        category: newNote.category,
        positionX: newNote.positionX,
        positionY: newNote.positionY
      })
      // Replace temp note with saved note (keeping UI position)
      setLocalNotes((prev) =>
        prev.map((n) => (n.id === tempId ? { ...saved, positionX: n.positionX, positionY: n.positionY } : n))
      )
    } catch {
      // Rollback on failure
      setLocalNotes((prev) => prev.filter((n) => n.id !== tempId))
    }
  }, [addNote, defaultCalendar, defaultCategory])

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden"
      }}
    >
      {/* positioning context for draggable notes */}
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        {localNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
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
      </Box>

      {/* Floating add note button */}
      <IconButton
        onClick={handleAddNote}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
          zIndex: 1300
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}
