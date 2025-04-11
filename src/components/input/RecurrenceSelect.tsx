import React from 'react';
import { MenuItem, TextField } from '@mui/material';

export enum RecurringPattern {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

interface RecurrenceSelectProperties {
  value: RecurringPattern;
  onChange: (value: RecurringPattern) => void;
  label?: string;
}

const RecurrenceSelect: React.FC<RecurrenceSelectProperties> = ({
  value,
  onChange,
  label = 'Repeat',
}) => {
  return (
    <TextField
      select
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as RecurringPattern)}
    >
      {Object.values(RecurringPattern).map((pattern) => (
        <MenuItem key={pattern} value={pattern}>
          {pattern === 'NONE' ? 'Do not repeat' : pattern.charAt(0) + pattern.slice(1).toLowerCase()}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default RecurrenceSelect;
