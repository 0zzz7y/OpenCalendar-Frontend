import React, { useMemo, useCallback } from "react"
import type { FC, CSSProperties } from "react"
import { Box } from "@mui/material"
import CalendarGridCell from "../CalendarGridCell"
import { EventBox } from "@/components/event/EventBox"
import type { Event } from "@/features/event/event.model"
import type { Calendar } from "@/features/calendar/calendar.model"
import type { Category } from "@/features/category/category.model"

const GAP = 4
const SLOT_HEIGHT = 32

export interface DayColumnProps {
  date: Date
  events: Event[]
  calendars: Calendar[]
  categories: Category[]
  onSave: (payload: Partial<Event> & { id?: string }) => Promise<void>
  onSlotClick: (anchor: HTMLElement, datetime: Date) => void
  onEventClick: (event: Event) => void
  dragTargetId?: string
}

const DayColumn: FC<DayColumnProps> = ({ date, events, onSave, onSlotClick, dragTargetId, onEventClick }) => {
  const timedEvents = useMemo(() => events.filter((e) => e.startDate && e.endDate), [events])

  const slots = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const slot = new Date(date)
        slot.setHours(Math.floor(i / 2), (i % 2) * 30, 0, 0)
        return slot
      }),
    [date]
  )

  const eventsOverlap = useCallback((a: Event, b: Event): boolean => {
    if (!a.startDate || !a.endDate || !b.startDate || !b.endDate) return false
    const startA = new Date(a.startDate).getTime()
    const endA = new Date(a.endDate).getTime()
    const startB = new Date(b.startDate).getTime()
    const endB = new Date(b.endDate).getTime()
    return startA < endB && startB < endA
  }, [])

  const groupedEvents = useMemo(() => {
    const groups: Event[][] = []
    for (const evt of timedEvents) {
      let placed = false
      for (const group of groups) {
        if (group.some((g) => eventsOverlap(g, evt))) {
          group.push(evt)
          placed = true
          break
        }
      }
      if (!placed) groups.push([evt])
    }
    return groups
  }, [timedEvents, eventsOverlap])

  const layoutedEvents = useMemo(() => {
    const laidOut: (Event & { style: CSSProperties })[] = []
    for (const group of groupedEvents) {
      const sorted = [...group].sort(
        (a, b) => new Date(a.startDate ?? new Date()).getTime() - new Date(b.startDate ?? new Date()).getTime()
      )
      const widthPct = 100 / sorted.length
      sorted.forEach((evt, index) => {
        const start = new Date(evt.startDate ?? new Date())
        const end = new Date(evt.endDate ?? new Date())
        const startMins = start.getHours() * 60 + start.getMinutes()
        const durationMins = end.getTime() - start.getTime()
        const top = (startMins * SLOT_HEIGHT) / 30
        const height = Math.max(SLOT_HEIGHT / 2, (durationMins * SLOT_HEIGHT) / (30 * 1000 * 60))
        laidOut.push({
          ...evt,
          style: {
            position: "absolute",
            top,
            height,
            width: `calc(${widthPct}% - ${GAP}px)`,
            left: `calc(${index * widthPct}% + ${index * GAP}px)`,
            zIndex: 20,
            opacity: dragTargetId ? 0.6 : 1,
            pointerEvents: dragTargetId && evt.id !== dragTargetId ? "none" : "auto"
          }
        })
      })
    }
    return laidOut
  }, [groupedEvents, dragTargetId])

  return (
    <Box flex={1} position="relative" borderLeft="1px solid #ddd" minHeight={48 * SLOT_HEIGHT}>
      {slots.map((slot) => (
        <CalendarGridCell
          key={slot.toISOString()}
          datetime={slot}
          allEvents={timedEvents}
          onSave={onSave}
          onClick={(el) => onSlotClick?.(el, slot)}
        />
      ))}

      {layoutedEvents.map((evt) => (
        <EventBox
          key={evt.id}
          event={evt as Event}
          dragTargetId={dragTargetId}
          customStyle={evt.style}
          onClick={() => onEventClick?.(evt as Event)}
        />
      ))}
    </Box>
  )
}

export default React.memo(DayColumn)
