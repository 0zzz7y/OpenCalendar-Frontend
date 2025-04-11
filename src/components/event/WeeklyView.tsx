import React from 'react';
import { Box, Typography } from '@mui/material';
import DayColumn from './DayColumn';

interface WeeklyViewProperties {
  weekDates: Date[]; // Array of 7 dates starting from the current week start
  onTimeSlotClick?: (date: Date) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const WeeklyView: React.FC<WeeklyViewProperties> = ({ weekDates, onTimeSlotClick }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header row */}
      <Box sx={{ display: 'flex', borderBottom: '1px solid #ccc', paddingX: 1 }}>
        <Box sx={{ width: 60 }} /> {/* empty space for time column */}
        {weekDates.map((date, index) => (
          <Box key={index} sx={{ flex: 1, textAlign: 'center', py: 1 }}>
            <Typography variant="subtitle2">
              {date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Grid content */}
      <Box sx={{ display: 'flex', flex: 1, overflowY: 'auto' }}>
        {/* Time column */}
        <Box sx={{ width: 60, borderRight: '1px solid #ccc', flexShrink: 0 }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{ height: 60, padding: '2px 4px', boxSizing: 'border-box' }}
            >
              <Typography variant="caption">{hour}</Typography>
            </Box>
          ))}
        </Box>

        {/* Day columns */}
        {weekDates.map((date, index) => (
          <DayColumn key={index} date={date} onSlotClick={onTimeSlotClick} />
        ))}
      </Box>
    </Box>
  );
};

export default WeeklyView;
