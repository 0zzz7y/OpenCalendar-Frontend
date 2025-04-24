import React, { useState, useMemo, useCallback } from "react"
import { Box } from "@mui/material"
import dayjs from "dayjs"
import { EventCreationPopover, EventInformationPopover } from "@/component/event"
import useEvent from "@/repository/event.repository"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import RecurringPattern from "@/model/domain/recurringPattern"
import DayColumn from "../DayColumn"

export interface DayViewProps {
  date: Date
  events: Schedulable[]
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  onEventClick?: (event: Event) => void
}

export default function DayView({ date, events, calendars, categories, onEventClick }: DayViewProps) {
  const { updateEvent } = useEvent()

  const dayEvents = useMemo(
    () => events.filter((e): e is Event => !!e.startDate && dayjs(e.startDate).isSame(date, "day")),
    [events, date]
  )

  const [slotInfo, setSlotInfo] = useState<{ anchor?: HTMLElement; datetime?: Date }>({})
  const [infoState, setInfoState] = useState<{
    anchor?: HTMLElement
    event?: Event
  }>({})
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined)

  const handleSlotClick = useCallback((anchor: HTMLElement, datetime: Date) => {
    setEditingEvent(undefined)
    setInfoState({})
    setSlotInfo({ anchor, datetime })
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
    (payload: Partial<Event> & { id?: string }) => {
      if (payload.id) {
        const original = events.find((e): e is Event => e.id === payload.id)
        if (original) {
          updateEvent({ ...original, ...payload })
        }
      }
      closeAll()
    },
    [updateEvent, closeAll, events]
  )

  const newEvent: Event | undefined = slotInfo.datetime
    ? {
        id: "",
        name: "",
        description: "",
        startDate: slotInfo.datetime.toISOString(),
        endDate: dayjs(slotInfo.datetime).add(1, "hour").toISOString(),
        recurringPattern: RecurringPattern.NONE,
        calendar: calendars[0],
        category: undefined
      }
    : undefined

  return (
    <>
      <Box display="flex" flex={1} p={2} sx={{ height: "100vh", overflow: "auto" }}>
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
            }
            setInfoState({})
          }}
        />
      )}
    </>
  )
}
