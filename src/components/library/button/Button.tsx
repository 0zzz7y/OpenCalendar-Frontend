import { Button as MuiButton, CircularProgress } from "@mui/material"
import type { ButtonProps } from "@mui/material"

interface ButtonProperties extends ButtonProps {
  loading?: boolean
}

export const Button = ({ loading, children, size = "medium", ...properties }: ButtonProperties) => (
  <MuiButton
    variant="contained"
    color="primary"
    disableElevation
    size={size}
    sx={{ textTransform: "none", fontWeight: 600 }}
    {...properties}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : children}
  </MuiButton>
)
