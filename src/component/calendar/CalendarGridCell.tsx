import type React from "react"
import { useEffect, useRef } from "react"
import { Box } from "@mui/material"
import { useDrop } from "react-dnd"
import type Event from "@/model/domain/event"
import type Schedulable from "@/model/domain/schedulable"

export interface CalendarGridCellProps {
  datetime: Date
  allEvents: Schedulable[]
  onSave: (evt: Partial<Event> & { startDate: string; endDate: string }) => void
  onClick?: (element: HTMLElement) => void
}

export default function CalendarGridCell({ datetime, allEvents, onSave, onClick }: CalendarGridCellProps) {
  const ref = useRef<HTMLDivElement>(null)

  // helper: format as local ISO for LocalDateTime
  function toLocalDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0")
    return (
      // biome-ignore lint/style/useTemplate: <explanation>
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + "T" +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes()) + ":" +
      pad(date.getSeconds())
    )
  }

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "event",
      drop: (dragged: { id: string }) => {
        const moved = allEvents.find((e) => e.id === dragged.id)
        if (!moved?.startDate || !moved?.endDate) return

        // snap to this 30-min slot start
        const slotStart = new Date(datetime)
        const oldStart = new Date(moved.startDate)
        const durationMs = new Date(moved.endDate).getTime() - oldStart.getTime()
        const slotEnd = new Date(slotStart.getTime() + durationMs)

        onSave({
          id: moved.id,
          title: moved.title,
          description: moved.description ?? "",
          calendar: moved.calendar,
          category: moved.category,
          startDate: toLocalDateTime(slotStart),
          endDate: toLocalDateTime(slotEnd)
        })
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [allEvents, datetime, onSave]
  )

  useEffect(() => {
    if (ref.current) drop(ref.current)
  }, [drop])

  const previewHeight = 32
  const handleClick = (e: React.MouseEvent<HTMLElement>) => onClick?.(e.currentTarget)

  return (
    <Box
      ref={ref}
      onClick={handleClick}
      sx={{
        position: "relative",
        minHeight: previewHeight,
        px: 1,
        py: 0.5,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        bgcolor: isOver && canDrop ? (theme) => theme.palette.action.hover : "transparent",
        zIndex: 10,
        "&:hover": { backgroundColor: (theme) => theme.palette.action.selected }
      }}
    >
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
