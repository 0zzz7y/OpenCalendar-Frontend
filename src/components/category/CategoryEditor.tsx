import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener,
} from "@mui/material"

import { Sketch } from "@uiw/react-color"

interface CategoryEditorProperties {
  editMode: "add" | "edit" | "delete"
  labelInput: string
  setLabelInput: (val: string) => void
  colorInput: string
  setColorInput: (val: string) => void
  onClose: () => void
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
}

export const CategoryEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  colorInput,
  setColorInput,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: CategoryEditorProperties) => {
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
                {editMode === "add" ? "Nowa kategoria" : "Zmień nazwę"}
              </Typography>

              <TextField
                placeholder="Nazwa"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              {editMode === "add" && (
                <Box mt={2}>
                  <Sketch
                    color={colorInput}
                    onChange={(color) => setColorInput(color.hex)}
                  />
                </Box>
              )}

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
                Czy na pewno chcesz usunąć tę kategorię?
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
