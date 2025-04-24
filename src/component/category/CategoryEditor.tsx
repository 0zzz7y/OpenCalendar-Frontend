import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  ClickAwayListener,
  Input,
  Paper,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import EditorMode from "@/model/utility/editorMode";
import PLACEHOLDERS from "@/constant/ui/labels";
import BUTTONS from "@/constant/ui/buttons";
import MESSAGES from "@/constant/ui/messages";

export interface CategoryEditorProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  mode: EditorMode.ADD | EditorMode.EDIT | EditorMode.DELETE;
  initialData: { id?: string; name?: string; color?: string };
  loading: boolean;
  onClose: () => void;
  onSave: (payload: { id?: string; name: string; color: string }) => void;
  onDelete: (id: string) => void;
}

export default function CategoryEditor({
  open,
  anchorEl,
  mode,
  initialData,
  loading,
  onClose,
  onSave,
  onDelete,
}: CategoryEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", color: "#3b5bdb" });

  // Sync initial data when opening
  useEffect(() => {
    if (open) {
      setForm({
        name: initialData.name?.trim() || "",
        color: initialData.color || "#3b5bdb",
      });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [open, initialData]);

  const handleChange = useCallback(
    (field: "name" | "color", value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  const handleSave = useCallback(() => {
    if (!form.name) return;
    onSave({ id: initialData.id, name: form.name, color: form.color });
  }, [form, initialData.id, onSave]);

  const handleDelete = useCallback(() => {
    if (initialData.id) onDelete(initialData.id);
  }, [initialData.id, onDelete]);

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!anchorEl?.contains(event.target as Node)) {
        onClose();
      }
    },
    [anchorEl, onClose]
  );

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper sx={{ p: 2, width: 280 }}>
          {(mode === EditorMode.ADD || mode === EditorMode.EDIT) && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {mode === EditorMode.ADD
                  ? MESSAGES.ADD_CATEGORY
                  : MESSAGES.EDIT_CATEGORY}
              </Typography>
              <TextField
                inputRef={inputRef}
                placeholder={PLACEHOLDERS.NAME}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Input
                  type="color"
                  value={form.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  sx={{ minWidth: 40 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSave}
                  disabled={loading}
                >
                  {mode === EditorMode.ADD ? BUTTONS.ADD : BUTTONS.SAVE}
                </Button>
              </Box>
            </>
          )}

          {mode === EditorMode.DELETE && (
            <>
              <Typography variant="body2">
                {MESSAGES.CONFIRM_DELETE_CATEGORY}
              </Typography>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button size="small" onClick={onClose}>
                  {BUTTONS.CANCEL}
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {BUTTONS.DELETE}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </Popover>
  );
}
