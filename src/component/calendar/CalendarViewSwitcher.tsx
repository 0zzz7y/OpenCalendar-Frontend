import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel
} from "@mui/material"

interface CalendarViewSwitcherProperties {
  view: "day" | "week" | "month"
  onChange: (view: "day" | "week" | "month") => void
}

const CalendarViewSwitcher = ({
  view,
  onChange
}: CalendarViewSwitcherProperties) => {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "day" | "week" | "month"
    onChange(value)
  }

  return (
    <>
      <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
        <InputLabel id="calendar-view-label">View</InputLabel>
        <Select
          labelId="calendar-view-label"
          value={view}
          onChange={handleChange}
          label="View"
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="week">Week</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </Select>
      </FormControl>
    </>
  )
}

export default CalendarViewSwitcher
