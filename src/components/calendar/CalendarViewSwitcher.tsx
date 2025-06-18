import { useCallback } from "react"
import { CalendarView } from "./view/calendarView.type"
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material"

export interface CalendarViewSwitcherProps {
  view: CalendarView
  onChange: (view: CalendarView) => void
}

export default function CalendarViewSwitcher({ view, onChange }: CalendarViewSwitcherProps) {
  const handleChange = useCallback(
    (e: SelectChangeEvent<CalendarView>) => onChange(e.target.value as CalendarView),
    [onChange]
  )

  return (
    <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
      <InputLabel id="calendar-view-label">View</InputLabel>
      <Select labelId="calendar-view-label" id="calendar-view-select" value={view} label="View" onChange={handleChange}>
        <MenuItem value={CalendarView.DAY}>{CalendarView.DAY}</MenuItem>
        <MenuItem value={CalendarView.WEEK}>{CalendarView.WEEK}</MenuItem>
        <MenuItem value={CalendarView.MONTH}>{CalendarView.MONTH}</MenuItem>
        <MenuItem value={CalendarView.YEAR}>{CalendarView.YEAR}</MenuItem>
      </Select>
    </FormControl>
  )
}
