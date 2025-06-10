import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"

interface MonthlyCalendarProperties {
  onDateSelect: (date: Date) => void
}

function MonthlyCalendar({ onDateSelect }: MonthlyCalendarProperties) {
  return (
    <DateCalendar
      onChange={(newDate) => {
        if (newDate) {
          onDateSelect(newDate)
        }
      }}
    />
  )
}

export default MonthlyCalendar
