/**
 * Copyright (c) Tomasz Wnuk
 */

import { Box } from "@mui/material"
import type { ReactNode } from "react"

interface ToolbarProperties {
  left?: ReactNode
  right?: ReactNode
  spacing?: number
}

const Toolbar = ({ left, right, spacing = 2 }: ToolbarProperties) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing,
      width: "100%",
      px: 2,
      py: 1,
      borderBottom: "1px solid #e0e0e0"
    }}
  >
    {left}
    {right}
  </Box>
)

export default Toolbar
