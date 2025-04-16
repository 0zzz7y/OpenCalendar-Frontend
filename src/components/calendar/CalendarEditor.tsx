import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener,
} from "@mui/material"

interface CalendarEditorProperties {
  editMode: "add" | "edit" | "delete"
  labelInput: string
  setLabelInput: (val: string) => void
  onClose: () => void
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
}

const CalendarEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: CalendarEditorProperties) => {
  return (
    <>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ p: 2, width: 280, boxShadow: 3, borderRadius: 2 }}>
          {(editMode === "add" || editMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editMode === "add" ? "Nowy kalendarz" : "Zmień nazwę"}
              </Typography>

              <TextField
                placeholder="Nazwa"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editMode === "add" ? onAdd : onEdit}
              >
                {editMode === "add" ? "DODAJ" : "ZAPISZ"}
              </Button>
            </>
          )}

          {editMode === "delete" && (
            <>
              <Typography variant="body2">
                Czy na pewno chcesz usunąć ten kalendarz?
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={onClose}>
                  Anuluj
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={onDelete}
                >
                  Usuń
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </>
  )
}

export default CalendarEditor
