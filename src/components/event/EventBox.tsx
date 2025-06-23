import type React from "react"
import { useMemo, useRef, useState, useEffect, useCallback } from "react"
import { Box, Typography } from "@mui/material"
import { useDrag } from "react-dnd"

import type { Event } from "@/features/event/event.model"
import { COLOR } from "@/themes/color.constant"

export interface EventBoxProperties {
  event: Event
  dragTargetId?: string | null
  customStyle?: React.CSSProperties
  onClick?: () => void
}

function EventBox({ event, dragTargetId, customStyle, onClick }: EventBoxProperties) {
  const reference = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<number>()
  const [enableDrag, setEnableDrag] = useState(false)

  const topAndHeight = useMemo(() => {
    const start = new Date(event.startDate || Date.now())
    const end = new Date(event.endDate || Date.now())
    const startMinutes = start.getHours() * 60 + start.getMinutes()
    const endMinutes = end.getHours() * 60 + end.getMinutes()
    const duration = Math.max(15, endMinutes - startMinutes)

    return {
      top: (startMinutes / 15) * 32,
      height: (duration / 15) * 32
    }
  }, [event.startDate, event.endDate])

  const backgroundColor = useMemo(() => {
    return "category" in event ? (event.category?.color ?? COLOR.PRIMARY) : COLOR.SECONDARY
  }, [event])

  const [, drag] = useDrag(
    () => ({
      type: "event",
      item: { id: event.id, startDate: event.startDate },
      canDrag: () => enableDrag
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
    if (reference.current) drag(reference.current)
  }, [drag])

  const isDimmed = dragTargetId && dragTargetId !== event.id
  const isDragging = dragTargetId === event.id
  const emoji = "calendar" in event ? event.calendar?.emoji : null

  return (
    <>
      <Box
        id={`event-${event.id}`}
        ref={reference}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        sx={{
          position: "absolute",
          top: topAndHeight.top,
          height: topAndHeight.height,
          backgroundColor,
          color: "#fff",
          borderRadius: 1,
          padding: "2px 4px",
          fontSize: "0.75rem",
          opacity: isDimmed ? 0.5 : 1,
          pointerEvents: isDimmed ? "none" : "auto",
          cursor: enableDrag ? "move" : "pointer",
          overflow: "hidden",
          zIndex: isDragging ? 1500 : 10,
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
    </>
  )
}

export { EventBox }
