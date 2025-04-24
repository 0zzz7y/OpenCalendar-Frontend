import BUTTONS from "@/constant/ui/buttons"
import PLACEHOLDERS from "@/constant/ui/labels"
import MESSAGES from "@/constant/ui/messages"
import useCalendar from "@/hook/useCalendar"

import {
  Box,
  Button,
  IconButton,
  Popover,
  TextField,
  Typography
} from "@mui/material"
import EmojiPicker, {
  type EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme
} from "emoji-picker-react"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import { useEffect, useRef, useState } from "react"

interface CalendarEditorProperties {
  open: boolean
  anchorEl: HTMLElement | null
  mode: "add" | "edit" | "delete"
  initialData?: { id?: string; label?: string; emoji?: string }
  onClose: () => void
}

const CalendarEditor = ({
  open,
  anchorEl,
  mode,
  initialData = {},
  onClose
}: CalendarEditorProperties) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { reloadCalendars, addCalendar, updateCalendar, deleteCalendar } = useCalendar()

  const [label, setLabel] = useState(initialData.label || "")
  const [emoji, setEmoji] = useState(initialData.emoji || "📅")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLabel(initialData.label || "")
      setEmoji(initialData.emoji || "📅")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, initialData])

  const handleSave = async () => {
    if (!label.trim()) return
    setLoading(true)
    try {
      if (mode === "add") {
        await addCalendar({ name: label.trim(), emoji })
      } else if (mode === "edit" && initialData.id) {
        await updateCalendar(initialData.id, { name: label.trim(), emoji })
      }
      await reloadCalendars()
      onClose()
    } catch (e) {
      console.error("Failed to save calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData.id) return
    setLoading(true)
    try {
      await deleteCalendar(initialData.id)
      await reloadCalendars()
      onClose()
    } catch (e) {
      console.error("Failed to delete calendar", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Box sx={{ p: 2, width: 280 }}>
        {mode !== "delete" ? (
          <>
            <Typography variant="subtitle2" color="primary" fontWeight={500}>
              {mode === "add" ? MESSAGES.ADD_EVENT : MESSAGES.EDIT_EVENT}
            </Typography>

            <TextField
              inputRef={inputRef}
              placeholder={PLACEHOLDERS.NAME}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              fullWidth
              size="small"
              margin="dense"
            />

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={1}>
              <Typography fontSize={24}>{emoji}</Typography>
              <IconButton onClick={() => setPickerOpen((prev) => !prev)}>
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
            </Box>

            {pickerOpen && (
              <EmojiPicker
                width="100%"
                height={300}
                onEmojiClick={(e: EmojiClickData) => {
                  setEmoji(e.emoji)
                  setPickerOpen(false)
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
              {mode === "add" ? BUTTONS.ADD : BUTTONS.SAVE}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2">{MESSAGES.CONFIRM_DELETE_CALENDAR}</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
              <Button onClick={onClose} size="small">{BUTTONS.CANCEL}</Button>
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
  )
}

export default CalendarEditor
