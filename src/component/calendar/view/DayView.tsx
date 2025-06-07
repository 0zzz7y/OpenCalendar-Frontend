/**
 * Copyright (c) Tomasz Wnuk
 */

import { useState, useMemo, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import useEvent from "@/repository/event.repository"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import DayColumn from "@/component/calendar/day/DayColumn"
import HourLabelsColumn from "@/component/calendar/hour/HourLabelColumn"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

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

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setCreationPopover({
      anchorEl: anchor,
      clickedDatetime: datetime
    })
  }, [])

  const handleEventClick = useCallback(
    (sched: Schedulable) => {
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
          onDelete={(id) => {
            const original = events.find((e): e is Event => e.id === id)
            if (original) {
              updateEvent({ ...original, name: "" })
              reloadEvents()
            }
            setInfoState({})
          }}
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
