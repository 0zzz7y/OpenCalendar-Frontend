import { useEffect, useRef, useState } from "react"
import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  ClickAwayListener
} from "@mui/material"

import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme
} from "emoji-picker-react"

import useCalendarContext from "../../hook/context/useCalendarContext"
import useCalendars from "../../hook/api/useCalendar"
import MESSAGES from "../../constant/message"

const CalendarEditor = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const {
    editorOpen,
    editorMode,
    editorData,
    closeEditor,
    selectedCalendar,
    setSelectedCalendar,
    reloadCalendars
  } = useCalendarContext()

  const { addCalendar, updateCalendar, deleteCalendar } = useCalendars()

  const [label, setLabel] = useState("")
  const [emoji, setEmoji] = useState("📅")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editorOpen) {
      setLabel(editorData.label || "")
      setEmoji(editorData.emoji || "📅")
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 50)
      }
    }
  }, [editorOpen, editorData])

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      closeEditor()
    }
  }

  const handleAdd = async () => {
    if (!label.trim()) return
    setLoading(true)
    try {
      const created = await addCalendar({ name: label.trim(), emoji })
      await reloadCalendars()
      setSelectedCalendar(created.id)
      closeEditor()
    } catch (e) {
      console.error("Failed to add calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!label.trim() || !editorData.id) return
    setLoading(true)
    try {
      await updateCalendar(editorData.id, { name: label.trim(), emoji })
      await reloadCalendars()
      closeEditor()
    } catch (e) {
      console.error("Failed to update calendar", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!editorData.id) return
    setLoading(true)
    try {
      await deleteCalendar(editorData.id)
      await reloadCalendars()
      if (selectedCalendar === editorData.id) {
        setSelectedCalendar("all")
      }
      closeEditor()
    } catch (e) {
      console.error("Failed to delete calendar", e)
    } finally {
      setLoading(false)
    }
  }

  if (!editorOpen) return null

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper
          ref={containerRef}
          sx={{ p: 2, width: 280, boxShadow: 3, borderRadius: 2 }}
        >
          {(editorMode === "add" || editorMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editorMode === "add"
                  ? MESSAGES.PLACEHOLDERS.NEW_EVENT
                  : "Edit calendar"}
              </Typography>

              <TextField
                inputRef={inputRef}
                placeholder={MESSAGES.PLACEHOLDERS.NAME}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />

              <Box
                mt={2}
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body2" fontWeight={500}>
                  Selected emoji:
                </Typography>
                <Typography fontSize={24}>{emoji}</Typography>
              </Box>

              <EmojiPicker
                width="100%"
                height={300}
                searchDisabled
                previewConfig={{ showPreview: false }}
                onEmojiClick={(emojiData: EmojiClickData) =>
                  setEmoji(emojiData.emoji)
                }
                emojiStyle={EmojiStyle.NATIVE}
                skinTonesDisabled
                lazyLoadEmojis
                defaultSkinTone={SkinTones.NEUTRAL}
                theme={Theme.LIGHT}
                autoFocusSearch={false}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editorMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editorMode === "add"
                  ? MESSAGES.BUTTONS.ADD
                  : MESSAGES.BUTTONS.SAVE}
              </Button>
            </>
          )}

          {editorMode === "delete" && (
            <>
              <Typography variant="body2">
                {MESSAGES.POPOVER.CONFIRM_DELETE_EVENT}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={closeEditor}>
                  {MESSAGES.BUTTONS.CANCEL}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {MESSAGES.BUTTONS.DELETE}
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
