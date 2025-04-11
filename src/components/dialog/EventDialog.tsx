import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from '@mui/material';
import TextInput from '../../components/input/TextInput';
import DescriptionInput from '../../components/input/DescriptionInput';
import DateTimeRangePicker from '../../components/input/DateTimeRangePicker';
import CalendarSelect, { CalendarOption } from '../../components/input/CalendarSelect';
import ColorPicker from '../../components/input/ColorPicker';
import RecurrenceSelect, { RecurringPattern } from '../../components/input/RecurrenceSelect';

export interface EventFormValues {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  calendarId: string | null;
  categoryColor: string;
  recurringPattern: RecurringPattern;
}

interface EventDialogProperties {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: EventFormValues;
  calendars: CalendarOption[];
  onClose: () => void;
  onSave: (values: EventFormValues) => void;
  onDelete?: () => void;
}

const EventDialog: React.FC<EventDialogProperties> = ({
  open,
  mode,
  initialValues,
  calendars,
  onClose,
  onSave,
  onDelete
}) => {
  const [formValues, setFormValues] = React.useState<EventFormValues>(initialValues);

  React.useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [initialValues, open]);

  const handleChange = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formValues.name || !formValues.startDate || !formValues.endDate || !formValues.calendarId) return;
    onSave(formValues);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? 'Add Event' : 'Edit Event'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Title"
            value={formValues.name}
            onChange={(val: string) => handleChange('name', val)}
            required
          />

          <DescriptionInput
            value={formValues.description}
            onChange={(val: string) => handleChange('description', val)}
          />

          <DateTimeRangePicker
            start={formValues.startDate}
            end={formValues.endDate}
            onStartChange={(val: Date | null) => handleChange('startDate', val)}
            onEndChange={(val: Date | null) => handleChange('endDate', val)}
          />

          <CalendarSelect
            calendars={calendars}
            value={formValues.calendarId}
            onChange={(val: string | null) => handleChange('calendarId', val)}
          />

          <ColorPicker
            value={formValues.categoryColor}
            onChange={(val: string) => handleChange('categoryColor', val)}
          />

          <RecurrenceSelect
            value={formValues.recurringPattern}
            onChange={(val: any) => handleChange('recurringPattern', val)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {mode === 'edit' && onDelete && (
          <Button onClick={onDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === 'add' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
