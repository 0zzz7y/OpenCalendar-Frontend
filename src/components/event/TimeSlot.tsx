import React from 'react';
import { Box } from '@mui/material';

interface TimeSlotProperties {
  time: string;
  onClick?: () => void;
}

const TimeSlot: React.FC<TimeSlotProperties> = ({ time, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        height: 30,
        borderBottom: '1px solid #e0e0e0',
        paddingLeft: 1,
        fontSize: '0.75rem',
        color: '#999',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      {time}
    </Box>
  );
};

export default TimeSlot;
