import React, { useState, useMemo, useCallback } from "react"
import { Box, Typography, Paper, useTheme } from "@mui/material"
import { lighten, darken } from "@mui/material/styles"
import dayjs from "dayjs"
import { EventInformationPopover, DayEventsPopover } from "@/component/event"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

export interface YearViewProps {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

export default function YearView({ date, events, calendars, categories, onEventClick }: YearViewProps) {
  const theme = useTheme()

  // Generate list of months and today's string
  const { months, todayString } = useMemo(() => {
    const year = date.getFullYear()
    const m = Array.from({ length: 12 }, (_, i) => dayjs(new Date(year, i, 1)))
    return { months: m, todayString: dayjs().format("YYYY-MM-DD") }
  }, [date])

  // Full weekday names (e.g. "Monday", "Tuesday", …)
  const weekDayNamesFull = useMemo(() => {
    const startOfWeek = dayjs().startOf("week")
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day").format("ddd"))
  }, [])

  // Popover states
  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [dayPopover, setDayPopover] = useState<{
    anchor?: HTMLElement
    date?: Date
  }>({})

  const openInfo = useCallback(
    (sched: Schedulable, anchor: HTMLElement) => {
      if (!("id" in sched)) return
      setDayPopover({})
      setInfo({ anchor, event: sched as Event })
      onEventClick?.(sched as Event)
    },
    [onEventClick]
  )

  const closeInfo = useCallback(() => setInfo({}), [])
  const openDayPopover = useCallback((anchor: HTMLElement, date: Date) => {
    setInfo({})
    setDayPopover({ anchor, date })
  }, [])
  const closeDayPopover = useCallback(() => setDayPopover({}), [])

  return (
    <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 2
        }}
      >
        {months.map((month) => {
          const monthKey = month.format("YYYY-MM")
          const daysInMonth = month.daysInMonth()
          const startOffset = month.startOf("month").day()

          return (
            <Paper key={monthKey} sx={{ p: 1 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ mb: 2 }} // add bottom margin to month header
              >
                {month.format("MMMM YYYY")}
              </Typography>
              {/* Full day‐of‐week header */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  mb: 1,
                  justifyItems: "center", // center horizontally
                  alignItems: "center" // center vertically
                }}
              >
                {weekDayNamesFull.map((dayName) => (
                  <Typography key={dayName} variant="caption">
                    {dayName}
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
                {Array.from({ length: startOffset + daysInMonth }).map((_, idx) => {
                  const dayIndex = idx - startOffset + 1
                  const isValid = dayIndex >= 1
                  const dayDate = isValid ? new Date(month.year(), month.month(), dayIndex) : undefined
                  const dayKey = isValid ? dayjs(dayDate).format("YYYY-MM-DD") : `${monthKey}-empty-${idx}`
                  const isToday = isValid && dayjs(dayDate).format("YYYY-MM-DD") === todayString

                  const dayEvents = isValid
                    ? events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(dayDate, "day"))
                    : []

                  return (
                    <Box
                      key={dayKey}
                      onClick={(e) =>
                        isValid &&
                        openDayPopover(e.currentTarget as HTMLElement, dayDate ? new Date(dayDate) : new Date())
                      }
                      sx={(theme) => ({
                        height: 60,
                        px: 1,
                        py: 0.5,
                        cursor: isValid ? "pointer" : "default",
                        backgroundColor: isToday ? theme.palette.primary.light : "transparent",
                        borderRadius: 1,
                        overflow: "hidden",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? darken(theme.palette.background.default, 0.1)
                              : lighten(theme.palette.background.default, 0.15)
                        }
                      })}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {isValid ? dayIndex : ""}
                      </Typography>
                      {dayEvents.length > 0 && (
                        <Typography variant="caption" noWrap sx={{ fontSize: 10 }}>
                          {dayEvents[0].name}
                        </Typography>
                      )}
                    </Box>
                  )
                })}
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
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}

      {dayPopover.anchor && dayPopover.date && (
        <DayEventsPopover
          anchorEl={dayPopover.anchor}
          date={dayPopover.date}
          events={events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(dayPopover.date, "day"))}
          onClose={closeDayPopover}
        />
      )}
    </Box>
  )
}
