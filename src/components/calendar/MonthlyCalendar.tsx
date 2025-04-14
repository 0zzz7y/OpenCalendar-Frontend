import { Box } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";

export default function MonthlyCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <Box mt={2} sx={{ maxWidth: 280 }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          sx={{ width: "100%", fontSize: 14 }}
        />
      </LocalizationProvider>
    </Box>
  );
}
