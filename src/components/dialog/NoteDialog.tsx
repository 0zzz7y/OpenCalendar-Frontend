// src/components/dialog/NoteDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TextInput from '../input/TextInput';
import { NoteFormValues } from '../../features/note/types';
import ColorPicker from '../input/ColorPicker';

interface NoteDialogProperties {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues: NoteFormValues;
  onClose: () => void;
  onSave: (values: NoteFormValues) => void;
  onDelete?: () => void;
}

const NoteDialog: React.FC<NoteDialogProperties> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSave,
  onDelete,
}) => {
  const [formValues, setFormValues] = React.useState<NoteFormValues>(initialValues);
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (open) setFormValues(initialValues);
  }, [open, initialValues]);

  const handleChange = <K extends keyof NoteFormValues>(key: K, value: NoteFormValues[K]) => {
    setFormValues((prev: any) => ({ ...prev, [key]: value }));
  };

  const applyFormat = (tag: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formValues.description.slice(0, start);
    const selected = formValues.description.slice(start, end);
    const after = formValues.description.slice(end);

    let wrapperStart = '';
    let wrapperEnd = '';

    if (tag === 'b') {
      wrapperStart = '**';
      wrapperEnd = '**';
    } else if (tag === 'i') {
      wrapperStart = '*';
      wrapperEnd = '*';
    } else if (tag === 'u') {
      wrapperStart = '__';
      wrapperEnd = '__';
    }

    const newText = before + wrapperStart + selected + wrapperEnd + after;
    setFormValues((prev: any) => ({ ...prev, description: newText }));

    // Ustaw focus z powrotem
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + wrapperStart.length, end + wrapperStart.length);
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'add' ? 'Add Note' : 'Edit Note'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextInput
            label="Title"
            value={formValues.name}
            onChange={(val) => handleChange('name', val)}
          />
          <Stack direction="row" spacing={1}>
            <Tooltip title="Bold">
              <IconButton onClick={() => applyFormat('b')}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => applyFormat('i')}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Underline">
              <IconButton onClick={() => applyFormat('u')}>
                <FormatUnderlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <textarea
            ref={textAreaRef}
            value={formValues.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={6}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
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

export default NoteDialog;
