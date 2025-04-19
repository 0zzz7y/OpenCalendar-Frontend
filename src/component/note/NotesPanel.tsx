import { useEffect, useRef, useState } from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"

import NoteCard from "./NoteCard"
import Note from "../../type/note"
import useNotes from "../../hook/api/useNote"
import useCategories from "../../hook/api/useCategory"
import MESSAGES from "@/constant/message"

const NotesPanel = () => {
  const { notes, addNote, updateNote, deleteNote, reloadNotes } = useNotes()
  const { categories, reloadCategories } = useCategories()
  const didFetchRef = useRef(false)

  const [localNotes, setLocalNotes] = useState<Note[]>([])

  useEffect(() => {
    if (!didFetchRef.current) {
      reloadNotes()
      reloadCategories()
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
    const newNote: Note = {
      id: tempId,
      name: MESSAGES.PLACEHOLDERS.NEW_NOTE,
      description: "",
      categoryId: "",
      calendarId: ""
    }

    setLocalNotes((prev) => [...prev, newNote])

    const savedNote = await addNote({
      name: newNote.name,
      description: newNote.description,
      categoryId: newNote.categoryId,
      calendarId: newNote.calendarId
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
    <Box position="absolute" top={0} left={0} width="0vh" height="0vh">
      {localNotes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          name={note.name}
          content={note.description || ""}
          calendarId={note.calendarId}
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
  )
}

export default NotesPanel
