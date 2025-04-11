import { Box, Button } from "@mui/material";
import { useState } from "react";
import NoteCard from "./NoteCard";
import { v4 as uuidv4 } from "uuid";

export default function StickyNotesPanel() {
  const [notes, setNotes] = useState<
    { id: string; x: number; y: number; color: string; text: string }[]
  >([]);

  const addNote = () => {
    const newNote = {
      id: uuidv4(),
      x: Math.random() * 150,
      y: Math.random() * 300,
      color: "#fff59d",
      text: ""
    };
    setNotes((prev) => [...prev, newNote]);
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const bringToFront = (id: string) => {
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      const others = prev.filter((n) => n.id !== id);
      return [...others, note!]; // Przesuwa notatkę na koniec (najwyższy z-index)
    });
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <Button
        onClick={addNote}
        size="small"
        variant="contained"
        sx={{ mb: 1 }}
      >
        ➕ Nowa notatka
      </Button>

      {notes.map((note) => (
        <NoteCard
          key={note.id}
          id={note.id}
          initialX={note.x}
          initialY={note.y}
          color={note.color}
          defaultText={note.text}
          onDelete={() => removeNote(note.id)}
          onInteract={() => bringToFront(note.id)}
        />
      ))}
    </Box>
  );
}
