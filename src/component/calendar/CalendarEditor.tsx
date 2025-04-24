import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import useCalendar from "@/repository/calendar.repository";
import EditorMode from "@/model/utility/editorMode";
import BUTTONS from "@/constant/ui/button";
import PLACEHOLDERS from "@/constant/ui/label";
import MESSAGES from "@/constant/ui/message";

export interface CalendarEditorProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  mode: EditorMode;
  initialData?: { id?: string; label?: string; emoji?: string };
  onClose: () => void;
}

export default function CalendarEditor({
  open,
  anchorEl,
  mode,
  initialData = {},
  onClose,
}: CalendarEditorProps) {
  const { reloadCalendars, addCalendar, updateCalendar, deleteCalendar } =
    useCalendar();

  const [form, setForm] = useState({ label: "", emoji: "📅" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync initialData when popover opens
  useEffect(() => {
    if (open) {
      setForm({
        label: initialData.label?.trim() || "",
        emoji: initialData.emoji || "📅",
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialData]);

  const handleChange = useCallback(
    (field: "label" | "emoji", value: string) =>
      setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  const handleSave = useCallback(async () => {
    if (!form.label) return;
    setLoading(true);
    try {
      if (mode === EditorMode.ADD) {
        await addCalendar({ name: form.label, emoji: form.emoji });
      } else if (mode === EditorMode.EDIT && initialData.id) {
        await updateCalendar({
          id: initialData.id,
          name: form.label,
          emoji: form.emoji,
        });
      }
      await reloadCalendars();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    mode,
    form,
    initialData.id,
    addCalendar,
    updateCalendar,
    reloadCalendars,
    onClose,
  ]);

  const handleDelete = useCallback(async () => {
    if (!initialData.id) return;
    setLoading(true);
    try {
      await deleteCalendar(initialData.id);
      await reloadCalendars();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [initialData.id, deleteCalendar, reloadCalendars, onClose]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 280 }}>
        {mode !== EditorMode.DELETE ? (
          <>
            <Typography variant="subtitle2" color="primary" fontWeight={500}>
              {mode === EditorMode.ADD
                ? MESSAGES.ADD_CALENDAR
                : MESSAGES.EDIT_CALENDAR}
            </Typography>
            <TextField
              inputRef={inputRef}
              placeholder={PLACEHOLDERS.NAME}
              value={form.label}
              onChange={(e) => handleChange("label", e.target.value)}
              fullWidth
              size="small"
              margin="dense"
            />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
              mb={1}
            >
              <Typography fontSize={24}>{form.emoji}</Typography>
              <IconButton onClick={() => setPickerOpen((prev) => !prev)}>
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
            </Box>
            {pickerOpen && (
              <EmojiPicker
                width="100%"
                height={300}
                onEmojiClick={(emojiData: EmojiClickData) => {
                  handleChange("emoji", emojiData.emoji);
                  setPickerOpen(false);
                }}
                searchDisabled
                skinTonesDisabled
                lazyLoadEmojis
                emojiStyle={EmojiStyle.NATIVE}
                theme={Theme.LIGHT}
              />
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleSave}
              disabled={loading}
            >
              {mode === EditorMode.ADD ? BUTTONS.ADD : BUTTONS.SAVE}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2">
              {MESSAGES.CONFIRM_DELETE_CALENDAR}
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
              <Button onClick={onClose} size="small">
                {BUTTONS.CANCEL}
              </Button>
              <Button
                onClick={handleDelete}
                size="small"
                variant="contained"
                color="error"
                disabled={loading}
              >
                {BUTTONS.DELETE}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
}
