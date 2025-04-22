import { Box, Typography, useTheme } from "@mui/material"

interface DayGridProperties {
  onSlotClick: (datetime: Date, element: HTMLElement) => void
}

const DayGrid = ({ onSlotClick }: DayGridProperties) => {
  const theme = useTheme()

  const slots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? 0 : 30
    return { hour, minute }
  })

  const formatTime = (hour: number, minute: number) => {
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    }).format(date)
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        sx={{
          height: `${48 * 24}px`,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "visible"
        }}
      >
        {slots.map(({ hour, minute }, i) => (
          <Box
            key={i}
            onClick={(e) => {
              const now = new Date()
              const slotDate = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hour,
                minute,
                0,
                0
              )
              onSlotClick(slotDate, e.currentTarget)
            }}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: "6px 12px",
              height: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
              "&:hover": {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            <Typography variant="caption">
              {formatTime(hour, minute)}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default DayGrid