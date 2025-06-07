/**
 * Copyright (c) Tomasz Wnuk
 */

import { useState, useMemo, useCallback } from "react"
import { Box, Typography, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import useEvent from "@/repository/event.repository"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import DayColumn from "../day/DayColumn"
import HourLabelsColumn from "../hour/HourLabelColumn"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

export interface WeekViewProps {
  date: Date
  events: Event[]
  calendars: Calendar[]
  categories: Category[]
  onEventClick?: (event: Event) => void
}

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

  const weekDates = useMemo(() => {
    const start = getStartOfWeek(date)
    return Array.from({ length: 7 }, (_, i) => dayjs(start).add(i, "day").toDate())
  }, [date])

  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [creationPopover, setCreationPopover] = useState<{
    anchorEl?: HTMLElement
    clickedDatetime?: Date
  }>({})
  const [editingEvent, setEditingEvent] = useState<Event>()

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setInfo({})
    setEditingEvent(undefined)
    setCreationPopover({ anchorEl: anchor, clickedDatetime: datetime })
  }, [])

  const handleEventClick = useCallback(
    (sched: Schedulable) => {
      if (!("id" in sched)) return
      const evt = sched as Event
      const anchor = document.getElementById(`event-${evt.id}`)
      if (!anchor) return
      setCreationPopover({})
      setInfo({ anchor, event: evt })
      onEventClick?.(evt)
    },
    [onEventClick]
  )

  const closeAll = useCallback(() => {
    setInfo({})
    setCreationPopover({})
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
    setCreationPopover({
      anchorEl: info.anchor,
      clickedDatetime: new Date(ev.startDate)
    })
  }, [info])

  const newEvent: Event | undefined = creationPopover.clickedDatetime
    ? {
        id: "",
        name: "",
        description: "",
        startDate: creationPopover.clickedDatetime.toISOString(),
        endDate: dayjs(creationPopover.clickedDatetime).add(1, "hour").toISOString(),
        recurringPattern: RecurringPattern.NONE,
        calendar: { id: calendars[0].id, name: calendars[0].name, emoji: calendars[0].emoji },
        category: undefined
      }
    : undefined

  return (
    <>
      <Box display="flex" flexDirection="column" flex={1} sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "60px repeat(7, 1fr)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.default,
            zIndex: 1,
            pr: 2
          }}
        >
          <Box />
          {weekDates.map((d) => {
            const isToday = dayjs(d).isSame(dayjs(), "day")
            return (
              <Box
                key={d.toISOString()}
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

        <Box
          flex={1}
          sx={{
            overflowY: "auto",
            pb: 4
          }}
        >
          <Box display="flex">
            <HourLabelsColumn />
            {weekDates.map((d) => {
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

      {creationPopover.anchorEl && creationPopover.clickedDatetime && (
        <EventCreationPopover
          anchorEl={creationPopover.anchorEl}
          clickedDatetime={creationPopover.clickedDatetime}
          calendars={calendars}
          categories={categories}
          onClose={() => setCreationPopover({ anchorEl: undefined, clickedDatetime: undefined })}
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
