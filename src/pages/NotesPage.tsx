import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import NoteDialog, { NoteFormValues } from '../components/dialog/NoteDialog';
import NotesPanel from '../components/note/NotesPanel';
import { useNotes } from '../features/note/hooks/useNotes';

const NotesPage: React.FC = () => {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddNote = (formValues: NoteFormValues) => {
    createNote({
      name: formValues.name,
      description: formValues.description,
      color: formValues.color,
      x: 0,
      y: 0,
    });
    setDialogOpen(false);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Notes
      </Typography>
      <NotesPanel
        notes={notes}
        onAddClick={() => setDialogOpen(true)}
        onNoteClick={(note) => console.log(note)}
        onNotePositionChange={(id, x, y) => {
          const note = notes.find((n) => n.id === id);
          if (note) updateNote({ ...note, x, y });
        }}
      />

      <NoteDialog
        open={dialogOpen}
        mode="add"
        initialValues={{ name: '', description: '', color: '#ffff88' }}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddNote}
      />
    </Box>
  );
};

export default NotesPage;
