import useEvent from "@/hook/useEvent"
import useTask from "@/hook/useTask"

import EventPopover from "@/component/event/EventCreationPopover"
import EventInformationPopover from "@/component/event/EventInformationPopover"
import CalendarViewSwitcher from "@/component/calendar/CalendarViewSwitcher"
import DayView from "@/component/calendar/DayView"
import WeekView from "@/component/calendar/WeekView"
import MonthView from "@/component/calendar/MonthView"

import RecurringPattern from "@/model/domain/recurringPattern"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

import { Box, Typography, Button } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

import dayjs, { ManipulateType } from "dayjs"
import { useEffect, useState } from "react"
import Task from "@/model/domain/task"
import useAppStore from "@/store/useAppStore"
import useCalendar from "@/hook/useCalendar"
import useNote from "@/hook/useNote"
import useCategory from "@/hook/useCategory"
import ViewType from "@/model/utility/viewType"
import viewType from "@/model/utility/viewType"
import YearView from "./YearView"

const CalendarPanel = () => {
  const { addEvent, updateEvent, deleteEvent, reloadEvents } = useEvent()
  const { reloadTasks } = useTask()
  const { reloadCalendars } = useCalendar()
  const { reloadNotes } = useNote()
  const { reloadCategories } = useCategory()
  const { events, tasks, calendars, categories } = useAppStore()
  const { selectedCalendar, selectedCategory } = useAppStore()

  const [view, setView] = useState<ViewType>(ViewType.WEEK)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState<HTMLElement | null>(null)
  const [selectedDatetime, setSelectedDatetime] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [infoEvent, setInfoEvent] = useState<Event | null>(null)
  const [infoAnchor, setInfoAnchor] = useState<HTMLElement | null>(null)

  useEffect(() => {
    reloadCalendars()
    reloadCategories()
    reloadEvents()
    reloadTasks()
    reloadNotes()
  }, [])

  const safeEvents: Event[] = Array.isArray(events) ? events : []
  const safeTasks: Task[] = Array.isArray(tasks) ? tasks : []

  const schedulables: Schedulable[] = [
    ...safeEvents,
    ...safeTasks.filter((task) => task.startDate && task.endDate)
  ].filter((item) => {
    const calendarMatch =
      selectedCalendar === "all" || item.calendar.id === selectedCalendar
    const categoryMatch =
      selectedCategory === "all" || item.category?.id === selectedCategory
    return calendarMatch && categoryMatch
  })

  const handleSlotClick = (el: HTMLElement, date: Date) => {
    setSelectedSlot(el)
    setSelectedDatetime(date)
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

    const exists = events.find((e) => e.id === data.id)
    if (exists && data.id) {
      await updateEvent(data.id, data)
    } else {
      const newEvent: Omit<Event, "id"> = {
        name: data.name ?? "New event",
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
    if (!infoEvent) return
    setEditingEvent(infoEvent)
    setSelectedDatetime(new Date(infoEvent.startDate))
    setSelectedSlot(infoAnchor)
    setInfoEvent(null)
  }

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id)
    setInfoEvent(null)
  }

  const navigate = (dir: "previous" | "next") => {
    const unit = view === ViewType.MONTH ? ViewType.MONTH : view === ViewType.WEEK ? ViewType.WEEK : ViewType.DAY
    const delta = dir === "next" ? 1 : -1
    setSelectedDate(dayjs(selectedDate).add(delta, view.toLowerCase() as ManipulateType).toDate())
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => navigate("previous")}> <ChevronLeftIcon /> </Button>
          <Typography variant="h6">
            {dayjs(selectedDate).format(view === ViewType.MONTH ? "MMMM YYYY" : "DD MMM YYYY")}
          </Typography>
          <Button onClick={() => navigate("next")}> <ChevronRightIcon /> </Button>
        </Box>
        <CalendarViewSwitcher view={view} onChange={setView} />
      </Box>

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
          onEventClick={handleEventClick}
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
              endDate: dayjs(selectedDatetime).add(1, "hour").toISOString(),
              calendar: calendars[0],
              category: undefined,
              recurringPattern: RecurringPattern.NONE
            }
          }
        />
      )}

      {infoEvent && infoAnchor && (
        <EventInformationPopover
          anchorElement={infoAnchor}
          event={infoEvent}
          onClose={() => setInfoEvent(null)}
          onEdit={handleEditEvent}
          onDelete={() => handleDeleteEvent(infoEvent.id)}
        />
      )}
    </>
  )
}

export default CalendarPanel
