import { useState, useMemo, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import dayjs from "dayjs"
import EventCreationPopover from "@/components/event/EventCreationPopover"
import EventInformationPopover from "@/components/event/EventInformationPopover"
import { useEvent } from "@/features/event/useEvent.hook"
import type { Event } from "@/features/event/event.model"
import { RecurringPattern } from "@/features/event/recurringPattern.type"
import DayColumn from "@/components/calendar/day/DayColumn"
import HourLabelsColumn from "@/components/calendar/hour/HourLabelColumn"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

export interface DayViewProps {
  date: Date
  events: Event[]
  calendars: Calendar[]
  categories: Category[]
  onEventClick?: (event: Event) => void
}

export default function DayView({ date, events, calendars, categories, onEventClick }: DayViewProps) {
  const { updateEvent, reloadEvents } = useEvent()

  const dayEvents = useMemo(
    () => events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(date, "day")),
    [events, date]
  )

  const [slotInfo, setSlotInfo] = useState<{
    anchor?: HTMLElement
    datetime?: Date
  }>({})
  const [infoState, setInfoState] = useState<{
    anchor?: HTMLElement
    event?: Event
  }>({})
  const [editingEvent, setEditingEvent] = useState<Event>()
  const [creationPopover, setCreationPopover] = useState<{
    anchorEl: HTMLElement | null
    clickedDatetime: Date | null
  }>({ anchorEl: null, clickedDatetime: null })

  const handleDelete = useCallback(
    async (id: string) => {
      const original = events.find((e): e is Event => e.id === id)
      if (original) {
        await updateEvent({ ...original, name: "" })
        await reloadEvents()
      }
      setInfoState({})
    },
    [events, updateEvent, reloadEvents]
  )

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setCreationPopover({
      anchorEl: anchor,
      clickedDatetime: datetime
    })
  }, [])

  const handleEventClick = useCallback(
    (sched: Event) => {
      if (!("id" in sched)) return
      const evt = sched as Event
      const anchor = document.getElementById(`event-${evt.id}`)
      if (!anchor) return
      setSlotInfo({})
      setEditingEvent(undefined)
      setInfoState({ anchor, event: evt })
      onEventClick?.(evt)
    },
    [onEventClick]
  )

  const closeAll = useCallback(() => {
    setSlotInfo({})
    setInfoState({})
    setEditingEvent(undefined)
  }, [])

  const handleSave = useCallback(
    async (payload: Partial<Event> & { id?: string }): Promise<void> => {
      if (payload.id) {
        const original = events.find((e): e is Event => e.id === payload.id)
        if (original) {
          await updateEvent({ ...original, ...payload })
          await reloadEvents()
        }
      }
      closeAll()
    },
    [events, updateEvent, closeAll, reloadEvents]
  )

  const newEvent: Event | undefined = slotInfo.datetime
    ? {
        id: "",
        name: "",
        description: "",
        startDate: slotInfo.datetime.toISOString(),
        endDate: dayjs(slotInfo.datetime).add(1, "hour").toISOString(),
        recurringPattern: RecurringPattern.NONE,
        calendar: { id: calendars[0].id, name: calendars[0].name, emoji: calendars[0].emoji },
        category: undefined
      }
    : undefined

  return (
    <>
      <Box display="flex" flexDirection="column" flex={1} sx={{ height: "100%", overflow: "hidden" }}>
        <Box
          sx={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="h6">{dayjs(date).format("dddd")}</Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            overflowY: "auto",
            pb: 4,
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          <HourLabelsColumn />
          <DayColumn
            date={date}
            events={dayEvents}
            calendars={calendars}
            categories={categories}
            onSave={handleSave}
            onSlotClick={handleSlotClick}
            onEventClick={handleEventClick}
          />
        </Box>
      </Box>

      {slotInfo.anchor && slotInfo.datetime && (
        <EventCreationPopover
          anchorEl={slotInfo.anchor}
          onClose={closeAll}
          calendars={calendars}
          categories={categories}
          initialEvent={editingEvent || newEvent}
        />
      )}
      {infoState.anchor && infoState.event && (
        <EventInformationPopover
          anchorElement={infoState.anchor}
          event={infoState.event}
          onClose={() => setInfoState({})}
          onEdit={() => {
            const { anchor, event } = infoState
            if (!anchor || !event) return
            setEditingEvent(event)
            setSlotInfo({ anchor, datetime: new Date(event.startDate) })
            setInfoState({})
          }}
          onDelete={handleDelete}
        />
      )}

      <EventCreationPopover
        anchorEl={creationPopover.anchorEl}
        clickedDatetime={creationPopover.clickedDatetime ?? undefined}
        calendars={calendars}
        categories={categories}
        onClose={() => setCreationPopover({ anchorEl: null, clickedDatetime: null })}
      />
    </>
  )
}
