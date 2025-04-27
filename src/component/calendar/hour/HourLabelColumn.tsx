import { Box, Typography } from "@mui/material"

export default function HourLabelsColumn() {
  // generate a Date for each hour of today
  const hours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date()
    d.setHours(i, 0, 0, 0)
    // respect the user’s locale/time‑format preference
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit"
    }).format(d)
  })

  return (
    <Box
      sx={{
        width: 60,
        flexShrink: 0,
        borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        // no top padding on container
        pt: 0,
        m: 0
      }}
    >
      {hours.map((label) => (
        <Box
          key={label}
          sx={{
            height: 64, // slot height
            px: 0, // no horizontal padding
            display: "flex",
            alignItems: "flex-start", // align at top of cell
            justifyContent: "center",
            pr: 0.5
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
