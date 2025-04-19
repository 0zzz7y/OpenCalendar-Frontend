import { useState } from "react"
import { Box } from "@mui/material"
import dayjs from "dayjs"

import TimeColumn from "./TimeColumn"
import DayColumn from "./DayColumn"
import EventPopover from "../event/EventCreationPopover"
import EventInformationPopover from "../event/EventInformationPopover"

import Event from "@/type/domain/event"

interface DayViewProperties {
  date: Date
  events: Event[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onSave: (event: Partial<Event>) => void
  onSlotClick: (element: HTMLElement, datetime: Date) => void
  onEventClick?: (event: Event) => void
}

const DayView = ({
  date,
  events,
  calendars,
  categories,
  onSave,
  onSlotClick,
  onEventClick
}: DayViewProperties) => {
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

  const dayEvents = events.filter((e) => dayjs(e.startDate).isSame(date, "day"))

  const handleSlotClick = (element: HTMLElement, datetime: Date) => {
    setSelectedSlot(element)
    setSelectedDatetime(datetime)
    setEditingEvent(null)
    setInfoEvent(null)
    onSlotClick(element, datetime)
  }

  const handleEventClick = (event: Event) => {
    const element = document.querySelector(`#event-${event.id}`) as HTMLElement
    if (element) {
      setInfoAnchor(element)
      setInfoEvent(event)
      onEventClick?.(event)
    }
  }

  const handleClosePopover = () => {
    setSelectedSlot(null)
    setSelectedDatetime(null)
    setEditingEvent(null)
  }

  const handleSave = (data: Partial<Event>) => {
    onSave(data)
    handleClosePopover()
  }

  const handleEditEvent = () => {
    setEditingEvent(infoEvent)
    setSelectedDatetime(infoEvent ? new Date(infoEvent.startDate) : null)
    setSelectedSlot(infoAnchor)
    setInfoEvent(null)
  }

  const handleDeleteEvent = (id: string) => {
    onSave({ id })
  }

  return (
    <>
      <Box
        display="flex"
        height="100%"
        sx={{ p: 2, height: "100vh", overflow: "auto" }}
      >
        <TimeColumn />
        <DayColumn
          date={date}
          events={dayEvents}
          allEvents={events}
          calendars={calendars}
          categories={categories}
          onSave={onSave}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
        />
      </Box>

      {selectedSlot && selectedDatetime && (
        <EventPopover
          anchorEl={selectedSlot}
          onClose={handleClosePopover}
          onSave={handleSave}
          calendars={calendars}
          categories={categories}
          initialEvent={
            editingEvent ?? {
              id: "",
              name: "",
              description: "",
              startDate: dayjs(selectedDatetime).toISOString(),
              endDate: dayjs(selectedDatetime).add(1, "hour").toISOString(),
              calendarId: "",
              categoryId: undefined,
              color: "#1976d2"
            }
          }
        />
      )}

      {infoEvent && infoAnchor && (
        <EventInformationPopover
          anchorEl={infoAnchor}
          event={infoEvent}
          onClose={() => setInfoEvent(null)}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </>
  )
}

export default DayView
