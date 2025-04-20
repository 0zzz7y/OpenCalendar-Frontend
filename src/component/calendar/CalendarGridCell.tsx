import { Box } from "@mui/material"
import { useDrop } from "react-dnd"
import { useRef, useEffect } from "react"
import Event from "../../type/domain/event" // Ensure the type includes `color`

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
      const originalStart = new Date(moved.startDate)
      if (newStart.getTime() === originalStart.getTime()) return

      const duration =
        new Date(moved.endDate).getTime() - originalStart.getTime()
      const newEnd = new Date(newStart.getTime() + duration)

      const overlappingEvents = allEvents.filter((e) => {
        const start = new Date(e.startDate).getTime()
        const end = new Date(e.endDate).getTime()
        return (
          e.id !== moved.id &&
          start < newEnd.getTime() &&
          end > newStart.getTime()
        )
      })

      const totalSlots = overlappingEvents.length + 1
      const widthPercent = 100 / totalSlots

      onSave({
        id: moved.id,
        name: moved.name,
        description: moved.description,
        calendarId: moved.calendarId,
        categoryId: moved.categoryId,
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
          (32 / 15)
      )
    : 32

  return (
    <Box
      ref={ref}
      onClick={handleClick}
      sx={{
        borderBottom: "1px solid #eee",
        padding: "6px",
        minHeight: 32,
        position: "relative",
        cursor: "pointer",
        zIndex: 10,
        bgcolor: isOver && canDrop ? "#e3f2fd" : "transparent",
        fontSize: "0.75rem",
        border: isOver && canDrop ? "2px dashed #1976d2" : undefined,
        "&:hover": {
          backgroundColor: "#f5f5f5"
        }
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
            border: "2px dashed #1976d2",
            borderRadius: 1,
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            zIndex: 1
          }}
        />
      )}
    </Box>
  )
}

export default CalendarGridCell
