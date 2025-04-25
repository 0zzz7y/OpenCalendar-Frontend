// src/common/component/AddButton.tsx
import { IconButton, Tooltip } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import type { MouseEventHandler } from "react"
import BUTTON from "@/constant/ui/button"

interface AddButtonProperties {
  onClick: MouseEventHandler<HTMLButtonElement>
  label?: string
}

const AddButton = ({ onClick, label = BUTTON.TOOLTIP_ADD }: AddButtonProperties) => (
  <Tooltip title={label}>
    <IconButton onClick={onClick} size="small" color="primary">
      <AddCircleIcon />
    </IconButton>
  </Tooltip>
)

export default AddButton
