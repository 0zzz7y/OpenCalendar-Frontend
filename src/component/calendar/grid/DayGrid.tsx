import React from "react"
import { Box, Typography, useTheme } from "@mui/material"

export interface DayGridProps {
  /** The base date for this column */
  date: Date
  /** Called when a time-slot is clicked */
  onSlotClick: (datetime: Date, element: HTMLElement) => void
}

/**
 * Renders 48 half-hour slots for a single day.
 */
export default function DayGrid({ date, onSlotClick }: DayGridProps) {
  const theme = useTheme()

  // Generate 48 half-hour increments
  const slots = React.useMemo(
    () =>
      Array.from({ length: 48 }, (_, idx) => {
        const hour = Math.floor(idx / 2)
        const minute = idx % 2 === 0 ? 0 : 30
        return { hour, minute }
      }),
    []
  )

  const formatTime = React.useCallback(
    (hour: number, minute: number) => {
      const d = new Date(date)
      d.setHours(hour, minute, 0, 0)
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit"
      }).format(d)
    },
    [date]
  )

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      sx={{
        height: `${48 * 32}px`, // 32px per slot
        border: `1px solid ${theme.palette.divider}`,
        overflow: "visible"
      }}
    >
      {slots.map(({ hour, minute }) => {
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${hour}-${minute}`
        const slotDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0, 0)
        return (
          <Box
            key={key}
            onClick={(e) => onSlotClick(slotDate, e.currentTarget as HTMLElement)}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              height: 32,
              px: 1.5,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              flexShrink: 0,
              zIndex: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <Typography variant="caption" sx={{ userSelect: "none" }}>
              {formatTime(hour, minute)}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
