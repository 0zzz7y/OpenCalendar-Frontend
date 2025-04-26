import { Button as MuiButton, CircularProgress } from "@mui/material"
import type { ButtonProps as MuiButtonProps } from "@mui/material"

interface ButtonProperties extends MuiButtonProps {
  loading?: boolean
}

const Button = ({ loading, children, size = "medium", ...properties }: ButtonProperties) => (
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

export default Button
