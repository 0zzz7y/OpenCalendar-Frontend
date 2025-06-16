import type { MouseEventHandler } from "react"

import { IconButton, Tooltip } from "@mui/material"

import AddCircleIcon from "@mui/icons-material/AddCircle"

import { BUTTON } from "@/components/library/button/button.constant"

interface AddButtonProperties extends React.ComponentProps<typeof IconButton> {
  onClick: MouseEventHandler<HTMLButtonElement>
  label?: string
}

export const AddButton = ({ onClick, label = BUTTON.TOOLTIP_ADD, ...props }: AddButtonProperties) => (
  <Tooltip title={label}>
    <IconButton onClick={onClick} color="primary" {...props}>
      <AddCircleIcon />
    </IconButton>
  </Tooltip>
)
