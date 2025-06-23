import type { ReactNode } from "react"

import { Box, Paper, Typography } from "@mui/material"

interface PanelProperties {
  title?: string
  icon?: ReactNode
  children: ReactNode
  padding?: number
  borderColor?: string
  backgroundColor?: string
}

export const Panel = ({
  title,
  icon,
  children,
  padding = 2,
  borderColor = "#ccc",
  backgroundColor = "#fff"
}: PanelProperties) => (
  <Paper
    sx={{
      border: `1px solid ${borderColor}`,
      borderRadius: 2,
      backgroundColor,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}
  >
    {title && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: padding,
          py: 1,
          borderBottom: `1px solid ${borderColor}`
        }}
      >
        {icon}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
      </Box>
    )}
    <Box sx={{ p: padding }}>{children}</Box>
  </Paper>
)
