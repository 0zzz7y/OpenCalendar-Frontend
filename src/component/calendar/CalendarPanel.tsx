// CalendarPanel.tsx
import React, { useMemo, useCallback, useState, useEffect } from "react"
import { Box, Typography, Button } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import dayjs, { type ManipulateType } from "dayjs"

import ViewType from "@/model/utility/viewType"
import RecurringPattern from "@/model/domain/recurringPattern"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

import useApplicationStorage from "@/storage/useApplicationStorage"
import FILTER from "@/constant/utility/filter"
import useEvent from "@/repository/event.repository"

import CalendarViewSwitcher from "@/component/calendar/CalendarViewSwitcher"
import DayView from "@/component/calendar/view/DayView"
import WeekView from "@/component/calendar/view/WeekView"
import MonthView from "@/component/calendar/view/MonthView"
import YearView from "@/component/calendar/view/YearView"
import { EventCreationPopover as EventPopover, EventInformationPopover } from "@/component/event"
import { generateRecurringSchedulables } from "@/function/schedulable/generateRecurringSchedulables"

interface CalendarPanelProperties {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  view: ViewType
  setView: (view: ViewType) => void
  jumpToDate: Date | null
  setJumpToDate: (date: Date | null) => void
}

export default function CalendarPanel({ selectedDate, setSelectedDate, view, setView, jumpToDate, setJumpToDate }: CalendarPanelProperties) {
  // Stores & repositories
  const { events, tasks, calendars, categories, selectedCalendar, selectedCategory } = useApplicationStorage()
  const { addEvent, updateEvent, deleteEvent, reloadEvents } = useEvent()

  const navigate = useCallback(
    (direction: "previous" | "next") => {
      const unit: ManipulateType =
        view === ViewType.MONTH ? "month" : view === ViewType.DAY ? "day" : "week"
      const delta = direction === "next" ? 1 : -1
      const newDate = dayjs(selectedDate).add(delta, unit).toDate()
      setSelectedDate(newDate)
    },
    [view, selectedDate, setSelectedDate]
  )

  const schedulables: Schedulable[] = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : []
    const safeTasks = Array.isArray(tasks) ? tasks : []
  
    const expandedEvents = safeEvents.flatMap((event) => {
      const recurringInstances = generateRecurringSchedulables(event)
  
      return [
        event,
        ...recurringInstances.filter((instance) => {
          // Nie pokazuj jeśli data kopii == data oryginału
          if (!instance.startDate || !event.startDate) return true
          const isSameDay = dayjs(instance.startDate).isSame(event.startDate, "day")
          return !isSameDay
        })
      ]
    })
  
    const combined: Schedulable[] = [
      ...expandedEvents,
      ...safeTasks.filter((t) => t.startDate && t.endDate)
    ]
  
    return combined.filter((item) => {
      const calMatch = !selectedCalendar || selectedCalendar === FILTER.ALL || item.calendar.id === selectedCalendar
      const catMatch = !selectedCategory || selectedCategory === FILTER.ALL || item.category?.id === selectedCategory
      return calMatch && catMatch
    })
  }, [events, tasks, selectedCalendar, selectedCategory])

  // Popover & editing state
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
      {/* Toolbar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => navigate("previous")}>
            <ChevronLeftIcon />
          </Button>
          <Typography variant="h6">
            {dayjs(selectedDate).format(view === ViewType.MONTH ? "MMMM YYYY" : "DD MMM YYYY")}
          </Typography>
          <Button onClick={() => navigate("next")}>
            <ChevronRightIcon />
          </Button>
        </Box>
        <CalendarViewSwitcher view={view} onChange={setView} />
      </Box>

      {/* Main view */}
      <Box sx={{ height: "100%", overflow: "auto", pb: 8 }}>
        {view === ViewType.DAY && (
          <DayView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onEventClick={handleEventClick}
          />
        )}
        {view === ViewType.WEEK && (
          <WeekView
            date={selectedDate}
            events={schedulables}
            calendars={calendars}
            categories={categories}
            onEventClick={handleEventClick}
          />
        )}
        {view === ViewType.MONTH && (
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
        {view === ViewType.YEAR && (
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

      {/* Popovers */}
      {creation.anchor && creation.datetime && (
        <EventPopover
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
