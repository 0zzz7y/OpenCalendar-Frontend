import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import NoteCard from "./NoteCard"
import Note from "../../types/note"

const initialNotes: Note[] = [
  {
    id: "1",
    description: "Zakupy: mleko, chleb, jajka",
    drawing: "",
    categoryId: undefined,
    calendarId: undefined,
    x: 0,
    y: 0,
    width: 200,
    height: 150,
    zIndex: 1,
    color: "#ffff88"
  },
  {
    id: "2",
    description: "Siłownia: biceps, plecy",
    categoryId: undefined,
    calendarId: undefined,
    drawing: "",
    x: 220,
    y: 0,
    width: 200,
    height: 150,
    zIndex: 2,
    color: "#ffff88"
  }
]

const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes)

  const handleUpdate = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    )
  }

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const handleAddNote = () => {
    const maxZ = Math.max(0, ...notes.map((n) => n.zIndex))
    const newNote: Note = {
      id: "",
      description: "",
      drawing: "",
      categoryId: undefined,
      calendarId: undefined,
      x: 20,
      y: 20,
      width: 200,
      height: 150,
      zIndex: maxZ + 1,
      color: "#ffff88"
    }
    setNotes((prev) => [...prev, newNote])
  }

  return (
    <Box position="relative" width="100%" height="100%">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      <IconButton
        onClick={handleAddNote}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          backgroundColor: "primary.main",
          color: "white",
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
