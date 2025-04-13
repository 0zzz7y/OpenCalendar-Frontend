import { Box } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import NotesPanel from "./note/NotesPanel";
import TasksPanel from "./task/TasksPanel";

interface Note {
  id: string;
  content: string;
}

export default function RightPanel() {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = () => {
    const newNote: Note = { id: uuidv4(), content: "" };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleUpdateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, height: "50%" }}>
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 1,
        }}
      >
        <NotesPanel
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onUpdateNote={handleUpdateNote}
        />
      </Box>

      <Box
        sx={{
          height: 450,
          border: "1px solid #ccc",
          borderRadius: 2,
          p: 1,
          overflowY: "auto",
        }}
      >
        <TasksPanel />
      </Box>
    </Box>
  );
}
