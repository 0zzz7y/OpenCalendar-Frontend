import Button from "./Button"
import BUTTON from "@/constant/ui/button"
import { Delete } from "@mui/icons-material"

interface DeleteButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  label?: string
}

const DeleteButton = ({ onClick, label = BUTTON.DELETE, ...props }: DeleteButtonProperties) => (
  <Button variant="outlined" startIcon={<Delete />} onClick={onClick} color="error" {...props}>
    {label}
  </Button>
)

export default DeleteButton
