import {
  Box,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material"
import {
  eachDayOfInterval,
  format,
  startOfWeek,
  addDays,
  differenceInMinutes,
  isSameDay,
  parseISO,
} from "date-fns"
import { useState, useEffect } from "react"

import { useEvents } from "@/hooks/useEvents"
// import EventCard from "../event/EventCard"
import EventCreationDialog from "../event/EventCreationDialog"

const hourHeight = 50
const slotHeight = hourHeight / 2

const WeeklyView = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end: addDays(start, 6) })

  const { events, fetchEvents } = useEvents()

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleSlotClick = (day: Date, hour: number, minute: number) => {
    const date = new Date(day)
    date.setHours(hour)
    date.setMinutes(minute)
    setSelectedDate(date)
    setOpenDialog(true)
  }

  return (
    <Box display="flex" height="100%" overflow="auto">
      {days.map((day, dayIndex) => (
        <Box key={dayIndex} flex={1} borderRight="1px solid #eee">
          <Box p={1} textAlign="center" borderBottom="1px solid #ccc" bgcolor="#f9f9f9">
            <Typography variant="subtitle2">{format(day, "EEEE")}</Typography>
            <Typography variant="caption">{format(day, "dd/MM")}</Typography>
          </Box>

          <Box position="relative" height={`calc(24 * ${hourHeight}px)`}>
            {[...Array(24)].map((_, hour) => (
              <Box
                key={hour}
                position="absolute"
                top={hour * hourHeight}
                left={0}
                right={0}
                height={hourHeight}
                borderTop="1px dashed #ccc"
                onClick={() => handleSlotClick(day, hour, 0)}
              />
            ))}

            {events
              .filter((event) => isSameDay(parseISO(event.startDate), day))
              .map((event) => {
                const start = parseISO(event.startDate)
                const end = parseISO(event.endDate)
                const top = start.getHours() * hourHeight + (start.getMinutes() / 60) * hourHeight
                const height = (differenceInMinutes(end, start) / 60) * hourHeight

                return (
                  <></>
                  // <EventCard
                  //   key={event.id}
                  //   event={event}
                  //   style={{ top, height }}
                  // />
                )
              })}
          </Box>
        </Box>
      ))}

      {openDialog && selectedDate && (
        <EventCreationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          initialDate={selectedDate}
        />
      )}
    </Box>
  )
}

export default WeeklyView
