import EventInformationPopover from "@/component/event/EventInformationPopover"
import Event from "@/model/domain/event"
import RecurringPattern from "@/model/domain/recurringPattern"
import Schedulable from "@/model/domain/schedulable"

import { useState } from "react"

import { Box, Typography, Paper, useTheme } from "@mui/material"
import dayjs from "dayjs"

import EventCreationPopover from "../event/EventCreationPopover"

interface MonthViewProperties {
  date: Date
  events: Schedulable[] // Zmienione na Schedulable[], aby obsługiwało Event i Task
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onSave: (data: Partial<Event>) => void
  onSlotClick?: (element: HTMLElement, datetime: Date) => void
  onEventClick?: (event: Event) => void
}

const MonthView = ({
  date,
  events,
  calendars,
  categories,
  onSave,
  onSlotClick,
  onEventClick
}: MonthViewProperties) => {
  const theme = useTheme()

  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)
  const [createAnchor, setCreateAnchor] = useState<HTMLElement | null>(null)
  const [createDate, setCreateDate] = useState<Date | null>(null)

  const startOfMonth = dayjs(date).startOf("month")
  const startDay = startOfMonth.startOf("week")
  const today = dayjs()

  const openInfoPopover = (event: Schedulable, anchor: HTMLElement) => {
    if ("id" in event && "name" in event && "calendar" in event) {
      setInfoEvent(event as Event) // Cast to Event
      setInfoAnchor(anchor)
      onEventClick?.(event as Event) // Cast to Event
    }
  }

  const closeInfoPopover = () => {
    setInfoEvent(null)
    setInfoAnchor(null)
  }

  const deleteEvent = (id: string) => {
    onSave({ id })
    closeInfoPopover()
  }

  const editEvent = () => {
    if (!infoEvent || !infoAnchor) return
    closeInfoPopover()
    setCreateDate(new Date(infoEvent.startDate))
    setCreateAnchor(infoAnchor)
  }

  const openCreatePopover = (anchor: HTMLElement, date: Date) => {
    setCreateAnchor(anchor)
    setCreateDate(date)
    onSlotClick?.(anchor, date)
  }

  const closeCreatePopover = () => {
    setCreateAnchor(null)
    setCreateDate(null)
  }

  const handleSave = (data: Partial<Event>) => {
    onSave(data)
    closeCreatePopover()
  }

  const cells: React.ReactNode[] = []
  for (let i = 0; i < 42; i++) {
    const day = startDay.add(i, "day")
    const dayEvents = events.filter((e) =>
      dayjs(e.startDate).isSame(day, "day")
    )

    cells.push(
      <Paper
        key={day.format("YYYY-MM-DD")}
        elevation={0}
        onClick={(e) =>
          openCreatePopover(e.currentTarget as HTMLElement, day.toDate())
        }
        sx={{
          minHeight: 100,
          p: 1,
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "background-color 0.15s ease-in-out",
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#3d3d3d" : "#e0e0e0"
          }
        }}
      >
        <Typography
          variant="body2"
          fontWeight="bold"
          color={
            day.isSame(today, "day") ? theme.palette.primary.main : "inherit"
          }
        >
          {day.format("D")}
        </Typography>

        <Box sx={{ mt: 0.5 }}>
          {dayEvents.slice(0, 3).map((ev) => (
            <Box
              key={ev.id}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: 0.5,
                mb: 0.5,
                "&:hover": { bgcolor: theme.palette.action.hover }
              }}
              onClick={(e) => {
                e.stopPropagation()
                openInfoPopover(ev, e.currentTarget as HTMLElement)
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: ev.category?.color,
                  borderRadius: "50%"
                }}
              />
              <Typography variant="caption" noWrap>
                {dayjs(ev.startDate).format("H:mm")} {ev.name}{" "}
                {ev.calendar?.emoji}
              </Typography>
            </Box>
          ))}

          {dayEvents.length > 3 && (
            <Typography variant="caption" color="text.secondary">
              jeszcze {dayEvents.length - 3}
            </Typography>
          )}
        </Box>
      </Paper>
    )
  }

  return (
    <Box sx={{ overflow: "auto", height: "100%", p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5
        }}
      >
        {cells}
      </Box>

      {infoEvent && infoAnchor && (
        <EventInformationPopover
          anchorElement={infoAnchor}
          event={infoEvent}
          onClose={closeInfoPopover}
          onEdit={editEvent}
          onDelete={deleteEvent}
        />
      )}

      {createAnchor && createDate && (
        <EventCreationPopover
          anchorEl={createAnchor}
          onClose={closeCreatePopover}
          calendars={calendars}
          categories={categories}
          initialEvent={{
            id: "",
            name: "",
            description: "",
            startDate: dayjs(createDate).toISOString(),
            endDate: dayjs(createDate).add(1, "hour").toISOString(),
            calendar: { id: "", name: "", emoji: "" },
            category: undefined,
            recurringPattern: RecurringPattern.NONE
          }}
        />
      )}
    </Box>
  )
}

export default MonthView
