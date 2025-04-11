import React from 'react';
import { MenuItem, TextField } from '@mui/material';

export interface CalendarOption {
  id: string;
  name: string;
}

interface CalendarSelectProperties {
  calendars: CalendarOption[];
  value: string | null;
  onChange: (value: string) => void;
  label?: string;
}

const CalendarSelect: React.FC<CalendarSelectProperties> = ({ calendars, value, onChange, label = "Calendar" }) => {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {calendars.map((calendar) => (
        <MenuItem key={calendar.id} value={calendar.id}>
          {calendar.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CalendarSelect;
