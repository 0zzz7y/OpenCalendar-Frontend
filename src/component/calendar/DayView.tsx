import EventPopover from "@/component/event/EventCreationPopover"
import EventInformationPopover from "@/component/event/EventInformationPopover"
import useEvent from "@/hook/api/useEvent"
import Event from "@/type/domain/event"
import RecurringPattern from "@/type/domain/recurringPattern"
import Schedulable from "@/type/domain/schedulable"

import { useState } from "react"

import { Box } from "@mui/material"
import dayjs from "dayjs"

import DayColumn from "./DayColumn"
import DayGrid from "./DayGrid"

interface DayViewProperties {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

const DayView = ({
  date,
  events,
  calendars,
  categories,
  onEventClick
}: DayViewProperties) => {
  const { updateEvent } = useEvent()

  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

  const dayEvents = events.filter(
    (e) => e.startDate && dayjs(e.startDate).isSame(date, "day")
  )

  const handleSlotClick = (slot: HTMLElement, datetime: Date) => {
    setSelectedSlot(slot)
    setSelectedDatetime(datetime)
    setEditingEvent(null)
    setInfoEvent(null)
  }

  const handleEventClick = (event: Schedulable) => {
    if ("id" in event && "name" in event && "calendar" in event) {
      const element = document.querySelector(
        `#event-${event.id}`
      ) as HTMLElement
      if (element) {
        setInfoAnchor(element)
        setInfoEvent(event as Event)
        onEventClick?.(event as Event)
      }
    }
  }

  const handleClosePopover = () => {
    setSelectedSlot(null)
    setSelectedDatetime(null)
    setEditingEvent(null)
  }

  const handleEditEvent = () => {
    setEditingEvent(infoEvent)
    setSelectedDatetime(infoEvent ? new Date(infoEvent.startDate) : null)
    setSelectedSlot(infoAnchor)
    setInfoEvent(null)
  }

  const handleDeleteEvent = async (id: string) => {
    await updateEvent(id, { name: "" })
  }

  return (
    <>
      <Box
        display="flex"
        height="100%"
        sx={{ p: 2, height: "100vh", overflow: "auto" }}
      >
        <DayColumn
          date={date}
          events={dayEvents}
          allEvents={events}
          calendars={calendars}
          categories={categories}
          onSave={(data) => {
            if (data.id) updateEvent(data.id, data)
          }}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
        />
      </Box>

      {selectedSlot && selectedDatetime && (
        <EventPopover
          anchorEl={selectedSlot}
          onClose={handleClosePopover}
          calendars={calendars}
          categories={categories}
          initialEvent={
            editingEvent ?? {
              id: "",
              name: "",
              description: "",
              startDate: dayjs(selectedDatetime).toISOString(),
              endDate: dayjs(selectedDatetime).add(1, "hour").toISOString(),
              recurringPattern: RecurringPattern.NONE,
              calendar: calendars[0],
              category: undefined
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
