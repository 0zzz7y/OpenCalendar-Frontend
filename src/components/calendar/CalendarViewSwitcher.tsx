import { ToggleButton, ToggleButtonGroup } from "@mui/material"

interface CalendarViewSwitcherProperties {
  view: "day" | "week" | "month"
  onChange: (view: "day" | "week" | "month") => void
}

const CalendarViewSwitcher = ({
  view,
  onChange
}: CalendarViewSwitcherProperties) => {
  return (
    <>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_e, nextView) => nextView && onChange(nextView)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="day">Day</ToggleButton>
        <ToggleButton value="week">Week</ToggleButton>
        <ToggleButton value="month">Month</ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

export default CalendarViewSwitcher
