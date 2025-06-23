import { useMemo, useCallback } from "react"

import dayjs from "dayjs"

import { Box, Typography, Popover, IconButton } from "@mui/material"

import CloseIcon from "@mui/icons-material/Close"

import type { Event } from "@/features/event/event.model"

import { formatFullDate, formatDayName } from "@/utilities/date.utility"

import { DayEventPreview } from "@/components/event/DayEventPreview"

export interface DayEventsPopoverProps {
  anchorEl: HTMLElement | null
  date: Date
  events: Event[]
  onClose: () => void
}

function DayEventPopover({ anchorEl, date, events, onClose }: DayEventsPopoverProps) {
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
          {formatFullDate(date)}
          <br />
          {formatDayName(date)}
        </Typography>
        <IconButton size="small" onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {sortedEvents.map((event) => (
        <DayEventPreview key={event.id} event={event} />
      ))}
    </Popover>
  )
}

export default DayEventPopover
