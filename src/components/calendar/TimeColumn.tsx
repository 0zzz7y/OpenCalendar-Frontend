import { Box, Typography } from "@mui/material"

interface TimeColumnProperties {
  startHour?: number
  endHour?: number
  interval?: number
}

const TimeColumn = ({ startHour = 8, endHour = 23, interval = 30 }: TimeColumnProperties) => {
  const times: string[] = []

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hh = h.toString().padStart(2, "0")
      const mm = m.toString().padStart(2, "0")
      times.push(`${hh}:${mm}`)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pr: 1,
        pt: 6,
        borderRight: "1px solid #ccc",
        backgroundColor: "#fafafa"
      }}
    >
      {times.map((time, i) => (
        <Typography
          key={i}
          variant="caption"
          sx={{ height: 32, lineHeight: "32px", pr: 1, fontSize: 12, color: "#555" }}
        >
          {time}
        </Typography>
      ))}
    </Box>
  )
}

export default TimeColumn
