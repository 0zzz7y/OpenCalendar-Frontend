import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"

interface DatePickerProperties {
  onDateSelect: (date: Date) => void
}

function DatePicker({ onDateSelect }: DatePickerProperties) {
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

export default DatePicker
