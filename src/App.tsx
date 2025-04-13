import { Box, CssBaseline } from "@mui/material";
import MonthlyCalendar from "./components/MonthlyCalendar";
import WeeklyView from "./components/WeeklyView";
import EventForm from "./components/event/EventForm";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarCategorySelector from "./components/CalendarCategorySelector";
import RightPanel from "./components/RightPanel";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>

        {/* Lewa kolumna: selektory + mały kalendarz */}
        <Box sx={{ width: 250, p: 2, borderRight: "1px solid #ccc" }}>
          <CalendarCategorySelector />
          <MonthlyCalendar />
        </Box>

        {/* Środkowa kolumna: główny widok */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <WeeklyView />
          <EventForm open={false} onClose={() => {}} defaultDate={null} />
        </Box>

        {/* Prawa kolumna: notatki i zadania */}
        <Box sx={{ width: 950, p: 1, borderLeft: "1px solid #ccc" }}>
          <RightPanel />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
