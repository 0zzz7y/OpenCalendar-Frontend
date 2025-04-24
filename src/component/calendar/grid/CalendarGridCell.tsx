import type React from "react"
import { useEffect, useRef } from "react"
import { Box } from "@mui/material"
import { useDrop } from "react-dnd"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

export interface CalendarGridCellProps {
  /** Date/time represented by this cell */
  datetime: Date
  /** All schedulable items (events/tasks) */
  allEvents: Schedulable[]
  /** Called when an item is dropped, or moved */
  onSave: (evt: Partial<Event> & { startDate: string; endDate: string }) => void
  /** Optional click handler for opening popovers */
  onClick?: (element: HTMLElement) => void
}

/**
 * A single time slot in the calendar grid. Handles drag‑and‑drop of events,
 * highlights drop targets, and optionally shows hour labels.
 */
export default function CalendarGridCell({ datetime, allEvents, onSave, onClick }: CalendarGridCellProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isOver, canDrop, item }, drop] = useDrop(
    () => ({
      accept: "event",
      drop: (dragged: { id: string }) => {
        const moved = allEvents.find((e) => e.id === dragged.id)
        if (!moved?.startDate || !moved?.endDate) return

        const newStart = new Date(datetime)
        const oldStart = new Date(moved.startDate)
        const durationMs = new Date(moved.endDate).getTime() - oldStart.getTime()
        const newEnd = new Date(newStart.getTime() + durationMs)

        onSave({
          id: moved.id,
          name: moved.name,
          description: moved.description ?? "",
          calendar: moved.calendar,
          category: moved.category,
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString()
        })
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        item: monitor.getItem()
      })
    }),
    [allEvents, datetime, onSave]
  )

  // Attach drop ref
  useEffect(() => {
    if (ref.current) drop(ref.current)
  }, [drop])

  // Preview indicator height: based on dragged item's duration
  let previewHeight = 32
  if (item?.id) {
    const previewEvent = allEvents.find((e) => e.id === item.id && e.startDate && e.endDate)
    if (previewEvent) {
      const startMs = new Date(previewEvent.startDate ?? "").getTime()
      const endMs = new Date(previewEvent.endDate ?? "").getTime()
      const minutes = (endMs - startMs) / (1000 * 60)
      previewHeight = Math.max(32, (minutes * 32) / 30)
    }
  }

  // Show label only on full hours
  const showHourLabel = datetime.getMinutes() === 0
  const formattedLabel = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(datetime)

  const handleClick = (e: React.MouseEvent<HTMLElement>) => onClick?.(e.currentTarget)

  return (
    <Box
      ref={ref}
      onClick={handleClick}
      sx={{
        position: "relative",
        minHeight: 32,
        px: 1,
        py: 0.5,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        bgcolor: isOver && canDrop ? (theme) => theme.palette.action.hover : "transparent",
        zIndex: 10,
        "&:hover": {
          backgroundColor: (theme) => theme.palette.action.selected
        }
      }}
    >
      {showHourLabel && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 2,
            fontSize: "0.75rem",
            color: (theme) => theme.palette.text.secondary
          }}
        >
          {formattedLabel}
        </Box>
      )}

      {isOver && canDrop && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: previewHeight,
            border: (theme) => `2px dashed ${theme.palette.primary.main}`,
            pointerEvents: "none"
          }}
        />
      )}
    </Box>
  )
}
