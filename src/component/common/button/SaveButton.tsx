import Button from "./Button"
import SaveIcon from "@mui/icons-material/Check"
import BUTTON from "@/constant/ui/button"
import COLOR from "@/constant/ui/color"

interface SaveButtonProperties extends React.ComponentProps<typeof Button> {
  onClick: () => void
  loading?: boolean
  label?: string
}

const SaveButton = ({ onClick, loading, label = BUTTON.SAVE, ...props }: SaveButtonProperties) => (
  <Button startIcon={<SaveIcon />} onClick={onClick} loading={loading} color="primary" {...props}>
    {label}
  </Button>
)

export default SaveButton
