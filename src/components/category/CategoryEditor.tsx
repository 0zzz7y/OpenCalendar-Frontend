import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material";

import { Sketch } from "@uiw/react-color";
import { useEffect, useRef, useState } from "react";

import useCategories from "../../hooks/useCategories";

interface CategoryEditorProperties {
  editMode: "add" | "edit" | "delete";
  labelInput: string;
  setLabelInput: (val: string) => void;
  colorInput: string;
  setColorInput: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  categoryId?: string;
}

const CategoryEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  colorInput,
  setColorInput,
  onClose,
  onSubmit,
  categoryId
}: CategoryEditorProperties) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { addCategory, updateCategory, deleteCategory } = useCategories();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(labelInput.length, labelInput.length);
    }
  }, [editMode]);

  const handleAdd = async () => {
    if (!labelInput.trim()) return;
    setLoading(true);
    try {
      await addCategory({
        name: labelInput.trim(),
        color: colorInput
      });
      onSubmit();
      onClose();
    } catch (e) {
      console.error("Error creating category", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!labelInput.trim() || !categoryId) return;
    setLoading(true);
    try {
      await updateCategory(categoryId, {
        name: labelInput.trim(),
        color: colorInput
      });
      onSubmit();
      onClose();
    } catch (e) {
      console.error("Error editing category", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryId) return;
    setLoading(true);
    try {
      await deleteCategory(categoryId);
      onSubmit();
      onClose();
    } catch (e) {
      console.error("Error deleting category", e);
    } finally {
      setLoading(false);
    }
  };

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
                {editMode === "add" ? "New category" : "Edit category"}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder="Name"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Box mt={2}>
                <Sketch
                  color={colorInput}
                  onChange={(color) => setColorInput(color.hex)}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editMode === "add" ? "ADD" : "SAVE"}
              </Button>
            </>
          )}

          {editMode === "delete" && (
            <>
              <Typography variant="body2">
                Are you sure you want to delete this category?
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </>
  );
};

export default CategoryEditor;
