import { ToggleButton, ToggleButtonGroup } from "@mui/material"

interface CalendarViewSwitcherProperties {
  view: "day" | "week" | "month"
  onChange: (view: "day" | "week" | "month") => void
}

const CalendarViewSwitcher = ({ view, onChange }: CalendarViewSwitcherProperties) => {
  return (
    <>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(e, nextView) => nextView && onChange(nextView)}
        size="small"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="day">Dzień</ToggleButton>
        <ToggleButton value="week">Tydzień</ToggleButton>
        <ToggleButton value="month">Miesiąc</ToggleButton>
      </ToggleButtonGroup>
    </>
  )
}

export default CalendarViewSwitcher
