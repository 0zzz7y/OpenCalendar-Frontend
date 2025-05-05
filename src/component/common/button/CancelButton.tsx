/**
 * Copyright (c) Tomasz Wnuk
 */

import Button from "./Button"
import CloseIcon from "@mui/icons-material/Close"
import BUTTON from "@/constant/ui/button"

interface CancelButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  label?: string
}

const CancelButton = ({ onClick, label = BUTTON.CANCEL, ...props }: CancelButtonProperties) => (
  <Button variant="outlined" color="inherit" startIcon={<CloseIcon />} onClick={onClick} {...props}>
    {label}
  </Button>
)

export default CancelButton
