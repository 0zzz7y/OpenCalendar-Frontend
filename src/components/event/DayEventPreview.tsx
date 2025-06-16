import { Box, Typography } from "@mui/material"

import { formatTime } from "@/utilities/date.utility"

import type { Event } from "@/features/event/event.model"

function DayEventPreview({ event }: { event: Event }) {
  return (
    <>
      <Box display="flex" alignItems="center" gap={1} mb={0.75}>
        <Box width={8} height={8} borderRadius="50%" flexShrink={0} sx={{ bgcolor: "text.primary" }} />
        <Typography variant="body2" noWrap>
          {formatTime(event.startDate)} {event.name}
        </Typography>
      </Box>
    </>
  )
}

export { DayEventPreview }
