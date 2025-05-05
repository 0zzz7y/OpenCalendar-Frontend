/**
 * Copyright (c) Tomasz Wnuk
 */

import { useMemo, useCallback } from "react"
import { Box, Typography, Popover, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import dayjs from "dayjs"
import type Event from "@/model/domain/event"

export interface DayEventsPopoverProps {
  anchorEl: HTMLElement | null
  date: Date
  events: Event[]
  onClose: () => void
}

export default function DayEventsPopover({ anchorEl, date, events, onClose }: DayEventsPopoverProps) {
  const open = Boolean(anchorEl)

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()),
    [events]
  )

  const handleClose = useCallback(() => onClose(), [onClose])

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{ sx: { p: 2, borderRadius: 3, minWidth: 220 } }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight={600} fontSize={18}>
          {dayjs(date).format("D MMMM YYYY")}
          <br />
          {dayjs(date).format("dddd")}
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {sortedEvents.map((event) => (
        <Box key={event.id} display="flex" alignItems="center" gap={1} mb={0.75}>
          <Box width={8} height={8} borderRadius="50%" flexShrink={0} sx={{ bgcolor: "text.primary" }} />
          <Typography variant="body2" noWrap>
            {dayjs(event.startDate).format("H:mm")} {event.title}
          </Typography>
        </Box>
      ))}
    </Popover>
  )
}
