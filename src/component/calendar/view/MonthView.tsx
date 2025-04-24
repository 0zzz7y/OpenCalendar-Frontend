import { useState, useMemo, useCallback } from "react"
import { Box, Typography, Paper, useTheme } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"

export interface MonthViewProps {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onSave: (data: Partial<Event>) => void
  onSlotClick?: (element: HTMLElement, datetime: Date) => void
  onEventClick?: (event: Event) => void
}

export default function MonthView({
  date,
  events,
  calendars,
  categories,
  onSave,
  onSlotClick,
  onEventClick
}: MonthViewProps) {
  const theme = useTheme()

  // Compute start of grid (42 days view)
  const { gridDates, todayString } = useMemo(() => {
    const startOfMonth = dayjs(date).startOf("month")
    const startDay = startOfMonth.startOf("week")
    const dates = Array.from({ length: 42 }, (_, i) => startDay.add(i, "day").toDate())
    return { gridDates: dates, todayString: dayjs().format("YYYY-MM-DD") }
  }, [date])

  // Handlers for info and creation popovers
  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [creation, setCreation] = useState<{ anchor?: HTMLElement; datetime?: Date }>({})

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

  const handleSave = useCallback(
    (data: Partial<Event>) => {
      onSave(data)
      closeCreation()
    },
    [onSave, closeCreation]
  )

  const handleDelete = useCallback(
    (id: string) => {
      onSave({ id })
      closeInfo()
    },
    [onSave, closeInfo]
  )

  const handleEdit = useCallback(() => {
    if (!info.anchor || !info.event) return
    closeInfo()
    setCreation({ anchor: info.anchor, datetime: new Date(info.event.startDate) })
  }, [info, closeInfo])

  return (
    <Box sx={{ overflow: "auto", height: "100%", p: 2 }}>
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
                minHeight: 100,
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "background-color 0.15s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#3d3d3d" : "#e0e0e0"
                }
              }}
            >
              <Typography variant="body2" fontWeight="bold" color={isToday ? theme.palette.primary.main : "inherit"}>
                {dayjs(dayDate).format("D")}
              </Typography>

              <Box sx={{ mt: 0.5 }}>
                {dayEvents.slice(0, 3).map((ev) => (
                  <Box
                    key={ev.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: 0.5,
                      mb: 0.5,
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
                        borderRadius: "50%"
                      }}
                    />
                    <Typography variant="caption" noWrap>
                      {dayjs(ev.startDate).format("H:mm")} {ev.name} {ev.calendar?.emoji}
                    </Typography>
                  </Box>
                ))}

                {dayEvents.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    jeszcze {dayEvents.length - 3}
                  </Typography>
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
          initialEvent={{
            id: "",
            name: "",
            description: "",
            startDate: creation.datetime.toISOString(),
            endDate: dayjs(creation.datetime).add(1, "hour").toISOString(),
            calendar: calendars[0],
            category: undefined,
            recurringPattern: RecurringPattern.NONE
          }}
        />
      )}
    </Box>
  )
}
