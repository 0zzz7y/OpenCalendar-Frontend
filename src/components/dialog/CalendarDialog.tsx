// src/components/dialog/CalendarDialog.tsx

import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack
} from '@mui/material';
import TextInput from '../../components/input/TextInput';

export interface CalendarFormValues {
  name: string;
}

interface CalendarDialogProperties {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: CalendarFormValues;
  onClose: () => void;
  onSave: (values: CalendarFormValues) => void;
  onDelete?: () => void;
}

const CalendarDialog: React.FC<CalendarDialogProperties> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formValues, setFormValues] = React.useState<CalendarFormValues>(initialValues);

  React.useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [open, initialValues]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{mode === 'add' ? 'Add Calendar' : 'Edit Calendar'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Name"
            value={formValues.name}
            onChange={(val) => setFormValues({ name: val })}
            required
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

export default CalendarDialog;
