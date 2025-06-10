import type React from "react"
import { useRef, useState, useEffect, useMemo, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import { useDrag } from "react-dnd"
import type Schedulable from "@/model/domain/schedulable"

export interface EventBoxProps {
  event: Schedulable
  dragTargetId?: string | null
  customStyle?: React.CSSProperties
  onClick?: () => void
}

export default function EventBox({ event, dragTargetId, customStyle, onClick }: EventBoxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number>()
  const [enableDrag, setEnableDrag] = useState(false)

  const { top, height } = useMemo(() => {
    const startDate = new Date(event.startDate || Date.now())
    const endDate = new Date(event.endDate || Date.now())
    const startMins = startDate.getHours() * 60 + startDate.getMinutes()
    const duration = Math.max(15, endDate.getHours() * 60 + endDate.getMinutes() - startMins)
    return {
      top: (startMins / 15) * 32,
      height: (duration / 15) * 32
    }
  }, [event.startDate, event.endDate])

  const emoji = useMemo(() => ("calendar" in event ? event.calendar?.emoji : ""), [event])

  const backgroundColor = useMemo(
    () => ("category" in event ? (event.category?.color ?? "#1976d2") : "#1976d2"),
    [event]
  )

  const [, drag] = useDrag(
    () => ({
      type: "event",
      item: { id: event.id, startDate: event.startDate },
      canDrag: () => enableDrag,
      collect: (monitor) => ({ isDragging: monitor.isDragging() })
    }),
    [enableDrag, event.id, event.startDate]
  )

  const handlePointerDown = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => setEnableDrag(true), 200)
  }, [])

  const handlePointerUp = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    if (!enableDrag) onClick?.()
    setEnableDrag(false)
  }, [enableDrag, onClick])

  useEffect(() => {
    if (ref.current) drag(ref.current)
  }, [drag])

  return (
    <Box
      id={`event-${event.id}`}
      ref={ref}
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
        pointerEvents: dragTargetId && dragTargetId !== event.id ? "none" : "auto",
        cursor: enableDrag ? "move" : "pointer",
        overflow: "hidden",
        zIndex: dragTargetId === event.id ? 1500 : 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        ...customStyle
      }}
    >
      <Typography
        variant="caption"
        fontWeight={500}
        noWrap
        flexGrow={1}
        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
      >
        {event.name || "Untitled"}
      </Typography>
      {emoji && (
        <Typography variant="caption" ml={1}>
          {emoji}
        </Typography>
      )}
    </Box>
  )
}
