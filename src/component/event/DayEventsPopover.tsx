import { Box, Typography, Popover, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import dayjs from "dayjs"
import type Event from "@/model/domain/event"

interface DayEventsPopoverProperties {
  anchorEl: HTMLElement | null
  date: Date
  events: Event[]
  onClose: () => void
}

const DayEventsPopover = ({ anchorEl, date, events, onClose }: DayEventsPopoverProperties) => {
  const open = Boolean(anchorEl)

  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  })

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {sortedEvents.map((event) => (
        <Box
          key={event.id}
          display="flex"
          alignItems="center"
          gap={1}
          mb={0.75}
        >
          <Box
            width={8}
            height={8}
            borderRadius="50%"
            flexShrink={0}
          />
          <Typography variant="body2" noWrap>
            {dayjs(event.startDate).format("H:mm")} {event.name}
          </Typography>
        </Box>
      ))}
    </Popover>
  )
}

export default DayEventsPopover
