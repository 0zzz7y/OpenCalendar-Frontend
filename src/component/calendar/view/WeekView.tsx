// src/component/calendar/view/WeekView.tsx
import React, { useState, useMemo, useCallback } from "react"
import { Box, Typography, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import useEvent from "@/repository/event.repository"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import DayColumn from "../DayColumn"
import HourLabelsColumn from "../HourLabelColumn"

export interface WeekViewProps {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

// Helper: Monday‐based week start
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function WeekView({ date, events, calendars, categories, onEventClick }: WeekViewProps) {
  const theme = useTheme()
  const { updateEvent, reloadEvents } = useEvent()

  // Build array of 7 dates (Mon–Sun)
  const weekDates = useMemo(() => {
    const start = getStartOfWeek(date)
    return Array.from({ length: 7 }, (_, i) => dayjs(start).add(i, "day").toDate())
  }, [date])

  // Popover state
  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [creation, setCreation] = useState<{
    anchor?: HTMLElement
    datetime?: Date
  }>({})
  const [editingEvent, setEditingEvent] = useState<Event>()

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

  // Template for new event
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
      <Box display="flex" flexDirection="column" flex={1} sx={{ height: "100%" }}>
        {/* 1) Day‐of‐week header */}
        <Box
          display="flex"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            zIndex: 1
          }}
        >
          {weekDates.map((d) => {
            const isToday = dayjs(d).isSame(dayjs(), "day")
            return (
              <Box
                key={d.toISOString()}
                flex={1}
                textAlign="center"
                py={1}
                sx={{
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  "&:first-of-type": {
                    borderLeft: "none"
                  }
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    width: 32,
                    height: 32,
                    lineHeight: "32px",
                    textAlign: "center",
                    borderRadius: "50%",
                    bgcolor: isToday ? theme.palette.primary.main : "transparent",
                    color: isToday ? "#fff" : "inherit",
                    margin: "0 auto"
                  }}
                >
                  {dayjs(d).date()}
                </Typography>
                <Typography variant="caption">{dayjs(d).format("dddd")}</Typography>
              </Box>
            )
          })}
        </Box>

        {/* 2) Scrollable grid */}
        <Box
          flex={1}
          sx={{
            overflowY: "auto",
            // you can also add paddingBottom: 4 to see the 11:30 slot
            pb: 4
          }}
        >
          <Box display="flex">
            <HourLabelsColumn />
            {weekDates.map((d, idx) => {
              const dayEvents = events.filter((e) => e.startDate && dayjs(e.startDate).isSame(d, "day"))
              return (
                <Box
                  key={d.toISOString()}
                  flex={1}
                  sx={{
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "&:first-of-type": {
                      borderLeft: "none"
                    },
                    "&:last-of-type": {
                      borderRight: `1px solid ${theme.palette.divider}`
                    }
                  }}
                >
                  <DayColumn
                    date={d}
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
        </Box>
      </Box>

      {/* Popovers */}
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
