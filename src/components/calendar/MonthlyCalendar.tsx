import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

function MonthlyCalendar() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar />
      </LocalizationProvider>
    </>
  )
}

export default MonthlyCalendar
