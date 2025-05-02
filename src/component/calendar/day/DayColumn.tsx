import React, { useMemo, useCallback } from "react"
import type { FC, CSSProperties } from "react"
import { Box } from "@mui/material"
import CalendarGridCell from "../CalendarGridCell"
import EventBox from "@/component/event/EventBox"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"
import type Calendar from "@/model/domain/calendar"
import type Category from "@/model/domain/category"

// Constants
const GAP = 4 // px gap between events
const SLOT_HEIGHT = 32 // px for 30-minute slot

export interface DayColumnProps {
  date: Date
  events: Schedulable[]
  calendars: Calendar[]
  categories: Category[]
  onSave: (payload: Partial<Event> & { id?: string }) => Promise<void>
  onSlotClick: (anchor: HTMLElement, datetime: Date) => void
  onEventClick: (sched: Schedulable) => void
  dragTargetId?: string
}

/**
 * Renders a single-day column with hourly slots and draggable events.
 */
const DayColumn: FC<DayColumnProps> = ({ date, events, onSave, onSlotClick, dragTargetId, onEventClick }) => {
  // Pre-filter timed events
  const timedEvents = useMemo(() => events.filter((e) => e.startDate && e.endDate), [events])

  // Generate 48 half-hour slots
  const slots = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const slot = new Date(date)
        slot.setHours(Math.floor(i / 2), (i % 2) * 30, 0, 0)
        return slot
      }),
    [date]
  )

  // Check overlap
  const eventsOverlap = useCallback((a: Schedulable, b: Schedulable): boolean => {
    if (!a.startDate || !a.endDate || !b.startDate || !b.endDate) return false
    const startA = new Date(a.startDate).getTime()
    const endA = new Date(a.endDate).getTime()
    const startB = new Date(b.startDate).getTime()
    const endB = new Date(b.endDate).getTime()
    return startA < endB && startB < endA
  }, [])

  // Group overlapping events
  const groupedEvents = useMemo(() => {
    const groups: Schedulable[][] = []
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

  // Layout events for absolute positioning
  const layoutedEvents = useMemo(() => {
    const laidOut: (Schedulable & { style: CSSProperties })[] = []
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
