import React, { useState } from 'react';
import NotesPanel from '../components/note/NotesPanel';
import { useNotes } from '../features/note/hooks/useNotes';
import NoteDialog, { NoteFormValues } from '../components/dialog/NoteDialog';
import { Note } from '../features/note/types';

const NoteSection: React.FC = () => {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);

  const handleAddClick = () => {
    setEditNote(null);
    setDialogOpen(true);
  };

  const handleSave = async (values: NoteFormValues) => {
    if (editNote) {
      await updateNote({ ...editNote, ...values });
    } else {
      await createNote({
        name: values.name,
        description: values.description,
        color: values.color,
        x: 0,
        y: 0,
      });
    }
    setDialogOpen(false);
  };

  const handleNoteClick = (note: Note) => {
    setEditNote(note);
    setDialogOpen(true);
  };

  const handlePositionChange = (id: string, x: number, y: number) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote({ ...note, x, y });
    }
  };

  return (
    <>
      <NotesPanel
        notes={notes}
        onAddClick={handleAddClick}
        onNoteClick={handleNoteClick}
        onNotePositionChange={handlePositionChange}
      />
      <NoteDialog
        open={dialogOpen}
        mode={editNote ? 'edit' : 'add'}
        initialValues={{
          name: editNote?.name || '',
          description: editNote?.description || '',
          color: editNote?.color || '#ffff88',
        }}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={editNote ? () => deleteNote(editNote.id ?? '') : undefined}
      />
    </>
  );
};

export default NoteSection;
