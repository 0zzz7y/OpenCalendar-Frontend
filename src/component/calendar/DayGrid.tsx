import { Box, Typography, useTheme } from "@mui/material"

interface DayGridProperties {
  onSlotClick: (hour: number, minute: number, element: HTMLElement) => void
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
          minHeight: `${48 * 32}px`,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "visible"
        }}
      >
        {slots.map(({ hour, minute }, i) => (
          <Box
            key={i}
            onClick={(e) => onSlotClick(hour, minute, e.currentTarget)}
            sx={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: "6px 12px",
              minHeight: 32,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
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
