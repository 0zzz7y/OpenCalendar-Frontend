import { Box, Typography } from "@mui/material"
import { useContext, useState } from "react"
import dayjs from "dayjs"

import DayColumn from "./DayColumn"
import EventPopover from "@/component/event/EventCreationPopover"
import EventInformationPopover from "@/component/event/EventInformationPopover"

import Event from "@/type/domain/event"
import useAppContext from "@/hook/context/useAppContext"

interface WeekViewProperties {
  date: Date
  events: Event[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

const getStartOfWeek = (date: Date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const WeekView = ({
  date,
  events,
  calendars,
  categories,
  onEventClick
}: WeekViewProperties) => {
  const { updateEvent } = useAppContext()

  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

  const weekStart = getStartOfWeek(date)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

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
      onEventClick?.(event)
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
    await updateEvent(id, { name: "" }) // implement real delete logic if needed
  }

  return (
    <>
      <Box
        display="flex"
        height="100%"
        sx={{ p: 2, height: "100vh", overflow: "auto" }}
      >
        {days.map((day, index) => {
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <Box
              key={index}
              width="100%"
              display="flex"
              flexDirection="column"
              borderRight="1px solid #ccc"
              minHeight={`${48 * 32}px`}
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
                events={(events ?? []).filter(
                  e =>
                    new Date(e.startDate).toDateString() === day.toDateString()
                )}
                allEvents={events}
                calendars={calendars}
                categories={categories}
                onSave={data => {
                  if (data.id) updateEvent(data.id, data)
                }}
                onSlotClick={handleSlotClick}
                onEventClick={handleEventClick}
              />
            </Box>
          )
        })}
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
              calendarId: "",
              categoryId: undefined
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

export default WeekView
