import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material"

import EmojiPicker from "emoji-picker-react"

import { useEffect, useRef, useState } from "react"
import {
  EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme
} from "emoji-picker-react"

import useCalendars from "../../hooks/useCalendars"

interface CalendarEditorProperties {
  editMode: "add" | "edit" | "delete"
  labelInput: string
  setLabelInput: (val: string) => void
  onClose: () => void
  onSubmit: () => void
  emojiInput: string
  setEmojiInput: (val: string) => void
  calendarId?: string
}

const CalendarEditor = ({
  editMode,
  labelInput,
  setLabelInput,
  onClose,
  onSubmit,
  emojiInput,
  setEmojiInput,
  calendarId
}: CalendarEditorProperties) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  const { addCalendar, updateCalendar, deleteCalendar, reloadCalendars } =
    useCalendars()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(labelInput.length, labelInput.length)
    }
  }, [editMode])

  const handleAdd = async () => {
    if (!labelInput.trim()) return
    setLoading(true)
    try {
      await addCalendar({
        name: labelInput.trim(),
        emoji: emojiInput
      })
      await reloadCalendars()
      onSubmit()
      onClose()
    } catch (e) {
      console.error("Failed to add calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!labelInput.trim() || !calendarId) return
    setLoading(true)
    try {
      await updateCalendar(calendarId, {
        name: labelInput.trim(),
        emoji: emojiInput
      })
      await reloadCalendars()
      onSubmit()
      onClose()
    } catch (e) {
      console.error("Failed to update calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!calendarId) return
    setLoading(true)
    try {
      await deleteCalendar(calendarId)
      await reloadCalendars()
      onSubmit()
      onClose()
    } catch (e) {
      console.error("Failed to delete calendar", e)
    } finally {
      setLoading(false)
    }
  }

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
                {editMode === "add" ? "New calendar" : "Edit calendar"}
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
                  lazyLoadEmojis
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
  )
}

export default CalendarEditor
