import React from 'react';
import { Box } from '@mui/material';

interface DayColumnProperties {
  date: Date;
  onSlotClick?: (dateTime: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const DayColumn: React.FC<DayColumnProperties> = ({ date, onSlotClick }) => {
  const handleClick = (hour: number) => {
    if (onSlotClick) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, 0, 0, 0);
      onSlotClick(slotTime);
    }
  };

  return (
    <Box sx={{ flex: 1, borderRight: '1px solid #eee' }}>
      {hours.map((hour) => (
        <Box
          key={hour}
          onClick={() => handleClick(hour)}
          sx={{
            height: 60,
            borderBottom: '1px solid #eee',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        />
      ))}
    </Box>
  );
};

export default DayColumn;
