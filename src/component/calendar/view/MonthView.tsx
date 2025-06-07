/**
 * Copyright (c) Tomasz Wnuk
 */

import { useState, useMemo, useCallback } from "react"
import { Box, Typography, Paper, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"
import useEvent from "@/repository/event.repository"

export interface MonthViewProps {
  date: Date
  events: Event[]
  calendars: Calendar[]
  categories: Category[]
  onSave: (data: Partial<Event>) => void
  onSlotClick?: (element: HTMLElement, datetime: Date) => void
  onEventClick?: (event: Event) => void
}

export default function MonthView({
  date,
  events,
  calendars,
  categories,
  onSlotClick,
  onEventClick
}: MonthViewProps) {
  const { reloadEvents, updateEvent } = useEvent()
  const theme = useTheme()

  const { gridDates, todayString } = useMemo(() => {
    const startOfMonth = dayjs(date).startOf("month")
    const startDay = startOfMonth.startOf("week")
    const dates = Array.from({ length: 42 }, (_, i) => startDay.add(i, "day").toDate())
    return { gridDates: dates, todayString: dayjs().format("YYYY-MM-DD") }
  }, [date])

  const weekDayNames = useMemo(() => {
    const startOfWeek = dayjs(date).startOf("week")
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day").format("dddd"))
  }, [date])

  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [creation, setCreation] = useState<{
    anchor?: HTMLElement
    datetime?: Date
    event?: Event
  }>({})

  const openInfo = useCallback(
    (sched: Schedulable, anchor: HTMLElement) => {
      if (!("id" in sched)) return
      setCreation({})
      setInfo({ anchor, event: sched as Event })
      onEventClick?.(sched as Event)
    },
    [onEventClick]
  )

  const closeInfo = useCallback(() => setInfo({}), [])
  const closeCreation = useCallback(() => setCreation({}), [])

  const openCreation = useCallback(
    (anchor: HTMLElement, datetime: Date) => {
      setInfo({})
      setCreation({ anchor, datetime })
      onSlotClick?.(anchor, datetime)
    },
    [onSlotClick]
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
    setCreation({
      anchor: info.anchor,
      datetime: new Date(ev.startDate),
      event: ev
    })
  }, [info])

  return (
    <Box sx={{ overflow: "auto", height: "100%", p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          mb: 1
        }}
      >
        {weekDayNames.map((name) => (
          <Typography key={name} variant="subtitle2" align="center">
            {name}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5
        }}
      >
        {gridDates.map((dayDate) => {
          const dayStr = dayjs(dayDate).format("YYYY-MM-DD")
          const isToday = dayStr === todayString
          const dayEvents = events.filter((e) => e.startDate && dayjs(e.startDate).format("YYYY-MM-DD") === dayStr)

          return (
            <Paper
              key={dayStr}
              elevation={0}
              onClick={(e) => openCreation(e.currentTarget as HTMLElement, dayDate)}
              sx={{
                height: 120,
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                transition: "background-color 0.15s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#3d3d3d" : "#e0e0e0"
                }
              }}
            >
              <Typography variant="body2" fontWeight="bold" color={isToday ? theme.palette.primary.main : "inherit"}>
                {dayjs(dayDate).format("D")}
              </Typography>

              <Box
                sx={{
                  mt: 0.5,
                  overflowY: "auto",
                  maxHeight: 75,
                  position: "relative",
                  "&::-webkit-scrollbar": {
                    display: "none"
                  },
                  "-ms-overflow-style": "none",
                  "scrollbar-width": "none"
                }}
              >
                {dayEvents.map((ev) => (
                  <Box
                    key={ev.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 0.5,
                      mb: 0.5,
                      overflow: "hidden",
                      maxWidth: "100%",
                      "&:hover": { bgcolor: theme.palette.action.hover }
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      openInfo(ev, e.currentTarget as HTMLElement)
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: ev.category?.color,
                        flexShrink: 0,
                        borderRadius: "50%"
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flexGrow: 1,
                        minWidth: 0
                      }}
                    >
                      {dayjs(ev.startDate).format("H:mm")} {ev.name} {ev.calendar?.emoji}
                    </Typography>
                  </Box>
                ))}

                {dayEvents.length > 3 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -7,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      pointerEvents: "none"
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      ▼
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          )
        })}
      </Box>

      {info.anchor && info.event && (
        <EventInformationPopover
          anchorElement={info.anchor}
          event={info.event}
          onClose={closeInfo}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {creation.anchor && creation.datetime && (
        <EventCreationPopover
          anchorEl={creation.anchor}
          onClose={closeCreation}
          calendars={calendars}
          categories={categories}
          initialEvent={
            creation.event
              ? creation.event
              : {
                  id: "",
                  name: "",
                  description: "",
                  startDate: creation.datetime.toISOString(),
                  endDate: dayjs(creation.datetime).add(1, "hour").toISOString(),
                  calendar: { ...calendars[0], name: calendars[0].name },
                  category: undefined,
                  recurringPattern: RecurringPattern.NONE
                }
          }
        />
      )}
    </Box>
  )
}
