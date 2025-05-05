/**
 * Copyright (c) Tomasz Wnuk
 */

import { useState, useEffect, useCallback, useMemo } from "react"
import { Box, Typography } from "@mui/material"

import useNotes from "@/repository/note.repository"
import useApplicationStorage from "@/storage/useApplicationStorage"
import NoteCard from "./NoteCard"
import { AddButton } from "../common"
import { toast } from "react-toastify"
import type Note from "@/model/domain/note"
import FILTER from "@/constant/utility/filter"

export default function NotesPanel() {
  const { addNote, updateNote, deleteNote } = useNotes()
  const { notes, categories, calendars, selectedCalendar, selectedCategory } = useApplicationStorage()

  const [localNotes, setLocalNotes] = useState<Note[]>([])
  const [notePositions, setNotePositions] = useState<Record<string, { x: number; y: number }>>({})

  useEffect(() => {
    if (Array.isArray(notes)) setLocalNotes(notes)
  }, [notes])

  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars])
  const defaultCategory = useMemo(() => categories.find((c) => c.id === null) || undefined, [categories])

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
    const calendar =
      selectedCalendar && selectedCalendar !== FILTER.ALL
        ? calendars.find((c) => c.id === selectedCalendar)
        : defaultCalendar

    const category =
      selectedCategory && selectedCategory !== FILTER.ALL
        ? categories.find((c) => c.id === selectedCategory)
        : defaultCategory

    if (!calendar) {
      toast.error("Cannot create note. No calendar is available.")
      return
    }

    const container = document.querySelector("#notes-container") as HTMLElement
    const containerWidth = container?.offsetWidth || 800
    const containerHeight = container?.offsetHeight || 600

    const tempId = `temp-${Date.now()}`
    const randomX = Math.random() * (containerWidth - 200)
    const randomY = Math.random() * (containerHeight - 100)

    const newNote: Note = {
      id: tempId,
      title: "New Note",
      description: "Description",
      calendar: calendar,
      category: category || undefined
    }

    setLocalNotes((prev) => [...prev, newNote])
    setNotePositions((prev) => ({
      ...prev,
      [tempId]: { x: randomX, y: randomY }
    }))

    try {
      const saved: Note = await addNote({
        title: newNote.title,
        description: newNote.description,
        calendar: newNote.calendar,
        category: newNote.category
      })

      if (saved !== undefined) {
        setLocalNotes((prev) => prev.map((n) => (n.id === tempId ? saved : n)))
        setNotePositions((prev) => {
          const { [tempId]: position, ...rest } = prev
          return { ...rest, [saved.id]: position }
        })
      }
    } catch {
      toast.error("Failed to create note.")
      setLocalNotes((prev) => prev.filter((n) => n.id !== tempId))
      setNotePositions((prev) => {
        const { [tempId]: _, ...rest } = prev
        return rest
      })
    }
  }, [addNote, selectedCalendar, selectedCategory, defaultCalendar, defaultCategory, calendars, categories])

  const filteredNotes = useMemo(() => {
    return localNotes.filter((note) => {
      const calMatch = !selectedCalendar || selectedCalendar === FILTER.ALL || note.calendar?.id === selectedCalendar
      const catMatch = !selectedCategory || selectedCategory === FILTER.ALL || note.category?.id === selectedCategory
      return calMatch && catMatch
    })
  }, [localNotes, selectedCalendar, selectedCategory])

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
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              name={note.title}
              content={note.description}
              calendar={note.calendar}
              category={note.category}
              categories={categories}
              calendars={calendars}
              initialX={notePositions[note.id]?.x || 0}
              initialY={notePositions[note.id]?.y || 0}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "text.secondary"
            }}
          >
            <Typography variant="body1">No notes found.</Typography>
          </Box>
        )}
      </Box>

      <AddButton
        onClick={handleAddNote}
        sx={{
          position: "absolute",
          bottom: 12,
          right: 8,
          zIndex: 1300
        }}
      />
    </Box>
  )
}
