import { useState } from "react"
import { Box, Typography } from "@mui/material"

import DayColumn from "./DayColumn"
import { Event } from "../../types/event"

const getStartOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // poniedziałek
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const WeeklyView = () => {
  const [events, setEvents] = useState<Event[]>([])

  const handleSave = (data: Partial<Event> & { start: string }) => {
    setEvents((prev) => {
      const exists = prev.find((e) => e.start === data.start)
      const id = exists?.id || crypto.randomUUID()
  
      const newEvent: Event = {
        id,
        title: data.title ?? "Nowe wydarzenie",
        startDate: data.start,
        endDate: data.end ?? data.start,
        color: data.color ?? "#1976d2",
        start: "",
        calendarId: ""
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
    <Box display="flex" height="100%">
      {days.map((day, index) => (
        <Box key={index} width="100%" display="flex" flexDirection="column" borderRight="1px solid #ccc">
          <Box px={1} py={1} textAlign="center" bgcolor="#f0f0f0" borderBottom="1px solid #ddd">
            <Typography variant="subtitle2">
              {day.toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "short" })}
            </Typography>
          </Box>

          <DayColumn
            date={day}
            events={events.filter((e) =>
              new Date(e.start).toDateString() === day.toDateString()
            )}
            onSave={handleSave}
          />
        </Box>
      ))}
    </Box>
  )
}

export default WeeklyView
