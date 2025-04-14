import { Box, IconButton } from "@mui/material";
import AddCircle from "@mui/icons-material/AddCircle";
import { useState } from "react";
import NoteCard from "./NoteCard";

export default function NotesPanel() {
  const [notes, setNotes] = useState([
    { id: "note-1", content: "Example note", x: 20, y: 20 }
  ]);

  const handleAddNote = () => {
    const newId = `note-${Date.now()}`;
    const newNote = {
      id: newId,
      content: "",
      x: 40 + notes.length * 20,
      y: 40 + notes.length * 20,
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      sx={{ pointerEvents: "none", zIndex: 2000 }}
    >
      {/* Note cards */}
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          content={note.content}
          initialX={note.x}
          initialY={note.y}
          onDelete={handleDeleteNote}
        />
      ))}
      {/* Floating Add Button */}
      <Box
        position="absolute"
        bottom={16}
        right={16}
        sx={{ pointerEvents: "auto" }}
      >
        <IconButton
          onClick={handleAddNote}
          color="primary"
          sx={{
            width: 48,
            height: 48,
            backgroundColor: "#fff",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          <AddCircle sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
