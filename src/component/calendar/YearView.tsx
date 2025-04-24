import { useState } from "react"
import { Box, Typography, Paper, useTheme } from "@mui/material"
import dayjs from "dayjs"
import EventInformationPopover from "@/component/event/EventInformationPopover"
import DayEventsPopover from "@/component/event/DayEventsPopover"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

interface YearViewProperties {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

const YearView = ({ date, events, calendars, categories, onEventClick }: YearViewProperties) => {
  const theme = useTheme()
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)
  const [dayPopoverAnchor, setDayPopoverAnchor] = useState<HTMLElement | null>(null)
  const [dayPopoverDate, setDayPopoverDate] = useState<Date | null>(null)

  const handleOpenInfo = (event: Schedulable, anchor: HTMLElement) => {
    if ("id" in event && "name" in event && "calendar" in event) {
      setInfoEvent(event as Event)
      setInfoAnchor(anchor)
      onEventClick?.(event as Event)
    }
  }

  const handleCloseInfo = () => {
    setInfoEvent(null)
    setInfoAnchor(null)
  }

  const handleOpenDayPopover = (anchor: HTMLElement, date: Date) => {
    setDayPopoverAnchor(anchor)
    setDayPopoverDate(date)
  }

  const handleCloseDayPopover = () => {
    setDayPopoverAnchor(null)
    setDayPopoverDate(null)
  }

  const year = date.getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => dayjs(new Date(year, i, 1)))

  return (
    <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
        {months.map((month) => {
          const daysInMonth = month.daysInMonth()
          const firstDayOfWeek = month.startOf("month").day()
          const days: Date[] = []

          for (let i = 0; i < firstDayOfWeek; i++) {
            days.push(new Date(NaN))
          }
          for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month.month(), i))
          }

          return (
            <Paper key={month.month()} sx={{ p: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {month.format("MMMM YYYY")}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
                {days.map((day, idx) => {
                  const isValid = !isNaN(day.getTime())
                  const dayEvents = isValid
                    ? events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(day, "day") && typeof e.name === "string")
                    : []

                  return (
                    <Box
                      key={idx}
                      onClick={(e) => {
                        if (isValid) {
                          handleOpenDayPopover(e.currentTarget, day)
                        }
                      }}
                      sx={{
                        height: 60,
                        px: 1,
                        py: 0.5,
                        cursor: isValid ? "pointer" : "default",
                        backgroundColor: isValid && dayjs(day).isSame(dayjs(), "day")
                          ? theme.palette.primary.light
                          : "transparent",
                        borderRadius: 1,
                        overflow: "hidden"
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {isValid ? day.getDate() : ""}
                      </Typography>
                      {dayEvents.length > 0 && (
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ fontSize: 10 }}
                        >
                          {dayEvents[0].name}
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          )
        })}
      </Box>

      {infoEvent && infoAnchor && (
        <EventInformationPopover
          anchorElement={infoAnchor}
          event={infoEvent}
          onClose={handleCloseInfo}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}

      {dayPopoverAnchor && dayPopoverDate && (
        <DayEventsPopover
          anchorEl={dayPopoverAnchor}
          date={dayPopoverDate}
          events={events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(dayPopoverDate, "day") && typeof e.name === "string")}
          onClose={handleCloseDayPopover}
        />
      )}
    </Box>
  )
}

export default YearView
