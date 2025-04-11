import React from 'react';
import { Box, Typography } from '@mui/material';
import { Note } from '../../features/note/types';

interface NoteCardProperties {
  note: Note;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProperties> = ({ note, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 200,
        minHeight: 120,
        backgroundColor: note.color || '#ffff88',
        borderRadius: 2,
        padding: 2,
        boxShadow: 3,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
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
