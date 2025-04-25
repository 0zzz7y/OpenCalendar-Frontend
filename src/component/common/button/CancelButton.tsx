// src/common/component/CancelButton.tsx
import Button from './Button';
import CloseIcon from '@mui/icons-material/Close';
import BUTTON from '@/constant/ui/button';

interface CancelButtonProperties {
  onClick: () => void;
  label?: string;
}

const CancelButton = ({ onClick, label = BUTTON.CANCEL }: CancelButtonProperties) => (
  <Button
    variant="outlined"
    color="inherit"
    startIcon={<CloseIcon />}
    onClick={onClick}
  >
    {label}
  </Button>
);

export default CancelButton;
