import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import NoteCard from './StickyNote';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { Note } from '../../features/note/types';

interface NotesPanelProperties {
  notes: Note[];
  onAddClick?: () => void;
  onNoteClick?: (note: Note) => void;
  onNotePositionChange?: (noteId: string, x: number, y: number) => void;
}

const NotesPanel: React.FC<NotesPanelProperties> = ({
  notes,
  onAddClick,
  onNoteClick,
  onNotePositionChange,
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const note = notes.find((n) => n.id === active.id);
    if (note) {
      const newX = (note.x ?? 0) + delta.x;
      const newY = (note.y ?? 0) + delta.y;
      onNotePositionChange?.(note.id ?? '', newX, newY);
    }
    setActiveId(null);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Typography variant="h6">Sticky Notes</Typography>
        <Button variant="outlined" size="small" onClick={onAddClick}>
          Add Note
        </Button>
      </Box>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onClick={() => onNoteClick?.(note)} />
        ))}

        <DragOverlay>
          {activeId && (
            <NoteCard note={notes.find((n) => n.id === activeId)!} />
          )}
        </DragOverlay>
      </DndContext>
    </Box>
  );
};

export default NotesPanel;
