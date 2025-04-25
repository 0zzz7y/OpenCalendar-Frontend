import { useState, useEffect, useRef, useCallback } from "react"
import { Box, ClickAwayListener, Input, Paper, TextField, Typography } from "@mui/material"

import Popover from "@/component/common/popover/Popover"
import SaveButton from "@/component/common/button/SaveButton"
import CancelButton from "@/component/common/button/CancelButton"

import EditorMode from "@/model/utility/editorMode"
import BUTTON from "@/constant/ui/button"
import LABEL from "@/constant/ui/label"
import MESSAGE from "@/constant/ui/message"

interface CategoryEditorProperties {
  open: boolean
  anchor: HTMLElement | null
  mode: EditorMode
  initialData: { id?: string; name?: string; color?: string }
  loading: boolean
  onClose: () => void
  onSave: (payload: { id?: string; name: string; color: string }) => void
  onDelete: (id: string) => void
}

export default function CategoryEditor({
  open,
  anchor,
  mode,
  initialData,
  loading,
  onClose,
  onSave,
  onDelete
}: CategoryEditorProperties) {
  const inputReference = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: "", color: "#3b5bdb" })

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData.name?.trim() || "",
        color: initialData.color || "#3b5bdb"
      })
      setTimeout(() => inputReference.current?.focus(), 50)
    }
  }, [open, initialData])

  const handleChange = useCallback((field: "name" | "color", value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }, [])

  const handleSave = useCallback(() => {
    if (!form.name) return
    onSave({ id: initialData.id, name: form.name, color: form.color })
  }, [form, initialData.id, onSave])

  const handleDelete = useCallback(() => {
    if (initialData.id) onDelete(initialData.id)
  }, [initialData.id, onDelete])

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!anchor?.contains(event.target as Node)) onClose()
    },
    [anchor, onClose]
  )

  return (
    <Popover open={open} anchor={anchor} onClose={onClose}>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper sx={{ p: 2, width: 280 }}>
          {(mode === EditorMode.ADD || mode === EditorMode.EDIT) && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                {mode === EditorMode.ADD ? MESSAGE.ADD_CATEGORY : MESSAGE.EDIT_CATEGORY}
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
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <Input
                  type="color"
                  value={form.color}
                  onChange={(element) => handleChange("color", element.target.value)}
                  sx={{ minWidth: 40 }}
                />
                <SaveButton onClick={handleSave} loading={loading} />
              </Box>
            </>
          )}

          {mode === EditorMode.DELETE && (
            <>
              <Typography variant="body2">{MESSAGE.CONFIRM_DELETE_CATEGORY}</Typography>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <CancelButton onClick={onClose} />
                <SaveButton onClick={handleDelete} loading={loading} label={BUTTON.DELETE} />
              </Box>
            </>
          )}
        </Paper>
      </ClickAwayListener>
    </Popover>
  )
}
