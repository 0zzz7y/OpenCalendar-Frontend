/**
 * Copyright (c) Tomasz Wnuk
 */

import { Box, Typography } from "@mui/material"

export default function HourLabelsColumn() {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const d = new Date()
    d.setHours(i, 0, 0, 0)
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
        pt: 0,
        m: 0
      }}
    >
      {hours.map((label) => (
        <Box
          key={label}
          sx={{
            height: 64,
            px: 0,
            display: "flex",
            alignItems: "flex-start",
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
