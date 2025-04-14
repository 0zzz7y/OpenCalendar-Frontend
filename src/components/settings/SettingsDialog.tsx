import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface SettingsDialogProperties {
  open: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ open, onClose }: SettingsDialogProperties) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ustawienia</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Tutaj możesz dodać swoje ustawienia aplikacji.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
}
