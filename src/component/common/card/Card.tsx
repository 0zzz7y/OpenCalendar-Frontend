/**
 * Copyright (c) Tomasz Wnuk
 */

import { Paper } from "@mui/material"
import type { ReactNode } from "react"

interface CardProperties {
  children: ReactNode
  padding?: number
  hoverable?: boolean
}

const Card = ({ children, padding = 2, hoverable = true }: CardProperties) => (
  <Paper
    elevation={hoverable ? 4 : 1}
    sx={{
      p: padding,
      borderRadius: 2,
      transition: "0.2s ease",
      "&:hover": hoverable ? { boxShadow: 6 } : {}
    }}
  >
    {children}
  </Paper>
)

export default Card
