import React, { useState, useMemo, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import useEvent from "@/repository/event.repository"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import DayColumn from "../DayColumn"

export interface WeekViewProps {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

// Calculate Monday start of week
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function WeekView({ date, events, calendars, categories, onEventClick }: WeekViewProps) {
  const { updateEvent, reloadEvents } = useEvent()

  // Compute week days
  const weekDates = useMemo(() => {
    const start = getStartOfWeek(date)
    return Array.from({ length: 7 }, (_, i) => dayjs(start).add(i, "day").toDate())
  }, [date])

  // Popover states
  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [creation, setCreation] = useState<{ anchor?: HTMLElement; datetime?: Date }>({})
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setInfo({})
    setEditingEvent(undefined)
    setCreation({ anchor, datetime })
  }, [])

  const handleEventClick = useCallback(
    (sched: Schedulable) => {
      if (!("id" in sched)) return
      const evt = sched as Event
      const anchor = document.getElementById(`event-${evt.id}`)
      if (!anchor) return
      setCreation({})
      setInfo({ anchor, event: evt })
      onEventClick?.(evt)
    },
    [onEventClick]
  )

  const closeAll = useCallback(() => {
    setInfo({})
    setCreation({})
    setEditingEvent(undefined)
  }, [])

  const handleSave = useCallback(
    async (payload: Partial<Event> & { id?: string }) => {
      if (payload.id) {
        const original = events.find((e): e is Event => e.id === payload.id)
        if (original) {
          await updateEvent({ ...original, ...payload })
          await reloadEvents()
        }
      }
      closeAll()
    },
    [events, updateEvent, reloadEvents, closeAll]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const original = events.find((e): e is Event => e.id === id)
      if (original) {
        await updateEvent({ ...original, name: "" })
        await reloadEvents()
      }
      setInfo({})
    },
    [events, updateEvent, reloadEvents]
  )

  const handleEdit = useCallback(() => {
    if (!info.anchor || !info.event) return
    const ev = info.event
    setInfo({})
    setEditingEvent(ev)
    setCreation({ anchor: info.anchor, datetime: new Date(ev.startDate) })
  }, [info])

  // Prepare new event template
  const newEvent: Event | undefined = creation.datetime
    ? {
        id: "",
        name: "",
        description: "",
        startDate: creation.datetime.toISOString(),
        endDate: dayjs(creation.datetime).add(1, "hour").toISOString(),
        recurringPattern: RecurringPattern.NONE,
        calendar: calendars[0],
        category: undefined
      }
    : undefined

  return (
    <>
      <Box display="flex" height="100%" sx={{ p: 2, height: "100vh", overflow: "auto" }}>
        {weekDates.map((dayDate) => {
          const dayKey = dayjs(dayDate).format("YYYY-MM-DD")
          const isToday = dayjs(dayDate).isSame(dayjs(), "day")
          const dayEvents = events.filter((e) => e.startDate && dayjs(e.startDate).isSame(dayDate, "day"))

          return (
            <Box
              key={dayKey}
              display="flex"
              flexDirection="column"
              borderRight="1px solid #ccc"
              sx={{ width: "100%", minWidth: 0 }}
            >
              <Box px={1} py={1} textAlign="center" borderBottom="1px solid #ddd" height={50}>
                <Typography
                  variant="h6"
                  sx={{
                    backgroundColor: isToday ? (theme) => theme.palette.primary.main : "transparent",
                    color: isToday ? "#fff" : "inherit",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    lineHeight: "32px",
                    margin: "0 auto"
                  }}
                >
                  {dayjs(dayDate).date()}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5 }}>
                  {dayjs(dayDate).format("ddd")}
                </Typography>
              </Box>

              <DayColumn
                date={dayDate}
                events={dayEvents}
                calendars={calendars}
                categories={categories}
                onSave={handleSave}
                onSlotClick={handleSlotClick}
                onEventClick={handleEventClick}
              />
            </Box>
          )
        })}
      </Box>

      {creation.anchor && creation.datetime && (
        <EventCreationPopover
          anchorEl={creation.anchor}
          onClose={closeAll}
          calendars={calendars}
          categories={categories}
          initialEvent={editingEvent || newEvent}
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
