import React, { useState, useMemo, useCallback } from "react"
import { Box, Typography, Paper, Popover, Stack, useTheme } from "@mui/material"
import { lighten, darken } from "@mui/material/styles"
import dayjs from "dayjs"
import { EventInformationPopover, EventCreationPopover } from "@/component/event"
import AddButton from "@/component/common/button/AddButton"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import useEvent from "@/repository/event.repository"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

export interface YearViewProps {
  date: Date
  events: Event[]
  calendars: Calendar[]
  categories: Category[]
  onEventClick?: (event: Event) => void
  onSave: (data: Partial<Event>) => void
}

export default function YearView({ date, events, calendars, categories, onEventClick, onSave }: YearViewProps) {
  const theme = useTheme()
  const { reloadEvents, deleteEvent } = useEvent()

  const { months, todayString } = useMemo(() => {
    const year = date.getFullYear()
    const m = Array.from({ length: 12 }, (_, i) => dayjs(new Date(year, i, 1)))
    return { months: m, todayString: dayjs().format("YYYY-MM-DD") }
  }, [date])

  const weekDayNamesFull = useMemo(() => {
    const startOfWeek = dayjs().startOf("week")
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day").format("ddd"))
  }, [])

  const [info, setInfo] = useState<{ anchor?: HTMLElement; event?: Event }>({})
  const [dayAnchor, setDayAnchor] = useState<HTMLElement | null>(null)
  const [dayDate, setDayDate] = useState<Date | null>(null)
  const [edit, setEdit] = useState<{ anchor?: HTMLElement; event?: Event | null; datetime?: Date }>({})

  const openInfo = useCallback(
    (event: Event, anchor: HTMLElement) => {
      closeDayPopover()
      setInfo({ anchor, event })
      onEventClick?.(event)
    },
    [onEventClick]
  )

  const closeInfo = useCallback(() => setInfo({}), [])

  const openDayPopover = useCallback(
    async (anchor: HTMLElement, date: Date) => {
      closeInfo()
      await reloadEvents()
      setDayAnchor(anchor)
      setDayDate(date)
    },
    [closeInfo, reloadEvents]
  )

  const closeDayPopover = useCallback(() => {
    setDayAnchor(null)
    setDayDate(null)
  }, [])

  const openEdit = useCallback(() => {
    if (info.anchor && info.event) {
      const anchorRect = info.anchor.getBoundingClientRect()

      closeInfo()

      setTimeout(() => {
        const fakeAnchor = document.createElement("div")
        fakeAnchor.style.position = "absolute"
        fakeAnchor.style.top = `${anchorRect.top}px`
        fakeAnchor.style.left = `${anchorRect.left}px`
        fakeAnchor.style.width = "1px"
        fakeAnchor.style.height = "1px"
        fakeAnchor.style.pointerEvents = "none"
        document.body.appendChild(fakeAnchor)

        setEdit({ anchor: fakeAnchor, event: info.event })
      }, 0)
    }
  }, [info, closeInfo])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const openCreate = useCallback(() => {
    if (dayAnchor && dayDate) {
      setEdit({ anchor: dayAnchor, event: null, datetime: dayDate })
      closeDayPopover()
    }
  }, [dayAnchor, dayDate])

  const closeEdit = useCallback(() => setEdit({}), [])

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteEvent(id)
      reloadEvents()
      closeInfo()
    },
    [deleteEvent, reloadEvents, closeInfo]
  )

  const handleSave = useCallback(
    async (data: Partial<Event>) => {
      await onSave(data) // <- await saving (if async)
      await reloadEvents() // <- important!
      closeEdit()
    },
    [onSave, reloadEvents, closeEdit]
  )

  const findCalendar = (calendarId?: string) => calendars.find((c) => c.id === calendarId)
  const findCategory = (categoryId?: string) => categories.find((c) => c.id === categoryId)

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
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                {month.format("MMMM YYYY")}
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  mb: 1,
                  justifyItems: "center",
                  alignItems: "center"
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
                      onClick={(e) => isValid && dayDate && openDayPopover(e.currentTarget as HTMLElement, dayDate)}
                      sx={{
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
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {isValid ? dayIndex : ""}
                      </Typography>

                      {/* Small dots and emoji preview */}
                      {isValid && dayEvents.length > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mt: 0.5 }}>
                          {dayEvents.slice(0, 3).map((event) => {
                            const calendar = findCalendar(event.calendar?.id)
                            const category = findCategory(event.category?.id)

                            return (
                              <Box key={event.id} sx={{ display: "flex", alignItems: "center", mr: 0.5 }}>
                                {category && (
                                  <Box
                                    sx={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      backgroundColor: category.color,
                                      mr: 0.25
                                    }}
                                  />
                                )}
                                {calendar?.emoji && (
                                  <Typography variant="caption" sx={{ fontSize: 10 }}>
                                    {calendar.emoji}
                                  </Typography>
                                )}
                              </Box>
                            )
                          })}
                        </Box>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Paper>
          )
        })}
      </Box>

      {/* Event Information Popover */}
      {info.anchor && info.event && (
        <EventInformationPopover
          anchorElement={info.anchor}
          event={info.event}
          onClose={closeInfo}
          onEdit={openEdit}
          onDelete={handleDelete}
          PaperProps={{ sx: { width: 300, p: 2 } }} // <- fix size here
        />
      )}

      {/* Event Creation / Edit Popover */}
      {edit.anchor && (
        <EventCreationPopover
          anchorEl={edit.anchor}
          calendars={calendars}
          categories={categories}
          initialEvent={edit.event ?? undefined}
          clickedDatetime={edit.datetime}
          onClose={closeEdit}
        />
      )}

      {/* Day Events Popover */}
      <Popover
        open={Boolean(dayAnchor)}
        anchorEl={dayAnchor}
        onClose={closeDayPopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: { p: 1, minWidth: 240, position: "relative", maxHeight: 400, overflowY: "auto", maxWidth: 240 }
        }}
      >
        {dayDate && (
          <Stack spacing={1} sx={{ position: "relative" }}>
            {/* Add button */}
            <Box sx={{ position: "absolute", top: 2, right: -4 }}>
              <AddButton onClick={openCreate} size="small" />
            </Box>

            <Typography variant="subtitle2">{dayjs(dayDate).format("MMMM D, YYYY")}</Typography>

            {events
              .filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(dayDate, "day"))
              .map((event) => {
                const calendar = findCalendar(event.calendar?.id)
                const category = findCategory(event.category?.id)

                return (
                  <Box
                    key={event.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: theme.palette.action.hover },
                      p: 0.5,
                      borderRadius: 1
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      openInfo(event, e.currentTarget as HTMLElement)
                    }}
                  >
                    {category && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: category.color,
                          borderRadius: "50%"
                        }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {event.title} {calendar?.emoji}
                    </Typography>
                  </Box>
                )
              })}

            {events.filter((e) => !!e.startDate && dayjs(e.startDate).isSame(dayDate, "day")).length === 0 && (
              <Typography variant="caption" color="text.secondary">
                No events
              </Typography>
            )}
          </Stack>
        )}
      </Popover>
    </Box>
  )
}
