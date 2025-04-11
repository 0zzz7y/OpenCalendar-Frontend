import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface MonthlyCalendarProperties {
  selectedDate: Date | null;
  onChange: (date: Date) => void;
}

export default function MonthlyCalendar({ selectedDate, onChange }: MonthlyCalendarProperties) {
  const dateToShow = selectedDate ?? new Date();

  return (
    <Box sx={{ width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={dateToShow}
          onChange={(date) => onChange(date as Date)}
        />
      </LocalizationProvider>
    </Box>
  );
}