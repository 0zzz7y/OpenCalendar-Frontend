import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack
} from '@mui/material';
import TextInput from '../../components/input/TextInput';
import ColorPicker from '../../components/input/ColorPicker';

export interface CategoryFormValues {
  name: string;
  color: string;
}

interface CategoryDialogProperties {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: CategoryFormValues;
  onClose: () => void;
  onSave: (values: CategoryFormValues) => void;
  onDelete?: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProperties> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formValues, setFormValues] = React.useState<CategoryFormValues>(initialValues);

  React.useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [open, initialValues]);

  const handleChange = <K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === 'add' ? 'Add Category' : 'Edit Category'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Name"
            value={formValues.name}
            onChange={(val) => handleChange('name', val)}
            required
          />
          <ColorPicker
            value={formValues.color}
            onChange={(val) => handleChange('color', val)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {mode === 'edit' && onDelete && (
          <Button color="error" onClick={onDelete}>Delete</Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(formValues)}>
          {mode === 'add' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
