import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material";

import EmojiPicker from "emoji-picker-react";

import { useEffect, useRef } from "react";
import {
  EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme
} from "emoji-picker-react";

interface CalendarEditorProperties {
  editMode: "add" | "edit" | "delete";
  labelInput: string;
  setLabelInput: (val: string) => void;
  onClose: () => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  emojiInput: string;
  setEmojiInput: (emoji: string) => void;
}

const CalendarEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  onClose,
  onAdd,
  onEdit,
  onDelete,
  emojiInput,
  setEmojiInput
}: CalendarEditorProperties) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(labelInput.length, labelInput.length);
    }
  }, [editMode]);

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
                {editMode === "add" ? "New calendar" : "Edit name"}
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
                <EmojiPicker
                  width="100%"
                  height={300}
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                  onEmojiClick={(emojiData: EmojiClickData) =>
                    setEmojiInput(emojiData.emoji)
                  }
                  emojiStyle={EmojiStyle.NATIVE}
                  skinTonesDisabled
                  lazyLoadEmojis={true}
                  defaultSkinTone={SkinTones.NEUTRAL}
                  theme={Theme.LIGHT}
                  autoFocusSearch={false}
                  customEmojis={[]}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editMode === "add" ? onAdd : onEdit}
              >
                {editMode === "add" ? "ADD" : "SAVE"}
              </Button>
            </>
          )}

          {editMode === "delete" && (
            <>
              <Typography variant="body2">
                Are you sure you want to delete this calendar?
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={onDelete}
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

export default CalendarEditor;
