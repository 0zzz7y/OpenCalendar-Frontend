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
import CalendarEditor from "./CalendarEditor";
import EditorMode from "@/model/utility/editorMode";
import PLACEHOLDERS from "@/constant/ui/label";
import FILTER from "@/constant/utility/filter";

export default function CalendarSelector() {
  const calendars = useAppStore((s) => s.calendars);
  const selectedCalendar = useAppStore((s) => s.selectedCalendar);
  const setSelectedCalendar = useAppStore((s) => s.setSelectedCalendar);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorAnchor, setEditorAnchor] = useState<HTMLElement | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>(EditorMode.ADD);
  const [editorData, setEditorData] = useState<{
    id?: string;
    label?: string;
    emoji?: string;
  }>({});

  const calendarOptions = useMemo(
    () => [
      { label: "All", value: "all", emoji: "📅" },
      ...calendars.map((cal) => ({
        label: cal.name,
        value: cal.id,
        emoji: cal.emoji,
      })),
    ],
    [calendars]
  );

  const openEditor = useCallback(
    (
      mode: EditorMode,
      anchor: HTMLElement,
      data: { id?: string; label?: string; emoji?: string } = {}
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

  const handleChange = useCallback(
    (value: string) => setSelectedCalendar(value),
    [setSelectedCalendar]
  );

  return (
    <Box display="flex" alignItems="center" gap={1} width="100%">
      <TextField
        select
        label={PLACEHOLDERS.CALENDAR}
        value={selectedCalendar || FILTER.ALL}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        size="small"
        SelectProps={{
          renderValue: (val) => {
            const opt = calendarOptions.find((o) => o.value === val);
            return (
              <Box display="flex" alignItems="center" gap={1}>
                <span>{opt?.emoji || "📅"}</span>
                <Typography variant="body2">{opt?.label}</Typography>
              </Box>
            );
          },
        }}
      >
        {calendarOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <span>{opt.emoji}</span>
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
                        label: opt.label,
                        emoji: opt.emoji,
                      });
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    disabled={opt.value === selectedCalendar}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(EditorMode.DELETE, e.currentTarget, {
                        id: opt.value,
                        label: opt.label,
                        emoji: opt.emoji,
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
            label: "",
            emoji: "📅",
          })
        }
      >
        <AddCircleOutlineIcon fontSize="small" />
      </IconButton>

      <CalendarEditor
        open={editorOpen}
        anchorEl={editorAnchor}
        mode={editorMode}
        initialData={editorData}
        onClose={closeEditor}
      />
    </Box>
  );
}
