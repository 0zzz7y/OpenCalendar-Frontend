import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Stack, MenuItem
} from '@mui/material';
import TextInput from '../../components/input/TextInput';
import DescriptionInput from '../../components/input/DescriptionInput';
import DateTimeRangePicker from '../../components/input/DateTimeRangePicker';
import CalendarSelect, { CalendarOption } from '../../components/input/CalendarSelect';
import RecurrenceSelect, { RecurringPattern } from '../../components/input/RecurrenceSelect';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskFormValues {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  status: TaskStatus;
  recurringPattern: RecurringPattern;
  calendarId: string | null;
}

interface TaskDialogProperties {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: TaskFormValues;
  calendars: CalendarOption[];
  onClose: () => void;
  onSave: (values: TaskFormValues) => void;
  onDelete?: () => void;
}

const TaskDialog: React.FC<TaskDialogProperties> = ({
  open,
  mode,
  initialValues,
  calendars,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formValues, setFormValues] = React.useState<TaskFormValues>(initialValues);

  React.useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [open, initialValues]);

  const handleChange = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? 'Add Task' : 'Edit Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Title"
            value={formValues.name}
            onChange={(val) => handleChange('name', val)}
            required
          />
          <DescriptionInput
            value={formValues.description}
            onChange={(val) => handleChange('description', val)}
          />
          <DateTimeRangePicker
            start={formValues.startDate}
            end={formValues.endDate}
            onStartChange={(val) => handleChange('startDate', val)}
            onEndChange={(val) => handleChange('endDate', val)}
          />
          <CalendarSelect
            calendars={calendars}
            value={formValues.calendarId}
            onChange={(val) => handleChange('calendarId', val)}
          />
          <RecurrenceSelect
            value={formValues.recurringPattern}
            onChange={(val) => handleChange('recurringPattern', val)}
          />
          <TextInput
            label="Status"
            value={formValues.status}
            onChange={(val) => handleChange('status', val as TaskStatus)}
            placeholder="TODO | IN_PROGRESS | DONE"
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

export default TaskDialog;
