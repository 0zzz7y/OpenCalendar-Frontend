import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  MenuItem,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAppStore from "@/store/useAppStore";
import CategoryEditor from "./CategoryEditor";
import EditorMode from "@/model/utility/editorMode";
import PLACEHOLDERS from "@/constant/ui/label";
import FILTER from "@/constant/utility/filter";

export default function CategorySelector() {
  const categories = useAppStore((s) => s.categories);
  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);

  // Editor popover state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorAnchor, setEditorAnchor] = useState<HTMLElement | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD);
  const [editorData, setEditorData] = useState<{
    id?: string;
    name?: string;
    color?: string;
  }>({});

  // Memoized options
  const categoryOptions = useMemo(
    () => [
      { label: "All", value: "all", color: "#ffffff" },
      ...categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
        color: cat.color,
      })),
    ],
    [categories]
  );

  const openEditor = useCallback(
    (
      mode: EditorMode,
      anchor: HTMLElement,
      data: { id?: string; name?: string; color?: string } = {}
    ) => {
      setEditorMode(mode);
      setEditorData(data);
      setEditorAnchor(anchor);
      setEditorOpen(true);
    },
    []
  );

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setEditorAnchor(null);
    setEditorData({});
  }, []);

  const handleSelectChange = useCallback(
    (value: string) => setSelectedCategory(value),
    [setSelectedCategory]
  );

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <TextField
        select
        label={PLACEHOLDERS.CATEGORY}
        value={selectedCategory || FILTER.ALL}
        onChange={(e) => handleSelectChange(e.target.value)}
        fullWidth
        size="small"
        SelectProps={{
          renderValue: (selected) => {
            const opt = categoryOptions.find((o) => o.value === selected);
            return (
              <Box display="flex" alignItems="center" gap={1}>
                {opt?.color && (
                  <Box
                    width={10}
                    height={10}
                    borderRadius="50%"
                    bgcolor={opt.color}
                  />
                )}
                <Typography variant="body2">{opt?.label}</Typography>
              </Box>
            );
          },
        }}
      >
        {categoryOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box display="flex" alignItems="center" gap={1}>
                {opt.color && (
                  <Box
                    width={10}
                    height={10}
                    borderRadius="50%"
                    bgcolor={opt.color}
                  />
                )}
                <Typography variant="body2">{opt.label}</Typography>
              </Box>
              {opt.value !== "all" && (
                <Box display="flex" gap={1}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(EditorMode.EDIT, e.currentTarget, {
                        id: opt.value,
                        name: opt.label,
                        color: opt.color,
                      });
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={opt.value === selectedCategory}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(EditorMode.DELETE, e.currentTarget, {
                        id: opt.value,
                        name: opt.label,
                        color: opt.color,
                      });
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <IconButton
        onClick={(e) =>
          openEditor(EditorMode.ADD, e.currentTarget, {
            name: "",
            color: "#3b5bdb",
          })
        }
      >
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>

      <CategoryEditor
        open={editorOpen}
        anchorEl={editorAnchor}
        mode={editorMode}
        initialData={editorData}
        loading={false}
        onClose={closeEditor}
        onSave={() => {}}
        onDelete={() => {}}
      />
    </Box>
  );
}
