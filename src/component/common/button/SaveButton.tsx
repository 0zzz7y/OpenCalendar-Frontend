import Button from './Button';
import SaveIcon from '@mui/icons-material/Check';
import BUTTON from '@/constant/ui/button';

interface SaveButtonProperties {
  onClick: () => void;
  loading?: boolean;
  label?: string;
}

const SaveButton = ({ onClick, loading, label = BUTTON.SAVE }: SaveButtonProperties) => (
  <Button
    startIcon={<SaveIcon />}
    onClick={onClick}
    loading={loading}
    color="primary"
  >
    {label}
  </Button>
);

export default SaveButton;
