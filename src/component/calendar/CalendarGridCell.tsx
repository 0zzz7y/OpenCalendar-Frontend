import { useRef, useEffect, useMemo } from "react"

import { Box } from "@mui/material"
import { useDrop } from "react-dnd"

import Event from "../../type/domain/event"

interface CalendarGridCellProperties {
  datetime: Date
  allEvents: Event[]
  onSave: (event: Partial<Event> & { startDate: string }) => void
  onClick?: (element: HTMLElement) => void
}

const CalendarGridCell = ({
  datetime,
  allEvents,
  onSave,
  onClick
}: CalendarGridCellProperties) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isOver, canDrop, item }, drop] = useDrop(() => ({
    accept: "event",
    drop: (item: { id: string }) => {
      const moved = allEvents.find((e) => e.id === item.id)
      if (!moved) return

      const newStart = new Date(datetime)
      const startTime = new Date(moved.startDate)
      newStart.setSeconds(0, 0)

      const duration =
        new Date(moved.endDate).getTime() - startTime.getTime()
      const newEnd = new Date(newStart.getTime() + duration)

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
  }))

  useEffect(() => {
    if (ref.current) {
      drop(ref.current)
    }
  }, [drop])

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onClick?.(e.currentTarget)
  }

  const previewEvent = allEvents.find((e) => e.id === item?.id)
  const previewHeight = previewEvent
    ? Math.max(
        32,
        ((new Date(previewEvent.endDate).getTime() -
          new Date(previewEvent.startDate).getTime()) /
          (1000 * 60)) *
          (32 / 30)
      )
    : 32

  const isFullHour = datetime.getMinutes() === 0

  const use12Hour = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().hour12,
    []
  )

  const formattedHour = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: use12Hour
      }).format(datetime),
    [datetime, use12Hour]
  )

  return (
    <>
      <Box
        ref={ref}
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) =>
            theme.palette.mode === "dark" ? "1px solid #333" : "1px solid #eee",
          padding: "6px",
          minHeight: 32,
          position: "relative",
          cursor: "pointer",
          zIndex: 10,
          bgcolor: isOver && canDrop ? "#e3f2fd" : "transparent",
          fontSize: "0.75rem",
          border: isOver && canDrop ? "2px dashed #1976d2" : undefined,
          "&:hover": {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#3d3d3d" : "#e0e0e0"
          }
        }}
      >
        {isFullHour && (
          <Box
            sx={{
              width: 50,
              color: "#999",
              fontSize: "0.75rem",
              pr: 1,
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            {formattedHour}
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
              border: "2px dashed #1976d2",
              borderRadius: 1,
              backgroundColor: "rgba(25, 118, 210, 0.1)",
              zIndex: 1
            }}
          />
        )}
      </Box>
    </>
  )
}

export default CalendarGridCell
