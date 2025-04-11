import React from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { useCalendars } from '../../features/calendar/hooks/useCalendars';

const CalendarList: React.FC = () => {
  const { calendars } = useCalendars();

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Calendars
      </Typography>
      <List dense>
        {calendars.map((calendar) => (
          <ListItem key={calendar.id}>
            <ListItemText primary={calendar.name} />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" size="small" onClick={() => console.log("Add Calendar")}>
        Add Calendar
      </Button>
    </Box>
  );
};

export default CalendarList;
