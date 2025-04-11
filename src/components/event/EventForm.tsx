// src/forms/EventForm.tsx
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { format } from "date-fns";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  defaultDate: Date | null;
}

export default function EventForm({ open, onClose, defaultDate }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (defaultDate) {
      setDate(format(defaultDate, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [defaultDate]);

  const handleSubmit = () => {
    console.log("Nowe wydarzenie:", { title, date });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nowe wydarzenie</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tytuł"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Data"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleSubmit}>Zapisz</Button>
      </DialogActions>
    </Dialog>
  );
}
