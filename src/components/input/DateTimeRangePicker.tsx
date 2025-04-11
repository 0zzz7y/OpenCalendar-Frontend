import React from 'react';
import Grid from '@mui/material/Grid';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DateTimeRangePickerProperties {
  start: Date | null;
  end: Date | null;
  onStartChange: (value: Date | null) => void;
  onEndChange: (value: Date | null) => void;
}

const DateTimeRangePicker: React.FC<DateTimeRangePickerProperties> = ({
  start,
  end,
  onStartChange,
  onEndChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="Start Time"
            value={start}
            onChange={onStartChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            label="End Time"
            value={end}
            onChange={onEndChange}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateTimeRangePicker;
