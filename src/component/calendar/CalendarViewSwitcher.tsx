import React, { useCallback } from "react"
import ViewType from "@/model/utility/viewType"
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from "@mui/material"

export interface CalendarViewSwitcherProps {
  /** Current view mode */
  view: ViewType
  /** Called when the view changes */
  onChange: (view: ViewType) => void
}

/**
 * Dropdown to select calendar view (Day, Week, Month, Year).
 */
export default function CalendarViewSwitcher({ view, onChange }: CalendarViewSwitcherProps) {
  const handleChange = useCallback((e: SelectChangeEvent<ViewType>) => onChange(e.target.value as ViewType), [onChange])

  return (
    <FormControl size="small" sx={{ mb: 2, minWidth: 120 }}>
      <InputLabel id="calendar-view-label">View</InputLabel>
      <Select labelId="calendar-view-label" id="calendar-view-select" value={view} label="View" onChange={handleChange}>
        <MenuItem value={ViewType.DAY}>{ViewType.DAY}</MenuItem>
        <MenuItem value={ViewType.WEEK}>{ViewType.WEEK}</MenuItem>
        <MenuItem value={ViewType.MONTH}>{ViewType.MONTH}</MenuItem>
        <MenuItem value={ViewType.YEAR}>{ViewType.YEAR}</MenuItem>
      </Select>
    </FormControl>
  )
}
