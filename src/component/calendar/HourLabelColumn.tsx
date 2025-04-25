import { Box, Typography } from "@mui/material"

export default function HourLabelsColumn() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  return (
    <Box
      sx={{
        width: 60,
        flexShrink: 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        pt: 4
      }}
    >
      {hours.map((hour) => (
        <Box key={hour} sx={{ height: 64, px: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {hour}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
