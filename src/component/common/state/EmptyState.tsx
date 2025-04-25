import { Box, Typography } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import type { ReactNode } from "react"
import MESSAGE from "@/constant/ui/message"

interface EmptyStateProperties {
  message?: string
  icon?: ReactNode
}

const EmptyState = ({
  message = MESSAGE.EMPTY_STATE,
  icon = <InfoIcon fontSize="large" color="disabled" />
}: EmptyStateProperties) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      py: 4,
      opacity: 0.7
    }}
  >
    {icon}
    <Typography variant="body2" align="center">
      {message}
    </Typography>
  </Box>
)

export default EmptyState
