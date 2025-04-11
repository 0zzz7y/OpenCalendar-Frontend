import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
  } from "@mui/material";
  import { useState } from "react";
  
  interface Props {
    open: boolean;
    date: Date | null;
    onClose: () => void;
    onSave: (data: { name: string; date: Date }) => void;
  }
  
  export default function EventFormPopup({ open, date, onClose, onSave }: Props) {
    const [name, setName] = useState("");
  
    const handleSubmit = () => {
      if (date && name.trim()) {
        onSave({ name: name.trim(), date });
        setName("");
        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Nowe wydarzenie</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tytuł"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            sx={{ mt: 1 }}
          />
          <Box mt={2}>
            <strong>Data:</strong> {date?.toLocaleString()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Anuluj</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  