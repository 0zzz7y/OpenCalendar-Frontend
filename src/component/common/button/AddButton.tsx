/**
 * Copyright (c) Tomasz Wnuk
 */

import { IconButton, Tooltip } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import type { MouseEventHandler } from "react"
import BUTTON from "@/constant/ui/button"

interface AddButtonProperties extends React.ComponentProps<typeof IconButton> {
  onClick: MouseEventHandler<HTMLButtonElement>
  label?: string
}

const AddButton = ({ onClick, label = BUTTON.TOOLTIP_ADD, ...props }: AddButtonProperties) => (
  <Tooltip title={label}>
    <IconButton onClick={onClick} color="primary" {...props}>
      <AddCircleIcon />
    </IconButton>
  </Tooltip>
)

export default AddButton
