import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NoteCard from './NoteCard';

interface NotesPanelProperties {
  notes: { id: string; content: string }[];
  onAddNote: () => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, content: string) => void;
}

const NotesPanel: React.FC<NotesPanelProperties> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Sticky Notes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNote}
          sx={{ borderRadius: 2 }}
        >
          Add Note
        </Button>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            id={note.id}
            content={note.content}
            onDelete={onDeleteNote}
            onUpdate={onUpdateNote}
          />
        ))}
      </Box>
    </Box>
  );
};

export default NotesPanel;
