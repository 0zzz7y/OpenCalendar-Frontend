import { Delete } from "@mui/icons-material"

import { Button } from "@/components/library/button/Button"

import { BUTTON } from "@/components/library/button/button.constant"

interface DeleteButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  label?: string
}

export const DeleteButton = ({ onClick, label = BUTTON.DELETE, ...props }: DeleteButtonProperties) => (
  <Button variant="outlined" startIcon={<Delete />} onClick={onClick} color="error" {...props}>
    {label}
  </Button>
)
