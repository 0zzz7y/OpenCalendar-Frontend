import { useMemo, useCallback, useState, useEffect } from "react"
import { Box, Typography, Button } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import dayjs, { type ManipulateType } from "dayjs"

import { CalendarView } from "./view/calendarView.type"
import { RecurringPattern } from "@/features/event/recurringPattern.type"
import type { Event } from "@/features/event/event.model"
import { useStorage } from "@/storage/useStorage.hook"
import { Filter } from "@/features/filter/filter.type"
import { useEvent } from "@/features/event/useEvent.hook"

import CalendarViewSwitcher from "@/components/calendar/CalendarViewSwitcher"
import DayView from "@/components/calendar/view/DayView"
import WeekView from "@/components/calendar/view/WeekView"
import MonthView from "@/components/calendar/view/MonthView"
import YearView from "@/components/calendar/view/YearView"
import EventCreationPopover from "@/components/event/EventCreationPopover"
import EventInformationPopover from "../event/EventInformationPopover"
import { useGenerateRecurringEvents } from "@/features/event/useGenerateRecurringEvents.hook"

interface CalendarPanelProperties {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  view: CalendarView
  setView: (view: CalendarView) => void
  jumpToDate: Date | null
  setJumpToDate: (date: Date | null) => void
}

export default function CalendarPanel({
  selectedDate,
  setSelectedDate,
  view,
  setView,
  jumpToDate,
  setJumpToDate
}: CalendarPanelProperties) {
  const { events, calendars, categories, selectedCalendar, selectedCategory } = useStorage()
  const { addEvent, updateEvent, deleteEvent, reloadEvents } = useEvent()

  const navigate = useCallback(
    (direction: "previous" | "next") => {
      const unit: ManipulateType = view === CalendarView.MONTH ? "month" : view === CalendarView.DAY ? "day" : "week"
      const delta = direction === "next" ? 1 : -1
      const newDate = dayjs(selectedDate).add(delta, unit).toDate()
      setSelectedDate(newDate)
    },
    [view, selectedDate, setSelectedDate]
  )

  const schedulables: Event[] = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : []
    const schedulables = [...safeEvents]

    const expandedEvents = schedulables.flatMap((event) => {
      const recurringInstances = useGenerateRecurringEvents(event)

      return [
        event,
        ...recurringInstances.filter((instance) => {
          if (!instance.startDate || !("startDate" in event && event.startDate)) return true
          const isSameDay = dayjs(instance.startDate).isSame(event.startDate, "day")
          return !isSameDay
        })
      ]
    })

    return expandedEvents.filter((item) => {
      const calMatch = !selectedCalendar || selectedCalendar === Filter.ALL || item.calendar.id === selectedCalendar
      const catMatch = !selectedCategory || selectedCategory === Filter.ALL || item.category?.id === selectedCategory
      return calMatch && catMatch
    })
  }, [events, selectedCalendar, selectedCategory])

  const [creation, setCreation] = useState<{ anchor?: HTMLElement; datetime?: Date }>({})
  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setInfo({})
    setEditingEvent(undefined)
    setCreation({ anchor, datetime })
  }, [])

  const handleEventClick = useCallback((event: Event) => {
    const anchor = document.getElementById(`event-${event.id}`)
    if (!anchor) return
    setCreation({})
    setInfo({ anchor, event })
  }, [])

  const closeAll = useCallback(() => {
    setCreation({})
    setInfo({})
    setEditingEvent(undefined)
  }, [])

  const handleSave = useCallback(
    async (data: Partial<Event> & { id?: string }) => {
      if (!data.startDate || !data.calendar) {
        return
      }
      if (data.id) {
        const original = events.find((e): e is Event => e.id === data.id)
        if (original) {
          await updateEvent({ ...original, ...data })
        }
      } else {
        const newEvent: Omit<Event, "id"> = {
          name: data.name || "New Event",
          description: data.description || "",
          startDate: data.startDate,
          endDate: data.endDate || data.startDate,
          calendar: data.calendar,
          category: data.category,
          recurringPattern: RecurringPattern.NONE
        }
        await addEvent(newEvent)
      }
      await reloadEvents()
      closeAll()
    },
    [events, updateEvent, addEvent, reloadEvents, closeAll]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteEvent(id)
      setInfo({})
    },
    [deleteEvent]
  )

  const handleEdit = useCallback(() => {
    if (!info.anchor || !info.event) return
    const ev = info.event
    setInfo({})
    setEditingEvent(ev)
    setCreation({ anchor: info.anchor, datetime: new Date(ev.startDate) })
  }, [info])

  useEffect(() => {
    if (jumpToDate) {
      setSelectedDate(jumpToDate)
      setJumpToDate(null)
    }
  }, [jumpToDate, setSelectedDate, setJumpToDate])

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => navigate("previous")}>
            <ChevronLeftIcon />
          </Button>
          <Typography variant="h6">
            {dayjs(selectedDate).format(view === CalendarView.MONTH ? "MMMM YYYY" : "DD MMM YYYY")}
          </Typography>
          <Button onClick={() => navigate("next")}>
            <ChevronRightIcon />
          </Button>
        </Box>
        <CalendarViewSwitcher view={view} onChange={setView} />
      </Box>

      <Box sx={{ height: "100%", overflow: "auto", pb: 8 }}>
        {view === CalendarView.DAY && (
          <DayView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onEventClick={handleEventClick}
          />
        )}
        {view === CalendarView.WEEK && (
          <WeekView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onEventClick={handleEventClick}
          />
        )}
        {view === CalendarView.MONTH && (
          <MonthView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onSlotClick={handleSlotClick}
            onSave={handleSave}
            onEventClick={handleEventClick}
          />
        )}
        {view === CalendarView.YEAR && (
          <YearView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onSave={handleSave}
            onEventClick={handleEventClick}
          />
        )}
      </Box>

      {creation.anchor && creation.datetime && (
        <EventCreationPopover
          anchorEl={creation.anchor}
          onClose={closeAll}
          calendars={calendars}
          categories={categories}
          initialEvent={
            editingEvent || {
              id: "",
              name: "",
              description: "",
              startDate: creation.datetime.toISOString(),
              endDate: dayjs(creation.datetime).add(1, "hour").toISOString(),
              calendar: calendars[0],
              category: undefined,
              recurringPattern: RecurringPattern.NONE
            }
          }
        />
      )}

      {info.anchor && info.event && (
        <EventInformationPopover
          anchorElement={info.anchor}
          event={info.event}
          onClose={() => setInfo({})}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}
