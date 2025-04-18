import { useState } from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import NoteCard from "./NoteCard";

import { v4 as uuidv4 } from "uuid";

import Note from "../../types/note";

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
];

const NotesPanel = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const handleUpdate = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleAddNote = () => {
    const maxZ = Math.max(0, ...notes.map((n) => n.zIndex));
    const newNote: Note = {
      id: uuidv4(),
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
    };
    setNotes((prev) => [...prev, newNote]);
  };

  return (
    <Box position="absolute" top={0} left={0} width="0vh" height="0vh">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          content={note.description || ""}
          initialX={note.x}
          initialY={note.y}
          color={note.color}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}

      <IconButton
        onClick={handleAddNote}
        z-index={1000}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark"
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default NotesPanel;
