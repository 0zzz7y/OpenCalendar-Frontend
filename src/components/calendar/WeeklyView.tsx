import { Box, Typography } from "@mui/material"

import DayColumn from "./DayColumn"
import TimeColumn from "./TimeColumn"

import Event from "../../types/event"

interface WeeklyViewProperties {
  events: Event[]
  onSlotClick?: (element: HTMLElement, datetime: Date) => void
  onSave: (event: Partial<Event>) => void
  onEventClick?: (event: Event) => void
}

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const WeeklyView = ({ events, onSlotClick, onSave, onEventClick }: WeeklyViewProperties) => {
  const weekStart = getStartOfWeek()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <Box
      display="flex"
      height="100%"
      sx={{ p: 2, height: "100vh", overflow: "auto" }}
    >
      <TimeColumn />

      {days.map((day, index) => {
        const isToday = day.toDateString() === new Date().toDateString()

        return (
          <Box
            key={index}
            width="100%"
            display="flex"
            flexDirection="column"
            borderRight="1px solid #ccc"
          >
            <Box
              px={1}
              py={1}
              textAlign="center"
              borderBottom="1px solid #ddd"
              height={50}
            >
              <Box
                sx={{
                  backgroundColor: isToday ? "#1976d2" : "transparent",
                  color: isToday ? "#fff" : "inherit",
                  borderRadius: isToday ? "50%" : "0",
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  fontWeight: isToday ? 700 : 500,
                  fontSize: 14
                }}
              >
                {day.getDate()}
              </Box>

              <Typography variant="caption" sx={{ mt: 0.5 }}>
                {day.toLocaleDateString("pl-PL", {
                  weekday: "short"
                })}
              </Typography>
            </Box>

            <DayColumn
              date={day}
              events={events.filter(
                (e) => new Date(e.startDate).toDateString() === day.toDateString()
              )}
              allEvents={events}
              onSave={onSave}
              onSlotClick={onSlotClick}
              onEventClick={onEventClick}
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default WeeklyView
