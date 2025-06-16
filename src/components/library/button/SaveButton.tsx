import SaveIcon from "@mui/icons-material/Check"

import { Button } from "@/components/library/button/Button"

import { BUTTON } from "@/components/library/button/button.constant"

interface SaveButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  loading?: boolean
  label?: string
}

export const SaveButton = ({ onClick, loading, label = BUTTON.SAVE, ...props }: SaveButtonProperties) => (
  <Button startIcon={<SaveIcon />} onClick={onClick} loading={loading} color="primary" {...props}>
    {label}
  </Button>
)
