import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import dayjs from "dayjs"

import WeeklyView from "../calendar/WeeklyView"
import DailyView from "../calendar/DailyView"
import MonthlyView from "../calendar/MonthlyView"
import EventPopover from "../event/EventPopover"
import EventInformationPopover from "../event/EventInformationPopover"

import Event from "@/types/event"

const CenterPanel = () => {
  const [view, setView] = useState("week")
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  const handleSlotClick = (element: HTMLElement, datetime: Date) => {
    setSelectedSlot(element)
    setSelectedDatetime(datetime)
    setEditingEvent(null)
    setInfoEvent(null)
  }

  const handleEventClick = (event: Event) => {
    const element = document.querySelector(`#event-${event.id}`) as HTMLElement
    if (element) {
      setInfoAnchor(element)
      setInfoEvent(event)
    }
  }

  const handleClosePopover = () => {
    setSelectedSlot(null)
    setSelectedDatetime(null)
    setEditingEvent(null)
  }

  const handleSave = (data: Partial<Event>) => {
    if (!data.startDate) return

    const exists = events.find((e) => e.id === data.id)
    const id = exists?.id || crypto.randomUUID()

    const newEvent: Event = {
      id,
      name: data.name ?? "Nowe wydarzenie",
      description: data.description ?? "",
      startDate: data.startDate,
      endDate: data.endDate ?? data.startDate,
      color: data.color ?? "#1976d2",
      calendarId: data.calendarId ?? "",
      categoryId: data.categoryId
    }

    setEvents((prev) =>
      exists ? prev.map((e) => (e.id === id ? newEvent : e)) : [...prev, newEvent]
    )

    handleClosePopover()
  }

  const handleEditEvent = () => {
    setEditingEvent(infoEvent)
    setSelectedDatetime(infoEvent ? new Date(infoEvent.startDate) : null)
    setSelectedSlot(infoAnchor)
    setInfoEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1}
      >
        <Typography variant="h5">Lipiec, 2025</Typography>

        <Box display="flex" gap={2}>
          <Button onClick={() => setView("day")} variant={view === "day" ? "outlined" : "text"}>Dzień</Button>
          <Button onClick={() => setView("week")} variant={view === "week" ? "outlined" : "text"}>Tydzień</Button>
          <Button onClick={() => setView("month")} variant={view === "month" ? "outlined" : "text"}>Miesiąc</Button>
        </Box>
      </Box>

      {view === "day" && (
        <DailyView
          events={events}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
        />
      )}
      {view === "week" && (
        <WeeklyView
          events={events}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
          onEventClick={handleEventClick}
        />
      )}

      {selectedSlot && selectedDatetime && (
        <EventPopover
          anchorEl={selectedSlot}
          onClose={handleClosePopover}
          onSave={handleSave}
          calendars={[
            { id: "personal", name: "Osobisty", emoji: "🗓" },
            { id: "work", name: "Praca", emoji: "💼" }
          ]}
          categories={[
            { id: "study", name: "Uczelnia", color: "#F44336" },
            { id: "dog", name: "Spacer", color: "#FFEB3B" }
          ]}
          initialEvent={editingEvent ?? {
            id: "",
            name: "",
            description: "",
            startDate: selectedDatetime.toISOString(),
            endDate: new Date(selectedDatetime.getTime() + 60 * 60 * 1000).toISOString(),
            calendarId: "",
            categoryId: undefined,
            color: "#1976d2"
          }}
        />
      )}

      <EventInformationPopover
        anchorEl={infoAnchor}
        event={infoEvent}
        onClose={() => setInfoEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  )
}

export default CenterPanel
