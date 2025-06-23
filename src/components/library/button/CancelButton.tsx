import CloseIcon from "@mui/icons-material/Close"

import { Button } from "@/components/library/button/Button"

import { BUTTON } from "@/components/library/button/button.constant"

interface CancelButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  label?: string
}

export const CancelButton = ({ onClick, label = BUTTON.CANCEL, ...props }: CancelButtonProperties) => (
  <Button variant="outlined" color="inherit" startIcon={<CloseIcon />} onClick={onClick} {...props}>
    {label}
  </Button>
)
