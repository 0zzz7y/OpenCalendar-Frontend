import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';

interface CalendarNavigationProperties {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProperties> = ({
  currentDate,
  onPrev,
  onNext,
  onToday,
}) => {
  const formatRange = () =>
    currentDate.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <IconButton onClick={onPrev}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton onClick={onToday}>
        <TodayIcon />
      </IconButton>
      <IconButton onClick={onNext}>
        <ChevronRightIcon />
      </IconButton>
      <Typography variant="h6" ml={2}>
        {formatRange()}
      </Typography>
    </Box>
  );
};

export default CalendarNavigation;
