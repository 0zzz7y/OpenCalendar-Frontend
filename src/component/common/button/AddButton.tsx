// src/common/component/AddButton.tsx
import { IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { MouseEventHandler } from 'react'
import BUTTON from '@/constant/ui/button'

interface AddButtonProperties {
  onClick: MouseEventHandler<HTMLButtonElement>
  label?: string
}

const AddButton = ({
  onClick,
  label = BUTTON.ADD,
}: AddButtonProperties) => (
  <Tooltip title={label}>
    <IconButton onClick={onClick} size="small" color="primary">
      <AddIcon />
    </IconButton>
  </Tooltip>
)

export default AddButton
