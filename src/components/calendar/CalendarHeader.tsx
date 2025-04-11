import React from 'react';
import { Box } from '@mui/material';
import CalendarNavigation from './CalendarNavigation';
import ViewSwitcher from './ViewSwitcher';

interface CalendarHeaderProperties {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: 'week' | 'month';
  onViewChange: (view: 'week' | 'month') => void;
}

const CalendarHeader: React.FC<CalendarHeaderProperties> = ({
  currentDate,
  onPrev,
  onNext,
  onToday,
  view,
  onViewChange,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <CalendarNavigation
        currentDate={currentDate}
        onPrev={onPrev}
        onNext={onNext}
        onToday={onToday}
      />
      <ViewSwitcher value={view} onChange={onViewChange} />
    </Box>
  );
};

export default CalendarHeader;
