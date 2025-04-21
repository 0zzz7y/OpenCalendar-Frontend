import { useEffect, useRef, useState } from "react"

import { Box, Typography } from "@mui/material"
import { useDrag } from "react-dnd"

import Event from "../../type/domain/event"

interface EventBoxProperties {
  event: Event
  calendars: { id: string; name: string; emoji: string }[]
  categories: { id: string; name: string; color: string }[]
  dragTargetId?: string | null
  showPopoverLine?: boolean
  customStyle?: React.CSSProperties
  onClick?: () => void
}

const EventBox = ({
  event,
  calendars,
  categories,
  dragTargetId,
  showPopoverLine,
  customStyle,
  onClick
}: EventBoxProperties) => {
  const eventRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (eventRef.current) {
      drag(eventRef.current)
    }
  }, [drag])

  const timeoutRef = useRef<number | null>(null)

  const handleMouseDown = () => {
    timeoutRef.current = window.setTimeout(() => setEnableDrag(true), 200)
  }

  const handleMouseUp = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (!enableDrag) {
      onClick?.()
    }
    setEnableDrag(false)
  }

  const start = new Date(event.startDate)
  const end = new Date(event.endDate)

  const minutesFromStart = start.getHours() * 60 + start.getMinutes()
  const minutesToEnd = end.getHours() * 60 + end.getMinutes()
  const duration = Math.max(15, minutesToEnd - minutesFromStart)

  const top = (minutesFromStart / 15) * 32
  const height = (duration / 15) * 32

  const calendar = calendars.find((c) => c.id === event.calendarId)
  const category = categories.find((c) => c.id === event.categoryId)

  const emoji = calendar?.emoji || ""
  const backgroundColor = category?.color || "#1976d2"

  return (
    <Box
      id={`event-${event.id}`}
      ref={eventRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
      <Typography variant="caption" fontWeight={500} noWrap flexGrow={1}>
        {event.name}
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
