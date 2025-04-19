import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import NoteCard from "./NoteCard";
import Note from "../../types/note";
import useNotes from "../../hooks/useNotes";
import useCategories from "../../hooks/useCategories";

const NotesPanel = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    reloadNotes
  } = useNotes();

  const { categories, reloadCategories } = useCategories();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current) {
      reloadNotes();
      reloadCategories();
      didFetchRef.current = true;
    }
  }, []);

  const handleUpdate = (updatedNote: Note) => {
    updateNote(updatedNote.id, updatedNote);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    reloadNotes();
  };

  const handleAddNote = async () => {
    const newNote: Omit<Note, "id"> = {
      name: "New Note",
      description: "",
      categoryId: "",
      calendarId: ""
    };
    await addNote(newNote);
    reloadNotes();
  };

  return (
    <Box position="absolute" top={0} left={0} width="0vh" height="0vh">
      {notes.map((note) => (
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
  );
};

export default NotesPanel;
