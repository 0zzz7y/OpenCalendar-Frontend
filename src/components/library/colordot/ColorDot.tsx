import { Box } from "@mui/material"

interface ColorDotProperties {
  color: string
  size?: number
}

export const ColorDot = ({ color, size = 12 }: ColorDotProperties) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color
    }}
  />
)
