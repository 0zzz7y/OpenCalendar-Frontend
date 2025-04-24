import Schedulable from "@/model/domain/schedulable"
import { Box, Typography } from "@mui/material"
import { useRef, useState, useEffect } from "react"
import { useDrag } from "react-dnd"

interface EventBoxProperties {
  event: Schedulable
  dragTargetId?: string | null
  customStyle?: React.CSSProperties
  onClick?: () => void
}

const EventBox = ({
  event,
  dragTargetId,
  customStyle,
  onClick
}: EventBoxProperties) => {
  const eventReference = useRef<HTMLDivElement>(null)
  const timeoutReference = useRef<number | null>(null)

  const start = new Date(event.startDate || Date.now())
  const end = new Date(event.endDate || Date.now())
  
  const minutesFromStart = start.getHours() * 60 + start.getMinutes()
  const minutesToEnd = end.getHours() * 60 + end.getMinutes()
  const duration = Math.max(15, minutesToEnd - minutesFromStart)

  const top = (minutesFromStart / 15) * 32
  const height = (duration / 15) * 32

  const emoji = "calendar" in event ? event.calendar?.emoji : ""
  const backgroundColor = "category" in event ? event.category?.color ?? "#1976d2" : "#1976d2"

  const [enableDrag, setEnableDrag] = useState(false)

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "event",
      item: { id: event.id },
      canDrag: () => enableDrag,
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [enableDrag]
  )

  const handlePointerDown = () => {
    timeoutReference.current = window.setTimeout(() => setEnableDrag(true), 200)
  }

  const handlePointerUp = () => {
    if (timeoutReference.current !== null) {
      clearTimeout(timeoutReference.current)
      timeoutReference.current = null
    }
    if (!enableDrag) onClick?.()
    setEnableDrag(false)
  }

  useEffect(() => {
    if (eventReference.current) {
      drag(eventReference.current)
    }
  }, [drag])

  return (
    <Box
      id={`event-${event.id}`}
      ref={eventReference}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      sx={{
        position: "absolute",
        top,
        height,
        backgroundColor,
        color: "#fff",
        borderRadius: 1,
        padding: "2px 4px",
        fontSize: "0.75rem",
        opacity: dragTargetId && dragTargetId !== event.id ? 0.5 : 1,
        pointerEvents:
          dragTargetId && dragTargetId !== event.id ? "none" : "auto",
        cursor: enableDrag ? "move" : "pointer",
        overflow: "hidden",
        zIndex: dragTargetId === event.id ? 1500 : 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        ...customStyle
      }}
    >
      <Typography variant="caption" fontWeight={500} noWrap flexGrow={1} sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        {("name" in event && event.name) || "Untitled"}
      </Typography>
      {emoji && (
        <Typography variant="caption" ml={1}>
          {emoji}
        </Typography>
      )}
    </Box>
  )
}

export default EventBox
