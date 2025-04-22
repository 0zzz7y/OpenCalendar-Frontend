import MESSAGES from "@/constant/messages"
import useCalendars from "@/hook/api/useCalendar"
import useCategories from "@/hook/api/useCategory"
import useNotes from "@/hook/api/useNote"
import Note from "@/type/domain/note"

import { useEffect, useRef, useState } from "react"

import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"

import NoteCard from "./NoteCard"
import NotesDock from "./NotesDock"

const NotesPanel = () => {
  const { notes, addNote, updateNote, deleteNote, reloadNotes } = useNotes()
  const { categories } = useCategories()
  const { calendars } = useCalendars()

  const didFetchRef = useRef(false)

  const [localNotes, setLocalNotes] = useState<Note[]>([])

  useEffect(() => {
    if (!didFetchRef.current) {
      reloadNotes()
      didFetchRef.current = true
    }
  }, [])

  useEffect(() => {
    setLocalNotes(notes)
  }, [notes])

  const handleUpdate = (updatedNote: Note) => {
    setLocalNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    )
    updateNote(updatedNote.id, updatedNote)
  }

  const handleDelete = async (id: string) => {
    setLocalNotes((prev) => prev.filter((note) => note.id !== id))
    await deleteNote(id)
  }

  const handleAddNote = async () => {
    const tempId = ""
    const defaultCalendar = calendars[0]
    const defaultCategory = categories[0]

    if (!defaultCalendar) return

    const newNote: Note = {
      id: tempId,
      name: MESSAGES.PLACEHOLDERS.NEW_NOTE,
      description: "",
      category: defaultCategory,
      calendar: defaultCalendar,
      positionX: Math.floor(Math.random() * 100),
      positionY: Math.floor(Math.random() * 100)
    }

    setLocalNotes((prev) => [...prev, newNote])

    const savedNote = await addNote({
      name: newNote.name,
      description: newNote.description,
      category: defaultCategory,
      calendar: defaultCalendar,
      positionX: newNote.positionX,
      positionY: newNote.positionY
    })

    setLocalNotes((prev) =>
      prev.map((note) =>
        note.id === tempId && savedNote?.id
          ? { ...savedNote, ...note, id: savedNote.id }
          : note
      )
    )
  }

  return (
    <>
      <Box position="absolute" top={0} left={0} width="0vh" height="0vh">
        {localNotes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            name={note.name}
            content={note.description || ""}
            calendar={note.calendar}
            categories={categories}
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
            backgroundColor: "primary.main",
            color: "white",
            zIndex: 1000,
            "&:hover": {
              backgroundColor: "primary.dark"
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </>
  )
}

export default NotesPanel
