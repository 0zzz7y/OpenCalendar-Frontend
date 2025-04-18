import { useState } from "react"
import { Box, Typography } from "@mui/material"

import DayColumn from "./DayColumn"
import TimeColumn from "./TimeColumn"
import Event from "../../types/event"

export interface Properties {
  onSlotClick: (slot: {
    anchorEl: HTMLElement
    dateTime: { dayIndex: number; hour: string }
  }) => void
}

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const WeeklyView = () => {
  const [events, setEvents] = useState<Event[]>([])

  const handleSave = (data: Partial<Event> & { start: string }) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.startDate === data.start)
      const id = exists?.id || crypto.randomUUID()

      const newEvent: Event = {
        id,
        name: data.name ?? "Nowe wydarzenie",
        startDate: data.start,
        endDate: data.endDate ?? data.start,
        color: data.color ?? "#1976d2",
        calendarId: "",
        description: ""
      }

      return exists
        ? prev.map((e) => (e.id === id ? newEvent : e))
        : [...prev, newEvent]
    })
  }

  const weekStart = getStartOfWeek()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <Box display="flex" height="100%" sx={{ p: 2, height: "100vh", overflow: "auto" }}>
      <TimeColumn />

      {days.map((day, index) => (
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
            bgcolor="#f0f0f0"
            borderBottom="1px solid #ddd"
          >
            <Typography variant="subtitle2">
              {day.toLocaleDateString("pl-PL", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
            </Typography>
          </Box>

          <DayColumn
            date={day}
            events={events.filter(
              (e) => new Date(e.startDate).toDateString() === day.toDateString()
            )}
            onSave={handleSave}
          />
        </Box>
      ))}
    </Box>
  )
}

export default WeeklyView
