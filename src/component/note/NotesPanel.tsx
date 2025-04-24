import MESSAGES from "@/constant/ui/messages"
import useNotes from "@/hook/useNote"
import Note from "@/model/domain/note"

import { useEffect, useRef, useState } from "react"

import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"

import NoteCard from "./NoteCard"
import useAppStore from "@/store/useAppStore"

const NotesPanel = () => {
  const { addNote, updateNote, deleteNote } = useNotes()
  const { notes, categories, calendars } = useAppStore()

  const [localNotes, setLocalNotes] = useState<Note[]>([])

  useEffect(() => {
    if (Array.isArray(notes)) {
      setLocalNotes(notes)
    }
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
    const defaultCalendar = calendars[0]
    const defaultCategory = categories[0]

    if (!defaultCalendar) return

    const tempNote: Note = {
      id: "", // temporary ID
      name: MESSAGES.NEW_NOTE,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory,
      positionX: Math.floor(Math.random() * 300),
      positionY: Math.floor(Math.random() * 200)
    }

    setLocalNotes((prev) => [...prev, tempNote])

    const savedNote = await addNote({
      name: tempNote.name,
      description: tempNote.description,
      calendar: tempNote.calendar,
      category: tempNote.category,
      positionX: tempNote.positionX,
      positionY: tempNote.positionY
    })

    if (savedNote) {
      setLocalNotes((prev) =>
        prev.map((note) =>
          note.id === "" ? { ...savedNote, ...note, id: savedNote.id } : note
        )
      )
    }
  }

  return (
    <Box position="absolute" top={0} left={0} width="100vw" height="100vh" zIndex={1}>
      {localNotes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          name={note.name}
          content={note.description || ""}
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
          backgroundColor: "primary.main",
          color: "white",
          zIndex: 1300,
          "&:hover": {
            backgroundColor: "primary.dark"
          }
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  )
}

export default NotesPanel
