import { useState, useEffect, useRef, useCallback } from "react"
import { Box, TextField, Typography, IconButton, ClickAwayListener, Input, Paper } from "@mui/material"
import EmojiPicker, { type EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"

import Popover from "@/component/common/popover/Popover"
import SaveButton from "@/component/common/button/SaveButton"
import CancelButton from "@/component/common/button/CancelButton"

import EditorMode from "@/model/utility/editorMode"
import useCalendar from "@/repository/calendar.repository"

import BUTTON from "@/constant/ui/button"
import LABEL from "@/constant/ui/label"
import MESSAGE from "@/constant/ui/message"

interface CalendarEditorProperties {
  open: boolean
  anchor: HTMLElement | null
  mode: EditorMode
  initialData?: {
    id?: string
    name?: string
    emoji?: string
  }
  onClose: () => void
  onDelete?: () => void
}

export function CalendarEditor({ open, anchor, mode, initialData = {}, onClose, onDelete }: CalendarEditorProperties) {
  const { reloadCalendars, addCalendar, updateCalendar, deleteCalendar } = useCalendar()
  const inputReference = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({ name: "", emoji: "📅" })
  const [pickerOpen, setPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData.name?.trim() || "",
        emoji: initialData.emoji || "📅"
      })
      setTimeout(() => inputReference.current?.focus(), 100)
    }
  }, [open, initialData])

  const handleChange = useCallback((field: "name" | "emoji", value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }, [])

  const handleSave = useCallback(async () => {
    if (!form.name) return
    setLoading(true)
    try {
      if (mode === EditorMode.ADD) {
        await addCalendar({ title: form.name, emoji: form.emoji })
      } else if (mode === EditorMode.EDIT && initialData.id) {
        await updateCalendar({
          id: initialData.id,
          title: form.name,
          emoji: form.emoji
        })
      }
      await reloadCalendars()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [form, mode, initialData.id, addCalendar, updateCalendar, reloadCalendars, onClose])

  const handleDelete = useCallback(async () => {
    if (!initialData.id) return
    setLoading(true)
    try {
      await deleteCalendar(initialData.id)
      await reloadCalendars()
      onDelete?.() // Call onDelete callback after successful deletion
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [initialData.id, deleteCalendar, reloadCalendars, onClose, onDelete])

  return (
    <Popover open={open} anchor={anchor} onClose={onClose}>
      <Box sx={{ width: 280 }} paddingRight={2}>
        {mode !== EditorMode.DELETE ? (
          <>
            <Typography variant="subtitle2" color="primary" fontWeight={500}>
              {mode === EditorMode.ADD ? MESSAGE.ADD_CALENDAR : MESSAGE.EDIT_CALENDAR}
            </Typography>

            <TextField
              inputRef={inputReference}
              placeholder={LABEL.NAME}
              value={form.name}
              onChange={(element) => handleChange("name", element.target.value)}
              fullWidth
              size="small"
              margin="dense"
            />

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontSize={24}>{form.emoji}</Typography>
                <IconButton onClick={() => setPickerOpen((previous) => !previous)}>
                  <EmojiEmotionsIcon fontSize="small" />
                </IconButton>
              </Box>
              <SaveButton onClick={handleSave} loading={loading} />
            </Box>

            {pickerOpen && (
              <EmojiPicker
                width="100%"
                height={300}
                onEmojiClick={(emojiData: EmojiClickData) => {
                  handleChange("emoji", emojiData.emoji)
                  setPickerOpen(false)
                }}
                searchDisabled
                skinTonesDisabled
                lazyLoadEmojis
                emojiStyle={EmojiStyle.NATIVE}
                theme={Theme.LIGHT}
              />
            )}
          </>
        ) : (
          <>
            <Typography variant="body2">{MESSAGE.CONFIRM_DELETE_CALENDAR}</Typography>
            <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
              <CancelButton onClick={onClose} />
              <SaveButton onClick={handleDelete} loading={loading} label={BUTTON.DELETE} />
            </Box>
          </>
        )}
      </Box>
    </Popover>
  )
}

export default CalendarEditor
