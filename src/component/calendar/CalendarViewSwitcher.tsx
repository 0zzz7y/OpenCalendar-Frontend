import ViewType from "@/model/utility/viewType"
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel
} from "@mui/material"

interface CalendarViewSwitcherProperties {
  view: ViewType
  onChange: (view: ViewType) => void
}

const CalendarViewSwitcher = ({
  view,
  onChange
}: CalendarViewSwitcherProperties) => {
  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value as ViewType
    onChange(value)
  }

  return (
    <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
      <InputLabel id="calendar-view-label">View</InputLabel>
      <Select
        labelId="calendar-view-label"
        value={view}
        onChange={handleChange}
        label="View"
      >
        <MenuItem value={ViewType.DAY}>{ViewType.DAY}</MenuItem>
        <MenuItem value={ViewType.WEEK}>{ViewType.WEEK}</MenuItem>
        <MenuItem value={ViewType.MONTH}>{ViewType.MONTH}</MenuItem>
        <MenuItem value={ViewType.YEAR}>{ViewType.YEAR}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default CalendarViewSwitcher
