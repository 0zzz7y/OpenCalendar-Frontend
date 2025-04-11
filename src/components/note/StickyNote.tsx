import React from 'react';
import { Box, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { Note } from '../../features/note/types';

interface NoteCardProperties {
  note: Note;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProperties> = ({ note, onClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id ?? '',});

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      sx={{
        position: 'absolute',
        left: note.x ?? 0,
        top: note.y ?? 0,
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        zIndex: transform ? 10 : 1,
        width: 200,
        minHeight: 120,
        backgroundColor: note.color || '#ffff88',
        borderRadius: 2,
        padding: 2,
        boxShadow: 3,
        cursor: 'move',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none',
        '&:hover': {
          opacity: 0.9,
        },
      }}
    >
      {note.name && (
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom noWrap>
          {note.name}
        </Typography>
      )}
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
        {note.description}
      </Typography>
    </Box>
  );
};

export default NoteCard;
