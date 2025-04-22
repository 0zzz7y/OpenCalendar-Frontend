import BUTTONS from "@/constant/buttons"
import PLACEHOLDERS from "@/constant/placeholders"
import POPOVER from "@/constant/popover"
import useCalendar from "@/hook/api/useCalendar"
import useEditor from "@/hook/editor/useEditor"
import EditorType from "@/type/editor/editorType"

import { useEffect, useRef, useState } from "react"

import {
  Box,
  Button,
  ClickAwayListener,
  Paper,
  TextField,
  Typography
} from "@mui/material"
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  SkinTones,
  Theme
} from "emoji-picker-react"
import { createPortal } from "react-dom"

const CalendarEditor = () => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const emojiPickerRef = useRef<HTMLDivElement | null>(null)

  const {
    editorOpen,
    editorType,
    editorMode,
    editorData,
    closeEditor,
    selectedCalendar,
    setSelectedCalendar
  } = useEditor()

  const { reloadCalendars, addCalendar, updateCalendar, deleteCalendar } =
    useCalendar()

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
      !containerRef.current.contains(event.target as Node) &&
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
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

  if (!editorOpen || editorType !== EditorType.CALENDAR) return null

  return createPortal(
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper
          ref={containerRef}
          sx={{
            p: 2,
            width: 280,
            boxShadow: 3,
            borderRadius: 2,
            position: "fixed",
            top: 100,
            left: 100,
            zIndex: 2000
          }}
        >
          {(editorMode === "add" || editorMode === "edit") && (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight={500}
                gutterBottom
              >
                {editorMode === "add" ? BUTTONS.ADD_EVENT : BUTTONS.EDIT_EVENT}
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

              <Box
                mt={2}
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontSize={24}>{emoji}</Typography>
              </Box>

              <div ref={emojiPickerRef}>
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
              </div>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={editorMode === "add" ? handleAdd : handleEdit}
                disabled={loading}
              >
                {editorMode === "add" ? BUTTONS.ADD : BUTTONS.SAVE}
              </Button>
            </>
          )}

          {editorMode === "delete" && (
            <>
              <Typography variant="body2">
                {POPOVER.CONFIRM_DELETE_CALENDAR}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button variant="text" size="small" onClick={closeEditor}>
                  {BUTTONS.CANCEL}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
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
    </>,
    document.body
  )
}

export default CalendarEditor
