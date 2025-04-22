import useFilters from "@/hook/api/useFilter"
import useAppContext from "@/hook/context/useAppContext"
import Event from "@/type/domain/event"
import RecurringPattern from "@/type/domain/recurringPattern"

import { useEffect, useState } from "react"

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Box, Typography, Button } from "@mui/material"
import dayjs from "dayjs"

import CalendarViewSwitcher from "../calendar/CalendarViewSwitcher"
import EventPopover from "../event/EventCreationPopover"
import EventInformationPopover from "../event/EventInformationPopover"
import DayView from "./DayView"
import MonthView from "./MonthView"
import WeekView from "./WeekView"

const CalendarPanel = () => {
  const {
    events,
    calendars,
    categories,
    addEvent,
    updateEvent,
    deleteEvent,
    reloadEvents
  } = useAppContext()

  const { selectedCalendar, selectedCategory } = useFilters()

  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        const calendarMatch =
          selectedCalendar === "all" || event.calendar.id === selectedCalendar
        const categoryMatch =
          selectedCategory === "all" || event.category?.id === selectedCategory
        return calendarMatch && categoryMatch
      })
    : []

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

  const handleSave = async (data: Partial<Event>) => {
    if (!data.startDate || !data.calendar) return

    const exists = events.find(
      (e: { id: string | undefined }) => e.id === data.id
    )

    if (exists && data.id) {
      await updateEvent(data.id, data)
    } else {
      const newEvent: Omit<Event, "id"> = {
        name: data.name ?? "Nowe wydarzenie",
        description: data.description ?? "",
        startDate: data.startDate,
        endDate: data.endDate ?? data.startDate,
        calendar: data.calendar,
        category: data.category,
        recurringPattern: RecurringPattern.NONE
      }

      await addEvent(newEvent)
    }

    handleClosePopover()
  }

  const handleEditEvent = () => {
    setEditingEvent(infoEvent)
    setSelectedDatetime(infoEvent ? new Date(infoEvent.startDate) : null)
    setSelectedSlot(infoAnchor)
    setInfoEvent(null)
  }

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id)
    setInfoEvent(null)
  }

  const navigate = (direction: "prev" | "next") => {
    const unit = view === "month" ? "month" : view === "week" ? "week" : "day"
    const delta = direction === "next" ? 1 : -1
    setSelectedDate(dayjs(selectedDate).add(delta, unit).toDate())
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
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => navigate("prev")} size="large">
            <ChevronLeftIcon fontSize="medium" />
          </Button>
          <Typography variant="h6">
            {dayjs(selectedDate).format(
              view === "month" ? "MMMM YYYY" : "DD MMM YYYY"
            )}
          </Typography>
          <Button onClick={() => navigate("next")} size="large">
            <ChevronRightIcon fontSize="medium" />
          </Button>
        </Box>

        <CalendarViewSwitcher view={view} onChange={setView} />
      </Box>

      {view === "day" && (
        <DayView
          date={selectedDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

      {view === "week" && (
        <WeekView
          date={selectedDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

      {view === "month" && (
        <MonthView
          date={selectedDate}
          events={filteredEvents}
          onSlotClick={handleSlotClick}
          onSave={handleSave}
          onEventClick={handleEventClick}
          calendars={calendars}
          categories={categories}
        />
      )}

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
              startDate: selectedDatetime.toISOString(),
              endDate: new Date(
                selectedDatetime.getTime() + 60 * 60 * 1000
              ).toISOString(),
              calendar: calendars[0],
              category: undefined,
              recurringPattern: RecurringPattern.NONE
            }
          }
        />
      )}

      <EventInformationPopover
        anchorEl={infoAnchor}
        event={infoEvent}
        onClose={() => setInfoEvent(null)}
        onEdit={handleEditEvent}
        onDelete={() => infoEvent && handleDeleteEvent(infoEvent.id)}
      />
    </>
  )
}

export default CalendarPanel
