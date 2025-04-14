import {
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  DialogProps
} from "@mui/material";

interface ConfirmDialogProperties {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  paperProps: DialogProps["PaperProps"];
}

export default function ConfirmDialog({ open, title, message, onConfirm, onClose, paperProps }: ConfirmDialogProperties) {
  return (
    <Dialog open={open} onClose={onClose} PaperProps={paperProps}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button color="error" onClick={onConfirm}>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
}
