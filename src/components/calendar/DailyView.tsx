import { useState } from "react"
import { Box } from "@mui/material"
import dayjs from "dayjs"

import DayColumn from "./DayColumn"
import TimeColumn from "./TimeColumn"
import EventPopover from "../event/EventPopover"
import EventInformationPopover from "../event/EventInformationPopover"

import Event from "@/types/event"

interface DailyViewProperties {
  events: Event[];
  onSave: (event: Partial<Event>) => void;
  onSlotClick: (element: HTMLElement, datetime: Date) => void;
  onEventClick?: (event: Event) => void;
}

const DailyView = ({ events, onSave, onSlotClick, onEventClick }: DailyViewProperties) => {
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

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

  const today = new Date()

  return (
    <>
      <Box display="flex" height="100%" sx={{ p: 2, height: "100vh", overflow: "auto" }}>
        <TimeColumn />
        <DayColumn
          date={today}
          events={events}
          allEvents={events}
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
            startDate: dayjs(selectedDatetime).toISOString(),
            endDate: dayjs(selectedDatetime).add(1, "hour").toISOString(),
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

export default DailyView